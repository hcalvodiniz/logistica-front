import { Component } from "react";
import MyModal from "../components/Modal";
import { Form } from "react-bootstrap";
import Select from "../components/Select";
import axios from "axios";

export class Travels extends Component {
    constructor(props) {
        super(props)
        this.state = {
            travels: [],
            listLocales: [],
            listDrivers: [],
            listTrucks:[],
            travelData: {
                id: 0,
                origin:'',
                destination: '',
                driver_id: '',
                truck_id: '',
                departure_date: '',
                departure_time: '',
                arrival_date: '',
                arrival_time: '',
                initial_mileage: '',
                final_mileage: '',
            },
            travelDefault: {
                id: 0,
                origin: '',
                destination: '',
                driver_id: '',
                truck_id: '',
                departure_date: '',
                departure_time: '',
                arrival_date: '',
                arrival_time: '',
                initial_mileage: '',
                final_mileage: '',
            },
            editStatus: false,
            modal: false,
            today: ''
        }
    }

    getLocales = () => {
        axios.get('http://localhost/services/travel/get-locales', {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        })
        .then((response) => {
            this.setState({ listLocales: response.data })
        })
        .catch((error) => console.log(error))
    }

    getDrivers = () => {
        axios.get('http://localhost/services/driver/list', {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        })
        .then((response) => this.setState({ listDrivers: response.data }))
        .catch((error) => console.log(error))
    }
    getTrucks = () => {
        axios.get('http://localhost/services/truck/list', {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        })
        .then((response) => this.setState({ listTrucks: response.data }))
        .catch((error) => console.log(error))
    }

    getMileage = (e) => {
        this.setState({ travelData: { ...this.state.travelData, truck_id: e.target.value } })
        axios.get(`http://localhost/services/truck/get-mileage/${e.target.value}`,{
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        })
        .then((response) => this.setState({ travelData: { ...this.state.travelData, initial_mileage: response.data.mileage } }))
        .catch((error) => console.log(error))
    }

    modalStatus = () => {
        this.setState({ modal: !this.state.modal })
        this.setState({ travelData: this.state.travelDefault })

    }

    renderTravels = () => {
        if(this.state.travels.length == 0) {
            return (
                <tr>
                    <td colSpan="7" className="text-center">No se encontraron registros</td>
                </tr>
            )
        }
    }

    componentDidMount() {
        this.getLocales()
        this.getDrivers()
        this.getTrucks()
        let today = new Date()
        let mes = (today.getMonth() < 10) ? `0${today.getMonth() + 1}` : today.getMonth() + 1
        this.setState({ today: `${today.getFullYear()}-${mes}-${today.getDate()}` })
    }

    handleSubmit = () => {
        let url = (this.state.travelData.id) ? 'http://localhost/services/travel/update' : 'http://localhost/services/travel/store'
        axios.post(url, this.state.travelData, {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        })
        .then((response) => console.log(response))
        .catch((error) => console.log(error))
    }

    render = () => (
        <>
            <div className="card" style={{ padding: 0 }}>
                <div className="card-header d-flex justify-content-between align-items-center">
                    <span>Viajes</span>
                    <button className="btn btn-outline-dark" type="button" onClick={() => this.modalStatus()}><i className="bi bi-plus-circle"></i></button>
                </div>
                <div className="card-body">
                    <table className="table table-striped table-bordered">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Conductor</th>
                                <th>Vehiculo</th>
                                <th>Origen</th>
                                <th>Destino</th>
                                <th>Fecha de Viaje</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.renderTravels()}
                        </tbody>
                    </table>
                </div>
            </div>
            <MyModal modalTitle={(this.editStatus) ? 'Editar Viaje' : 'Crear Viaje'} show={this.state.modal} handleClose={() => {this.modalStatus()}} size="lg">
                <div className="row">
                    <div className="col-md-3">
                        <div className="mb-3">
                            <Form.Label>Fecha de Viaje:</Form.Label>
                            <Form.Control type="date" value={this.state.travelData.departure_date} onChange={(e) => this.setState({ travelData: { ...this.state.travelData, departure_date: e.target.value } })} min={this.state.today}></Form.Control>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="mb-3">
                            <Form.Label>Hora de Salida:</Form.Label>
                            <Form.Control type="time" value={this.state.travelData.departure_time} onChange={(e) => this.setState({ travelData: { ...this.state.travelData, departure_time: e.target.value } })}></Form.Control>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="mb-3">
                            <Form.Label>Fecha de Llegada:</Form.Label>
                            <Form.Control type="date" value={this.state.travelData.arrival_date} onChange={(e) => this.setState({ travelData: { ...this.state.travelData, arrival_date: e.target.value } })} disabled={!this.state.editStatus} min={this.state.today}></Form.Control>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="mb-3">
                            <Form.Label>Hora de Llegada:</Form.Label>
                            <Form.Control type="time" value={this.state.travelData.arrival_time} onChange={(e) => this.setState({ travelData: { ...this.state.travelData, arrival_time: e.target.value } })} disabled={!this.state.editStatus}></Form.Control>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="mb-3">
                            <Form.Label>Origen:</Form.Label>
                            <Select data={this.state.listLocales} value={this.state.travelData.origin} onChange={(e) => this.setState({ travelData: { ...this.state.travelData, origin: e.target.value } })} placeholder="Elige un local" />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="mb-3">
                            <Form.Label>Destino:</Form.Label>
                            <Select data={this.state.listLocales} value={this.state.travelData.destination} onChange={(e) => this.setState({ travelData: { ...this.state.travelData, destination: e.target.value } })} placeholder="Elige un local" />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="mb-3">
                            <Form.Label>Conductor:</Form.Label>
                            <Select data={this.state.listDrivers} value={this.state.travelData.driver_id} onChange={(e) => this.setState({ travelData: { ...this.state.travelData, driver_id: e.target.value } })} placeholder="Elige un Conductor"  />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="mb-3">
                            <Form.Label>Camión / Vehiculo:</Form.Label>
                            <Select data={this.state.listTrucks} value={this.state.travelData.truck_id} onChange={this.getMileage} placeholder="Elige un vehiculo" />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="mb-3">
                            <Form.Label>Kilometraje Inicial:</Form.Label>
                            <Form.Control type="text" value={this.state.travelData.initial_mileage} onChange={(e) => this.setState({ travelData: { ...this.state-travelData, initial_mileage: e.target.value } })} disabled></Form.Control>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="mb-3">
                            <Form.Label>Kilometraje Final:</Form.Label>
                            <Form.Control type="text" value={this.state.travelData.final_mileage} onChange={(e) =>this.setState({ travelData: { ...this.state.travelData, final_mileage: e.target.value } })} disabled={!this.state.editStatus}></Form.Control>
                        </div>
                    </div>
                    <div className="col-md-12">
                        <div className="mb-3 d-flex justify-content-end">
                            <button className="btn btn-danger" type="button" onClick={() => this.modalStatus()}>Cancelar</button>
                            <button className="btn btn-primary ms-2" type="button" onClick={() => this.handleSubmit() }>{(this.state.editStatus) ? 'Actualizar' : 'Guardar'}</button>
                        </div>
                    </div>
                </div>
            </MyModal>
        </>
    )
}

export default Travels