// db/conn.js

const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('get_a_pet', 'root', 'sucesso', {
    host: 'localhost',
    dialect: 'mysql'
})

try {
    sequelize.authenticate()
    console.log('Conectando ao Banco')
} catch (error) {
    console.log('Não foi possivel se conectar', error)
}

module.exports = sequelize
