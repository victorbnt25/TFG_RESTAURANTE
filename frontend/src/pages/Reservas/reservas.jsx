import { useState } from "react";
import { request } from "../../servicios/api";
import fondoReservas from "../../assets/media/fondo-reservas.webp"; // Foto de fondo del hero
import "./reservas.css";


function Reservas() {
  // 1. Estado del formulario (datos que introduce el cliente)
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [numeroPersonas, setNumeroPersonas] = useState("2");
  const [zona, setZona] = useState("");
  const [observaciones, setObservaciones] = useState("");

  // 2. Estado para manejar la respuesta del servidor
  const [mensajeExito, setMensajeExito] = useState(null);
  const [mensajeError, setMensajeError] = useState(null);

  // 3. Función que procesa el envío del formulario
  const procesarReserva = async (evento) => {
    evento.preventDefault(); // Evita que la página se recargue por defecto
    // Vaciamos los mensajes anteriores
    setMensajeExito(null);
    setMensajeError(null);

    const datosReserva = {
      nombre: nombre,
      email: correo, // Symfony espera 'email', pero nuestra variable es 'correo'
      fecha: fecha,
      hora: hora,
      numero_personas: parseInt(numeroPersonas), // Symfony espera un número entero
      zona: zona !== "" ? zona : undefined, // Si no eligió zona, no la enviamos
      observaciones: observaciones !== "" ? observaciones : undefined,
    };
    try {
      // Usamos la función 'request' centralizada (que ya añade la URL base)
      await request("/api/reservas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosReserva),
      });

      // Si llega aquí es porque la respuesta fue OK
      setMensajeExito("¡Reserva confirmada con éxito!");

      // Limpiamos el formulario
      setNombre("");
      setCorreo("");
      setFecha("");
      setHora("");
      setNumeroPersonas("2");
      setZona("");
      setObservaciones("");

    } catch (errorPeticion) {
      // 'request' ya extrae el mensaje de error del backend
      setMensajeError(errorPeticion.message || "Error al crear la reserva");
    }

  };

  return (
    <section className="reservas">

      {/* HERO con foto de fondo */}
      <div className="reservas-inner">
        <div
          className="reservas-foto"
          style={{ backgroundImage: `url(${fondoReservas})` }}
        />
        <div className="reservas-content">
          <h1 className="reservas-title">
            <span className="white small"><strong>RESERVA</strong></span>
            <span className="primary big"><strong>TU</strong></span>
            <span className="white small"><strong>MESA</strong></span>
          </h1>
        </div>
      </div>

      {/* FORMULARIO DE RESERVA */}
      <form className="formulario-reservas" onSubmit={procesarReserva}>

        <div>
          <label>Introduce tu nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Introduce tu correo</label>
          <input
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="fecha">Introduce la fecha</label>
          <input
            id="fecha"
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Introduce la hora</label>
          <select value={hora} onChange={(e) => setHora(e.target.value)} required>

            <option value="">Selecciona la hora</option>
            <optgroup label="Comida">
              <option value="12:00">12:00</option>
              <option value="12:30">12:30</option>
              <option value="13:00">13:00</option>
              <option value="13:30">13:30</option>
              <option value="14:00">14:00</option>
              <option value="14:30">14:30</option>
              <option value="15:00">15:00</option>
              <option value="15:30">15:30</option>
              <option value="16:00">16:00</option>
            </optgroup>
            <optgroup label="Cena">
              <option value="20:00">20:00</option>
              <option value="20:30">20:30</option>
              <option value="21:00">21:00</option>
              <option value="21:30">21:30</option>
              <option value="22:00">22:00</option>
              <option value="22:30">22:30</option>
              <option value="23:00">23:00</option>
              <option value="23:30">23:30</option>
            </optgroup>
          </select>
        </div>

        <div>
          <label>Introduce el número de personas</label>
          <input
            type="number"
            value={numeroPersonas}
            onChange={(e) => setNumeroPersonas(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Introduce la zona</label>
          <select value={zona} onChange={(e) => setZona(e.target.value)}>
            <option value="">Selecciona una zona (Opcional)</option>
            <option value="SALA">Salón</option>
            <option value="TERRAZA">Terraza</option>
            <option value="BARRA">Barra</option>
            <option value="PRIVADO">Privado</option>
          </select>
        </div>

        <div className="formulario-fila-completa">
          <label>Introduce las observaciones</label>
          <textarea
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
          ></textarea>
        </div>

        {/* Mensaje de error (en rojo) */}
        {mensajeError && (
          <div className="formulario-fila-completa" style={{ color: "red", fontWeight: "bold" }}>
            {mensajeError}
          </div>
        )}

        {/* Mensaje de éxito (en verde) */}
        {mensajeExito && (
          <div className="formulario-fila-completa" style={{ color: "green", fontWeight: "bold" }}>
            {mensajeExito}
          </div>
        )}

        <button type="submit">Confirmar Reserva</button>
      </form>

    </section>
  );
}

export default Reservas;
