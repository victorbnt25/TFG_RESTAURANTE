// import { useState } from "react";
// import { crearReserva } from "../../servicios/api";
// import { request } from "../../servicios/api";
// import fondoReservas from "../../assets/media/fondo-reservas.webp"; // Foto de fondo del hero
// import "./reservas.css";

import { useState } from "react";
import { crearReserva } from "../../servicios/api";
import fondoReservas from "../../assets/media/fondo-reservas.webp"; // Foto de fondo del hero
import "./reservas.css";

function Reservas() {
  const [formulario, setFormulario] = useState({
    // Este es el estado del formulario, donde se guarda lo que escribe el usuario
    nombre: "",
    correo: "",
    fecha: "",
    hora: "",
    numeroPersonas: "",
    zona: "",
    observaciones: "",
  });

  // Aquí guardamos si todo ha ido bien o si ha saltado algún error

  const [mensajeExito, setMensajeExito] = useState("");
  const [mensajeError, setMensajeError] = useState("");
  const [enviando, setEnviando] = useState(false);

  // Esta función se encarga de actualizar el estado cada vez que el usuario escribe
  function manejarCambio(evento) {
    const { name, value } = evento.target;

    setFormulario((anterior) => ({
      ...anterior, // Copiamos lo que ya había
      [name]: value, // Y solo cambiamos el campo que ha tocado
    }));
  }

  // Aquí es donde mandamos los datos al backend cuando le dan al botón
  async function procesarReserva(evento) {
    evento.preventDefault(); // Evitamos que la página se recargue sola

    setMensajeExito("");
    setMensajeError("");
    setEnviando(true); // Bloqueamos el botón para que no pulsen mil veces

    try {
      // Preparamos los datos tal cual los espera la API de Symfony
      const datosReserva = {
        nombre: formulario.nombre.trim(),
        email: formulario.correo.trim(),
        fecha: formulario.fecha,
        hora: formulario.hora,
        numero_personas: parseInt(formulario.numeroPersonas, 10), // Lo pasamos a número
        zona: formulario.zona || null,
        observaciones: formulario.observaciones.trim() || null,
      };

      // Llamamos al servicio para que mande la reserva al backend
      // Usamos el await para esperar a que el servidor nos diga algo
      await crearReserva(datosReserva);

      // Si llegamos aquí es que ha funcionado, limpiamos el formulario

      setMensajeExito("Reserva enviada correctamente.");
      setFormulario({
        nombre: "",
        correo: "",
        fecha: "",
        hora: "",
        numeroPersonas: "",
        zona: "",
        observaciones: "",
      });
    } catch (error) {
      setMensajeError(error.message || "No se pudo realizar la reserva.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section className="container">
      <h1 className="title">Reservas</h1>

      <p className="text">
        Reserva tu mesa de forma rápida y sencilla. Indica la fecha, la hora,
        el número de personas y la zona que prefieres.
      </p>

      {mensajeExito && <p style={{ color: "green" }}>{mensajeExito}</p>}
      {mensajeError && <p style={{ color: "red" }}>{mensajeError}</p>}

      <form className="form-standard" onSubmit={procesarReserva}>
        <div className="form-group">
          <label htmlFor="nombre">Nombre</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formulario.nombre}
            onChange={manejarCambio}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="correo">Correo electrónico</label>
          <input
            type="email"
            id="correo"
            name="correo"
            value={formulario.correo}
            onChange={manejarCambio}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="fecha">Fecha</label>
          <input
            type="date"
            id="fecha"
            name="fecha"
            value={formulario.fecha}
            onChange={manejarCambio}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="hora">Hora</label>
          <input
            type="time"
            id="hora"
            name="hora"
            value={formulario.hora}
            onChange={manejarCambio}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="numeroPersonas">Número de personas</label>
          <input
            type="number"
            id="numeroPersonas"
            name="numeroPersonas"
            min="1"
            max="20"
            value={formulario.numeroPersonas}
            onChange={manejarCambio}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="zona">Zona</label>
          <select
            id="zona"
            name="zona"
            value={formulario.zona}
            onChange={manejarCambio}
          >
            <option value="">Sin preferencia</option>
            <option value="SALA">Sala</option>
            <option value="TERRAZA">Terraza</option>
            <option value="BARRA">Barra</option>
            <option value="PRIVADO">Privado</option>
          </select>
        </div>

        <div className="form-group form-full-width">
          <label htmlFor="observaciones">Observaciones</label>
          <textarea
            id="observaciones"
            name="observaciones"
            rows="4"
            value={formulario.observaciones}
            onChange={manejarCambio}
            placeholder="Escribe aquí cualquier detalle adicional de tu reserva"
          />
        </div>

        <div className="form-full-width">
          <button className="form-button" type="submit" disabled={enviando}>
            {enviando ? "Enviando..." : "Reservar mesa"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default Reservas;
