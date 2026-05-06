import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { iniciarSesion } from "../../servicios/api";
import "./login.css";

function Login() {
  const navigate = useNavigate();

  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [mensajeError, setMensajeError] = useState(null);
  const [cargando, setCargando] = useState(false);

  const manejarLogin = async (evento) => {
    evento.preventDefault();
    setMensajeError(null);
    setCargando(true);

    try {
      const response = await iniciarSesion({
        email: correo.trim(),
        contrasena: contrasena,
      });

      sessionStorage.setItem("usuario", JSON.stringify(response.usuario));

      if (response.usuario.rol === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/");
      }

      window.location.reload();
    } catch (error) {
      setMensajeError(error.message || "Email o contraseña incorrectos.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <section className="login-page">
      <div className="login-header">
        <h1 className="login-title">
          <span className="white small"><strong>BIENVENIDO</strong></span>
          <span className="primary big"><strong> DE NUEVO</strong></span>
        </h1>
      </div>

      <form className="form-standard" onSubmit={manejarLogin}>
        <div className="banner-info">
          <span>
            ¿No tienes cuenta? <Link to="/registrarse">Regístrate gratis</Link>
          </span>
          <span>y obtén beneficios exclusivos.</span>
        </div>

        <div className="form-group form-full-width">
          <label htmlFor="correo">Correo Electrónico</label>
          <input
            id="correo"
            type="email"
            placeholder="Introduce tu email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
        </div>

        <div className="form-group form-full-width">
          <label htmlFor="contrasena">Contraseña</label>
          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <input
              id="contrasena"
              type={mostrarContrasena ? "text" : "password"}
              placeholder="Introduce tu contraseña"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
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
              marginTop: "10px",
            }}
          >
            <p>⚠ {mensajeError}</p>
          </div>
        )}

        <button
          type="submit"
          className="form-button"
          disabled={cargando}
          style={{ marginTop: "20px" }}
        >
          {cargando ? "ENTRANDO..." : "INICIAR SESIÓN"}
        </button>

        <div
          className="form-full-width"
          style={{ textAlign: "center", marginTop: "15px" }}
        >
          <Link
            to="/"
            style={{
              color: "#888",
              fontSize: "0.9rem",
              textDecoration: "underline",
            }}
          >
            Volver al inicio
          </Link>
        </div>
      </form>
    </section>
  );
}

export default Login;