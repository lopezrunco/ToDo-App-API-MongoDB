const { userModel } = require('../../models/user')

module.exports = (request, response) => {
    userModel
        .findOne({ _id: request.user.id })
        .then(user => {
            user.todos.push(request.body)

            user.save()
            .then(() => {
                response.status(201).json({
                    message: 'Todo created!'
                }).end()
            }).catch(error => {
                console.error(error)

                response.status(500).json({
                    message: 'Error trying to create the todo'
                })
            })
        }).catch(error => {
            console.error(error)

            response.status(500).json({
                message: 'Error trying to create the todo'
            })
        })
}