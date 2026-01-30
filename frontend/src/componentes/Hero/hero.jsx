import fondoHero from "../../assets/media/fondoHero.png";
import "./hero.css";

function Hero() {
  return (
    <section className="hero">
      <img
        src={fondoHero}
        alt=""
        className="hero__foto"
        loading="eager"
        fetchpriority="high"
      />

      <div className="hero__content">
        <h1 className="hero_titulo"><b>SONS OF BURGER</b></h1>
        <p className="hero_subtitulo">
          Auténtica parrilla española desde 2024
        </p>
      </div>
    </section>
  );
}

export default Hero;