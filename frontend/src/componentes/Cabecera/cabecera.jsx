import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./cabecera.css";
import Logo from "../../assets/media/logoBlanco.png";

function Cabecera() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const usuarioGuardado = localStorage.getItem("usuario");
  const usuario = usuarioGuardado ? JSON.parse(usuarioGuardado) : null;

  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    navigate("/");
    window.location.reload();
  };

  return (
    <header className="cabecera">
      <div className="cabecera-izquierda">
        <Link to="/">
          <img src={Logo} alt="Logo Sons of Burger" className="logo" />
        </Link>

        <button
          className={`hamburguesa ${menuOpen ? "abierto" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menú"
          type="button"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <nav className={`menu-principal ${menuOpen ? "activo" : ""}`}>
        <Link to="/">Inicio</Link>
        <Link to="/carta">Carta</Link>
        <Link to="/reservas">Reservas</Link>
        <Link to="/contacto">Contacto</Link>
      </nav>

      <nav className="acceso-usuario">
        <div className="contenedor-acceso">
          <button className="boton-acceso" type="button">
            {usuario
              ? `HOLA, ${usuario.nombre.split(" ")[0].toUpperCase()}`
              : "Acceder"}
          </button>

          <div className="menu-desplegable-acceso">
            {usuario ? (
              <>
                {usuario.rol === "ADMIN" && (
                  <Link to="/admin" className="opcion-acceso">
                    Panel Admin
                  </Link>
                )}

                <button
                  onClick={cerrarSesion}
                  className="opcion-acceso"
                  type="button"
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    width: "100%",
                    textAlign: "left",
                  }}
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="opcion-acceso">
                  Iniciar sesión
                </Link>

                <Link to="/registrarse" className="opcion-acceso">
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Cabecera;

/*
CAMBIOS REALIZADOS EN ESTE ARCHIVO

1. Se mantiene la lógica visual de la cabecera ya existente.
2. Se mejora la lectura del usuario desde localStorage para evitar errores si no hay sesión.
3. Se sustituyen los enlaces <a> por <Link> para trabajar correctamente con React Router.
4. Se mantiene el saludo personalizado mostrando el primer nombre del usuario.
5. Si el usuario tiene rol ADMIN, se muestra acceso al panel de administración.
6. Se mantiene el menú desplegable de acceso con login, registro o cierre de sesión.
7. Se añade useNavigate para redirigir al inicio al cerrar sesión.
8. Con este cambio la cabecera refleja correctamente el estado de autenticación del usuario.
*/