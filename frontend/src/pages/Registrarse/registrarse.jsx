import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registrarUsuario } from "../../servicios/api";
import "./registrarse.css";

function Registrarse() {
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [mostrarContrasena, setMostrarContrasena] = useState(false);

  const [mensajeExito, setMensajeExito] = useState(null);
  const [mensajeError, setMensajeError] = useState(null);
  const [cargando, setCargando] = useState(false);

  const manejarRegistro = async (evento) => {
    evento.preventDefault();
    setMensajeError(null);
    setMensajeExito(null);

    if (password !== confirmarPassword) {
      setMensajeError("Las contraseñas no coinciden. Revisa que ambas sean iguales.");
      return;
    }

    if (password.length < 6) {
      setMensajeError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setCargando(true);

    try {
      await registrarUsuario({
        nombre: nombre.trim(),
        email: correo.trim(),
        contrasena: password,
      });

      setMensajeExito("¡Cuenta creada con éxito! Redirigiendo al login...");

      setNombre("");
      setCorreo("");
      setPassword("");
      setConfirmarPassword("");

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
      <div className="registrarse-content">
        <h1 className="registrarse-title">
          <span className="white small"><strong>REGÍSTRATE </strong></span>
          <span className="primary big"><strong> YA </strong></span>
          <br />
          <span className="white small"><strong> Y OBTÉN UN 10% DE DESCUENTO</strong></span>
        </h1>
      </div>

      <form className="form-standard" onSubmit={manejarRegistro}>
        <div className="banner-info">
          <span>Únete a la familia de <strong>Sons of Burger</strong>.</span>
          <span>
            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
          </span>
        </div>

        <div className="form-group">
          <label htmlFor="nombre">Nombre Completo</label>
          <input
            id="nombre"
            type="text"
            placeholder="Ej: Juan Pérez"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="correo">Correo Electrónico</label>
          <input
            id="correo"
            type="email"
            placeholder="usuario@ejemplo.com"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
        </div>

        <div className="form-group form-full-width">
          <label htmlFor="password">Contraseña</label>
          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <input
              id="password"
              type={mostrarContrasena ? "text" : "password"}
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: "100%", paddingRight: "40px" }}
            />
            <button
              type="button"
              onClick={() => setMostrarContrasena(!mostrarContrasena)}
              style={{
                position: "absolute",
                right: "10px",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "0",
                display: "flex",
                alignItems: "center",
                color: "#888"
              }}
            >
              {mostrarContrasena ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="form-group form-full-width">
          <label htmlFor="confirmarPassword">Confirmar Contraseña</label>
          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <input
              id="confirmarPassword"
              type={mostrarContrasena ? "text" : "password"}
              placeholder="Repite tu contraseña"
              value={confirmarPassword}
              onChange={(e) => setConfirmarPassword(e.target.value)}
              required
              style={{ width: "100%", paddingRight: "40px" }}
            />
          </div>
        </div>

        {mensajeError && (
          <div
            className="form-full-width"
            style={{
              color: "#ff4d4d",
              fontWeight: "bold",
              background: "rgba(255,0,0,0.1)",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid red",
            }}
          >
            <p>⚠ {mensajeError}</p>
          </div>
        )}

        {mensajeExito && (
          <div
            className="form-full-width"
            style={{
              color: "var(--color-primary)",
              fontWeight: "bold",
              background: "rgba(184, 134, 11, 0.1)",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid var(--color-primary)",
            }}
          >
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
