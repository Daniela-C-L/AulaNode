const Pet = require('../Model/Pet')
const User = require('../Model/User')
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-token')
const jwt = require('jsonwebtoken')
const ImagePet = require('../Model/ImagePet')

module.exports = class PetController {
    static async create(req, res) {
        const { name, age, weight, color } = req.body


        const available = true
        if (!name) {
            res.status(422).json({ message: 'O nome é obrigatório' })
            return
        }
        if (!age) {
            res.status(422).json({ message: 'O age é obrigatório' })
            return
        }
        if (!weight) {
            res.status(422).json({ message: 'O weight é obrigatório' })
            return
        }
        if (!color) {
            res.status(422).json({ message: 'O color é obrigatório' })
            return
        }


        //pegando o dono do pet
        let currentUser
        const token = getToken(req)
        const decoded = jwt.verify(token, 'nossosecret')
        currentUser = await User.findByPk(decoded.id)

        //criando pet
        const pet = new Pet({
            name: name,
            age: age,
            weight: weight,
            color: color,
            available: available,
            UserId: currentUser.id
        });

        try {
            // Save the pet to the database
            const newPet = await pet.save();

            // Handle image uploads
            const images = req.files;
            if (images && images.length > 0) {
                // Save each image to the ImagePet table
                for (let i = 0; i < images.length; i++) {
                    const filename = images[i].filename;
                    const newImagePet = new ImagePet({ image: filename, PetId: newPet.id });
                    await newImagePet.save();
                }
            }

            res.status(201).json({ message: 'Pet cadastrado com sucesso', newPet });
        } catch (error) {
            res.status(500).json({ message: error });
        }
    }



    //mostrando todos os pets
    static async getAll(req, res) {
    const pets = await Pet.findAll({
        order: [['createdAt', 'DESC']],
        include: ImagePet
    });

    res.status(200).json({ pets: pets });

}

    //filtrando os pets por usuario
    static async getAllUserPets(req, res) {
    //encontrando o usuario logado
    let currentUser
    const token = getToken(req)
    const decoded = jwt.verify(token, 'nossosecret')
    currentUser = await User.findByPk(decoded.id)
    currentUser.password = undefined
    const currentUserId = currentUser.id

    const pets = await Pet.findAll({ where: { userId: currentUserId }, order: [['createdAt', 'DESC']] })

    res.status(200).json({ pets })

}

    static async getPetById(req, res) {
    const id = req.params.id

    if (isNaN(id)) {
        res.status(422).json({ message: 'ID Inválido' })
        return
    }
    //get pet by id
    const pet = await Pet.findByPk(id, { include: ImagePet });

    //validando se o ID é valido
    if (!pet) {
        res.status(422).json({ message: 'Pet não existe' })
        return
    }

    res.status(200).json({ pet: pet })
}

    static async removePetById(req, res) {
    const id = req.params.id

    if (isNaN(id)) {
        res.status(422).json({ message: 'ID Inválido' })
        return
    }
    //get pet by id
    const pet = await Pet.findByPk(id)

    //validando se o ID é valido
    if (!pet) {
        res.status(422).json({ message: 'Pet não existe' })
        return
    }

    //checar se o usuario logado registrou o pet
    let currentUser
    const token = getToken(req)
    const decoded = jwt.verify(token, 'nossosecret')
    currentUser = await User.findByPk(decoded.id)
    currentUser.password = undefined
    const currentUserId = currentUser.id

    if (Number(pet.userId) !== Number(currentUserId)) {
        res.status(422).json({ message: 'ID inválido' })
        return
    }

    await Pet.destroy({ where: { id: id } })

    res.status(200).json({ message: 'Pet removido com sucesso' })
}


    static async updatePet(req, res) {
    const id = req.params.id
    const { name, age, weight, color } = req.body

    const updateData = {}
    const pet = await Pet.findByPk(id);

    if (!pet) {
        res.status(404).json({ message: "Pet não existe!" });
        return;
    }

    //pegando o dono do pet
    let currentUser
    const token = getToken(req)
    const decoded = jwt.verify(token, 'nossosecret')
    currentUser = await User.findByPk(decoded.id)

    if (pet.UserId !== currentUser.id) {
        res.status(422).json({ message: "ID inválido!" });
        return;
    }

    if (!name) {
        res.status(422).json({ message: "O nome é obrigatório!" });
        return;
    } else {
        updateData.name = name
    }
    if (!age) {
        res.status(422).json({ message: "A idade é obrigatória!" });
        return;
    } else {
        updateData.age = age
    }
    if (!weight) {
        res.status(422).json({ message: "O peso é obrigatório!" });
        return;
    } else {
        updateData.weight = weight
    }
    if (!color) {
        res.status(422).json({ message: "A cor é obrigatória!" });
        return;
    } else {
        updateData.color = color
    }



    const images = req.files
    if (!images || images.length === 0) {
        res.status(422).json({ message: "As imagens são obrigatórias!" });
        return;
    } else {
        // Atualizar as imagens do pet
        const imageFilenames = images.map((image) => image.filename);
        // Remover imagens antigas
        await ImagePet.destroy({ where: { PetId: pet.id } });
        // Adicionar novas imagens
        for (let i = 0; i < imageFilenames.length; i++) {
            const filename = imageFilenames[i];
            const newImagePet = new ImagePet({ image: filename, PetId: pet.id });
            await newImagePet.save();
        }

    }

    await Pet.update(updateData, { where: { id: id } });

    res.status(200).json({ message: "att com successo!" })
}

    static async schedule(req, res) {
    const id = req.params.id;

    const pet = await Pet.findByPk(id);

    if (!pet) {
        res.status(404).json({ message: "Pet não existe!" });
        return;
    }

    //checar se o usuario logado registrou o pet
    let currentUser
    const token = getToken(req)
    const decoded = jwt.verify(token, 'nossosecret')
    currentUser = await User.findByPk(decoded.id)

    if (pet.userId === currentUser.id) {
        res.status(422).json({ message: "O pet já é seu" });
        return;
    }

    //checar se o usuario ja agendou a visita

    if (pet.adopter) {
        if (pet.adopter === currentUser.id) {
            res.status(422).json({ message: "Voce ja agendou a visita" });
            return;
        }
    }

    console.log(pet.adopter, ' = ', currentUser.id)
    //adicioar user como adontante do pet
    pet.adopter = currentUser.id

    await pet.save()

    res.status(200).json({ message: `Visita agendada por ${currentUser.name}` })
}

    static async concludeAdoption(req, res) {
    const id = req.params.id;

    const pet = await Pet.findByPk(id);
    if (!pet) {
        res.status(404).json({ message: "Pet não existe!" });
        return;
    }

    let currentUser
    const token = getToken(req)
    const decoded = jwt.verify(token, 'nossosecret')
    currentUser = await User.findByPk(decoded.id)

    if (pet.UserId !== currentUser.id) {
        res.status(422).json({ message: "ID inválido!" });
        return;
    }

    pet.available = false

    await pet.save(); // Salvando a instância do pet atualizada.

    res.status(200).json({ message: `Adoção concluída` })
}

    static async getAllUserAdoptions(req, res) {

    //get usuario pelo token
    let currentUser
    const token = getToken(req)
    const decoded = jwt.verify(token, 'nossosecret')
    currentUser = await User.findByPk(decoded.id)

    const pets = await Pet.findAll({
        where: { adopter: currentUser.id },
        order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
        pets,
    })

}


}