// Importamos la biblioteca json web token
const jwt = require('jsonwebtoken')

// Por defecto, el middleware chequea si el token es de tipo 'CONSUMER'.
// Si en la funcion viene como parametro el valor 'REFRESH', chequea con ese tipo
module.exports = (tokenType = 'CONSUMER') => {
    return (request, response, next) => {

        // Del header del request obtenemos la autorizacion
        const token = request.headers.authorization

        try {
            // Valida que el token enviado por el usuario sea correcto
            const decoded = jwt.verify(token, process.env.JWT_KEY)

            // Chequea el tipo de token
            if (decoded.type === tokenType) {
                // Inserta los datos del usuario en la request
                request.user = {
                    id: decoded.id,
                    name: decoded.name,
                    email: decoded.email,
                    role: decoded.role
                }

                // Inserta informacion del token en la request, para acceder a ella mas adelante
                request.token = {
                    value: token,
                    type: decoded.type
                }

                // Se invoca al siguiente middleware
                next()
            } else {
                return response.status(401).json({
                    message: 'Tipo de token invalido'
                })
            }

        // Si alguna linea del try da error, se corta el programa y se captura el error
        } catch (error) {
            console.error('Error en el token', error)

            // Se retorna un error 401 en caso de que el token no se valido
            return response.status(401).json({
                message: 'Credenciales invalidas'
            })
        }
    }
}