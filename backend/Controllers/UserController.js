const User = require('../Model/User')
const bcrypt = require('bcrypt') //criptografa o login
const jwt = require('jsonwebtoken') //criptografa o token

//helpers
const createUserToken = require('../helpers/create-user-token')
const getToken = require('../helpers/get-token')

module.exports = class UserController {
    //criar usuario
    static async register(req, res) {
        const { name, email, password, phone, confirmpassword } = req.body
        //validações

        if (!name) {
            res.status(422).json({ message: 'O campo Nome deve ser preenchido' })
            return
        }
        if (!email) {
            res.status(422).json({ message: 'O campo Email deve ser preenchido' })
            return
        }
        if (!password) {
            res.status(422).json({ message: 'O campo Senha deve ser preenchido' })
            return
        }
        if (!confirmpassword) {
            res.status(422).json({ message: 'O campo Confirmação de Senha deve ser preenchido' })
            return
        }
        if (!phone) {
            res.status(422).json({ message: 'O campo Telefone deve ser preenchido' })
            return
        }
        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(password, salt)

        //Checar se o usuario ja existe
        const userExists = await User.findOne({ where: { email: email } })
        if (password != confirmpassword) {
            res.status(422).json({ message: 'Senha e Confirmação de Senha não são correspondentes' })
            return
            //Um return vazio quebra a compilação, gera um 'break'
        }
        if (userExists) {
            res.status(422).json({ message: 'Email inserido já esta cadastrado' })
            return
            //Um return vazio quebra a compilação, gera um 'break'
        }

        const user = new User({
            name: name,
            email: email,
            phone: phone,
            password: passwordHash
        })

        try {
            //criando usuario no banco
            const newUser = await user.save()
            //entregar o token para o novo user 
            await createUserToken(newUser, req, res)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }
    //Realizar Login
    static async login(req, res) {
        const { email, password } = req.body //Requisição do email e da senha que serão vindas do body, campos preenchidos pelo usuario

        if (!email) {
            res.status(422).json({ message: 'O campo Email deve ser preenchido' })
            return //relembrando, um 'return' vazio gera um 'breack' no sistema, parando ele.
        }

        if (!password) {
            res.status(422).json({ message: 'O campo Senha deve ser preenchido' })
            return
        }

        const user = await User.findOne({ where: { email: email } })
        //FindOne = comando sql que irá buscar o email correspondente no banco de dados, verificando se ele existe
        //FindOne = 'Busque Um'

        if (!user) { //Validação de usuario não existente, caso tente fazer login com dados não cadastrados
            res.status(422).json({ message: 'Email não encontrado, cadastre-o e tente novamente ;)' })
            return
        }

        //Checar se a Senha é a mesma cadastrada no Banco de Dados
        //Compara a senha fornecida pelo usuário (variável password) com a senha armazenada no banco de dados associada ao usuário
        const checkPassword = await bcrypt.compare(password, user.password) //user = objeto, .password = caracteristica do objeto

        if (!checkPassword) {
            res.status(422).json({ message: 'Senha incorreta' })
            return
        }

        await createUserToken(user, req, res)
    }

    //Verificar se o usuario esta Logado
    static async checkUser(req, res) {
        let currentUser

        if (req.headers.authorization) {
            const token = getToken(req)
            //jwt vem de uma biblioteca
            const decoded = jwt.verify(token, 'nossosecret')

            currentUser = await User.findByPk(decoded.id)
            //findByPk = "Econtrar por chave primaria" (irá buscar pelo Id) 

            currentUser.password = undefined
            //Por questão de segurança a senha será entregue no front como 'indefinida' para não permitir sua visualização
        } else {
            currentUser = null
        }

        res.status(200).send(currentUser)
    }

    static async getUserById(req, res) {
        const id = req.params.id

        const user = await User.findByPk(id, {
            where: { id: id }
        })

        if (!user) {
            res.status(422).json({ message: 'Usuario não encontrado' })
            return
        }

        user.password = undefined

        res.status(200).json({ user })

    }

    static async editUser(req, res) {
        const id = req.params.id

        //checar se o usuario exite
        const token = getToken(req)
        const user = await getUserById(token)

        //receber os dados nas variaves
        const { name, email, phone, password, confirmpassword } = req.body

        //recebendo imagem do usuario
        let image = ''
        if (req.file) {
            image = req.file.filename
        }

        //validações de campos vazios 
        if (!name) {
            res.status(422).json({ message: 'O nome é obrigatório' })
            return
        }
        if (!email) {
            res.status(422).json({ message: 'O email é obrigatório' })
            return
        }
        const userExists = await User.findOne({ where: { email: email } })
        if (user.email !== email && userExists) {
            res.status(422).json({ message: 'Por favor utilize outro email' })
            return
        }
        if (!phone) {
            res.status(422).json({ message: 'O phone é obrigatório' })
            return
        }
        user.phone = phone

        if (password !== confirmpassword) {
            res.status(422).json({ message: 'as senhas não batem' })
            return
        } else if (password === confirmpassword && password != null) {
            //criptografando senha
            const salt = await bcrypt.genSalt(12)
            const passwordHash = await bcrypt.hash(password, salt)

            user.password = passwordHash
        }

        const userToUpdate = await User.findByPk(id)

        if (!userToUpdate) {
            res.status(422).json({ message: 'Usuario não encontrado' })
            return
        }

        userToUpdate.name = name
        userToUpdate.email = email
        userToUpdate.phone = phone
        userToUpdate.image = image

        if (password === confirmpassword && password != null) {
            //criptografando senha
            const salt = await bcrypt.genSalt(12)
            const passwordHash = await bcrypt.hash(password, salt)

            userToUpdate.password = passwordHash
        }

        try {
            await userToUpdate.save()
            res.status(200).json({ message: 'usuario atualizado com sucesso' })
        } catch (error) {
            res.status(500).json({ message: error.message })
        }

    }
}

