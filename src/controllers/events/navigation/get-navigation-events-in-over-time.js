const eventTypes = require('../../../models/event-types')
const { eventModel } = require('../../../models/event')

module.exports = (request, response) => {
    eventModel
        .aggregate([{
            $match: {
                // Filtra by NAVIGATION events
                type: eventTypes.NAVIGATION
            }
        }, {
            $group: {
                _id: {
                    $dateToString: {
                        format: '%Y-%m-%d',
                        date: '$date'
                    }
                },
                inTime: {
                    $sum: 1
                }
            }
        }, {
            $project: {  
                _id: false,
                date: '$_id',
                inTime: 1
            }
        }, {
            $sort: {
                date: 1
            }
        }])
        .then(events => {
            for (let i = 0; i < events.length; i++) {
                if (events[i - 1]) {
                    events[i].overTime = events[i].inTime + events[i - 1].overTime
                } else {
                    events[i].overTime = events[i].inTime
                }
            }

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