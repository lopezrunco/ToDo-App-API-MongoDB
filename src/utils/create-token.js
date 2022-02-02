const jwt = require('jsonwebtoken')

// Return token or refresh token depending the parameters
module.exports = (user, tokenType, expiresIn) => {
    return jwt.sign({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        type: tokenType
    }, process.env.JWT_KEY, { expiresIn })
}