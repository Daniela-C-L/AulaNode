//Isso é ctrl C e ctrl V em todas as vezes que se utilizar do node
const express = require('express')
const cors = require('cors')

const app = express()

const conn = require('./db/conn')

app.use(express.json())

app.use(cors({ credentials: true, origin: '*' }))

app.use(express.static('public'))

//ROTAS
const UserRoutes = require('./routes/UserRoutes')
const PetRoutes = require('./routes/PetRoutes')
// /users seria o caminho que será exibido na URL
app.use('/users', UserRoutes)
app.use('/pets', PetRoutes)

conn
    .sync()
    .then(() => {
        app.listen(5000)
    })
    .catch((error) => console.log(error))
// Quando haver uma requisição na porta 5000 ...
