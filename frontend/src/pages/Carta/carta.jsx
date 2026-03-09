import { useState, useEffect } from "react";
import { request, API_URL } from "../../servicios/api";

function Carta() {
  const [hamburguesas, setHamburguesas] = useState([]);
  const [mostrarHamburguesas, setMostrarHamburguesas] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHamburguesas = async () => {
      setCargando(true);
      try {
        const data = await request("/api/platos");
        // Filtramos solo las hamburguesas asumiendo tipo "PRINCIPAL" o puedes mostrar todo
        // Dejamos configurado para mostrar solo las que son de tipo PRINCIPAL / Hamburguesa
        setHamburguesas(data.filter(plato => plato.tipo === "PRINCIPAL" && (plato.activo !== false)));
      } catch (e) {
        setError("Error al cargar la carta. Inténtalo de nuevo.");
      } finally {
        setCargando(false);
      }
    };

    fetchHamburguesas();
  }, []);

  return (
    <section className="container carta">
      <h1 className="title">Nuestra carta</h1>

      <p className="text">
        Descubre nuestra selección de platos elaborados con ingredientes de
        primera calidad.
      </p>

      <section className="carta-seccion" id="hamburguesas">
        <h2 className="carta-titulo">Hamburguesas</h2>

        <button
          className="btn-carta"
          onClick={() => setMostrarHamburguesas(true)}
        >
          Ver hamburguesas
        </button>

        {error && <p className="mensaje-error">{error}</p>}
        {cargando && mostrarHamburguesas && <p>Cargando hamburguesas...</p>}

        {mostrarHamburguesas && !cargando && (
          <div className="carta-grid">
            {hamburguesas.length === 0 ? (
              <p>No hay hamburguesas disponibles en este momento.</p>
            ) : (
              hamburguesas.map((burger) => (
                <article key={burger.id} className="carta-card">
                  {burger.foto_url && (
                    <img
                      src={`${API_URL}${burger.foto_url}`}
                      alt={burger.nombre}
                      className="carta-card-img"
                      style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '10px' }}
                    />
                  )}
                  <h3>{burger.nombre}</h3>
                  <p>{burger.descripcion || "Jugosa hamburguesa con ingredientes frescos."}</p>
                  <span className="precio">
                    {Number(burger.precio).toFixed(2)} €
                  </span>
                </article>
              ))
            )}
          </div>
        )}
      </section>
    </section>
  );
}

export default Carta;
