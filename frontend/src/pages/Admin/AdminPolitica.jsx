import { useEffect, useState } from "react";
import { obtenerPoliticaPrivacidad, guardarPoliticaPrivacidad } from "../../servicios/adminApi";

export default function AdminPolitica() {
  const [politica, setPolitica] = useState("");
  const [cargandoPolitica, setCargandoPolitica] = useState(false);
  const [guardandoPolitica, setGuardandoPolitica] = useState(false);
  const [mensajePolitica, setMensajePolitica] = useState({ tipo: "", texto: "" });
 
  useEffect(() => {
    // Cargar Política de Privacidad
    setCargandoPolitica(true);
    obtenerPoliticaPrivacidad()
      .then((res) => {
        setPolitica(res.politica || "");
      })
      .catch((e) => {
        setMensajePolitica({ tipo: "error", texto: "No se pudo cargar la política." });
      })
      .finally(() => setCargandoPolitica(false));
  }, []);

  const handleGuardarPolitica = async () => {
    setGuardandoPolitica(true);
    setMensajePolitica({ tipo: "", texto: "" });
    try {
      await guardarPoliticaPrivacidad(politica);
      setMensajePolitica({ tipo: "exito", texto: "Política de privacidad actualizada correctamente." });
    } catch (e) {
      setMensajePolitica({ tipo: "error", texto: "Hubo un error al guardar." });
    } finally {
      setGuardandoPolitica(false);
    }
  };

  return (
    <div className="admin-pedidos-wrapper">
      <div className="admin-pedidos-header">
        <div>
          <h2>Política de Privacidad</h2>
          <p className="admin-subtitle-text">Configura los términos legales del sitio web</p>
        </div>
      </div>

      <div className="admin-kpi-card" style={{ padding: "30px" }}>
        {mensajePolitica.texto && (
          <div className={mensajePolitica.tipo === "exito" ? "mensaje-exito" : "mensaje-error"}>
            {mensajePolitica.texto}
          </div>
        )}

        {cargandoPolitica ? (
          <p style={{ color: "#888" }}>Cargando texto actual...</p>
        ) : (
          <textarea 
            value={politica}
            onChange={(e) => setPolitica(e.target.value)}
            placeholder="Escribe aquí los términos de servicio y políticas..."
            style={{ 
              width: "100%", 
              minHeight: "450px", 
              padding: "20px", 
              marginBottom: "20px",
              fontFamily: "monospace",
              fontSize: "0.95rem"
            }}
          />
        )}
        
        <button 
          className="btn-add" 
          onClick={handleGuardarPolitica}
          disabled={guardandoPolitica || cargandoPolitica}
        >
          {guardandoPolitica ? "Guardando..." : "Guardar Cambios"}
        </button>
      </div>

    </div>
  );
}
