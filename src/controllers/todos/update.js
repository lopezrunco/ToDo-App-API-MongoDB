const { userModel } = require('../../models/user')

module.exports = (request, response) => {
    userModel
        .findOne({ _id: request.user.id })
        .then(user => {
            const todo = user.todos.id(request.params.id)

            todo.set(request.body)

            user.save().then(() => {
                response.status(200).end()
            }).catch(error => {
                console.error(error)

                response.status(500).json({
                    message: 'Error trying to uodate the todo'
                })
            })
        }).catch(error => {
            console.error(error)

            response.status(500).json({
                message: 'Error trying to uodate the todo'
            })
        })
}
