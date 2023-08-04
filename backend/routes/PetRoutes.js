const router = require('express').Router()
const PetController = require('../Controllers/PetController')

//helpers
const verifyToken = require('../helpers/verify-token')
const imageUpload = require('../helpers/image-upload')
const { verify } = require('jsonwebtoken')
//------------- ROTAS PRIVADAS ---------------
/* Cadastrar Pet*/
router.post('/create', verifyToken, imageUpload.array('images'), PetController.create)

/* Mostrar pets do usuario logado */
router.get('/mypets', verifyToken, PetController.getAllUserPets)

/* Deletar um pet pelo ID */
router.delete('/:id', verifyToken, PetController.removePetById)

/* Editar Pet */
router.patch('/:id', verifyToken, imageUpload.array('images'), PetController.updatePet)

/*agendar pet*/
router.patch('/shedule/:id', verifyToken, PetController.schedule)

/*concluir adoção*/
router.patch('/conclude/:id', verifyToken, PetController.concludeAdoption)
//------------- ROTAS PUBLICAS ---------------

/* Listar todos os Pets*/
router.get('/', PetController.getAll)
/*Listar Pets por Id*/
router.get('/:id', PetController.getPetById)

module.exports = router