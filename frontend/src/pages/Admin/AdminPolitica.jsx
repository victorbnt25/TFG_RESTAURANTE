import { useEffect, useState } from "react";
import { obtenerPoliticaPrivacidad, guardarPoliticaPrivacidad } from "../../servicios/adminApi";
import { ShieldCheck, Info } from "lucide-react";

export default function AdminPolitica() {
  const [politica, setPolitica] = useState("");
  const [cargandoPolitica, setCargandoPolitica] = useState(false);
  const [guardandoPolitica, setGuardandoPolitica] = useState(false);
  const [mensajePolitica, setMensajePolitica] = useState({ tipo: "", texto: "" });
 
  useEffect(() => {
    setCargandoPolitica(true);
    obtenerPoliticaPrivacidad()
      .then((res) => {
        setPolitica(res.politica || "");
      })
      .catch((e) => {
        setMensajePolitica({ tipo: "error", texto: "No se pudo cargar la política actual." });
      })
      .finally(() => setCargandoPolitica(false));
  }, []);

  const handleGuardarPolitica = async () => {
    setGuardandoPolitica(true);
    setMensajePolitica({ tipo: "", texto: "" });
    try {
      await guardarPoliticaPrivacidad(politica);
      setMensajePolitica({ tipo: "exito", texto: "Política de privacidad actualizada con éxito." });
    } catch (e) {
      setMensajePolitica({ tipo: "error", texto: "Error al guardar los cambios." });
    } finally {
      setGuardandoPolitica(false);
    }
  };

  return (
    <div className="admin-dashboard-wrapper">
      <div className="admin-dashboard-header">
        <div>
          <h2 className="admin-title-graffiti">Textos Legales</h2>
          <p className="admin-subtitle-text">Gestiona la política de privacidad y términos de servicio.</p>
        </div>
        <button 
          className="btn-add" 
          onClick={handleGuardarPolitica}
          disabled={guardandoPolitica || cargandoPolitica}
          style={{ padding: "10px 24px", fontSize: "0.9rem" }}
        >
          {guardandoPolitica ? "GUARDANDO..." : "PUBLICAR CAMBIOS"}
        </button>
      </div>

      <div className="admin-dashboard-section">
        <h3 className="admin-section-title">
            <ShieldCheck size={18} /> Editor de Política
        </h3>
        
        <div className="admin-chart-card" style={{ padding: "0", overflow: "hidden" }}>
           {mensajePolitica.texto && (
              <div style={{ margin: "20px" }} className={mensajePolitica.tipo === "exito" ? "mensaje-exito" : "mensaje-error"}>
                {mensajePolitica.texto}
              </div>
            )}

            <div style={{ padding: "10px 20px", background: "rgba(255,255,255,0.03)", borderBottom: "1px solid #222", display: "flex", alignItems: "center", gap: "8px" }}>
                <Info size={14} color="#888" />
                <span style={{ fontSize: "0.75rem", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>
                    Cuerpo del documento (Soporta texto plano)
                </span>
            </div>

            <textarea 
                value={politica}
                onChange={(e) => setPolitica(e.target.value)}
                placeholder="Redacta aquí la política de privacidad..."
                className="admin-textarea-legal"
                style={{ 
                    width: "100%", 
                    minHeight: "60vh", 
                    background: "transparent",
                    border: "none",
                    color: "#eee",
                    padding: "25px",
                    fontSize: "1rem",
                    lineHeight: "1.6",
                    outline: "none",
                    resize: "vertical",
                    fontFamily: "'Inter', sans-serif"
                }}
            />
        </div>
      </div>
    </div>
  );
}
