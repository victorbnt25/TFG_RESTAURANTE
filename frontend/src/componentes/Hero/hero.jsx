import { useEffect, useState } from "react";
import fondoHero from "../../assets/media/fondoHero.webp";
import "./hero.css";

function Hero() {
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setOffsetY(window.pageYOffset);
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="hero">
      <img
        src={fondoHero}
        alt="Sons of Burger Interior"
        className="hero__foto"
        style={{
          // Este transform mueve la imagen hacia arriba mientras bajas
          // El 0.3 es la intensidad: ajústalo a 0.5 si quieres que se mueva más rápido
          transform: `translateY(${offsetY * 0.3}px)`,
        }}
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