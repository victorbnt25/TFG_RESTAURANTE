import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { request } from "../../servicios/api";
import "./registrarse.css";

function Registrarse() {
  const navigate = useNavigate();

  // 1. Estados para los campos del formulario
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");

  // 2. Estados para feedback del usuario
  const [mensajeExito, setMensajeExito] = useState(null);
  const [mensajeError, setMensajeError] = useState(null);
  const [cargando, setCargando] = useState(false);

  // 3. Función para procesar el registro
  const manejarRegistro = async (evento) => {
    evento.preventDefault();
    setMensajeError(null);
    setMensajeExito(null);

    // Validación básica: Contraseñas coinciden
    if (password !== confirmarPassword) {
      setMensajeError("Las contraseñas no coinciden. Revisa que ambas sean iguales.");
      return;
    }

    // Validación básica: Longitud de contraseña
    if (password.length < 6) {
      setMensajeError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setCargando(true);

    try {
      const datosRegistro = {
        nombre: nombre,
        email: correo,
        contrasena: password
      };

      // Llamada al backend (usamos /api/register que crearemos a continuación)
      await request("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosRegistro),
      });

      setMensajeExito("¡Cuenta creada con éxito! Redirigiendo al login...");
      
      // Limpiamos los campos
      setNombre("");
      setCorreo("");
      setPassword("");
      setConfirmarPassword("");

      // Redirigimos al login después de 2 segundos
      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (errorPeticion) {
      setMensajeError(errorPeticion.message || "Error al intentar registrar el usuario.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <section className="registrarse">
      {/* TÍTULO CON ANIMACIÓN (Heredado de tu CSS) */}
      <div className="registrarse-content">
        <h1 className="registrarse-title">
          <span className="white small"><strong>REGÍSTRATE </strong></span>
          <span className="primary big"><strong> YA </strong></span>
          <br />
          <span className="white small"><strong> Y OBTÉN UN 10% DE DESCUENTO</strong></span>
        </h1>
      </div>

      {/* FORMULARIO UTILIZANDO LAS CLASES GENÉRICAS DE GUIA_ESTILOS.md */}
      <form className="form-standard" onSubmit={manejarRegistro}>
        
        <div className="banner-info">
            <span>Únete a la familia de <strong>Sons of Burger</strong>.</span>
            <span>¿Ya tienes cuenta? <a href="/login">Inicia sesión</a></span>
        </div>

        <div className="form-group">
          <label>Nombre Completo</label>
          <input
            type="text"
            placeholder="Ej: Juan Pérez"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Correo Electrónico</label>
          <input
            type="email"
            placeholder="usuario@ejemplo.com"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
        </div>

        <div className="form-group form-full-width">
          <label>Contraseña</label>
          <input
            type="password"
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-group form-full-width">
          <label>Confirmar Contraseña</label>
          <input
            type="password"
            placeholder="Repite tu contraseña"
            value={confirmarPassword}
            onChange={(e) => setConfirmarPassword(e.target.value)}
            required
          />
        </div>

        {/* FEEDBACK */}
        {mensajeError && (
          <div className="form-full-width" style={{ color: "#ff4d4d", fontWeight: "bold", background: "rgba(255,0,0,0.1)", padding: "10px", borderRadius: "8px", border: "1px solid red" }}>
            <p>⚠ {mensajeError}</p>
          </div>
        )}

        {mensajeExito && (
          <div className="form-full-width" style={{ color: "var(--color-primary)", fontWeight: "bold", background: "rgba(184, 134, 11, 0.1)", padding: "10px", borderRadius: "8px", border: "1px solid var(--color-primary)" }}>
            <p>✅ {mensajeExito}</p>
          </div>
        )}

        <button type="submit" className="form-button" disabled={cargando}>
          {cargando ? "PROCESANDO..." : "REGISTRARME AHORA"}
        </button>

      </form>
    </section>
  );
}

export default Registrarse;