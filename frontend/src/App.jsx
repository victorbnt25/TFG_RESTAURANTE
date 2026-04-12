import { Routes, Route, useLocation } from "react-router-dom";
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
import Registrarse from "./pages/Registrarse/registrarse.jsx";
import Login from "./pages/Login/login.jsx";
import Privacidad from "./pages/Privacidad/privacidad.jsx";
import MisReservas from "./pages/MisReservas/misReservas.jsx";
import ScrollToTop from "./componentes/ScrollToTop.jsx";
import Chatbot from "./componentes/Chatbot/Chatbot.jsx";
import { useData } from "./context/DataContext.jsx";
import "./App.css";

// IMPORTS ADMINISTRACIÓN
import AdminLayout from "./pages/Admin/AdminLayout.jsx";
import AdminDashboard from "./pages/Admin/AdminDashboard.jsx";
import AdminPlatos from "./pages/Admin/AdminPlatos.jsx";
import AdminMesas from "./pages/Admin/AdminMesas.jsx";
import AdminPolitica from "./pages/Admin/AdminPolitica.jsx";
import RutaProtegida from "./componentes/auth/RutaProtegida.jsx";
import AdminLogin from "./pages/Admin/AdminLogin.jsx";

// CONTEXTO CARRITO
import Carrito from "./pages/Carrito/carrito.jsx";

import AdminPedidos from "./pages/Admin/AdminPedidos.jsx";


function App() {
  const location = useLocation();
  const esRutaAdmin = location.pathname.startsWith("/admin");
  const { cargandoTodo } = useData();

  if (cargandoTodo) {
    return <Loader />;
  }

  return (
    <div className="layout">
      <ScrollToTop />
      {!esRutaAdmin && <Cabecera />}

      <main className={esRutaAdmin ? "" : "contenido"}>
        <Routes>
          <Route path="/" element={<><Hero /><Inicio /></>} />
          <Route path="/carta" element={<Carta />} />
          <Route path="/reservas" element={<Reservas />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/registrarse" element={<Registrarse />} />
          <Route path="/login" element={<Login />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/privacidad" element={<Privacidad />} />
          <Route path="/mis-reservas" element={<MisReservas />} />

          
          
          <Route element={<RutaProtegida />}>
           <Route element={<RutaProtegida />}>
  <Route path="/admin/login" element={<AdminLogin />} />

  <Route path="/admin" element={<AdminLayout />}>
    <Route index element={<AdminDashboard />} />
    <Route path="platos" element={<AdminPlatos />} />
    <Route path="mesas" element={<AdminMesas />} />
    <Route path="pedidos" element={<AdminPedidos />} /> 
    <Route path="politica" element={<AdminPolitica />} />
  </Route>
            </Route>
          </Route>
        </Routes>
      </main>

      {!esRutaAdmin && <Footer />}
      {!esRutaAdmin && <Chatbot />}
    </div>
  );
}

export default App;