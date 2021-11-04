const userModel = require('../../models/user')

module.exports = (sequelize) => {
    return (request, response) => {
        userModel(sequelize).findAll({
            attributes: { exclude: ['password'] }
        }).then(users => {
            response.status(200).json({
                users
            })

        }).catch(error => {
            console.error(error)

            response.status(500).json({
                message: 'Error al intentar listar los usuarios'
            })
        })
    }
}