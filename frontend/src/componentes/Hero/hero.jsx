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

        {/* DERECHADONDE VA EL CONTENIDO */}
        <div className="hero-contenido">
          <h1>Sons of Burger</h1>
          <p>Cocina auténtica desde 1985</p>

          <div className="hero-btn">
            <a href="/carta" className="hero-btn primary">Ver carta</a>
            <a href="/reservas" className="hero-btn outline">Reservar mesa</a>
          </div>
        </div>

      </div>
    </section>
  );
}

export default Hero;
