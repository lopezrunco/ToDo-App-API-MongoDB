const eventTypes = require('../../models/event-types')
const { eventModel } = require('../../models/event')

// Obtain the LOGIN or REGISTER events, count them and group by type
module.exports = (request, response) => {
    eventModel
        .aggregate([{
            $match: {
                $or: [
                    { type: eventTypes.LOGIN },
                    { type: eventTypes.REGISTER }
                ]
            }
        }, {
            $group: {
                _id: '$type',
                count: {
                    $sum: 1
                }
            }
        }, {
            $project: {  
                _id: false,
                type: '$_id',
                count: 1
            }
        }])
        .then(events => {
            response.status(200).json({
                events
            })
        }).catch(error => {
            console.error(error)

            response.status(500).json({
                message: 'Error trying to obtain stats'
            })
        })
}