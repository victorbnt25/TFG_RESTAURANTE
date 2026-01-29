import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

import Cabecera from "./componentes/Cabecera/cabecera.jsx";
import Footer from "./componentes/Footer/footer.jsx";
import Hero from "./componentes/Hero/hero.jsx";
import Inicio from "./pages/Inicio/inicio.jsx";
import Carta from "./pages/Carta/carta.jsx";
import Reservas from "./pages/Reservas/reservas.jsx";
import Contacto from "./pages/Contacto/contacto.jsx";
import Loader from "./componentes/Loader/loader.jsx";
import Nosotros from "./pages/Nosotros/nosotros.jsx";
import "./App.css";

function App() {
  const [loading, setLoading] = useState(() => {
    return !sessionStorage.getItem("appLoaded");
  });

  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        sessionStorage.setItem("appLoaded", "true");
        setLoading(false);
      }, 1800);

      return () => clearTimeout(timer);
    }
  }, [loading]);

  if (loading) {
    return <Loader />;
  }

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
          <Route path="/nosotros" element={<Nosotros />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;