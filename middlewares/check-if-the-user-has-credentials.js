// Importamos la biblioteca json web token
const jwt = require('jsonwebtoken')

// El exports se incluye para que la funcion que disponible globalmente
module.exports = (request, response, next) => {

    // Del header del request obtenemos la autorizacion
    const token = request.headers.authorization

    try {
        // Valida que el token enviado por el usuario sea correcto
        const decoded = jwt.verify(token, process.env.JWT_KEY)
        
        // Se invoca al siguiente middleware
        next()

    // Si alguna linea del try da error, se corta el programa y se captura el error
    } catch(error) {
        console.error('Error en el token', error)

        // Se retorna un error 401 en caso de que el token no se valido
        return response.status(401).json({
            message: 'Credenciales invalidas'
        })
    }
}