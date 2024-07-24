import { Component } from 'react'
import axios from "axios"
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import MyModal from "../components/Modal"
import Form from "react-bootstrap/Form"

const MySwal = withReactContent(Swal)

export class Drivers extends Component {
    constructor(props) {
        super(props)
        this.state = {
            drivers: [],
            driverData: {
                id:0,
                noempl:'',
                name: '',
                license_number: '',
                expiration_date:''
            },
            driverDefault: {
                id:0,
                noempl:'',
                name: '',
                license_number: '',
                expiration_date:''
            },
            modal: false,
            editStatus: false,
            invalidEmpl: false,
            invalidName: false,
            invalidLicense: false,
            invalidExpiration: false,
            today: '',
        }
    }

    getDrivers = () => {
        axios.get('http://localhost/services/driver', {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        })
        .then((response) => {
            this.setState({ drivers: response.data })
        })
        .catch((error) => console.log(error))
    }

    editDriver = (e) => {
        let value = (e.target.nodeName === 'BUTTON') ? e.target.value : e.target.parentElement.value
        axios.get(`http://localhost/services/driver/show/${value}`, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        })
        .then((response) => {
            this.modalStatus()
            this.setState({ editStatus: true })
            this.setState({ driverData: response.data.data })
        })
        .catch((error) => console.log(error))
    }

    sendData = () => {
        let url = (this.state.driverData.id) ? 'http://localhost/services/driver/update' : 'http://localhost/services/driver/store'

        if(this.state.driverData.noempl == '') { this.setState({ invalidEmpl: true }) }
        if(this.state.driverData.name == '') { this.setState({ invalidName: true }) }
        if(this.state.driverData.license_number == '') { this.setState({ invalidLicense: true }) }
        if(this.state.driverData.expiration_date == '') { this.setState({ invalidExpiration: true }) }

        axios.post(url, this.state.driverData, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        })
        .then((response) => {
            MySwal.fire({
                title: (response.data.success) ? '¡Éxito!' : 'Oops',
                icon: (response.data.success) ? 'success' : 'error',
                text: response.data.msg
            })
            this.modalStatus()
            this.getDrivers()
        })
        .catch((error) => console.log(error))
    }

    deleteDriver = (e) => {
        var value = (e.target.nodeName === 'BUTTON') ? e.target.value : e.target.parentElement.value
        MySwal.fire({
            title:'¿Estas Seguro?',
            text: '¡Esta acción no se podra revertir!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminalo',
            cancelButtonText: 'Cancelar'
        })
        .then((result) => {
            if(result.isConfirmed){
                axios.delete(`http://localhost/services/driver/delete/${value}`, {
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    }
                })
                .then((response) => {
                    MySwal.fire({
                        title: '¡Éxito!',
                        icon: 'success',
                        text: response.data.msg
                    })
                })
                .catch((error) => console.log(error))
            }
        })
    }

    modalStatus = () => {
        this.setState({ modal: !this.state.modal })
        this.setState({ driverData: this.state.driverDefault })
    }
    renderDrivers = () => {
        if(this.state.drivers.length == 0) {
            return (
                <tr>
                    <td colSpan="6" className="text-center">No se encontraron registros</td>
                </tr>
            )
        }
        return this.state.drivers.map((driver) => (
            <tr key={driver.id}>
                <td>{driver.id}</td>
                <td>{driver.noempl}</td>
                <td>{driver.name}</td>
                <td>{driver.license_number}</td>
                <td>{driver.expiration_date}</td>
                <td>
                    <button className="btn btn-sm btn-primary rounded-circle" value={driver.id} onClick={this.editDriver} type="button"><i className="bi bi-pencil-square"></i></button>
                    <button className="btn btn-sm btn-danger rounded-circle ms-1" value={driver.id} onClick={this.deleteDriver} type="button"><i className="bi bi-trash"></i></button>
                </td>
            </tr>
        ))
    }

    componentDidMount() {
        this.getDrivers()
        let today = new Date()
        let mes = (today.getMonth() < 10) ? `0${today.getMonth() + 1}` : today.getMonth() + 1
        this.setState({ today: `${today.getFullYear()}-${mes}-${today.getDate()}` })
    }

    render() {
        return (
            <>
                <div className="card" style={{ padding: 0 }}>
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <span>Conductores</span>
                        <div className="btn-group">
                            <button className="btn btn-sm btn-outline-dark" type="button" onClick={ () => {  this.setState({ editStatus: false }); this.setState({ modal: true }) }}><i className="bi bi-plus-circle"></i></button>
                        </div>
                    </div>
                    <div className="card-body">
                        <table className="table table-striped table-bordered">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>No. Empleado</th>
                                    <th>Nombre</th>
                                    <th>No. Licencia</th>
                                    <th>Vigencia de Licencia</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.renderDrivers()}
                            </tbody>
                        </table>
                    </div>
                </div>
                <MyModal modalId="driverModal" show={this.state.modal} handleClose={ () => this.modalStatus() } modalTitle={ (this.state.editStatus) ? 'Editar Conductor' : 'Crear Conductor' }>
                    <div className="mb-3">
                        <Form.Label>No. Empleado:</Form.Label>
                        <Form.Control type="text" id="noempl" isInvalid={this.state.invalidEmpl} value={this.state.driverData.noempl} onChange={(e) => this.setState({ driverData: { ...this.state.driverData, noempl: e.target.value } })}></Form.Control>
                    </div>
                    <div className="mb-3">
                        <Form.Label>Nombre:</Form.Label>
                        <Form.Control type="text" id="name" isInvalid={this.state.invalidName} value={this.state.driverData.name} onChange={ (e) => this.setState({ driverData: { ...this.state.driverData, name: e.target.value } }) }></Form.Control>
                    </div>
                    <div className="mb-3">
                        <Form.Label>No. Licencia:</Form.Label>
                        <Form.Control type="text" id="license_number" isInvalid={this.state.invalidLicense} value={this.state.driverData.license_number} onChange={(e) => this.setState({ driverData: { ...this.state.driverData, license_number: e.target.value } })}></Form.Control>
                    </div>
                    <div className="mb-3">
                        <Form.Label>Vigencia de Licencia:</Form.Label>
                        <input className={(this.state.invalidExpiration) ? 'form-control is-invalid' : 'form-control'} type="date" id="expiration_date" value={this.state.driverData.expiration_date} onChange={(e) => this.setState({ driverData: { ...this.state.driverData, expiration_date: e.target.value } })} max={this.state.today} />
                    </div>
                    <div className="mb-3 d-flex justify-content-end">
                        <button className="btn btn-danger" type="button" onClick={ () => this.modalStatus() }>Cancelar</button>
                        <button className="btn btn-primary ms-2" type="button" onClick={ () => this.sendData() }>{(this.state.editStatus) ? 'Actualizar' : 'Guardar'}</button>
                    </div>
                </MyModal>
            </>
        )
    }
}

export default Drivers