const { request } = require('express')
const otplib = require('otplib')
const qrcode = require('qrcode')
const userModel = require('../../models/user')

// Este controlador se llama desde la UI para habilitar el multifactor.
// Se llama cuando el usuario ya esta logueado, entonces puedo obtener datos
// como el email, id, etc, seteados anteriormente desde el middleware
module.exports = (request, response) => {

    // Estos datos se mostraran en la app de autenticacion (Google authenticator por ejemplo)
    const email = request.user.email
    const service = 'Tasky'

    // Genera una clave secreta para este usuario puntual
    const secret = otplib.authenticator.generateSecret()
    // Datos con los cuales se generara el QR
    const otpauth = otplib.authenticator.keyuri(email, service, secret)

    // Con los datos que se le pasan, esta funcion genera una imagen QR (url de datos en base64)
    qrcode.toDataURL(otpauth)   // Genera el QR
        .then(qr => {

            // Cuando ya tiene el QR, bsuco el usuario por el ID que esta en el token que se inyectó en el middleware
            // Solo habilitara el MFA si el mismo esta deshabilitado, si no, no. 
            // Le decimos que el MFA esta habilitado y le asignamos la clave secreta
            userModel.findOneAndUpdate({ _id: request.user.id, mfaEnabled: false }, { mfaEnabled: true, mfaSecret: secret })
                .then((user) => {

                    // Si existe usuario, se retorna el QR y la clave secret al usuario
                    if (user) {
                        response.json({
                            qr,
                            secret
                        })
                    } else {
                        response.json({
                            message: 'No fue posible habilitar MFA'
                        })
                    }
                })
                .catch(error => {
                    console.error('Error al tratar de habilitar MFA', error)
                    response.status(500).json({
                        message: 'Error al tratar de habilitar MFA'
                    })
                })
        })
        .catch(error => {
            console.error('Error generando el QR', error)
            response.status(500).json({
                message: 'Error generando el QR'
            })
        })
}