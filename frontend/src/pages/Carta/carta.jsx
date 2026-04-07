import { useEffect, useState } from "react";
import {
  API_URL,
  obtenerCategorias,
  obtenerPlatos,
  obtenerDetallePlato,
} from "../../servicios/api";
import { useCarrito } from "../../context/CarritoContext";
import "./carta.css"; // Importamos los nuevos estilos premium
import { Link } from "react-router-dom";

function Carta() {
  const { 
    carrito, 
    agregarAlCarrito, 
    aumentarCantidad, 
    disminuirCantidad, 
    totalProductos, 
    totalPrecio 
  } = useCarrito();

  const [categorias, setCategorias] = useState([]);
  const [platos, setPlatos] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [platoSeleccionado, setPlatoSeleccionado] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [cargandoDetalle, setCargandoDetalle] = useState(false);
  const [error, setError] = useState("");
  const [miniCarritoAbierto, setMiniCarritoAbierto] = useState(false);

  useEffect(() => {
    cargarCategorias();
    // Carga inicial automatica sin filtro
    cargarPlatos("");
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

  async function manejarCambioCategoria(idCategoria) {
    setCategoriaSeleccionada(idCategoria);
    await cargarPlatos(idCategoria);
  }

  async function abrirDetalle(idPlato) {
    try {
      setCargandoDetalle(true);
      setError("");

      const datos = await obtenerDetallePlato(idPlato);
      setPlatoSeleccionado(datos);
      // Hacemos scroll al detalle suavemente
      window.scrollTo({ top: 0, behavior: "smooth" });
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

    if (!rutaImagen) return "";

    return `${API_URL}${rutaImagen}`;
  }

  // Vista de detalle si hay un plato seleccionado
  if (platoSeleccionado) {
    return (
      <section className="container carta">
        <section className="detalle-plato">
          <h2 className="detalle-title">{platoSeleccionado.nombre}</h2>

          {obtenerRutaImagen(platoSeleccionado) && (
            <img
              src={obtenerRutaImagen(platoSeleccionado)}
              alt={platoSeleccionado.nombre}
              className="detalle-img"
            />
          )}

          <p className="detalle-desc">{platoSeleccionado.descripcion}</p>
          <div className="detalle-price">{Number(platoSeleccionado.precio).toFixed(2)} €</div>

          <div className="detalle-lista">
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
          </div>

          <div className="detalle-lista">
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
          </div>

          <button
            className="btn-add"
            style={{ padding: "15px", width: "100%", marginTop: "15px", fontSize: "1.1rem" }}
            onClick={() => {
              agregarAlCarrito(platoSeleccionado);
              cerrarDetalle(); // Opcional: Cerrar al añadir
            }}
          >
            Añadir al carrito
          </button>

          <button
            className="btn-close"
            onClick={cerrarDetalle}
          >
            Volver a la carta
          </button>
        </section>
      </section>
    );
  }

  return (
    <section className="container carta">
      <h1 className="title">NUESTRA CARTA</h1>
      <p className="text">
        Descubre nuestra selección de platos elaborados con ingredientes de
        calidad y pensados para una experiencia única.
      </p>

      {error && <p className="mensaje-error">{error}</p>}

      {/* PILLS CATEGORÍAS */}
      <div className="carta-filtros">
        <button
          className={`pill-categoria ${categoriaSeleccionada === "" ? "activa" : ""}`}
          onClick={() => manejarCambioCategoria("")}
        >
          Todas
        </button>

        {categorias.map((categoria) => (
          <button
            key={categoria.id}
            className={`pill-categoria ${categoriaSeleccionada == categoria.id ? "activa" : ""}`}
            onClick={() => manejarCambioCategoria(categoria.id.toString())}
          >
            {categoria.nombre}
          </button>
        ))}
      </div>

      {cargandoDetalle && <p style={{textAlign:"center", margin:"20px"}}>Cargando detalle...</p>}

      {/* GRID DE PLATOS AUTOMÁTICO */}
      <section className="carta-seccion">
        {cargando ? (
          <p style={{textAlign:"center", color:"#aaa"}}>Cargando deliciosos platos...</p>
        ) : (
          <div className="carta-grid">
            {platos.length === 0 ? (
              <p style={{textAlign:"center", gridColumn:"1/-1"}}>No hay platos disponibles en este momento.</p>
            ) : (
              platos.map((plato) => (
                <article key={plato.id} className="carta-card">
                  <div className="img-container">
                    {obtenerRutaImagen(plato) ? (
                      <img
                        src={obtenerRutaImagen(plato)}
                        alt={plato.nombre}
                        className="carta-card-img"
                      />
                    ) : (
                      <div className="carta-card-img" style={{backgroundColor:"#333"}} />
                    )}
                  </div>

                  <div className="card-content">
                    <h3 className="card-title">{plato.nombre}</h3>
                    <p className="card-desc">
                      {plato.descripcion ||
                        "Plato elaborado con ingredientes frescos y seleccionados."}
                    </p>
                    <div className="card-price">{Number(plato.precio).toFixed(2)} €</div>

                    <div className="card-actions">
                      <button
                        className="btn-detalle"
                        onClick={() => abrirDetalle(plato.id)}
                      >
                        Saber más
                      </button>

                      <button
                        className="btn-add"
                        onClick={() => agregarAlCarrito(plato)}
                      >
                        Añadir
                      </button>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        )}
      </section>

      {/* BARRA FLOTANTE VER CARRITO */}
      {totalProductos > 0 && (
        <div className="barra-flotante-carrito">
          <div 
            className="resumen-flotante" 
            onClick={() => setMiniCarritoAbierto(!miniCarritoAbierto)}
            style={{ cursor: "pointer", display: "flex", gap: "10px", alignItems: "center" }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span>{totalProductos} {totalProductos === 1 ? "artículo" : "artículos"} ⏶</span>
              <span style={{ fontWeight: "bold" }}>{totalPrecio.toFixed(2)} €</span>
            </div>
          </div>

          <Link to="/carrito" className="btn-ir-carrito">
            Ir al carrito →
          </Link>

          {/* POPUP MINI CARRITO */}
          {miniCarritoAbierto && (
            <div className="mini-carrito-popup">
              <div className="mini-carrito-header">
                <h3>Tu Pedido</h3>
                <button 
                  className="btn-cerrar-mini" 
                  onClick={() => setMiniCarritoAbierto(false)}
                >
                  ✕
                </button>
              </div>
              
              <div className="mini-carrito-items">
                {carrito.map((item) => (
                  <div key={item.id} className="mini-item">
                    <div className="mini-item-info">
                      <span className="mini-item-nombre">{item.nombre}</span>
                      <span className="mini-item-precio">{(item.precio * item.cantidad).toFixed(2)} €</span>
                    </div>
                    
                    <div className="mini-item-controles">
                      <button onClick={() => disminuirCantidad(item.id)}>-</button>
                      <span>{item.cantidad}</span>
                      <button onClick={() => aumentarCantidad(item.id)}>+</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

    </section>
  );
}

export default Carta;