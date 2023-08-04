// helpers/verify-token.js
const jwt = require('jsonwebtoken') //jwt gerencia o token

const getToken = require('./get-token')

function checkToken(req, res, next){
    //Verifica se o Usuario tem login
    if(!req.headers.authorization){
        return res.status(401).json({ message: 'Acesso negado'})
    }

    const token = getToken(req)
    //Verifica se o usuario esta logado
    if(!token){
        return res.status(401).json({ message: 'Acesso negado'})
    }
    
    try {
        const verified = jwt.verify(token, 'nossosecret')
        req.user = verified
        next()
    } catch (error) {
        //Verifica se o Token é válido
        return res.status(400).json({ message: 'Token Inválido'})
    }

}
module.exports = checkToken