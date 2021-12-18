const eventTypes = require('../../../models/event-types')
const { eventModel } = require('../../../models/event')

module.exports = (request, response) => {
    eventModel
        .aggregate([{
            // Filtra por eventos de tipo LOGIN
            $match: {
                type: eventTypes.LOGIN
            }
        }, {
            $group: {
                _id: {
                    // Convierte la fecha del campo date al formato Ymd (De esa forma se pueden agrupar (Se eliminan milisegundos, zona horaria, etc))
                    $dateToString: {
                        format: '%Y-%m-%d',
                        date: '$date'
                    }
                },
                // Suma un valor, lo que dara como resultado "En el dia XXX hubieron XXX logins"
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
            // Ordena por fecha de forma ascendente
            $sort: {
                date: 1
            }
        }])
        .then(events => {
            // Este loop hace posible el overt time
            // Itera por todos los eventos dia a dia que vienen y va sumando los eventos de LOGIN considerando el historico
            for (let i = 0; i < events.length; i++) {
                if (events[i - 1]) {
                    events[i].overTime = events[i].inTime + events[i - 1].overTime  // Va seteando en .overTime los eventos del dia actual mas los historicos del anterior
                } else {
                    events[i].overTime = events[i].inTime   // Si cae aqui quiere decir que es el primer evento de la lista
                }
            }

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