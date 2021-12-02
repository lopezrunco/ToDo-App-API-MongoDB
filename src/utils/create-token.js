const jwt = require('jsonwebtoken')

// Retorna token o refresh token dependiendo de los parametros
module.exports = (user, tokenType, expiresIn) => {
    return jwt.sign({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        type: tokenType
    }, process.env.JWT_KEY, { expiresIn })
}