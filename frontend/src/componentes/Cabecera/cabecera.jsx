import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./cabecera.css";
import Logo from "../../assets/media/logoBlanco.png";
import { useCarrito } from "../../context/CarritoContext";

function Cabecera() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [animarCarrito, setAnimarCarrito] = useState(false);
  const navigate = useNavigate();

  const { totalProductos } = useCarrito();

  const usuarioGuardado = localStorage.getItem("usuario");
  const usuario = usuarioGuardado ? JSON.parse(usuarioGuardado) : null;

  useEffect(() => {
    if (totalProductos > 0) {
      setAnimarCarrito(true);
      const timer = setTimeout(() => setAnimarCarrito(false), 280);
      return () => clearTimeout(timer);
    }
  }, [totalProductos]);

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

        <Link
          to="/carrito"
          className={`enlace-carrito ${animarCarrito ? "animar" : ""}`}
        >
          <span className="enlace-carrito-texto">Carrito:</span>
          <span className="enlace-carrito-cantidad">{totalProductos}</span>
        </Link>
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