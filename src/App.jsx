import { useState } from 'react'
import './App.css'
import MyNavBar from './components/nav'
import Trucks from './screens/trucks'
import Drivers from './screens/drivers'
import Users from './screens/users'
import Login from './screens/login'
import useToken from './components/useToken'
import Travels from './screens/travels'

function App() {
  const [module, setModule] = useState('');
  const { token, setToken } = useToken();

  const componentMap = {
    Drivers: (<Drivers />),
    Trucks:(<Trucks />),
    Users:(<Users />),
    Viajes: (<Travels />),
  }

  if(!token) {
    return <Login setToken={setToken} />
  }

  return (
    <div>
      <MyNavBar goToModule={setModule} userData={token} setToken={setToken} />
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-md-8 my-3">
            { componentMap[module] || null }
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
