// Se envuelve una funcion dentro de otra para poder pasar role como parametro
module.exports = (roles) => {
    return (request, response, next) => {

        // Chequea si hay usuario
        if(request.user) {

            // Chequea dentro de la lista de roles, si el rol del usuario coincide
            const roleMatches = roles.find(role => role === request.user.role)

            // Si el usuario coincide, pasa al siguiente middleware
            if (roleMatches) {
                next()
            } else {
                return response.status(403).json({
                    message: 'Acceso prohibido'
                })
            }
        } else {
            return response.status(401).json({
                message: 'Credenciales invalidas'
            })
        }
    }
}