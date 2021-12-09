const mongoose = require('mongoose')                // Lo usaremos para el ObjectId
const { userModel } = require('../../models/user')

module.exports = (request, response) => {
    userModel
        .findOne({ _id: request.user.id })  // Accede al usuario segun el ID inyectado en el middleware checkIfTheUserHasCredentials
        .select('todos')                    // Para el usuario logueado, selecciona los todos
        .then(user => {
            // Agregate es una consulta que puede tener varias etapas
            userModel.aggregate([{
                $match: { _id: mongoose.Types.ObjectId(request.user.id) }   // $match es un equivalente de find. Types.ObjectId obitne el ID de un objeto a partir de un string
            }, {
                $project: {     // Hace una proyeccion, o sea, agregar un campo. En este caso es $size (como un lenght) de las todos
                    count: { $size: '$todos' }
                }
            }]).then(countAggregation => {
                // Se accede al count y se lo muestra
                const count = countAggregation[0].count
                const meta = {
                    count
                }

                // Responde al front end con el numero de tareas del usuario y las tareas
                response.status(200).json({
                    meta,
                    todos: user.todos
                })
            }).catch(error => {
                console.error(error)

                response.status(500).json({
                    message: 'Error al intentar listar las tareas'
                })
            })

        }).catch(error => {
            console.error(error)

            response.status(500).json({
                message: 'Error al intentar listar las tareas'
            })
        })
}