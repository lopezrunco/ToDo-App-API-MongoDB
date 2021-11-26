const { userModel } = require('../../models/user')

module.exports = (request, response) => {

    // Definicion de una paginacion por defecto
    const pagination = {
        offset: 0,
        limit: 10
    }

    // Si vienen valores asignaos por el usuario, los asignamos a la paginacion, si no, se asignan los valores por defecto
    if (request.query.page && request.query.itemsPerPage) {
        pagination.offset = (request.query.page - 1) * request.query.itemsPerPage,
            pagination.limit = parseInt(request.query.itemsPerPage)
    }

    // Lista todas las tareas del usuario logueado en la UI
    userModel
        .findOne({ _id: request.user.id })    // Accede al usuario segun el ID inyectado en el middleware checkIfTheUserHasCredentials
        .select(['todos'])                  // Para el usuario logueado, selecciona los todos
        .skip(pagination.offset)            // Aplica paginacion
        .limit(pagination.limit)
        .then(user => {
            userModel
                .count()                     // TODO: Para este usuario en particular, contar el largo del array de tareas
                .then(count => {
                    const meta = {
                        count
                    }

                    // Responde al front end con el numero de tareas del usuario y las tareas en si
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