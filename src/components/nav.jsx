import { useRef } from 'react'

const MyNavBar = ({ goToModule, userData, setToken}) => {

    const userButton = useRef(null)
    function setModulo(module) {
        goToModule(module)
    }

    function logout(e) {
        setToken('')
    }

    return (
        <>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                    <a href="#" className="navbar-brand">Grupo Diniz</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent" aria-expanded="false">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <a href="#" className="nav-link" onClick={() => { setModulo('Drivers') }}>Conductores</a>
                            </li>
                            <li className="nav-item">
                                <a href="#" className="nav-link" onClick={() => { setModulo('Trucks') }}>Camiones</a>
                            </li>
                            <li className="nav-item">
                                <a href="#" className="nav-link" onClick={() => { setModulo('Users') }}>Usuarios</a>
                            </li>
                            <li className='nav-item'>
                                <a href="#" className='nav-link' onClick={() => { setModulo('Viajes') }}>Viajes</a>
                            </li>
                        </ul>
                        <div className="dropdown d-flex">
                            <button className="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false"><i className="bi bi-person-square"></i>&nbsp;{userData.name}</button>
                            <ul className="dropdown-menu">
                                <li><a href="#" className='dropdown-item' onClick={logout}>Cerrar Sesión</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default MyNavBar