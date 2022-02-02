const bcrypt = require('bcrypt')
const Joi = require('joi')

const createToken = require('../../utils/create-token')
const storeEvent = require('../../utils/store-event')
const eventTypes = require('../../models/event-types')
const { userModel } = require('../../models/user')
const { CONSUMER_TOKEN_TYPE, REFRESH_TOKEN_TYPE } = require('../../utils/token-types')

module.exports = (request, response) => {

    const user = request.body

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

    const validationResult = schema.validate(user)

    if (!validationResult.error) {

        user.password = bcrypt.hashSync(user.password, 2)

        userModel.create({
            password: user.password,
            email: user.email,
            name: user.name,
            todos: [],
            role: 'BASIC'
        }).then(user => {

            // Obtain the user in plain
            const userWithoutPassword = user.toObject()

            delete userWithoutPassword.todos
            delete userWithoutPassword.password
            delete userWithoutPassword.mfaSecret

            userWithoutPassword.token = createToken(user, CONSUMER_TOKEN_TYPE, '20m')
            userWithoutPassword.refreshToken = createToken(user, REFRESH_TOKEN_TYPE, '2d')

            // Create REGISTER event
            storeEvent({
                type: eventTypes.REGISTER,
                context: { id: user.id }
            }).then().catch(error => { console.error(error) })

            response.json({
                user: userWithoutPassword
            })

        }).catch(error => {
            response.status(500).json({
                message: 'Could not register the user'
            })
        })
    } else {
        response.status(400).json({
            message: validationResult.error
        })
    }
}