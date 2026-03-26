import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter} from "react-router-dom"
import './index.css'
import App from './App.jsx'
import "./styles/theme.css";
import "./styles/forms.css";
import { CarritoProvider } from "./context/CarritoContext.jsx";

createRoot(document.getElementById('root')).render(
   <StrictMode>
    <BrowserRouter>
      <CarritoProvider>
        <App/>
      </CarritoProvider>
    </BrowserRouter>
  </StrictMode>,
)
