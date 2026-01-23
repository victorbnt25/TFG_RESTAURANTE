import { useState } from "react";
import "./cabecera.css";
import Logo from "../../assets/media/logo1.png";

function Cabecera() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="cabecera">
      {/* IZQUIERDA: LOGO */}
      <div className="cabecera-izquierda">
        <img src={Logo} alt="Logo Sons of Burger" className="logo" />

        {/* Botón hamburguesa (solo móvil) */}
        <button
          className={`hamburguesa ${menuOpen ? "abierto" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menú"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* MENÚ PRINCIPAL */}
      <nav className={`menu-principal ${menuOpen ? "activo" : ""}`}>
        <a href="/">Inicio</a>
        <a href="/carta">Carta</a>
        <a href="/reservas">Reservas</a>
        <a href="/contacto">Contacto</a>
      </nav>

      {/* ACCESO USUARIO */}
      <nav className="acceso-usuario">
        <div className="contenedor-acceso">
          <button className="boton-acceso">Acceder</button>
          <div className="menu-desplegable-acceso">
            <a href="/login" className="opcion-acceso">Iniciar sesión</a>
            <a href="/registro" className="opcion-acceso">Registrarse</a>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Cabecera;
