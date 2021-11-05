const todoModel = require('../../models/todo')

module.exports = (request, response) => {

    // Definicion de una paginacion por defecto
    let pagination = {
        offset: 0,
        limit: 10
    }

    // Si vienen valores asignaos por el usuario, los asignamos a la paginacion, si no, se asignan los valores por defecto
    if (request.query.page && request.query.itemsPerPage) {
        pagination.offset = (request.query.page - 1) * request.query.itemsPerPage,
            pagination.limit = parseInt(request.query.itemsPerPage)
    }

    // Lista todos las tareas y responde mostrandolas en la UI
    todoModel
        .find()
        .skip(pagination.offset)
        .limit(pagination.limit)
        .then(todos => {
            todoModel.
                count()
                .then(count => {
                    const meta = {
                        count
                    }

                    // Responde al front end con el numero de tareas y las tareas en si
                    response.status(200).json({
                        meta,
                        todos
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