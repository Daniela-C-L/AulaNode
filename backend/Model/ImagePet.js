// Model/ImagePet.js
const { DataTypes } = require('sequelize')

const db = require('../db/conn')

const Pet = require('./Pet')

const imagePet = db.define('imagePet',{
    image:{
        type: DataTypes.STRING,
        allowNull: false
    }
})

// A imagem pertence a 1 Pet
imagePet.belongsTo(Pet)
//Um pet tem varias imagens
Pet.hasMany(imagePet)

module.exports = imagePet