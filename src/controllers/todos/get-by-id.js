const { userModel } = require('../../models/user')

module.exports = (request, response) => {
    userModel
        .findOne({ _id: request.user.id })                  // Obtiene el usuario logueado
        .then(user => {
            const todo = user.todos.id(request.params.id)   // De la lista de todos obtiene la que matchea con el id de los params 
                                                            // Funcionalidad de mongoose en la que especificamos modelo.coleccion.id y le pasamos el id y devuelve el elemento que matchea
                                                            // Para encontrar: parent.children.id(_id)
                                                            // Para eliminar: parent.children.id(_id).remove()
            response.status(200).json({
                todo                                        // Retorna la tarea
            })
        }).catch(error => {
            console.error(error)

            response.status(500).json({
                message: 'Error al intentar obtener la tarea'
            })
        })
}