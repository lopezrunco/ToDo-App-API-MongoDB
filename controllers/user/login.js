// Importacion de las bibliotecas bcrypt y json web token
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// Importacion del modelo de usuario
const userModel = require('../../models/user')

module.exports = (request, response) => {
    userModel.findOne({
        email: request.body.email
    }).then(user => {
        if (user) {
            // Comparamos la password ingresada por el usuario con la guardada en la base de datos
            const match = bcrypt.compareSync(request.body.password, user.password)

            if (match) {
                // Elimino campos que no quiero mostrar en la respuesta
                // El objeto usuario viene como un objeto completo de mongoose, por eso se debe "aplanar"
                const userWithoutPassword = user.toObject()

                delete userWithoutPassword.password

                // Agregamos token de usuario
                userWithoutPassword.token = jwt.sign({
                    id: user._id,
                }, process.env.JWT_KEY, { expiresIn: '1h' })

                // Retornamos el usuario
                response.json({
                    user: userWithoutPassword
                })
            } else {
                console.error('La password no es correcta')
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