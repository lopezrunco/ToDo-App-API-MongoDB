const otplib = require('otplib')
const qrcode = require('qrcode')
const crypto = require('crypto')
const { userModel } = require('../../models/user')

otplib.authenticator.options = { crypto }

module.exports = (request, response) => {
    const secret = otplib.authenticator.encode(
        crypto.randomBytes(32).toString('hex').substr(0, 20)
    )
    
    // This data will be displayed on the auth app (ex: Google Authenticator)
    const email = request.user.email
    const service = 'Tasky'
    const otpAuth = otplib.authenticator.keyuri(email, service, secret)
    
    // Generate a QR (url data in base64) code with the data received
    qrcode.toDataURL(otpAuth)
        .then(qr => {
            userModel.findOneAndUpdate({ _id: request.user.id, mfaEnabled: false }, { mfaEnabled: true, mfaSecret: secret })
                .then((user) => {

                    if (user) {
                        response.json({
                            qr,
                            secret
                        })
                    } else {
                        response.json({
                            message: 'Could not enable MFA'
                        })
                    }
                })
                .catch(error => {
                    console.error('Error trying to enable MFA', error)
                    response.status(500).json({
                        message: 'Error trying to enable MFA'
                    })
                })
        })
        .catch(error => {
            console.error('Error generating QR', error)
            response.status(500).json({
                message: 'Error generating QR'
            })
        })
}