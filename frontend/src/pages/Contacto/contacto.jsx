import { useState } from "react";
import { enviarContacto } from "../../servicios/api";
import "./contacto.css";

function Contacto() {
  const [formulario, setFormulario] = useState({
    nombre: "",
    email: "",
    telefono: "",
    mensaje: "",
  });

  const [mensajeExito, setMensajeExito] = useState("");
  const [mensajeError, setMensajeError] = useState("");
  const [enviando, setEnviando] = useState(false);

  function manejarCambio(evento) {
    const { name, value } = evento.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  }

  async function procesarContacto(evento) {
    evento.preventDefault();

    setMensajeExito("");
    setMensajeError("");
    setEnviando(true);

    try {
      const datosContacto = {
        nombre: formulario.nombre.trim(),
        email: formulario.email.trim(),
        telefono: formulario.telefono.trim() || null,
        mensaje: formulario.mensaje.trim(),
      };

      await enviarContacto(datosContacto);

      setMensajeExito("Mensaje enviado correctamente. Te responderemos lo antes posible.");
      setFormulario({
        nombre: "",
        email: "",
        telefono: "",
        mensaje: "",
      });
    } catch (error) {
      setMensajeError(error.message || "No se pudo enviar el mensaje.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section className="contacto-page container">
      <div className="contacto-header">
        <h1 className="title">Contacto</h1>
        <p className="text">
          Ponte en contacto con nosotros para resolver dudas, pedir información
          o consultar cualquier detalle sobre reservas, carta o eventos.
        </p>
      </div>

      <div className="contacto-layout">
        <div className="contacto-formulario">
          <div className="banner-info">
            <span>¿Tienes alguna duda?</span>
            <span>Te responderemos lo antes posible.</span>
          </div>

          {mensajeExito && <p className="mensaje-exito">{mensajeExito}</p>}
          {mensajeError && <p className="mensaje-error">{mensajeError}</p>}

          <form className="form-standard" onSubmit={procesarContacto}>
            <div className="form-group">
              <label htmlFor="nombre">Nombre</label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                value={formulario.nombre}
                onChange={manejarCambio}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Correo electrónico</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formulario.email}
                onChange={manejarCambio}
                required
              />
            </div>

            <div className="form-full-width form-group">
              <label htmlFor="telefono">Teléfono</label>
              <input
                id="telefono"
                name="telefono"
                type="text"
                value={formulario.telefono}
                onChange={manejarCambio}
                placeholder="Opcional"
              />
            </div>

            <div className="form-full-width form-group">
              <label htmlFor="mensaje">Mensaje</label>
              <textarea
                id="mensaje"
                name="mensaje"
                rows="5"
                value={formulario.mensaje}
                onChange={manejarCambio}
                required
                placeholder="Escribe aquí tu mensaje"
              />
            </div>

            <div className="form-full-width">
              <button className="form-button" type="submit" disabled={enviando}>
                {enviando ? "Enviando..." : "Enviar mensaje"}
              </button>
            </div>
          </form>
        </div>

        <aside className="contacto-info">
          <h2 className="contacto-info-title">Información</h2>
          <p className="text">
            También puedes escribirnos o llamarnos directamente para reservas,
            eventos o cualquier consulta.
          </p>

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
        </aside>
      </div>
    </section>
  );
}

export default Contacto;

/*
CAMBIOS REALIZADOS EN ESTE ARCHIVO

1. Se sustituye la página vacía por una página de contacto funcional.
2. Se reutilizan las clases globales del proyecto para mantener la misma estética:
   - container
   - title
   - text
   - form-standard
   - form-group
   - form-full-width
   - form-button
   - banner-info
3. Se añaden los campos:
   - nombre
   - email
   - teléfono
   - mensaje
4. Se conecta el formulario con la función enviarContacto() del archivo api.js.
5. Se muestran mensajes de éxito y error según la respuesta del backend.
6. Se limpia el formulario cuando el envío se realiza correctamente.
7. Se añade un bloque lateral con información de contacto del restaurante.
8. Con este cambio la página Contacto queda integrada visual y funcionalmente con el resto del proyecto.
*/