const bcrypt = require('bcrypt')
const otplib = require('otplib')
const jwt = require('jsonwebtoken')
const userModel = require('../../models/user')

const returnCredentials = (user, response) => {
    // Elimino campos que no quiero mostrar en la respuesta
    const userWithoutPassword = user.toJSON()

    delete userWithoutPassword.password
    delete userWithoutPassword.mfaEnabled
    delete userWithoutPassword.mfaSecret

    // Agregamos token de usuario
    userWithoutPassword.token = jwt.sign({
        id: user._id,
        name: user.name,
        email: user.email
    }, process.env.JWT_KEY, { expiresIn: '1h' })

    // Retornamos el usuario
    response.json({
        user: userWithoutPassword
    })
}

module.exports = (request, response) => {
    userModel.findOne({
        email: request.body.email
    }).then(user => {
        if (user) {
            // Comparamos la password ingresada por el usuario con la guardada en la base de datos
            const match = bcrypt.compareSync(request.body.password, user.password)
            
            if (match) {

                // Chequea si el usuario tiene MFA habilitado
                if (user.mfaEnabled) {
                    try {
                        // Validar token generado por la app
                        const mfaTokenValid = otplib.authenticator.check(request.body.token, user.mfaSecret)
                        
                        if (mfaTokenValid) {
                            returnCredentials(user, response)
                        } else {
                            console.error('Token MFA invalido')
                            response.status(401).end()
                        }
                    } catch (err) {
                        console.error('Error al validar el token MFA', error)
                        response.status(401).end()
                    }
                } else {
                    returnCredentials(user, response)
                }
            } else {
                console.error('La password no coincide')
                response.status(401).end()
            }
        } else {
            console.error('No se encontro el usuario')
            response.status(401).end()
        }
    }).catch(error => {
        console.error(error)

        response.status(500).json({
            message: 'Error al intentar iniciar sesion'
        })
    })
}