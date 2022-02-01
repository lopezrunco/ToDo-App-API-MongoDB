const { userModel } = require('../../models/user')

module.exports = (request, response) => {
    userModel
        .findOne({ _id: request.user.id })
        .then(user => {
            user.todos.push(request.body)

            user.save()
            .then(() => {
                response.status(201).json({
                    message: 'Tarea creada exitosamente!'
                }).end()
            }).catch(error => {
                console.error(error)

                response.status(500).json({
                    message: 'Error al intentar crear una tarea'
                })
            })
        }).catch(error => {
            console.error(error)

            response.status(500).json({
                message: 'Error al intentar crear una tarea'
            })
        })
}