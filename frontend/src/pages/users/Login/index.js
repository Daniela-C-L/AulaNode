import React from 'react'
import InputGroup from '../../../components/InputGroup'
import { Link } from 'react-router-dom'

// hooks
import { useContext, useState } from 'react'

//context
import { Context } from '../../../Context/UserContext'

function Login(){
    //aqui entra a lógica do login

    const [user, setUser] = useState({})
    const { login } = useContext(Context)

    function handleChange(e){
        setUser({ ...user, [e.target.name]: e.target.value })
    }
    // e = evento
    function handleSubmit(e){
        e.preventDefault()
        login(user)
    }

    return(
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <InputGroup
                label='Email'
                type='email'
                name='email'
                placeholder='Digite seu email'
                handleChange={handleChange}
                />
                <InputGroup
                label='Senha'
                type='password'
                name='password'
                placeholder='Digite sua senha'
                handleChange={handleChange}
                />
                <button type='submit'>Login</button>
            </form>
            <p>
                Não possui conta? <Link to='/register'>Clique Aqui</Link>
            </p>
        </div>

    )
}

export default Login