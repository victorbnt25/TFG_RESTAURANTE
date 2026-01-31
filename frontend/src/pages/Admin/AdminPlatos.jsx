import { useEffect, useState } from "react";
import { listarPlatos } from "../../servicios/adminApi";
import { API_URL } from "../../servicios/api";

export default function AdminPlatos() {
  const [platos, setPlatos] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    listarPlatos()
      .then(setPlatos)
      .catch((e) => setError(e.message));
  }, []);

  return (
    <div>
      <h2>Platos</h2>
      {error && <p>{error}</p>}

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Foto</th>
          </tr>
        </thead>
        <tbody>
          {platos.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.nombre}</td>
              <td>{p.precio}</td>
              <td>
                {p.foto_url ? (
                  <img
                    src={`${API_URL}${p.foto_url}`}
                    alt={p.nombre}
                    width="80"
                  />
                ) : (
                  "Sin foto"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
