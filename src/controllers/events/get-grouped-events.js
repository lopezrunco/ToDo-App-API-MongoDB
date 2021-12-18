const { eventModel } = require("../../models/event")

// Obtiene los eventos, los cuenta y los agrupa por tipo
module.exports = (request, response) => {
    eventModel
        .aggregate([{
            // Agrupa por tipo de evento y por cada uno, suma un valor al count
            $group: {
                _id: '$type',
                count: {
                    $sum: 1
                }
            }
        }, {
            // $project proyecta campos, por ejemplo, para renombrar
            // Por defecto, el group muestra el type como _id, lo que no es bueno en terminos de UI
            // por eso, se renombra de la siguiente manera:
            //  _id no se muestra, y lo que era _id se muestra en un campo llamado type. Y preserva el count
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
                message: 'Error al intentar obtener estadisticas'
            })
        })
}