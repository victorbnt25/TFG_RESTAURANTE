import { useState } from "react";
import "./cabecera.css";
import Logo from "../../assets/media/logoBlanco.png";

function Cabecera() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Comprobar si hay sesión
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    window.location.reload();
  };

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

      {/* ACCESO USUARIO / PERFIL */}
      <nav className="acceso-usuario">
        <div className="contenedor-acceso">
          <button className="boton-acceso">
            {usuario ? `HOLA, ${usuario.nombre.split(' ')[0].toUpperCase()}` : "Acceder"}
          </button>
          
          <div className="menu-desplegable-acceso">
            {usuario ? (
              <>
                {usuario.rol === "ADMIN" && <a href="/admin" className="opcion-acceso">Panel Admin</a>}
                <button onClick={cerrarSesion} className="opcion-acceso" style={{ background: "none", border: "none", cursor: "pointer", width: "100%", textAlign: "left" }}>Cerrar sesión</button>
              </>
            ) : (
              <>
                <a href="/login" className="opcion-acceso">Iniciar sesión</a>
                <a href="/registrarse" className="opcion-acceso">Registrarse</a>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Cabecera;
