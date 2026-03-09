import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { request } from "../../servicios/api";
import "./login.css";

function Login() {
  const navigate = useNavigate();

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  
  const [mensajeError, setMensajeError] = useState(null);
  const [cargando, setCargando] = useState(false);

  const manejarLogin = async (evento) => {
    evento.preventDefault();
    setMensajeError(null);
    setCargando(true);

    try {
      const response = await request("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: correo,
          contrasena: password
        }),
      });

      // Guardamos la sesión en el navegador (JSON con info del usuario)
      localStorage.setItem("usuario", JSON.stringify(response.usuario));
      
      // Redirigimos según el rol o al inicio
      if (response.usuario.rol === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/");
      }

      // Recargamos para que la cabecera se actualice (truco rápido por ahora)
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
          <span>¿No tienes cuenta? <a href="/registrarse">Regístrate gratis</a></span>
          <span>y obtén beneficios exclusivos.</span>
        </div>

        <div className="form-group form-full-width">
          <label>Correo Electrónico</label>
          <input
            type="email"
            placeholder="Introduce tu email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
        </div>

        <div className="form-group form-full-width">
          <label>Contraseña</label>
          <input
            type="password"
            placeholder="Introduce tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {mensajeError && (
          <div className="form-full-width" style={{ color: "#ff4d4d", fontWeight: "bold", background: "rgba(255,0,0,0.1)", padding: "10px", borderRadius: "8px", border: "1px solid red", marginTop: "10px" }}>
            <p>⚠ {mensajeError}</p>
          </div>
        )}

        <button type="submit" className="form-button" disabled={cargando} style={{ marginTop: "20px" }}>
          {cargando ? "ENTRANDO..." : "INICIAR SESIÓN"}
        </button>

        <div className="form-full-width" style={{ textAlign: "center", marginTop: "15px" }}>
            <a href="/" style={{ color: "#888", fontSize: "0.9rem", textDecoration: "underline" }}>Volver al inicio</a>
        </div>
      </form>
    </section>
  );
}

export default Login;
