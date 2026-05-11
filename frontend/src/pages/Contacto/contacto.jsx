import "./contacto.css";

function Contacto() {
  return (
    <section className="contacto-page container">
      <div className="contacto-header">
        <h1 className="title">Contacto</h1>
        <p className="text">
          Si tienes alguna duda o quieres realizar una consulta directa, 
          estamos a tu disposición a través de los siguientes canales.
        </p>
      </div>

      <div className="contacto-info-full">
        <div className="contacto-card">
          <div className="contacto-bloque">
            <strong>Teléfono</strong>
            <span>+34 600 000 000</span>
          </div>

          <div className="contacto-bloque">
            <strong>Email</strong>
            <span>sonsofburger.tfg@gmail.com</span>
          </div>

          <div className="contacto-bloque">
            <strong>Ubicación</strong>
            <span>Móstoles, Madrid</span>
          </div>

          <div className="contacto-bloque">
            <strong>Horario</strong>
            <span>Lunes a Domingo · 13:00 - 23:30</span>
          </div>
        </div>

        <div className="banner-info-footer">
          <span>Próximamente habilitaremos un sistema de mensajería directa.</span>
        </div>
      </div>
    </section>
  );
}

export default Contacto;