import { useState } from "react";
import "./cabecera.css";
import Logo from "../../assets/media/logo1.png";

function Cabecera() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
<<<<<<< HEAD
    <header className="cabecera">
      <div className="cabecera-izquierda">
        <h1 className="logo-restaurante">NOMBRE RESTAURANTE</h1>
        <img src={Logo} alt="Logo" className="logo" />

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

        {/* Menú principal */}
        <nav className={`menu-principal ${menuOpen ? "activo" : ""}`}>
          <a href="#">Inicio</a>
          <a href="#">Carta</a>
          <a href="#">Reservas</a>
          <a href="#">Contacto</a>
        </nav>
      </div>

      {/* Acceso usuario */}
      <nav className="acceso-usuario">
        <div className="contenedor-acceso">
          <button className="boton-acceso">Acceder</button>

          <div className="menu-desplegable-acceso">
            <a href="#" className="opcion-acceso">Iniciar sesión</a>
            <a href="#" className="opcion-acceso">Registrarse</a>
          </div>
        </div>
      </nav>
    </header>
=======
    <>
      {/* Cabecera con el nombre del restaurante y la navegación */}
      <header className="cabecera">
  <div className="cabecera-izquierda">
    <h1 className="logo-restaurante"></h1>
    <img src={Logo} alt="Logo Sons of Burger" className="logo" />
  </div>

  <nav className="menu-principal">
    <a href="#">Inicio</a>
    <a href="#">Carta</a>
    <a href="#">Reservas</a>
    <a href="#">Contacto</a>
  </nav>

  <nav className="acceso-usuario">
    <div className="contenedor-acceso">
      <button className="boton-acceso">Acceder</button>
      <div className="menu-desplegable-acceso">
        <a href="#" className="opcion-acceso">Iniciar sesión</a>
        <a href="#" className="opcion-acceso">Registrarse</a>
      </div>
    </div>
  </nav>
</header>

    </>
>>>>>>> aaf08883e3f25b351f723a451ef18666727154ef
  );
}

export default Cabecera;
