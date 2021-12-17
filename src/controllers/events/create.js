const Joi = require('joi')      // Con Joi se validara el tipo de informacion que guardara el evento
const storeEvent = require('../../utils/store-event')
const eventTypes = require('../../models/event-types')

// Guarda el evento
module.exports = (request, response) => {
    // Guardamos el evento que viene en la peticion
    const event = request.body

    // Definicion de esquema a validar
    const schema = Joi.object({
        // El type debe de estar dentro de los valores indicados en eventTypes
        type: Joi.string().valid(
            eventTypes.NAVIGATION,
            eventTypes.TODO_CREATED,
            eventTypes.TODO_DELETED,
            eventTypes.TODO_UPDATED,
            eventTypes.REGISTER,
            eventTypes.LOGIN,
            eventTypes.TOKEN_REFRESH,
            eventTypes.GENERIC
        ).required(),
        // Informacion contextual que no es obligatoria
        context: Joi.any()
    })

    const validationResult = schema.validate(event)

    // Si la validacion es exitosa, guarda el evento
    if (!validationResult.error) {
        storeEvent({ 
            ...event, 
            context: {
                ...event.context,
                userId: request.user.id
            }
        }).then(() => {
            response.status(200).end()
        }).catch(error => {
            console.error(error)

            response.status(500).json({
                message: 'No se pudo registrar el evento'
            })
        })
    } else {
        response.status(400).json({
            message: validationResult.error
        })
    }
}