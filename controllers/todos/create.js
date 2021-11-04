const Joi = require('joi')
const todoModel = require('../../models/todo')

module.exports = (sequelize) => {
    return (request, response) => {

        // Guarda el body en una variable
        const todo = request.body

        // Esquema de validacion
        const schema = Joi.object({
            title: Joi.string()
                .required(),
            description: Joi.string()
                .required(),
            priority: Joi.string()
                .valid('BAJA', 'MEDIA', 'ALTA')
                .required(),
            completed: Joi.boolean()
        })

        // Validacion del esquema contra el objeto
        const validationResult = schema.validate(todo)

        // Si la validacion no da error, crea la tarea. Si no, muestra error
        if (!validationResult.error) {

            // Llama la funcion create del modelo pasandole los valores que vienen en la request
            todoModel(sequelize).create({
                title: todo.title,
                description: todo.description,
                priority: todo.priority,
                completed: todo.completed

            // Responde al front-end con la tarea creada
            }).then(todo => {
                response.json({
                    todo
                })
            
            // Logueo de error y mensaje
            }).catch(error => {
                console.error(error)

                response.status(500).json({
                    message: 'Error al crear la tarea'
                })
            })
        } else {
            response.status(400).json({
                message: validationResult.error
            })
        }

    }
}