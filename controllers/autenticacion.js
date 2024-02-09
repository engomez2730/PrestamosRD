const { promisify } = require("util");
const crypto = require("crypto");
const UserModel = require("../models/users");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const JSONWEBTOKEN = require("jsonwebtoken");
const { token } = require("morgan");
const Email = require("../utils/email");

const enviarRespuestaConToken = (req, res, id) => {
  const token = JSONWEBTOKEN.sign({ id: id }, process.env.JSON_SECRET, {
    expiresIn: process.env.JSON_EXPIRES,
  });

  const cookeOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE * 24 * 60 * 60 * 100),
    httpOnly: false,
  };
  if (process.env.NODE_ENV != "development") cookeOptions.secure = true;
  res.cookie("jwt", token, cookeOptions);
  res.status(201).json({
    status: "Sucess",
    token,
  });
};

exports.crearUsuario = catchAsync(async (req, res) => {
  const user = await UserModel.create({
    nombre: req.body.nombre,
    apellido: req.body.apellido,
    telefono: req.body.telefono,
    direccion: req.body.direccion,
    rol: req.body.rol,
  });

  enviarRespuestaConToken(req, res, user._id);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  //Validate email and password
  if (!email || !password) {
    return next(new AppError("Tiene que llenar los campos", 400));
  }
  //Verify if password is correct
  const user = await UserModel.findOne({ email: email }).select("+password");
  if (!user || !(await user.correctPassword(password, user.password)))
    return next(new AppError("Contraseña o correo incorrectos", 400));
  //Creating a Token
  enviarRespuestaConToken(req, res, user._id);
});

exports.olvidarcontrasena = catchAsync(async (req, res, next) => {
  const userBody = req.body.email;
  if (!userBody) return next(new AppError("Debe introdocur un correo", 401));
  const user = await UserModel.findOne({ email: userBody });
  if (!user)
    return next(new AppError("No hay usuarios con esa dirrecion", 404));
  //Creando el TOken desde el Schema
  const resetToken = user.crearTokenContraseña();
  user.save({ validateBeforeSave: false });
  //creando la URL
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/auth/reiniciarcontrasena/${resetToken}`;
  //Creando el Mensaje
  const mensaje = `Si quiere reiniciar su contraseña, vaya a esta dirrecion: ${resetUrl} `;
  try {
    //Sending the email
    await Email({
      email: "endersonyelsa@gmail.con",
      subject: "Loco viejo",
      message: mensaje,
    });
    res.status(201).json({
      status: "Success",
      message: "Token Creado",
    });
  } catch (err) {
    user.resetTokenExpires = undefined;
    user.resetToken = undefined;
    await UserModel.save();
    return next(new AppError("Hubo un error enviando el email", 500));
  }
});

exports.reiniciarcontrasena = catchAsync(async (req, res, next) => {
  //Decifrando el token de la URL
  const hashToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  //Confirmando que el Token sea el correcto
  const user = await UserModel.findOne({
    resetToken: hashToken,
    resetTokenExpires: { $gt: Date.now() },
  });

  if (!user) return next(new AppError("El token ha expirado"));
  user.password = req.body.nuevaContrasena;
  user.confirmPassword = req.body.confirmarContrasena;
  user.resetToken = undefined;
  user.resetTokenExpires = undefined;
  await user.save();
  enviarRespuestaConToken(req, res, user._id);
});

exports.protegerRutas = catchAsync(async (req, res, next) => {
  //Verify if the token is there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) return next(new AppError("No esta registrdo", 401));
  //Verify that the token is right
  const decode = await promisify(JSONWEBTOKEN.verify)(
    token,
    process.env.JSON_SECRET
  );
  //Verify the user still exist
  const currentUser = await UserModel.findById(decode.id);
  if (!currentUser)
    return next(
      new AppError("El usuario en el cual desea logearse no existe", 401)
    );
  //Verify the user has not changed the password
  const estado = await currentUser.passwordChangedAt(decode.iat);
  if (estado) {
    return next(
      new AppError(
        "El usuario cambio la contraseña, debe logearse denuevo",
        401
      )
    );
  }
  //Setting the currentUser to the loged user
  req.user = currentUser;

  next();
});

exports.verRol = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.rol)) {
      return next(new AppError("No tienes permiso", 401));
    }
    next();
  };
};
