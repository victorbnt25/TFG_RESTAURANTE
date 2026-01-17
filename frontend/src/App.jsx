import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import "./App.css";

function App() {
  return (
<div className="aplicacion">

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
        <button className="boton-acceso">
          Acceder
        </button>

        {/* Opciones que aparecen al pasar el ratón */}
        <div className="menu-desplegable-acceso">
          <a href="#" className="opcion-acceso">Iniciar sesión</a>
          <a href="#" className="opcion-acceso">Registrarse</a>
        </div>
      </div>
    </nav>
  </header>

  {/* Sección principal de presentación */}
  <section className="seccion-hero">
    <div className="contenido-hero">
      <h2>Cocina moderna · Sabor auténtico</h2>
      <p>
        Disfruta de una experiencia gastronómica única en el corazón de la ciudad.
      </p>

      {/* Botón para llevar a reservas */}
      <button className="boton-reservar">
        Reservar mesa
      </button>
    </div>
  </section>

  {/* Información básica del restaurante */}
  <section className="seccion-informacion">
    <div className="bloque-informacion">
      <h4>Horario</h4>
      <p>Lunes a Domingo</p>
      <p>13:00 – 16:00 / 20:00 – 23:30</p>
    </div>

    <div className="bloque-informacion">
      <h4>Dirección</h4>
      <p>Calle Falsa 123</p>
      <p>Madrid</p>
    </div>
  </section>

  {/* Pie de página */}
  <footer className="footer">
    <div className='footer-redes'>
    
  </div>
  <div className="footer-derechos">
    <p>© 2026 Nombre del restaurante</p>
    <p>Calle Hijos de la Ruina 17, Getafe, Madrid</p>
  </div>
  </footer>

</div>

  );
}

export default App;
