import "./footer.css";
import instagramLogo from '../../assets/media/logoInstagram.svg';
import tiktokLogo from '../../assets/media/tiktokLogo.svg';
import Logo from '../../assets/media/logo1.png';


function Footer() {
  return (
   <footer className="footer">
  <div className="footer1">
    
    {/* 1️⃣ Logo */}
    <div className="footer-logo">
<<<<<<< HEAD
      {/* LOGO DE RESTAURANTE */}
      
=======
      {/* logo */}
   
>>>>>>> aaf08883e3f25b351f723a451ef18666727154ef
      <img src={Logo} alt="" />
    </div>

    {/* 2️⃣ Preguntas */}
    <div className="footer-links">
      <h2>¿Tienes alguna duda?</h2>
      <p><a href="#" onClick={(e) => e.preventDefault()}>Nosotros</a></p>
      <p><a href="#" onClick={(e) => e.preventDefault()}>Contacto</a></p>
      <p><a href="#" onClick={(e) => e.preventDefault()}>Política de privacidad</a></p>
    </div>

    {/* 3️⃣ Redes sociales */}
    <div className="footer-social">
      {/* iconos instagram / tiktok */}
    
   
        <img src={instagramLogo} alt="" />
       <img src={tiktokLogo} alt="" />
    </div>

  </div>

  <div className="footer-derechos">
    <p>© 2026 Sons of Burger</p>
    <p>Calle Hijos de la Ruina 17, Getafe, Madrid</p>
  </div>
</footer>

  );
}

export default Footer;
