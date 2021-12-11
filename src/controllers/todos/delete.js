const { userModel } = require('../../models/user')

module.exports = (request, response) => {
    userModel
        .findOne({ _id: request.user.id })              // Encuentra el usuario logueado con el id que viene en el request
        .then(user => {
            user.todos.id(request.params.id).remove()   // Al objeto que tiene el id indicado se lo elimina (el id viene en los parametros de la url)

            user.save().then(() => {                    // Guarda el estado actual del modelo (basicamente el modelo menos la todo que se elimino)
                response.status(200).end()
            }).catch(error => {
                console.error(error)

                response.status(500).json({
                    message: 'Error al intentar eliminar la tarea'
                })

            })
        }).catch(error => {
            console.error(error)

            response.status(500).json({
                message: 'Error al intentar eliminar la tarea'
            })
        })
}