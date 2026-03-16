import { useEffect, useState } from "react";
import {
  API_URL,
  obtenerCategorias,
  obtenerPlatos,
  obtenerDetallePlato,
} from "../../servicios/api";

function Carta() {
  const [categorias, setCategorias] = useState([]);
  const [platos, setPlatos] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [platoSeleccionado, setPlatoSeleccionado] = useState(null);
  const [mostrarCarta, setMostrarCarta] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [cargandoDetalle, setCargandoDetalle] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    cargarCategorias();
    cargarPlatos();
  }, []);

  async function cargarCategorias() {
    try {
      const datos = await obtenerCategorias();
      setCategorias(datos);
    } catch (error) {
      setError("No se pudieron cargar las categorías.");
    }
  }

  async function cargarPlatos(idCategoria = "") {
    try {
      setCargando(true);
      setError("");

      const datos = await obtenerPlatos(idCategoria || null);
      setPlatos(datos);
    } catch (error) {
      setError("No se pudieron cargar los platos.");
    } finally {
      setCargando(false);
    }
  }

  async function manejarCambioCategoria(evento) {
    const idCategoria = evento.target.value;
    setCategoriaSeleccionada(idCategoria);
    await cargarPlatos(idCategoria);
  }

  async function abrirDetalle(idPlato) {
    try {
      setCargandoDetalle(true);
      setError("");

      const datos = await obtenerDetallePlato(idPlato);
      setPlatoSeleccionado(datos);
    } catch (error) {
      setError("No se pudo cargar el detalle del plato.");
    } finally {
      setCargandoDetalle(false);
    }
  }

  function cerrarDetalle() {
    setPlatoSeleccionado(null);
  }

  function obtenerRutaImagen(plato) {
    const rutaImagen =
      plato?.imagenUrl || plato?.imagen_url || plato?.foto_url || "";

    if (!rutaImagen) {
      return "";
    }

    return `${API_URL}${rutaImagen}`;
  }

  return (
    <section className="container carta">
      <h1 className="title">Nuestra carta</h1>

      <p className="text">
        Descubre nuestra selección de platos elaborados con ingredientes de
        calidad y pensados para una experiencia única.
      </p>

      {error && <p className="mensaje-error">{error}</p>}

      <div className="carta-filtros" style={{ marginBottom: "20px" }}>
        <label htmlFor="categoria" style={{ marginRight: "10px" }}>
          Filtrar por categoría
        </label>

        <select
          id="categoria"
          value={categoriaSeleccionada}
          onChange={manejarCambioCategoria}
        >
          <option value="">Todas</option>

          {categorias.map((categoria) => (
            <option key={categoria.id} value={categoria.id}>
              {categoria.nombre}
            </option>
          ))}
        </select>
      </div>

      <section className="carta-seccion">
        <h2 className="carta-titulo">Platos</h2>

        <button
          className="btn-carta"
          onClick={() => setMostrarCarta(true)}
          type="button"
        >
          Ver carta
        </button>

        {mostrarCarta && cargando && <p>Cargando platos...</p>}

        {mostrarCarta && !cargando && (
          <div className="carta-grid">
            {platos.length === 0 ? (
              <p>No hay platos disponibles en este momento.</p>
            ) : (
              platos.map((plato) => (
                <article key={plato.id} className="carta-card">
                  {obtenerRutaImagen(plato) && (
                    <img
                      src={obtenerRutaImagen(plato)}
                      alt={plato.nombre}
                      className="carta-card-img"
                      style={{
                        width: "100%",
                        height: "220px",
                        objectFit: "cover",
                        borderRadius: "10px",
                        marginBottom: "12px",
                      }}
                    />
                  )}

                  <h3>{plato.nombre}</h3>

                  <p>
                    {plato.descripcion ||
                      "Plato elaborado con ingredientes frescos y seleccionados."}
                  </p>

                  <p>{plato.categoria?.nombre || "Sin categoría"}</p>

                  <strong>{Number(plato.precio).toFixed(2)} €</strong>

                  <div style={{ marginTop: "12px" }}>
                    <button
                      className="btn-carta"
                      onClick={() => abrirDetalle(plato.id)}
                      type="button"
                    >
                      Ver detalle
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        )}
      </section>

      {cargandoDetalle && <p style={{ marginTop: "20px" }}>Cargando detalle...</p>}

      {platoSeleccionado && (
        <section className="detalle-plato" style={{ marginTop: "30px" }}>
          <h2>{platoSeleccionado.nombre}</h2>

          {obtenerRutaImagen(platoSeleccionado) && (
            <img
              src={obtenerRutaImagen(platoSeleccionado)}
              alt={platoSeleccionado.nombre}
              style={{
                width: "100%",
                maxWidth: "500px",
                height: "300px",
                objectFit: "cover",
                borderRadius: "12px",
                marginBottom: "16px",
              }}
            />
          )}

          <p>{platoSeleccionado.descripcion}</p>
          <p>
            <strong>{Number(platoSeleccionado.precio).toFixed(2)} €</strong>
          </p>
          <p>{platoSeleccionado.categoria?.nombre || "Sin categoría"}</p>

          <h3>Ingredientes</h3>
          <ul>
            {platoSeleccionado.ingredientes &&
            platoSeleccionado.ingredientes.length > 0 ? (
              platoSeleccionado.ingredientes.map((ingrediente) => (
                <li key={ingrediente.id}>{ingrediente.nombre}</li>
              ))
            ) : (
              <li>No disponibles</li>
            )}
          </ul>

          <h3>Alérgenos</h3>
          <ul>
            {platoSeleccionado.alergenos &&
            platoSeleccionado.alergenos.length > 0 ? (
              platoSeleccionado.alergenos.map((alergeno) => (
                <li key={alergeno.id}>{alergeno.nombre}</li>
              ))
            ) : (
              <li>No indicados</li>
            )}
          </ul>

          <button
            className="btn-carta"
            onClick={cerrarDetalle}
            type="button"
            style={{ marginTop: "16px" }}
          >
            Cerrar detalle
          </button>
        </section>
      )}
    </section>
  );
}

export default Carta;


/*
CAMBIOS REALIZADOS EN ESTE ARCHIVO

1. Se conecta la página Carta con la API real del backend.
2. Se sustituye la lógica anterior basada en carga simple de platos por una estructura más completa.
3. Se añaden estados para gestionar:
   - categorías
   - platos
   - categoría seleccionada
   - plato seleccionado
   - visibilidad de la carta
   - carga de datos
   - carga del detalle
   - errores
4. Al cargar el componente:
   - se obtienen las categorías desde /api/categorias
   - se obtienen los platos desde /api/platos
5. Se añade filtro por categoría usando el select y la ruta:
   /api/platos?categoria=ID
6. Se añade la función abrirDetalle(idPlato) para obtener la información completa
   de un plato desde /api/platos/{id}.
7. Se añade la función cerrarDetalle() para limpiar el plato seleccionado.
8. Se crea una función obtenerRutaImagen() para soportar distintos nombres de campo
   de imagen devueltos por el backend:
   - imagenUrl
   - imagen_url
   - foto_url
9. Se muestra:
   - listado de platos
   - categoría de cada plato
   - precio
   - imagen
   - detalle del plato con ingredientes y alérgenos
10. Con este cambio la página Carta ya queda preparada para trabajar con datos reales
    del backend y no solo con información local del frontend.
*/