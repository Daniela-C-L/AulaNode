const router = require('express').Router()

const UserController = require('../Controllers/UserController')
//helpers
const verifyToken = require('../helpers/verify-token')
const imageUpload = require('../helpers/image-upload')

//Rotas para criar "registrar" um usuário
// Após o ponto de UserController o nome visualizado é o nome da função assincrona presente no Controller
//Rotas Públicas
router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.get('/checkuser', UserController.checkUser)
router.get('/:id', UserController.getUserById)

//Rotas Protegidas, só acessar caso esteja logado
router.patch('/edit/:id', verifyToken, imageUpload.single('image'), UserController.editUser)

module.exports = router