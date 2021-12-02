const { REFRESH_TOKEN_TYPE, CONSUMER_TOKEN_TYPE } = require('../../utils/token-types')
const createToken = require('../../utils/create-token')

module.exports = (request, response) => {

    // Valida si el tipo de token es de refresco
    if (request.token.type === 'REFRESH') {
        // Agrega token de usuario
        const token = createToken(request.user, CONSUMER_TOKEN_TYPE, '20m')

        // Agrega refresh token de usuario
        const refreshToken = createToken(request.user, REFRESH_TOKEN_TYPE, '2d')

        // Retorna ambos tokens
        response.json({
            token,
            refreshToken
        })
    } else {
        response.status(401).end()
    }
}