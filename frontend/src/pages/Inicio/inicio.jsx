import './inicio.css';
import fotoInicio from '../../assets/media/portada.jpg'; // ruta de la foto
import videoHumo from  '../../assets/media/videoHumoHamburguesa3.mp4';

function Inicio() {
  return (
    <section className="inicio">
      <div className="inicio-overlay">

        {/* IZQUIERDA DONDE VA LA FOTO */}
        <div className="inicio-imagen">
      {  /*  <img src={fotoInicio} alt="Plato del restaurante" />*/}
   <video
src={videoHumo}
autoPlay
muted
loop
playsInline
preload="auto"
className="inicio-video"
/>
        </div>

        {/* DERECHA DONDE VA EL CONTENIDO */}
        <div className="inicio-contenido">
          <h1>Sons of Burger</h1>
          <p>Cocina auténtica desde 1985</p>

          <div className="inicio-btn">
            <a href="/carta" className="inicio-btn primary">Ver carta</a>
            <a href="/reservas" className="inicio-btn outline">Reservar mesa</a>
          </div>
        </div>

      </div>
    </section>
  );
}

export default Inicio;