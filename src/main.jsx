import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { CustomProvider } from 'rsuite'
import './scss/styles.scss'
import * as bootstrap from 'bootstrap'

ReactDOM.createRoot(document.getElementById('app')).render(
  <React.StrictMode>
    <CustomProvider>
      <App />
    </CustomProvider>
  </React.StrictMode>,
)
