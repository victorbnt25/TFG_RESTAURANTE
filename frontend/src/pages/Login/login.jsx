import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { iniciarSesion } from "../../servicios/api";
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
      const response = await iniciarSesion({
        email: correo.trim(),
        contrasena: password,
      });

      localStorage.setItem("usuario", JSON.stringify(response.usuario));

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
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            placeholder="Introduce tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
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

/*
CAMBIOS REALIZADOS EN ESTE ARCHIVO

1. Se conecta la página de login con la función iniciarSesion() del archivo api.js.
2. Se envían al backend los campos:
   - email
   - contrasena
3. Si el login es correcto, se guarda el usuario en localStorage.
4. Se redirige:
   - a /admin si el rol es ADMIN
   - a / si es un usuario normal
5. Se mantiene el manejo de errores y estado de carga.
6. Se sustituyen enlaces <a> por <Link> para evitar recargas innecesarias en React Router.
7. Con este cambio el login queda más limpio y alineado con la arquitectura del resto del frontend.
*/