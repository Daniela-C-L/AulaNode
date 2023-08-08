import React, {useState} from "react"
import InputGroup from "../../../components/InputGroup"
import api from "../../../utils/api"



function AddPet(){
    const [pet, setPet] = useState({})
    const [preview, setPreview] = useState()
    const [token] = useState(localStorage.getItem('token') || '')

    function handleChange(e){
        setPet({...pet, [e.target.name]: e.target.value })
    }
    const [images, setImages] = useState(null)
    function onFileChange(e){
        setPreview(URL.createObjectURL(e.target.files[0]))
        setImages(e.target.files[0])
    }

    async function handleSubmit(e){
        e.preventDefault()

        const formData = new FormData()

        if(images){
            formData.append('images', images)
        }

        await Object.keys(pet).forEach((key) => formData.append(key, pet[key]))

        const data = await api.post(`pets/create`, formData, {
            headers:{
                Authorization: `Bearer ${JSON.parse(token)}`,
                'Content-Type': 'multipart/form-data'
            }
        }).then((response) => {
            return response.data
        }).catch((err) => {
            alert(err.response.data)
            return err.reponse.data
        })
        alert(data.message)
    }

    return(
        <div>
            <h3>Cadastre um pet para adoção</h3>
            <form onSubmit={handleSubmit}>
                <InputGroup
                    type='file'
                    label='Adicione uma foto do Pet'
                    name='images'
                    handleChange={onFileChange}
                />
                <InputGroup
                    type='text'
                    label='Digite o nome do Pet'
                    name='name'
                    placeholder='Digite o nome do Pet'
                    handleChange={handleChange}
                />
                <InputGroup
                    type='number'
                    label='Digite a idade do Pet'
                    name='age'
                    placeholder='Digite a idade do Pet'
                    handleChange={handleChange}
                />
                <InputGroup
                    type='number'
                    label='Digite o peso Pet'
                    name='weight'
                    placeholder='Digite a peso do Pet'
                    handleChange={handleChange}
                />
                <InputGroup
                    type='text'
                    label='Digite a cor do Pet'
                    name='color'
                    placeholder='Digite a cor do Pet'
                    handleChange={handleChange}
                />
                <button type="submit">Cadastrar</button>
                
            </form>

        </div>
    )
}

export default AddPet