import { useEffect, useState } from "react";
import { obtenerPoliticaPrivacidad } from "../../servicios/adminApi";
import "./privacidad.css";

export default function Privacidad() {
  const [politica, setPolitica] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Para que inicie la vista desde arriba del todo
    window.scrollTo(0, 0);

    obtenerPoliticaPrivacidad()
      .then((res) => {
        setPolitica(res.politica || "Actualmente no existen políticas de privacidad definidas.");
      })
      .catch((e) => {
        setError(true);
      })
      .finally(() => {
        setCargando(false);
      });
  }, []);

  return (
    <section className="container privacidad-page">
      <h1 className="title">Política de Privacidad</h1>
      
      <div className="privacidad-content">
        {cargando ? (
          <p className="loading-text">Cargando condiciones legales...</p>
        ) : error ? (
          <p className="error-text">No se ha podido cargar la información legal en este momento.</p>
        ) : (
          <div className="texto-legal">
            {/* Como es texto plano, renderizamos conservando los saltos de línea con CSS */}
            {politica}
          </div>
        )}
      </div>
    </section>
  );
}
