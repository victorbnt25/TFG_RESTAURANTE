import { Routes, Route } from "react-router-dom";

import Cabecera from "./componentes/Cabecera/cabecera.jsx";
import Footer from "./componentes/Footer/footer.jsx";
import Hero from "./componentes/Hero/hero.jsx";
import Inicio from "./pages/Inicio/inicio.jsx";
import Carta from "./pages/Carta/carta.jsx";
import Reservas from "./pages/Reservas/reservas.jsx";
import Contacto from "./pages/Contacto/contacto.jsx";



import "./App.css";

function App() {
  return (
    <div className="layout">
      <Cabecera />

      <main className="contenido">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Hero />
                <Inicio />
              </>
            }
          />
          <Route path="/carta" element={<Carta />} />
          <Route path="/reservas" element={<Reservas />} />
          <Route path="/contacto" element={<Contacto />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;