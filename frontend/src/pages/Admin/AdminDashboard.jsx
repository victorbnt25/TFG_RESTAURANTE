import { useEffect, useState } from "react";
import { obtenerKpisReservas } from "../../servicios/adminApi";

export default function AdminDashboard() {
  const [kpis, setKpis] = useState(null);
  const [error, setError] = useState("");
 
  useEffect(() => {
    obtenerKpisReservas()
      .then(setKpis)
      .catch((e) => setError(e.message));
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      {error && <p>{error}</p>}
      {!kpis && !error && <p>Cargando...</p>}

      {kpis && (
        <ul>
          <li>Reservas hoy: {kpis.reservas_hoy}</li>
          <li>Reservas semana: {kpis.reservas_semana}</li>
          <li>Canceladas hoy: {kpis.canceladas_hoy}</li>
        </ul>
      )}
    </div>
    
  );
   
}
