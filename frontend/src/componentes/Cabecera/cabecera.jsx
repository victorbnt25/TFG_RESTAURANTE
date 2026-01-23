import "./cabecera.css";
import Logo from '../../assets/media/logo1.png';

function Cabecera() {
  return (
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
  );
}

export default Cabecera;
