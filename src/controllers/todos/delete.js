const todoModel = require('../../models/todo')

module.exports = (sequelize) => {
    return (request, response) => {

        // Se llama la funcion destroy pasando el id que viene en los parametros
        todoModel(sequelize).destroy({
            where: {
                id: request.params.id
            }
        }).then(deletedRows => {

            // deletedRows son los registros afectados por la consulta
            // si no se afecto ningun registro, quiere decir que no se encontro la tarea eliminar
            if (deletedRows > 0) {
                response.json({
                    message: 'Tarea eliminada'
                })
            } else {
                response.status(404).json({
                    message: 'No se encontro la tarea a eliminar'
                })
            }
        }).catch(error => {
            console.error(error)

            response.status(500).json({
                message: 'Error al intentar borrar la tarea'
            })
        })
    }
}