// helpers/get-user-token.js
const jwt = require('jsonwebtoken') //jwt gerencia o token

const User =  require('../Model/User')

//Coleta usuário com Token

async function getUserByToken(token){
    if (!token) {
        return res.status(401).json({ message: 'Acesso negado'})
    }

    const decoded = jwt.verify(token, 'nossosecret')

    const userId = decoded.id

    const user = await User.findOne({id: userId})

    return user
}
module.exports = getUserByToken