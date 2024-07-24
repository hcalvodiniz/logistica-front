import axios from "axios";
import { Component } from "react";
import { Form } from "react-bootstrap";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal)

export class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: '',
            password: '',
            invalidUser: false,
            invalidPassword: false,
        }
    }

    handleSubmit = () => {

        const data = {
            username: this.state.username,
            password: this.state.password
        }
        
        axios.post('http://localhost/services/login/login', data, {
            headers:{
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        })
        .then((response) => {
            MySwal.fire({
                title: (response.data.success) ? '¡Éxito!' : 'Oops',
                icon: (response.data.success) ? 'success' : 'error',
                html: response.data.msg
            })
            this.props.setToken({...response.data.data, token: response.data.data.password})
        })
        .catch((error) => console.log(error))
    }

    render = () => (
        <>
            <div className="container-fluid">
                <div className="row justify-content-center">
                    <div className="col-md-4 my-5">
                        <div className="card" style={{ padding: 0 }}>
                            <div className="card-header">Iniciar Sesión</div>
                            <div className="card-body">
                                <div className="mb-3">
                                    <Form.Label>Usuario:</Form.Label>
                                    <Form.Control type="text" id="username" isInvalid={this.state.invalidUser} value={this.state.username} onChange={(e) => this.setState({ username: e.target.value })}></Form.Control>
                                </div>
                                <div className="mb-3">
                                    <Form.Label>Contraseña:</Form.Label>
                                    <Form.Control type="password" id="password" isInvalid={this.state.invalidPassword} value={this.state.password} onChange={(e) => this.setState({ password: e.target.value })}></Form.Control>
                                </div>
                                <div className="mb-3 d-grid">
                                    <button className="btn btn-block btn-primary" type="button" onClick={this.handleSubmit}>Iniciar Sesión</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login