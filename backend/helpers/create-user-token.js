const jwt = require('jsonwebtoken')

//criando token do user
async function createUserToken(user, req, res) {

    //gerar o token
    const token = jwt.sign({
        name: user.name,
        id: user.id
    }, 'nossosecret') //Mudar o nossosecret para melhorar a criptografia, será um componente a mais para o embaralhamento que irá gerar um "código" para criptografia

    //retornar o token
    res.status(200).json({
        message: 'Você esta autenticado',
        token: token,
        userId: user.id
    })

}
module.exports = createUserToken