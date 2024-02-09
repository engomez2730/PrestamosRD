exports.aumentarMes = (prestamo) => {
    let fechaActual = new Date(prestamo.dayOfPayment)
    let dia = fechaActual.getDate()
    let mes = fechaActual.getMonth()
    mes = mes + 1
    let año = fechaActual.getFullYear()
    return new Date(año, mes, dia)
}

