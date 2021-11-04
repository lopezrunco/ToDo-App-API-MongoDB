const { DataTypes } = require('sequelize')

// Se exporta el modelo hacia afuera
module.exports = (sequelize) => {
    
    // Definicion del modelo
    const userModel = sequelize.define('user', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }
    })

    return userModel
}