import { createContext, useContext, useEffect, useState } from "react";

const CarritoContext = createContext();

export function useCarrito() {
  return useContext(CarritoContext);
}

export function CarritoProvider({ children }) {
  const [carrito, setCarrito] = useState(() => {
    const carritoGuardado = localStorage.getItem("carrito");
    return carritoGuardado ? JSON.parse(carritoGuardado) : [];
  });

  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }, [carrito]);

  function agregarAlCarrito(plato) {
    setCarrito((carritoAnterior) => {
      const productoExistente = carritoAnterior.find(
        (item) => item.id === plato.id
      );

      if (productoExistente) {
        return carritoAnterior.map((item) =>
          item.id === plato.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }

      return [
        ...carritoAnterior,
        {
          id: plato.id,
          nombre: plato.nombre,
          precio: Number(plato.precio),
          imagen_url: plato.imagen_url || plato.imagenUrl || plato.foto_url || "",
          cantidad: 1,
        },
      ];
    });
  }

  function aumentarCantidad(id) {
    setCarrito((carritoAnterior) =>
      carritoAnterior.map((item) =>
        item.id === id ? { ...item, cantidad: item.cantidad + 1 } : item
      )
    );
  }

  function disminuirCantidad(id) {
    setCarrito((carritoAnterior) =>
      carritoAnterior
        .map((item) =>
          item.id === id ? { ...item, cantidad: item.cantidad - 1 } : item
        )
        .filter((item) => item.cantidad > 0)
    );
  }

  function eliminarDelCarrito(id) {
    setCarrito((carritoAnterior) =>
      carritoAnterior.filter((item) => item.id !== id)
    );
  }

  function vaciarCarrito() {
    setCarrito([]);
  }

  const totalProductos = carrito.reduce(
    (acumulador, item) => acumulador + item.cantidad,
    0
  );

  const totalPrecio = carrito.reduce(
    (acumulador, item) => acumulador + item.precio * item.cantidad,
    0
  );

  return (
    <CarritoContext.Provider
      value={{
        carrito,
        agregarAlCarrito,
        aumentarCantidad,
        disminuirCantidad,
        eliminarDelCarrito,
        vaciarCarrito,
        totalProductos,
        totalPrecio,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
}