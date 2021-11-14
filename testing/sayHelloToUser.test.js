const sayHelloToUser = require('./sayHelloToUser')

describe('Function que le da la bienvenida a un/a usuari@', () => {

    test('Para el usuario "Sofia" deberia decir "Hola usuaria: Sofia"', () => {
        // Arrange
        const user = {
            female: true,
            name: 'Sofia'
        }
    
        // Act
        const result = sayHelloToUser(user)
        
        // Assert
        expect(result).toBe('Hola usuaria: Sofia')
    })
    
    test('Para el usuario "Pedro" deberia decir "Hola usuario: Pedro"', () => {
        // Arrange
        const user = {
            female: false,
            name: 'Pedro'
        }
    
        // Act
        const result = sayHelloToUser(user)
        
        // Assert
        expect(result).toBe('Hola usuario: Pedro')
    })

})
