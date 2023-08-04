// Controllers/PetController.js

const Pet = require('../Model/Pet')
const User = require('../Model/User')
const imagePet = require('../Model/ImagePet')
const jwt = require('jsonwebtoken')

//helpers
const getToken = require('../helpers/get-token')
module.exports = class PetController {

    //Cadastrar novo pet
    static async create(req, res) {
        const { name, age, weight, color } = req.body

        const available = true

        if (!name) {
            res.status(422).json({ message: 'O campo Nome é obrigatório' })
            return
        }
        if (!age) {
            res.status(422).json({ message: 'O campo Idade é obrigatório' })
            return
        }
        if (!weight) {
            res.status(422).json({ message: 'O campo Peso é obrigatório' })
            return
        }
        if (!color) {
            res.status(422).json({ message: 'O campo Cor é obrigatório' })
            return
        }

        //Pegando o Id do cadastrador do Pet
        let currentUser // usuario atual
        const token = getToken(req)
        const decoded = jwt.verify(token, 'nossosecret')
        currentUser = await User.findByPk(decoded.id)
        //console.log(currentUser)

        const pet = new Pet({
            name: name,
            age: age,
            weight: weight,
            color: color,
            available: available,
            UserId: currentUser.id
        })

        try {
            const newPet = await pet.save()
            res.status(201).json({ message: 'Pet Cadastrado com Sucesso ', newPet })
        } catch (error) {
            res.status(500).json({ message: error })
        }
    }

    static async getAll(req, res) {
        const pets = await Pet.findAll({ order: [['createdAt', 'DESC']] })
        res.status(200).json({ pets: pets })
    }

    static async getAllUserPets(req, res) {
        //verificar o usuario logado
        let currentUser
        const token = getToken(req)
        const decoded = jwt.verify(token, 'nossosecret')
        currentUser = await User.findByPk(decoded.id)
        currentUser.password = undefined
        //Pegando o Id do usuario logado
        const currentUserId = currentUser.id

        const pets = await Pet.findAll({ where: { UserId: currentUserId }, order: [['createdAt', 'DESC']] })
        res.status(200).json({ pets })
    }
    //Buscar pet por Id
    static async getPetById(req, res) {
        //Bucar Id da URL
        const id = req.params.id

        // NaN <-------------------- Not a Number
        if (isNaN(id)) { //Se o Id nã for um numero
            res.status(422).json({ message: "Identificador Inválido, deve conter apenas Nº" })
            return
        }

        const pet = await Pet.findByPk(id)

        if (!pet) {
            res.status(422).json({ message: "Pet não existente" })
            return
        }

        res.status(200).json({ pet: pet })
    }

    static async removePetById(req, res) {
        const id = req.params.id

        // NaN <-------------------- Not a Number
        if (isNaN(id)) { //Se o Id nã for um numero
            res.status(422).json({ message: "Identificador Inválido, deve conter apenas Nº" })
            return
        }

        const pet = await Pet.findByPk(id)

        if (!pet) {
            res.status(422).json({ message: "Pet não existente" })
            return
        }

        //verificar o usuario logado
        let currentUser
        const token = getToken(req)
        const decoded = jwt.verify(token, 'nossosecret')
        currentUser = await User.findByPk(decoded.id)
        currentUser.password = undefined
        //Pegando o Id do usuario logado
        const currentUserId = currentUser.id

        if (Number(pet.UserId) !== Number(currentUserId)) {
            res.status(422).json({ message: 'Identificador Inválido' })
            return
        }

        await Pet.destroy({ where: { id: id } })
        res.status(200).json({ message: 'Cadastro de Pet excluido com sucesso' })

    }

    static async updatePet(req, res) {
        const id = req.params.id
        const { name, age, weight, color } = req.body

        const updatePet = {}
        const pet = await Pet.findByPk(id)

        if (!pet) {
            res.status(404).json({ message: 'Pet não encontrado' })
        }

        //pegando o dono do pet
        let currentUser
        const token = getToken(req)
        const decoded = jwt.verify(token, 'nossosecret')
        currentUser = await User.findByPk(decoded.id)

        if (pet.UserId !== currentUserId) {
            res.status(422).json({ message: 'Identificador Inválido' })
            return
        }


        if (!name) {
            res.status(422).json({ message: 'O campo Nome é obrigatório' })
            return
        } else {
            updatePet.name = name
        }
        if (!age) {
            res.status(422).json({ message: 'O campo Idade é obrigatório' })
            return
        } else {
            updatePet.age = age
        }
        if (!weight) {
            res.status(422).json({ message: 'O campo Peso é obrigatório' })
            return
        } else {
            updatePet.weight = weight
        }
        if (!color) {
            res.status(422).json({ message: 'O campo Cor é obrigatório' })
            return
        } else {
            updatePet.color = color
        }

        //Trabalhar com as imagens
        const images = req.files
        if(!images || images.lenght === 0){
            res.status(422).json({ message: 'As imagens são obrigatorias'})
            ReadableStreamDefaultController
        }
        //Atualizar as imagens do pet               //Ação  
        const imageFileName = images.map((image) => image.imageFilename) //filename = nome do arquivo
        
        //remover imagens antigas
        await imagePet.destroy({ where: { PetId: pet.id }})

        //adicionar novas imagens
        for (let i = 0; i < imageFileName.lenght; i++){
            const filename = imageFileName[i]
            const newImagePet = new imagePet({ Image: filename, PetId: pet.id })
            await newImagePet.save()
        }

        await Pet.update(updateData, { where: { id: id} })
        res.status(200).json({message: 'Pet atualizado com sucesso'})
    }
    static async schedule(req, res) {
        const id = req.params.id
        const pet = await Pet.findByPk(id)

        if (!pet) {
            res.status(404).json({ message: 'Pet não existe!!!!!!!' })
            return
        }

        //pegando o dono do pet
        let currentUser
        const token = getToken(req)
        const decoded = jwt.verify(token, 'nossosecret')
        currentUser = await User.findByPk(decoded.id)

        if (pet.UserId !== currentUser.id) {
            res.status(422).json({ message: 'O pet ja é seu' })
            return
        }

        if (pet.adopter) {
            if (pet.adopter === currentUser.id) {
                res.status(422).json({ message: 'voce ja agendou uma visita' })
            }
        }
        pet.adopter = currentUser.id

        await pet.save()

        res.status(200).json({ message: 'pet adotado com sucesso' })
    }

    static async concludeAdoption(req, res) {
        const id = req.params.id
        const pet = await Pet.findByPk(id)

        if (!pet) {
            res.status(404).json({ message: 'Pet não existe!!!!!!!' })
            return
        }

        //pegando o dono do pet
        let currentUser
        const token = getToken(req)
        const decoded = jwt.verify(token, 'nossosecret')
        currentUser = await User.findByPk(decoded.id)

        if (pet.UserId !== currentUser.id) {
            res.status(422).json({ message: 'Id Invalido' })
            return
        }

        pet.available = false
        await pet.save()
        res.status(200).json({ message: 'Adoção concluida!!' })
    }
    static async getAllUserAdoptiond(req, res){
         //pegando o dono do pet
         let currentUser
         const token = getToken(req)
         const decoded = jwt.verify(token, 'nossosecret')
         currentUser = await User.findByPk(decoded.id)

         const pets = await Pet.findAll({
            where: {adopter: currentUser.id},
            order: [['createAt', 'DESC']]
            
         })
         res.status(200).json({ pets })
    }
}




