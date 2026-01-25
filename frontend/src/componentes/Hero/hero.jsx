import fondoHero from "../../assets/media/fondoHero.png";
import "./hero.css";


function Hero() {
return (
<section className="hero">
<div
className="hero__foto"
style={{ backgroundImage: `url(${fondoHero})` }}
/>


<div className="hero__content">
<h1 className="hero_titulo"><b>SONS OF BURGUERS</b></h1>
<p className="hero_subtitulo">
Auténtica cocina italiana desde 1985
</p>
</div>
</section>
);
}


export default Hero;