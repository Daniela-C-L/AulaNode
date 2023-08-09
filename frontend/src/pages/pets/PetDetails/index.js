import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import imagePet from '../../../../../backend/Model/ImagePet'

function PetDetails() {

    const [pet, setPet] = useState({})
    const [id] = useParams()

    const [token] = useState(localStorage.getItem('token') || '')

    useEffect(() => {
        api.get(`/pets/${id}`).then((response) => {
            setPet(response.data.pet)
        })
    }, [id])

    async function schedule() {
        const data = await api.patch(`pets/schedules/${pet.id}`, {
            headers: {
                Autorization: `Bearer ${JSON, parse(token)}`
            }
        })
            .then((response) => {
                console.log(response.data)
                return response.data
            })
            .catch((err) => {
                console.log(err)
                return err.response.data
            })
        alert(data.message)
    }

    return (
        <div>
            {pet.name && (
                <section>
                    <div>
                        <h3>Conhecendo o Pet: {pet.name}</h3>
                        <p>Se tiver interesse, marque uma visita para conhece-lo</p>
                    </div>
                    <div>
                        {pet.ImagePets && pet.ImagePets.length > 0 ? (
                            pet.ImagePets.map((imagePet, index) => {
                                const imageUrl = `http://localhost:5000/images/pets/${imagePet.image}`
                                return(
                                    <img
                                        key={index}
                                        src={imageUrl}
                                        alt={pet.name}
                                    />
                                )
                            })
                        ): (
                            <p>Não há imagens disponiveis para esse cachorro</p>
                        )}
                    </div>
                    <p>Peso: {pet.weight} kg</p>
                    <p>Idade: {pet.age} anos</p>
                    {token ? (
                        <button onClick={schedule}>Solicitar um Visita</button>
                    ) : (
                        <p>
                            Você precisa <Link to='/register'>Criar uma conta</Link> para solicitar a visita
                        </p>
                    )}
                </section>
            )}
        </div>
    )
}

export default PetDetails