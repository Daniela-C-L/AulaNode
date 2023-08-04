const { DataTypes } = require('sequelize')

const db = require('../db/conn')

const User = require ('../Model/User')

const Pet = db.define('Pet',{
    name:{
        type: DataTypes.STRING,
        allowNull: false
    },
    age:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    weight:{
        type: DataTypes.FLOAT,
        allowNull: false
    },
    color:{
        type: DataTypes.STRING,
        allowNull: false
    },
    available:{
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    adopter:{
        type: DataTypes.INTEGER,
        allowNull: true
    }
})

Pet.belongsTo(User) //"Um pet pertence à um usuário"
User.hasMany(Pet) //"Um usuario pode possuir varios pets"

module.exports = Pet