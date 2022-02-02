const { eventModel } = require("../../models/event")

// Obtain the events, count them and group by type
module.exports = (request, response) => {
    eventModel
        .aggregate([{
            $group: {
                _id: '$type',
                count: {
                    $sum: 1
                }
            }
        }, {
            // Use $project to rename _id to type (and preserves the count)
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