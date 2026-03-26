import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL, crearPedido } from "../../servicios/api";
import { useCarrito } from "../../context/CarritoContext";

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
        `🎉 Pedido realizado con éxito. Pedido #${respuesta.pedido.id} creado correctamente por un total de ${respuesta.pedido.total} €.`
      );

      vaciarCarrito();

      
    } catch (error) {
      setErrorPedido(error.message || "No se pudo tramitar el pedido.");
    } finally {
      setEnviandoPedido(false);
    }
  }

  return (
    <section
      className="container"
      style={{ paddingTop: "40px", paddingBottom: "40px" }}
    >
      <h1 className="title">Tu pedido</h1>

    {mensajePedido && (
  <div style={{ marginTop: "20px" }}>
    <p
      style={{
        color: "#28a745",
        fontWeight: "bold",
        fontSize: "1.2rem",
        marginBottom: "15px",
      }}
    >
      {mensajePedido}
    </p>

    <button
      className="btn-carta"
      style={{ backgroundColor: "#e77e23" }}
      onClick={() => navigate("/")}
    >
      Volver al inicio
    </button>
  </div>
)}

      {errorPedido && (
        <p
          style={{
            color: "#dc3545",
            marginTop: "20px",
            fontWeight: "bold",
            fontSize: "1.05rem",
          }}
        >
          {errorPedido}
        </p>
      )}

      {carrito.length === 0 ? (
        <div style={{ marginTop: "40px" }}>
          <p className="text">Tu carrito está vacío.</p>

          <Link to="/carta" className="btn-carta" style={{ marginTop: "20px" }}>
            Ir a la carta
          </Link>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "30px", marginTop: "30px" }}>
          <div style={{ display: "grid", gap: "20px" }}>
            {carrito.map((item) => (
              <article
                key={item.id}
                style={{
                  display: "flex",
                  gap: "20px",
                  alignItems: "center",
                  border: "1px solid #333",
                  borderRadius: "12px",
                  padding: "16px",
                  background: "#111",
                }}
              >
                {item.imagen_url && (
                  <img
                    src={obtenerRutaImagen(item.imagen_url)}
                    alt={item.nombre}
                    style={{
                      width: "120px",
                      height: "120px",
                      objectFit: "cover",
                      borderRadius: "10px",
                    }}
                  />
                )}

                <div style={{ flex: 1 }}>
                  <h3>{item.nombre}</h3>
                  <p>{Number(item.precio).toFixed(2)} €</p>
                  <p>Subtotal: {(item.precio * item.cantidad).toFixed(2)} €</p>
                  <p>Cantidad: {item.cantidad}</p>
                </div>

                <div
                  style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}
                >
                  <button
                    onClick={() => disminuirCantidad(item.id)}
                    className="btn-carta"
                    type="button"
                  >
                    -
                  </button>

                  <button
                    onClick={() => aumentarCantidad(item.id)}
                    className="btn-carta"
                    type="button"
                  >
                    +
                  </button>

                  <button
                    onClick={() => eliminarDelCarrito(item.id)}
                    className="btn-carta"
                    type="button"
                    style={{ backgroundColor: "#b02a37" }}
                  >
                    Eliminar
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div
            style={{
              border: "1px solid #333",
              borderRadius: "12px",
              padding: "20px",
              background: "#0d0d0d",
              display: "flex",
              flexDirection: "column",
              gap: "15px",
            }}
          >
            <h2>Resumen del pedido</h2>

            <p>Total unidades: {totalProductos}</p>
            <p>Productos distintos: {carrito.length}</p>

            <h2 style={{ color: "#e77e23" }}>
              Total: {totalPrecio.toFixed(2)} €
            </h2>

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <Link to="/carta" className="btn-carta">
                Seguir comprando
              </Link>

              <button
                className="btn-carta"
                style={{ backgroundColor: "#28a745" }}
                onClick={tramitarPedido}
                disabled={enviandoPedido}
                type="button"
              >
                {enviandoPedido ? "Tramitando..." : "Tramitar pedido"}
              </button>

              <button
                className="btn-carta"
                onClick={vaciarCarrito}
                style={{ backgroundColor: "#6c757d" }}
                type="button"
              >
                Vaciar carrito
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Carrito;