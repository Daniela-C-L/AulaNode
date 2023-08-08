import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
//Contexto
import { Context } from '../../Context/UserContext'

function NavBar() {
    const { authenticated, logout } = useContext(Context)

    return (
        <nav className='navbar bg-warning'>
            <div className='container'>

                <Link className='navbar-brand'>Logo</Link>
                <div>
                    <ul className='navbar nav'>
                        <li className='nav-item'>
                            <Link className='nav-link' to='/'>Home</Link>
                        </li>
                        {!authenticated ? (
                            <>
                                <li className='nav-item'>
                                    <Link className='nav-link' to='/register'>Registrar</Link>
                                </li>
                                <li className='nav-item'>
                                    <Link className='nav-link' to='/login'>Login</Link>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className='nav-item'>
                                    <Link className='nav-link' to='/user/profile'>Perfil</Link>
                                </li>

                                <li className='nav-item'>
                                    <Link className='nav-link' to='/pet/create'>Cadastrar Pet</Link>
                                </li>

                                <li onClick={logout} className='nav-item'><Link
                                className='nav-link' to='/'>Sair</Link></li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav >
    )
}

export default NavBar