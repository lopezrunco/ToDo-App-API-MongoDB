// Importacion de el archivo a testear
const checkUserRole = require('./check-user-role')

// Function que retorna un mock de la response de express
mockResponse = () => {
    const response = {}

    response.status = jest.fn().mockReturnValue(response)
    response.json = jest.fn().mockReturnValue(response)

    return response
}

// Definicion de los casos de prueba
describe('Middleware para chequeo de rol del usuario', () => {
    test('El middleware debe continuar con la ejecucion si el rol del usuario esta dentro de los permitidos', () => {
        const request = {
            user: {
                role: 'BASIC'
            }
        }

        // Simulacion de la respuesta de Express
        const response = mockResponse()

        // Funcion "espía" que permite verificar si la funcion fue invocada
        const next = jest.fn()

        // Ejecucion
        checkUserRole(['ADMIN', 'BASIC'])(request, response, next)

        // Chequea si la funcion next se invocó
        expect(next).toBeCalled()

    })

    test('El middleware no debe continuar con la ejecucion si el rol del usuario no esta dentro de los permitidos (Error 403)', () => {
        const request = {
            user: {
                role: 'BASIC'
            }
        }

        const response = mockResponse()

        const next = jest.fn()

        checkUserRole(['ADMIN'])(request, response, next)

        expect(next).not.toBeCalled()                       // Espera que la funcion NO sea invocada
        expect(response.status).toHaveBeenCalledWith(403)   // Espera que es status de respuesta sea 403
        expect(response.json).toHaveBeenCalledWith({        // Espera que la funcion json() responda con el mensaje de Acceso prohibido
            message: 'Acceso prohibido'
        })
    })

    test('El middleware no debe continuar con la ejecucion si el usuario no esta presente en la request (Error 401)', () => {
        const request = {}

        const response = mockResponse()

        const next = jest.fn()

        checkUserRole(['ADMIN'])(request, response, next)

        expect(next).not.toBeCalled()                       // Espera que la funcion NO sea invocada
        expect(response.status).toHaveBeenCalledWith(401)   // Espera que es status de respuesta sea 401
        expect(response.json).toHaveBeenCalledWith({        // Espera que la funcion json() responda con el mensaje de Acceso prohibido
            message: 'Credenciales invalidas'
        })
    })

})