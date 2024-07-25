import React, { Component } from "react";
import axios from "axios";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { NumericFormat } from 'react-number-format'
import MyModal from "../components/Modal"
import Form from "react-bootstrap/Form"


const MySwal = withReactContent(Swal)

export class Trucks extends Component {
    constructor(props) {
        super(props)
        this.state = {
            trucks: [],
            truckData: {
                id: 0,
                brand: '',
                model: '',
                year: '',
                mileage: '',
                serial_number: ''
            },
            truckDefault: {
                id: 0,
                brand: '',
                model: '',
                year: '',
                mileage: '',
                serial_number: ''
            },
            files: null,
            modal: false,
            modalC: false,
            editStatus: false,
            invalidBrand: false,
            invalidModel: false,
            invalidYear: false,
            invalidMile: false,
            invalidSerial: false,
        }
        this.fileInput = React.createRef()
    }

    getTrucks = () => {
        axios.get('http://localhost/services/truck', {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
            }
        })
        .then((response) => {
            this.setState({ trucks: response.data })
        })
        .catch((error) => {
            MySwal.fire({
                title: 'Error',
                icon: 'error',
                text: error.message,
            })
        })
    }

    modalStatus() {
        this.setState({ modal: !this.state.modal })
        this.setState({ truckData: this.state.truckDefault })
        this.clearValidation()
    }

    editTruck = (event) => {
        let value = (event.target.nodeName === 'BUTTON') ? event.target.value : event.target.parentElement.value
        axios.get(`http://localhost/services/truck/show/${value}`, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            }
        })
        .then((response) => {
            this.modalStatus()
            this.setState({ editStatus: true })
            this.setState({ truckData: response.data.data })
        })
        .catch((error) => {
            MySwal.fire({
                title: 'Error',
                icon: 'error',
                text: error.message
            })
        })
    }

    clearValidation = () => {
        this.setState({
            invalidBrand: false,
            invalidModel: false,
            invalidYear: false,
            invalidMile: false,
            invalidSerial: false,
        })
    }

    sendTruckData = () => {
        let url = (this.state.truckData.id) ? 'http://localhost/services/truck/update' : 'http://localhost/services/truck/store'
        const form = new FormData()
        this.clearValidation()
        if(this.state.truckData.brand == '') { this.setState({ invalidBrand: true }) }
        if(this.state.truckData.model == '') { this.setState({ invalidModel: true }) }
        if(this.state.truckData.year == '') { this.setState({ invalidYear: true }) }
        if(this.state.truckData.mileage == '') { this.setState({ invalideMile: true }) }
        if(this.state.truckData.serial_number == '') { this.setState({ invalidSerial: true }) }

        for(const [key, value] of Object.entries(this.state.truckData)) {
            form.append(key, value)
        }
        if(this.state.files !== null) {
            [...this.state.files].forEach((file) => {
                form.append('files[]', file, file.name)
            })
        }
            
        axios.post(url, form)
        .then((response) => {
            Swal.fire({
                title: (response.data.success) ? 'Éxito!' : 'Oops',
                icon: (response.data.success) ? 'success' : 'error',
                html: response.data.msg
            })
            if(response.data.success){
                this.modalStatus()
                this.getTrucks()
            }
            this.fileInput.current.value = null
        })
        .catch((error) => {
            Swal.fire({
                title: 'Ooops!',
                icon: 'error',
                text: error.message
            })
        })
    }

    handleChangeFile = (e) => {
        if(e.target.files) {
            this.setState({ files: e.target.files })
        }
    }

    getPhotos = (event) => {
        var value = (event.target.nodeName === 'BUTTON') ? event.target.value : event.target.parentElement.value

        axios.get(`http://localhost/services/truck/get-photos/${value}`, {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        })
        .then((response) => {
            if (!response.data.success) {
                MySwal.fire({
                    title: 'Oops',
                    icon: 'warning',
                    text: response.data.msg
                })
            } else {
                console.log(response.data.data)
            }
        })
        .catch((error) => console.log(error))
    }

    deleteTruck = (event) => {
        var value = (event.target.nodeName === 'BUTTON') ? event.target.value : event.target.parentElement.value
        Swal.fire({
            title: '¿Estás seguro?',
            text: '¡Esta acción no se podra revertir!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: '¡Sí, eliminalo!',
            cancelButtonText: 'Cancelar'
        })
        .then((result) => {
            if(result.isConfirmed) {
                axios.delete(`http://localhost/services/truck/delete/${value}`, {
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                    }
                })
                .then((response) => {
                    Swal.fire({
                        title: (response.data.success) ? 'Éxito' : 'Oops',
                        icon: (response.data.success) ? 'success' : 'error',
                        text: response.data.msg
                    })
                    this.getTrucks()
                })
                .catch((error) => console.log(error))
            }
        })
    }

    componentDidMount() {
        this.getTrucks()
    }

    renderTrucks() {
        if(this.state.trucks.length == 0) {
            return (
                <tr>
                    <td colSpan="7" className="text-center">No se encontro información!</td>
                </tr>
            )
        }
        return this.state.trucks.map((truck) => (
            <tr key={truck.id}>
                <td>{truck.id}</td>
                <td>{truck.brand}</td>
                <td>{truck.model}</td>
                <td>{truck.year}</td>
                <td><NumericFormat value={truck.mileage} displayType="text" thousandsGroupStyle="thousand" thousandSeparator="," suffix={' KM'} /></td>
                <td>{truck.serial_number}</td>
                <td>
                    <button className="btn btn-sm btn-primary rounded-circle" value={truck.id} onClick={this.editTruck} type="button"><i className="bi bi-pencil-square"></i></button>
                    <button className="btn btn-sm btn-success rounded-circle ms-1" value={truck.id} onClick={this.getPhotos}><i className="bi bi-eye-fill"></i></button>
                    <button className="btn btn-sm btn-danger rounded-circle ms-1" value={truck.id} onClick={this.deleteTruck} type="button"><i className="bi bi-trash"></i></button>
                </td>
            </tr>
        ))
    }

    render() {
        return (
            <>
                <div className="card" style={{ padding:0 }}>
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <span> Camiones </span>
                        <div className="btn-group">
                            <button className="btn btn-sm btn-outline-dark" type="button" onClick={() => { this.setState({ editStatus: false }); this.modalStatus() }}><i className="bi bi-plus-circle"></i></button>
                        </div>
                    </div>
                    <div className="card-body">
                        <table className="table table-striped table-bordered">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Marca</th>
                                    <th>Modelo</th>
                                    <th>Año</th>
                                    <th>Kilometraje</th>
                                    <th>Serie</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.renderTrucks()}
                            </tbody>
                        </table>
                    </div>
                </div>
                <MyModal modalId="truckModal" show={this.state.modal} handleClose={() => this.modalStatus() } modalTitle={ (this.state.editStatus) ? 'Editar Camión' : 'Crear Camión' }>
                    <div className="mb-3">
                        <Form.Label>Marca</Form.Label>
                        <Form.Control type="text" id="brand" isInvalid={this.state.invalidBrand} value={this.state.truckData.brand} onChange={(event) => this.setState({ truckData: { ...this.state.truckData, brand: event.target.value } })}></Form.Control>
                    </div>
                    <div className="mb-3">
                        <Form.Label>Modelo</Form.Label>
                        <Form.Control type="text" id="model" isInvalid={this.state.invalidModel} value={this.state.truckData.model} onChange={(event) => this.setState({ truckData: { ...this.state.truckData, model: event.target.value } })}></Form.Control>
                    </div>
                    <div className="mb-3">
                        <Form.Label>Año</Form.Label>
                        <Form.Control type="text" id="year" isInvalid={this.state.invalidYear} value={this.state.truckData.year} onChange={(event) => this.setState({ truckData: { ...this.state.truckData, year: event.target.value } })}></Form.Control>
                    </div>
                    <div className="mb-3">
                        <Form.Label>Kilometraje</Form.Label>
                        <Form.Control type="text" id="mileage" isInvalid={this.state.invalidMile} value={this.state.truckData.mileage} onChange={(event) => this.setState({ truckData: { ...this.state.truckData, mileage: event.target.value } })}></Form.Control>
                    </div>
                    <div className="mb-3">
                        <Form.Label>Serie</Form.Label>
                        <Form.Control type="text" id="serial_number" isInvalid={this.state.invalidSerial} value={this.state.truckData.serial_number} onChange={(event) => this.setState({ truckData: { ...this.state.truckData, serial_number: event.target.value } })}></Form.Control>
                    </div>
                    <Form.Group controlId="file-upload" className="mb-3">
                        <Form.Label>Carga de Fotos</Form.Label>
                        <Form.Control type="file" multiple accept="image/jpeg, image/png" onChange={this.handleChangeFile} ref={this.fileInput} capture="enviroment" />
                    </Form.Group>
                    <div className="mb-3 d-flex justify-content-end">
                        <button className="btn btn-danger" type="button" onClick={() => { this.modalStatus() }}>Cancelar</button>
                        <button className="btn btn-primary ms-2" type="button" onClick={() => this.sendTruckData()}>Actualizar</button>
                    </div>
                </MyModal>
            </>
        )
    }
}

export default Trucks