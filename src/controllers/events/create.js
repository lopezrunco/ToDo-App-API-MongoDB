const Joi = require('joi')
const storeEvent = require('../../utils/store-event')
const eventTypes = require('../../models/event-types')

// Save the event
module.exports = (request, response) => {
    const event = request.body

    const schema = Joi.object({
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
        // No Mandatory contextual information
        context: Joi.any()
    })

    const validationResult = schema.validate(event)

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
                message: 'Could not register the event'
            })
        })
    } else {
        response.status(400).json({
            message: validationResult.error
        })
    }
}