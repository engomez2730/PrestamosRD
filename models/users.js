const crypto = require("crypto");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, "Un usuario debe tener un nombre"],
  },
  apellido: {
    type: String,
    required: [true, "Un usuario debe tener un correo"],
    unique: true,
  },
  telefono: {
    type: Number,
    required: [true, "Un Usuario debe tener un Telefono"],
    unique: true,
  },
  direccion: {
    type: String,
    required: [true, "Un usuario deber tene una dirrecion"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  state: {
    type: Boolean,
    default: true,
  },
  rol: {
    type: String,
    enum: {
      values: ["Cliente", "Admin", "Prestamista"],
    },
    default: "Cliente",
  },
});

//Changing the PassWordChangedAt field

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

//Encrypting the password using bcrypt

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});
//Verifing the password is correct
userSchema.methods.correctPassword = async function (
  candidatePassword,
  realPassWord
) {
  return await bcrypt.compare(candidatePassword, realPassWord);
};
//Verifing the user has not changed the password
userSchema.methods.passwordChangedAt = async function (JWTTIME) {
  if (this.fechaDeCambioPassword) {
    const hora = parseInt(this.fechaDeCambioPassword.getTime() / 1000);
    return JWTTIME < hora;
  }
  return false;
};

//Verifing the user has not changed the password
userSchema.methods.crearTokenContraseña = function () {
  const token = crypto.randomBytes(32).toString("hex");

  this.resetToken = crypto.createHash("sha256").update(token).digest("hex");
  console.log(token, this.resetToken);
  this.resetTokenExpires = Date.now() + 10 * 60 * 1000;
  return token;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
