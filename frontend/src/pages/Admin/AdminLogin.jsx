import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const entrar = (e) => {
    e.preventDefault();
    setError("");

    // DEMO: una clave fija (cámbialo por llamada a API luego)
    if (clave === "admin123") {
      localStorage.setItem("token_admin", "ok"); // luego aquí guardas el JWT real
      navigate("/admin", { replace: true });
    } else {
      setError("Clave incorrecta");
    }
  };

  return (
    <div style={{marginTop: 120, maxWidth: 360 }}>
      <h2>Login admin</h2>

      <form onSubmit={entrar}>
        <input
          type="password"
          placeholder="Clave"
          value={clave}
          onChange={(e) => setClave(e.target.value)}
        />
        <button type="submit">Acceder</button>
      </form>

      {error && <p>{error}</p>}
    </div>
  );
}
