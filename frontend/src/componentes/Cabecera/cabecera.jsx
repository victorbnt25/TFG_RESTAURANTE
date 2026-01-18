import "./cabecera.css";

function Cabecera() {
  return (
    <>
      {/* Cabecera con el nombre del restaurante y la navegación */}
      <header className="cabecera">
        <div className="cabecera-izquierda">
          <h1 className="logo-restaurante">NOMBRE RESTAURANTE</h1>

          {/* Menú principal de la web */}
          <nav className="menu-principal">
            <a href="#">Inicio</a>
            <a href="#">Carta</a>
            <a href="#">Reservas</a>
            <a href="#">Contacto</a>
          </nav>
        </div>

        {/* Zona de acceso del usuario */}
        <nav className="acceso-usuario">
          <div className="contenedor-acceso">
            <button className="boton-acceso">Acceder</button>

            {/* Opciones que aparecen al pasar el ratón */}
            <div className="menu-desplegable-acceso">
              <a href="#" className="opcion-acceso">Iniciar sesión</a>
              <a href="#" className="opcion-acceso">Registrarse</a>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}

export default Cabecera;
