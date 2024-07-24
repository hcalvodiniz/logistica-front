import { Component } from 'react'
import axios from 'axios'
import Form from "react-bootstrap/Form"
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

import MyModal from '../components/Modal'
export class Users extends Component {
    constructor(props) {
        super(props)
        this.state = {
            users: [],
            userData: {
                id: 0,
                name: '',
                email: '',
                password: '',
                password_confirmation: '',
                noempl: ''
            },
            userDefault: {
                id: 0,
                name: '',
                email: '',
                password: '',
                password_confirmation: '',
                noempl: ''
            },
            modal: false,
            editStatus: false,
            invalidEmpl: false,
            invalidName: false,
            invalidEmail: false,
            invalidPassword: false,
            invalidConfirmation: false,
        }
    }

    getUsers = () => {
        axios.get('http://localhost/services/user', {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        })
        .then((response) => {
            this.setState({ users: response.data })
        })
        .catch((error) => console.log(error))
    }

    modalStatus = () => {
        this.setState({ modal: !this.state.modal })
        this.setState({ userData: this.state.userDefault })
        this.clearValidation()
    }

    editUser = (e) => {
        let value = (e.target.nodeName === 'BUTTON') ? e.target.value : e.target.parentElement.value
        axios.get(`http://localhost/services/user/show/${value}`)
        .then((response) => {
            this.modalStatus()
            this.setState({ editStatus: true })
            this.setState({ userData: {...response.data.data, password_confirmation: '' } })
        })
        .catch((error) => console.log(error))
    }

    reloadPassword = (e) => {
        let value = (e.target.nodeName === 'BUTTON') ? e.target.value : e.target.parentElement.value
        MySwal.fire({
            title: "¿Quiéres recuperar la contraseña?",
            text: "Esto generará una contraseña temporal para el usuario.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: "Si, cambia la contraseña",
            cancelButtonText: "Cancelar",
            showLoaderOnConfirm: true,
            preConfirm: async () => {
                try {
                    const response = await axios.patch(`http://localhost/services/user/password-reset/${value}`,{} ,{
                        headers: {
                            "Accept": "application/json",
                            "Content-Type": "application/json"
                        }
                    })
                    if(!response.data.success) {
                        return MySwal.showValidationMessage(`${JSON.stringify(response.data)}`)
                    }
                    return response.data
                } catch (error) {
                    MySwal.showValidationMessage(`Request error: ${error}`)
                }
            },
            allowOutsideClick: () => !MySwal.isLoading()
        })
        .then((result) => {
            if(result.isConfirmed) {
                MySwal.fire({
                    title: '¡Éxito!',
                    text: `Se ha actualizado correctamente la contraseña de ${result.value.data.name}!`,
                    icon: 'success'
                })
            }
        })
    }

    deleteUser = (e) => {
        let value = (e.target.nodeName === 'BUTTON') ? e.target.value : e.target.parentElement.value
        MySwal.fire({
            title: '¿Estás seguro?',
            text: '¡Esta acción no se podra revertir!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminalo',
            cancelButtonText: 'Cancelar',
            showLoaderOnConfirm: true,
            preConfirm: async () => {
                try {
                    const response = await axios.delete(`http://localhost/services/user/delete/${value}`, {
                        headers: {
                            "Accept": "application/json",
                            "Content-Type": "application/json"
                        }
                    })

                    if(!response.data.success) {
                        return MySwal.showValidationMessage(`${JSON.stringify(response.data)}`)
                    }
                    return response.data
                } catch (error) {
                    return MySwal.showValidationMessage(`Request Error: ${error}`)
                }
            },
            allowOutsideClick: () => !MySwal.isLoading()
        })
        .then((result) => {
            if (result.isConfirmed) {
                MySwal.fire({
                    title: (result.value.success) ? '¡Éxito!' : 'Oops',
                    icon: (result.value.success) ? 'success' : 'error',
                    text: result.value.msg,
                    timer: 2000
                })
                this.getUsers();
            }
        })
    }

    renderUsers = () => {
        if(this.state.users.length == 0) {
            return (
                <tr>
                    <td colSpan="5" className="text-center">No se encontraron registros!</td>
                </tr>
            )
        }
        return this.state.users.map((user) => (
            <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.noempl}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                    <button className="btn btn-sm btn-primary rounded-circle" type="button" value={user.id} onClick={this.editUser}><i className="bi bi-pencil-square"></i></button>
                    <button className="btn btn-sm btn-success rounded-circle ms-1" type="button" value={user.id} onClick={this.reloadPassword}><i className="bi bi-arrow-clockwise"></i></button>
                    <button className="btn btn-sm btn-danger rounded-circle ms-1" type="button" value={user.id} onClick={this.deleteUser}><i className="bi bi-trash"></i></button>
                </td>
            </tr>
        ))
    }

    sendData = () => {
        let url = (this.state.userData.id) ? 'http://localhost/services/user/update' : 'http://localhost/services/user/store'
        if(this.state.userData.name == '') { this.setState({ invalidName: true }) } else { this.setState({ invalidName: false }) }
        if(this.state.userData.noempl == '') { this.setState({ invalidEmpl: true }) } else { this.setState({ invalidEmpl: false }) }
        if(this.state.userData.email == '') { this.setState({ invalidEmail: true }) } else { this.setState({ invalidEmail: false }) }
        if(!this.state.editStatus) {
            if(this.state.userData.password == '') { this.setState({ invalidPassword: true }) } else { this.setState({ invalidPassword: false }) }
            if(this.state.userData.password_confirmation == '') { this.setState({ invalidConfirmation: true }) } else { this.setState({ invalidConfirmation: false }) }
            if(this.state.userData.password_confirmation != this.state.userData.password) { this.setState({ invalidConfirmation: true }) } else { this.setState({ invalidConfirmation: false }) }
        }

        axios.post(url, this.state.userData)
        .then((response) => {
            MySwal.fire({
                title: (response.data.success) ? '¡Éxito!' : 'Oops',
                icon: (response.data.success) ? 'success' : 'error',
                html: response.data.msg
            })
            if(response.data.success) {
                this.modalStatus()
                this.getUsers()
            }
        })
        .catch((error) => console.log(error))
    }

    clearValidation = () => {
        this.setState({
            invalidEmpl: false,
            invalidName: false,
            invalidEmail: false,
            invalidPassword: false,
            invalidConfirmation: false,
        })
    }

    componentDidMount() {
        this.getUsers()
    }

    render = () => (
        <>
            <div className="card" style={{ padding: 0 }}>
                <div className="card-header d-flex justify-content-between align-items-center">
                    <span>Usuarios</span>
                    <button className="btn btn-outline-dark" type="button" onClick={() => { this.setState({ editStatus: false }); this.modalStatus() }}><i className="bi bi-plus-circle"></i></button>
                </div>
                <div className="card-body">
                    <table className="table table-striped table-bordered">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>No. Empleado</th>
                                <th>Nombre</th>
                                <th>Correo</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.renderUsers()}
                        </tbody>
                    </table>
                </div>
            </div>
            <MyModal modalTitle={(this.state.editStatus) ? 'Editar Usuario' : 'Agregar Usuario'} show={this.state.modal} handleClose={() => this.modalStatus()}>
                <div className="mb-3">
                    <Form.Label>No. Empleado:</Form.Label>
                    <Form.Control type="text" id="noempl" isInvalid={this.state.invalidEmpl} value={this.state.userData.noempl} onChange={(e) => this.setState({ userData:{ ...this.state.userData, noempl: e.target.value } })}></Form.Control>
                </div>
                <div className="mb-3">
                    <Form.Label>Nombre:</Form.Label>
                    <Form.Control type="text" id="name" isInvalid={this.state.invalidName} value={this.state.userData.name} onChange={(e) => this.setState({ userData:{ ...this.state.userData, name: e.target.value } })}></Form.Control>
                </div>
                <div className="mb-3">
                    <Form.Label>Correo:</Form.Label>
                    <Form.Control type="email" id="email" isInvalid={this.state.invalidEmail} value={this.state.userData.email} onChange={(e) => this.setState({ userData:{ ...this.state.userData, email: e.target.value } })}></Form.Control>
                </div>
                <div className="mb-3">
                    <Form.Label>Contraseña:</Form.Label>
                    <Form.Control type="password" id="password" isInvalid={this.state.invalidPassword} value={this.state.userData.password} onChange={(e) => this.setState({ userData:{ ...this.state.userData, password: e.target.value } })}></Form.Control>
                </div>
                <div className="mb-3">
                    <Form.Label>Confirmar Contraseña</Form.Label>
                    <Form.Control type="password" id="password_confirmation" isInvalid={this.state.invalidConfirmation} value={this.state.userData.password_confirmation}  onChange={(e) => this.setState({ userData:{ ...this.state.userData, password_confirmation: e.target.value } }) }></Form.Control>
                </div>
                <div className="mb-3 d-flex justify-content-end">
                    <button className="btn btn-danger" type="button" onClick={() => { this.modalStatus() }}>Cancelar</button>
                    <button className="btn btn-primary ms-2" type="button" onClick={() => this.sendData() }>{ (this.state.editStatus) ? 'Actualizar' : 'Guardar' }</button>
                </div>
            </MyModal>
        </>
    )
}

export default Users