import React from 'react'
import api from '../../utils/api'

import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

function Home(){
    const [ pets, setPet ] = useState ({})

    useEffect(() => {
        api.get('/pets').then((response) => {
            setPet(response.data.pets)
        })
    }, [])

    return(
        <div>
            <div>
            <h2>Adote seu Pet</h2>
            <p>Veja os detalhes de cada um e conheça o tutor deles</p>
            </div>

            <div className='d-flex justify-content-around flex-wrap'>
                {pets.length > 0 ? (
                    pets.map((pet) => {
                        <figure>
                            <img 
                            src={`http://localhost:5000/image/pets/${pet.ImagePets && pet.ImagePets[0] && pet.ImagePets[0].image}`}
                            />
                            <figcaption>
                                <h3 className='cart-title'>{pet.name}</h3>
                                <p className='card-text'>Peso: {pet.weight}</p>
                            </figcaption>
                        </figure>
                    })
                ): (
                        <p Não há pets cadastrados ou disponiveis no momento></p>
                )
                
                }

            </div>
        </div>

    )
}

export default Home