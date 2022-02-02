const checkUserRole = require('./check-user-role')

// Return a mock of express
mockResponse = () => {
    const response = {}

    response.status = jest.fn().mockReturnValue(response)
    response.json = jest.fn().mockReturnValue(response)

    return response
}

describe('Middleware to check user role', () => {
    test('The middleware must continue the ejecution if the user role is on the allowed', () => {
        const request = {
            user: {
                role: 'BASIC'
            }
        }

        // Simulate express response
        const response = mockResponse()

        // "Spy" function that verify if the function was invocated
        const next = jest.fn()

        // Ejecution
        checkUserRole(['ADMIN', 'BASIC'])(request, response, next)

        // Check if the next function was invocated
        expect(next).toBeCalled()
    })

    test('The middleware must not continue the ejecution if the user rol is not on the allowed (Error 403)', () => {
        const request = {
            user: {
                role: 'BASIC'
            }
        }

        const response = mockResponse()

        const next = jest.fn()

        checkUserRole(['ADMIN'])(request, response, next)

        expect(next).not.toBeCalled()                       // Wait the function not be invocated
        expect(response.status).toHaveBeenCalledWith(403)   // Wait 403 response status
        expect(response.json).toHaveBeenCalledWith({        // Wait that json() respond with Forbidden access
            message: 'Acceso prohibido'
        })
    })

    test('The middleware must not continue the ejecution if the user rol is not on the allowed (Error 401)', () => {
        const request = {}

        const response = mockResponse()

        const next = jest.fn()

        checkUserRole(['ADMIN'])(request, response, next)

        expect(next).not.toBeCalled()                       // Wait the function not be invocated
        expect(response.status).toHaveBeenCalledWith(401)   // Wait 401 response status
        expect(response.json).toHaveBeenCalledWith({        // Wait that json() respond with Forbidden access
            message: 'Invalid credentials'
        })
    })

})