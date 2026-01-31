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

// IMPORTS PARA LA PARTE DE ADMINISTRACIÓN
import AdminLayout from "./pages/Admin/AdminLayout.jsx";
import AdminDashboard from "./pages/Admin/AdminDashboard.jsx";
import AdminPlatos from "./pages/Admin/AdminPlatos.jsx";
import AdminSubirFoto from "./pages/Admin/AdminSubirFoto.jsx";
import RutaProtegida from "./componentes/auth/RutaProtegida.jsx";
import AdminLogin from "./pages/Admin/AdminLogin.jsx";



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
               {/* Páginas públicas */}
          <Route path="/carta" element={<Carta />} />
          <Route path="/reservas" element={<Reservas />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/nosotros" element={<Nosotros />} />

          {/* Ruta de login admin */}
          <Route path="/admin/login" element={<AdminLogin />} />
          {/* Rutas para la parte de administración */}
            <Route element={<RutaProtegida />}>
            <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="platos" element={<AdminPlatos />} />
            <Route path="subir-foto" element={<AdminSubirFoto />} />
           </Route>
          </Route>

        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;