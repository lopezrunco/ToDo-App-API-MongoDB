const { userModel } = require('../../models/user')

module.exports = (request, response) => {

    // Definicion de una paginacion por defecto
    const pagination = {
        offset: 0,
        limit: 10
    }
    // Si vienen valores asignados por el usuario, los asignamos a la paginacion, si no, se asignan los valores por defecto
    if (request.query.page && request.query.itemsPerPage) {
        pagination.offset = (request.query.page - 1) * request.query.itemsPerPage,
            pagination.limit = parseInt(request.query.itemsPerPage)
    }

    userModel
        .find()     // Obtiene toda la lista sin filtro
        .select('-password -todos -mfaSecret')  // Omite los campos password, todos y mfaSecret
        .skip(pagination.offset)
        .limit(pagination.limit)
        .then(users => {
            userModel
                .count()                        // Hace una cuenta de la coleccion entera
                .then(count => {
                    const meta = {
                        count
                    }

                    response.status(200).json({ // Responde con los usuarios y el numero de usuarios
                        meta,
                        users
                    })
                }).catch(error => {
                    console.error(error)

                    response.status(500).json({
                        message: 'Error al intentar listar los usuarios'
                    })
                })
        }).catch(error => {
            console.error(error)

            response.status(500).json({
                message: 'Error al intentar listar los usuarios'
            })
        })
}