import { login } from './login';
/* import axios from 'axios';
 */import '@babel/polyfill';
/* 

const raya = document.querySelector('.fa-bars')
const rayaCerrado = document.querySelector('.fa-times')
const sidebar = document.querySelector('.content-sidebar')
const content = document.querySelector('.content-fullbar')
const logo = document.querySelector('.logo')
const encabezado = document.querySelectorAll('.encabezado')


raya.addEventListener('click', function (e) {

    sidebar.style.flex = "0 0 4%";
    content.style.flex = "0 0 96%"
    logo.style.display = 'none'
    raya.style.display = 'none'
    rayaCerrado.style.display = 'block'
    encabezado.forEach(e => {
        e.style.display = 'none'
    })
})

rayaCerrado.addEventListener('click', function (e) {
    sidebar.style.flex = "0 0 14%"
    content.style.flex = "0 0 86%"
    raya.style.display = 'block'
    logo.style.display = 'block'
    rayaCerrado.style.display = 'none'
    encabezado.forEach(e => {
        e.style.display = 'block'
    })

})

//Data /////////////////////////////////////////

const stats = async () => {
    try {
        const res = await axios({
            method: 'GET',
            url: 'http://localhost:3000/api/v1/users',
        })
        
    } catch (err) {
        console.log(err)
    } */
/* }



stats() */

const submitBtn = document.getElementById('submit')
const correo = document.getElementById('correo')
const password = document.getElementById('password')
const loginSection = document.querySelector('.login')

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