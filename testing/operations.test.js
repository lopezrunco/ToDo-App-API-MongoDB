const { sum, sub } = require('./operations')

describe('Function que suma valores', () => {

    test('Si le pasamos los parametros (1, 2) deberia retornar 3', () => {
        // Arrange, Act, Assert
        expect(sum(1, 2)).toBe(3)
    })
    
    test('Si le pasamos los parametros (5000, 5) deberia retornar 5005', () => {
        // Arrange, Act, Assert
        expect(sum(5000, 5)).toBe(5005)
    })
    
    test('Si le pasamos los parametros (-1, 1) deberia retornar 0', () => {
        // Arrange, Act, Assert
        expect(sum(-1, 1)).toBe(0)
    })

})

describe('Function que resta valores', () => {

    test('Si le pasamos los parametros (5, 4) deberia retornar 1', () => {
        // Arrange, Act, Assert
        expect(sub(5, 4)).toBe(1)
    })
    
    test('Si le pasamos los parametros (805, 5) deberia retornar 800', () => {
        // Arrange, Act, Assert
        expect(sub(805, 5)).toBe(800)
    })
    
    test('Si le pasamos los parametros (4067895, 3856596) deberia retornar -344.801', () => {
        // Arrange, Act, Assert
        expect(sub(40895, 385696)).toBe(-344801)
    })

})
