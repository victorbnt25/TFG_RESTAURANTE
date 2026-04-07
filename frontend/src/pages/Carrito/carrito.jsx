import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL, crearPedido } from "../../servicios/api";
import { useCarrito } from "../../context/CarritoContext";
import "./carrito.css"; // Nuevos estilos premium

function Carrito() {
  const navigate = useNavigate();

  const {
    carrito,
    aumentarCantidad,
    disminuirCantidad,
    eliminarDelCarrito,
    vaciarCarrito,
    totalPrecio,
    totalProductos,
  } = useCarrito();

  const [enviandoPedido, setEnviandoPedido] = useState(false);
  const [mensajePedido, setMensajePedido] = useState("");
  const [errorPedido, setErrorPedido] = useState("");

  function obtenerRutaImagen(imagen) {
    if (!imagen) return "";
    return `${API_URL}${imagen}`;
  }

  async function tramitarPedido() {
    try {
      setEnviandoPedido(true);
      setMensajePedido("");
      setErrorPedido("");

      const productos = carrito.map((item) => ({
        id: item.id,
        cantidad: item.cantidad,
      }));

      const respuesta = await crearPedido({ productos });

      setMensajePedido(
        `🎉 Pedido #${respuesta.pedido.id} tramitado correctamente por un total de ${respuesta.pedido.total} €.`
      );

      vaciarCarrito();
    } catch (error) {
      setErrorPedido(error.message || "No se pudo tramitar el pedido.");
    } finally {
      setEnviandoPedido(false);
    }
  }

  return (
    <section className="container carrito-page">
      <h1 className="title" style={{ color: "#fff", marginBottom: "10px" }}>TU PEDIDO</h1>

      {mensajePedido && (
        <div style={{ marginTop: "20px", marginBottom: "30px", background: "rgba(40,167,69,0.1)", padding: "20px", borderRadius: "12px", border: "1px solid #28a745" }}>
          <p style={{ color: "#28a745", fontWeight: "bold", fontSize: "1.2rem", marginBottom: "15px" }}>
            {mensajePedido}
          </p>
          <button className="btn-tramitar" onClick={() => navigate("/")} style={{ width: "auto", padding: "10px 20px" }}>
            Volver al inicio
          </button>
        </div>
      )}

      {errorPedido && (
        <p style={{ color: "#ff4d4d", padding: "15px", background: "rgba(220,53,69,0.1)", borderRadius: "8px", border: "1px solid #ff4d4d" }}>
          {errorPedido}
        </p>
      )}

      {carrito.length === 0 && !mensajePedido ? (
        <div className="carrito-vacio">
          <p>Aún no has añadido ningún plato delicioso a tu pedido.</p>
          <Link to="/carta" className="btn-tramitar" style={{ display: "inline-block", width: "auto", padding: "12px 30px" }}>
            Ver la carta
          </Link>
        </div>
      ) : (
        carrito.length > 0 && (
          <div className="carrito-layout">
            
            {/* IZQUIERDA: LISTA DE PRODUCTOS */}
            <div className="carrito-items">
              {carrito.map((item) => (
                <article key={item.id} className="carrito-item">
                  
                  {item.imagen_url || item.imagenUrl || item.foto_url ? (
                    <img 
                      src={obtenerRutaImagen(item.imagen_url || item.imagenUrl || item.foto_url)} 
                      alt={item.nombre} 
                      className="carrito-img" 
                    />
                  ) : (
                    <div className="carrito-img-placeholder" />
                  )}

                  <div className="carrito-detalles">
                    <h3>{item.nombre}</h3>
                    <p className="carrito-precio-uni">{Number(item.precio).toFixed(2)} € / ud.</p>
                    <p className="carrito-subtotal">Subtotal: {(item.precio * item.cantidad).toFixed(2)} €</p>
                    
                    <div className="carrito-controles">
                      <div className="control-cantidad">
                        <button className="btn-qty" onClick={() => disminuirCantidad(item.id)}>-</button>
                        <span className="label-qty">{item.cantidad}</span>
                        <button className="btn-qty" onClick={() => aumentarCantidad(item.id)}>+</button>
                      </div>
                      
                      <button className="btn-remove" onClick={() => eliminarDelCarrito(item.id)}>
                        Eliminar
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* DERECHA: RESUMEN LATERAL (STICKY) */}
            <div className="carrito-sidebar-wrapper">
              <aside className="carrito-resumen">
                <h2>Resumen del pago</h2>
                
                <div className="resumen-linea">
                  <span>Productos ({totalProductos})</span>
                  <span>{totalPrecio.toFixed(2)} €</span>
                </div>
                
                <div className="resumen-linea">
                  <span>Gastos de gestión</span>
                  <span style={{color: "#28a745"}}>Gratis</span>
                </div>

                <div className="resumen-total">
                  <span>Total</span>
                  <span>{totalPrecio.toFixed(2)} €</span>
                </div>

                <div className="carrito-botones">
                  <button 
                    className="btn-tramitar" 
                    onClick={tramitarPedido} 
                    disabled={enviandoPedido}
                  >
                    {enviandoPedido ? "Tramitando..." : "Finalizar Pedido"}
                  </button>

                  <Link to="/carta" className="btn-seguir">
                    Añadir más cosas
                  </Link>
                  
                  <button className="btn-vaciar" onClick={vaciarCarrito}>
                    Vaciar todo mi carrito
                  </button>
                </div>
              </aside>
            </div>

          </div>
        )
      )}
    </section>
  );
}

export default Carrito;