const { userModel } = require('../../models/user')

module.exports = (request, response) => {
    userModel
        .findOne({ _id: request.user.id })
        .then(user => {
            // Se busca el elemento a modificar
            const todo = user.todos.id(request.params.id)

            // La funcion set es la encargada de setear los valores
            // No es destructiva, o sea que si solo hay que setear un campo de varios, no toca los campos que no debe
            todo.set(request.body)

            // Guardado
            user.save().then(() => {
                response.status(200).end()
            }).catch(error => {
                console.error(error)

                response.status(500).json({
                    message: 'Error al intentar modificar una tarea'
                })
            })
        }).catch(error => {
            console.error(error)

            response.status(500).json({
                message: 'Error al intentar modificar una tarea'
            })
        })
}
