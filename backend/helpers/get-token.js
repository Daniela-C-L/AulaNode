// helpers/get-token.js

const getToken = (req) => {
    const authHeader = req.headers.authorization // Recebe os dados do header da requisição |  O espaço irá separar os campos nos vetores, Por padrão o token esta na posição 1 no navegador

    const token = authHeader.split(' ')[1] // Separa o token do restante do header
    return token
}

module.exports = getToken