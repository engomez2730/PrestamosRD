const submitBtn = document.getElementById('submit')
const correo = document.getElementById('correo')
const password = document.getElementById('password')
const loginSection = document.querySelector('.login')

const crearAlerta = (mensaje, color) => {
    const elemento = document.createElement('div')
    elemento.classList.add('alerta')
    elemento.textContent = mensaje
    elemento.style.backgroundColor = color
    loginSection.prepend(elemento)
    elemento.style.marginTop = '20px'
    elemento.style.marginLeft = '50%'
    elemento.style.transform = 'translateX(-50%)'
    setTimeout(() => {
        elemento.remove()
    }, 2000)
}


export const login = async (email, password) => {
    try {
        const res = await axios({
            method: 'POST',
            url: 'http://localhost:3000/api/v1/auth/login',
            data: {
                email, password
            }
        })
        crearAlerta("Se ha logueado con Exito", "#319A2C")
        window.setTimeout(() => {
            location.assign('/')
        }, 1500)

    } catch (err) {
        console.log(err.response.data.message)
        crearAlerta(err.response.data.message, "#BE4444")
    }
}

submitBtn.addEventListener('click', function () {
    const correoValue = document.getElementById('correo').value
    const passwordCalue = document.getElementById('password').value
    console.log(correoValue, passwordCalue)
    login(correoValue, passwordCalue)
})

const cambiarColorInput = (correo) => {
    if (correo.value.includes('@')) {
        correo.style.border = '2px solid green'
    } else {
        correo.style.border = '2px solid red'
    }
}

const cambiarColorPassword = (password) => {
    if (password.value.length >= 8) {
        password.style.border = '2px solid green'
    } else {
        password.style.border = '2px solid red'
    }
}

document.getElementById('correo').addEventListener('input', function (e) {
    cambiarColorInput(correo)
})

document.getElementById('correo').addEventListener('focus', function (e) {
    cambiarColorInput(correo)
})

document.getElementById('password').addEventListener('focus', function (e) {
    cambiarColorPassword(password)
})

document.getElementById('password').addEventListener('input', function (e) {
    cambiarColorPassword(password)
})