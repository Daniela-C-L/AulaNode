// helpers/image-upload.js
const multer = require('multer') //Multer gerencia imagens | OBS: a imagem é salva no banco através do caminho dela

const path = require('path') //Path gerencia o caminho dos arquivos | Aqui sera definido onde os arquivos seram salvos
//O destino das imagens será definido aqui

//objeto
const imageStorage = multer.diskStorage({
    //destination = atributo
    destination: function(req, file, cb){ //Função anônima
        let folder = '' //folder = pasta

        if(req.baseUrl.includes('users')){
            folder = 'users'
        } else if (req.baseUrl.includes('pets')){
            folder = 'pets'
        }

        cb(null, `public/images/${folder}`) //Local onde será enviado a imagem
    },
    filename: function(req, file, cb){
        cb(null, Date.now() + path.extname(file.originalname)) //Vai renomear o arquivo antes de salvar, adicionando a data do dia em que foi salva
    }
})

const imageUpload = multer ({
    storage: imageStorage,
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(png|jpg)$/)){
            return cb(new Error('Apenas arquivos jpg e png são válidos'))
        }
        cb(null, true)
    }

})

module.exports =  imageUpload 