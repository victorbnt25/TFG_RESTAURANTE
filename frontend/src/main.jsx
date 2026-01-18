import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import Cabecera from './componentes/Cabecera/cabecera.jsx'
import Footer from './componentes/Footer/footer.jsx'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <App/>
  </StrictMode>,
)
