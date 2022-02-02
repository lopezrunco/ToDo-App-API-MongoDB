const eventTypes = require('../../../models/event-types')
const { eventModel } = require('../../../models/event')

module.exports = (request, response) => {
    eventModel
        .aggregate([{
            // Filter by LOGIN events
            $match: {
                type: eventTypes.LOGIN
            }
        }, {
            $group: {
                _id: {
                    // Transform date to YMD format, so they can be agrupated (Delete milsec, timezone, etc)
                    $dateToString: {
                        format: '%Y-%m-%d',
                        date: '$date'
                    }
                },
                // Add 1 value, wich results "On day XXX was XXX logins"
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
            // This loop makes possible the "over time"
            // Loops the events day by day and adds LOGIN events considering the historic
            for (let i = 0; i < events.length; i++) {
                if (events[i - 1]) {
                    events[i].overTime = events[i].inTime + events[i - 1].overTime  // Sets in .overTime the events of actual day adding the history events of the previous day
                } else {
                    events[i].overTime = events[i].inTime   // If comes here, means this is the first event of the list
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