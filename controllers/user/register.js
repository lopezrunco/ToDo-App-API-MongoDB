// Importacion de las bibliotecas bcrypt y Joi
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Joi = require('joi')

// Importamos el modelo de usuario
const userModel = require('../../models/user')

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
            .alphanum()
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
            role: 'BASIC'       // Al registrarse un usuario, por defecto es BASIC
        }).then(user => {

            // Se obtiene el usuario de forma plana
            const userWithoutPassword = user.toObject()

            // Se borra la password
            delete userWithoutPassword.password

            // Agregamos token de usuario
            userWithoutPassword.token = jwt.sign({
                id: userWithoutPassword._id,
                name: userWithoutPassword.name,
                email: userWithoutPassword.email,
                role: userWithoutPassword.role              // La informacion del rol tambien viaja en el token al front end
            }, process.env.JWT_KEY, { expiresIn: '1h' })

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