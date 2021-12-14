// Importacion de las bibliotecas bcrypt y Joi
const bcrypt = require('bcrypt')
const Joi = require('joi')
const createToken = require('../../utils/create-token')
const { userModel } = require('../../models/user')
const { CONSUMER_TOKEN_TYPE, REFRESH_TOKEN_TYPE } = require('../../utils/token-types')

module.exports = (request, response) => {

    // Crea el usuario con los datos que vienen en el body
    const user = request.body

    // Valida el usuario usando la biblioteca Joi
    // En la constante schema se define el modelo a validar
    const schema = Joi.object({
        name: Joi.string()
            .alphanum()
            .required(),
        password: Joi.string()
            .min(7)
            .max(50)
            .required(),
        email: Joi.string()
            .email()
            .required()
    })

    // Resultado de la validacion del esquema proporcionado
    const validationResult = schema.validate(user)

    // Si no hay error, se registra el usuario
    if (!validationResult.error) {

        // Usando la biblioteca bcrypt, toma la password del usuario y genera el hash 
        // Los parametros usados son: En primer lugar el string a hashear
        // y en segundo lugar las vueltas de "sal", o sea que tan seguro sera el hash
        user.password = bcrypt.hashSync(user.password, 2)

        // Guardar el usuario en la base de datos
        userModel.create({
            // Se pasan los campos
            password: user.password,
            email: user.email,
            name: user.name,
            todos: [],
            role: 'BASIC'       // Al registrarse un usuario, por defecto es BASIC
        }).then(user => {

            // Se obtiene el usuario de forma plana
            const userWithoutPassword = user.toObject()

            // Se borran los datos que no se mostraran en la respuesta
            delete userWithoutPassword.todos
            delete userWithoutPassword.password
            delete userWithoutPassword.mfaSecret

            // Agregamos token de usuario
            userWithoutPassword.token = createToken(user, CONSUMER_TOKEN_TYPE, '20m')

            // Agregamos refresh token de usuario
            userWithoutPassword.refreshToken = createToken(user, REFRESH_TOKEN_TYPE, '2d')

            // Se retorna la informacion de usuario sin la password
            response.json({
                user: userWithoutPassword
            })

        }).catch(error => {
            response.status(500).json({
                message: 'No se pudo registrar el usuario'
            })
        })
    } else {
        // Si hay error, se muestra mensaje con el error de validacion que arroja Joi
        response.status(400).json({
            message: validationResult.error
        })
    }
}