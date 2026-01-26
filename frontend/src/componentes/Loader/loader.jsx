import "./loader.css";
import logo from "../../assets/media/logoBlanco.png";

function Loader() {
  return (
    <div className="loader-overlay">
      <img
        src={logo}
        alt="Cargando Sons of Burger"
        className="loader-logo"
      />
    </div>
  );
}

export default Loader;