const { userModel } = require('../../models/user')

module.exports = (request, response) => {
    userModel
        .findOne({ _id: request.params.id })   // Encuentra el usuario con el id que viene en los parametros
        .select('-password -todos -mfaSecret')  // Se excluyen campos
        .then(user => {
            response.status(200).json({
                user                            // Retorna el usuario
            })
        }).catch(error => {
            console.error(error)

            response.status(500).json({
                message: 'Error al intentar obtener el usuario'
            })
        })
}