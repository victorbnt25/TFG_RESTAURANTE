import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { iniciarSesion } from "../../servicios/api";

export default function AdminLogin() {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const entrar = async (e) => {
    e.preventDefault();
    setError("");
    setCargando(true);

    try {
      const response = await iniciarSesion({
        email: correo.trim(),
        contrasena: contrasena,
      });

      if (!response?.usuario) {
        throw new Error("Respuesta de login no válida");
      }

      if (response.usuario.rol !== "ADMIN") {
        throw new Error("Esta cuenta no tiene permisos de administrador");
      }

      sessionStorage.setItem("usuario", JSON.stringify(response.usuario));
      navigate("/admin", { replace: true });
      window.location.reload();
    } catch (err) {
      setError(err.message || "No se pudo iniciar sesión");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#111",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "#1a1a1a",
          border: "1px solid #2a2a2a",
          borderRadius: "16px",
          padding: "32px",
          color: "#fff",
          boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
        }}
      >
        <h2 style={{ marginTop: 0, marginBottom: "10px", fontSize: "28px" }}>
          Acceso administración
        </h2>

        <p style={{ marginTop: 0, marginBottom: "24px", color: "#bdbdbd" }}>
          Inicia sesión con una cuenta de administrador.
        </p>

        <form onSubmit={entrar} style={{ display: "grid", gap: "14px" }}>
          <div>
            <label
              htmlFor="correo-admin"
              style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}
            >
              Correo electrónico
            </label>
            <input
              id="correo-admin"
              type="email"
              placeholder="admin@correo.com"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: "10px",
                border: "1px solid #333",
                background: "#0f0f0f",
                color: "#fff",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div>
            <label
              htmlFor="contrasena-admin"
              style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}
            >
              Contraseña
            </label>
            <input
              id="contrasena-admin"
              type="password"
              placeholder="Introduce tu contraseña"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: "10px",
                border: "1px solid #333",
                background: "#0f0f0f",
                color: "#fff",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {error && (
            <div
              style={{
                color: "#ff6b6b",
                background: "rgba(255, 0, 0, 0.08)",
                border: "1px solid rgba(255, 0, 0, 0.35)",
                padding: "12px",
                borderRadius: "10px",
                fontWeight: 600,
              }}
            >
              ⚠ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={cargando}
            style={{
              marginTop: "8px",
              padding: "12px 16px",
              borderRadius: "10px",
              border: "none",
              background: "#d4af37",
              color: "#111",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {cargando ? "ENTRANDO..." : "ACCEDER"}
          </button>
        </form>

        <div style={{ marginTop: "24px", textAlign: "center" }}>
          <button 
            onClick={() => navigate("/")}
            style={{
              background: "none",
              border: "none",
              color: "#888",
              cursor: "pointer",
              fontSize: "0.9rem",
              textDecoration: "underline"
            }}
          >
            Volver a la web principal
          </button>
        </div>
      </div>
    </div>
  );
}