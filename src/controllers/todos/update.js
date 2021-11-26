const todoModel = require('../../models/todo')

module.exports = (sequelize) => {
    return (request, response) => {

        // Tarea que viene en la peticion
        const todo = request.body

        todoModel(sequelize).update({
            // El primer parametro del update son los campos a actualizar
            title: todo.title,
            description: todo.description,
            priority: todo.priority,
            completed: todo.completed
        }, {
            // El segundo parametro es la condicion para que se actualicen los campos
            where: {
                id: request.params.id
            }
        }).then(updatedRows => {
            // Chequea si encontro la tarea a modificar
            if (updatedRows > 0) {
                response.json({
                    todo
                })
            } else {
                response.status(404).json({
                    message: 'No se encontro la tarea a modificar'
                })
            }
        }).catch(error => {
            console.error(error)

            response.status(500).json({
                message: 'Error al intentar actualizar la tarea'
            })
        })
    }
}
