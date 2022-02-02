const { REFRESH_TOKEN_TYPE, CONSUMER_TOKEN_TYPE } = require('../../utils/token-types')
const createToken = require('../../utils/create-token')

module.exports = (request, response) => {
    // Validate if the token is REFRESH type
    if (request.token.type === 'REFRESH') {
        const token = createToken(request.user, CONSUMER_TOKEN_TYPE, '20m')
        const refreshToken = createToken(request.user, REFRESH_TOKEN_TYPE, '2d')

        response.json({
            token,
            refreshToken
        })
    } else {
        response.status(401).end()
    }
}