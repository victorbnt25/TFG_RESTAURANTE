import "./footer.css";
import instagramLogo from "../../assets/media/logoInstagram.svg";
import tiktokLogo from "../../assets/media/tiktokLogo.svg";
import Logo from "../../assets/media/logoNegro.png";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer1">

        {/* LOGO */}
        <div className="footer-logo">
          <img src={Logo} alt="Logo Sons of Burger" />
        </div>

        {/* ENLACES */}
        <div className="footer-links">
          <h2>¿Tienes alguna duda?</h2>
          <p><a href="/nosotros">Nosotros</a></p>
          <p><a href="/contacto">Contacto</a></p>
          <p><a href="/privacidad">Política de privacidad</a></p>
        </div>

        {/* REDES SOCIALES */}
        <div className="footer-social">
          <a href="https://www.instagram.com" aria-label="Instagram">
            <img src={instagramLogo} alt="Instagram" />
          </a>
          <a href="https://www.tiktok.com" aria-label="TikTok">
            <img src={tiktokLogo} alt="TikTok" />
          </a>
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
