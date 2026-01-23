import './hero.css';
import heroFoto from '../../assets/media/portada.jpg';//ruta de la foto

function Hero() {
  return (
    <section className="hero">
      <div className="hero-overlay">

        {/* IZQUIERDA DONDE VA LA FOTO */}
        <div className="hero-imagen">
          <img src={heroFoto} alt="Plato del restaurante" />
        </div>

        {/* DERECHA DONDE VA EL CONTENIDO */}
        <div className="hero-contenido">
          <h1>Sons of Burger</h1>
<<<<<<< HEAD
          <br />
          <p>Cocina auténtica desde 1985</p>
=======
          <p>Cocina auténtica desde 2024</p>
>>>>>>> aaf08883e3f25b351f723a451ef18666727154ef

          <div className="hero-btn">
            <a href="/carta" className="hero-btn primary">Ver carta</a>
            <a href="/reservas" className="hero-btn outline">Reservar mesa</a>
          </div>
        </div>

      </div>
      <div>

      </div>
    </section>
  );
}

export default Hero;
