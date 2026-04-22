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
          nombre: plato.nombre || plato.plato,
          precio: Number(plato.precio),
          imagen_url:
            plato.imagen_url || plato.imagenUrl || plato.foto_url || "",
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

  function reemplazarCarrito(productos) {
    const productosFormateados = productos.map((producto) => ({
      id: producto.id,
      nombre: producto.nombre || producto.plato,
      precio: Number(producto.precio),
      imagen_url:
        producto.imagen_url || producto.imagenUrl || producto.foto_url || "",
      cantidad: Number(producto.cantidad),
    }));

    setCarrito(productosFormateados);
  }

  function anadirLoteAlCarrito(productos) {
    setCarrito((carritoAnterior) => {
      const nuevoCarrito = [...carritoAnterior];

      productos.forEach((producto) => {
        const indiceExistente = nuevoCarrito.findIndex(
          (item) => item.id === producto.id
        );

        if (indiceExistente !== -1) {
          nuevoCarrito[indiceExistente] = {
            ...nuevoCarrito[indiceExistente],
            cantidad:
              nuevoCarrito[indiceExistente].cantidad + Number(producto.cantidad),
          };
        } else {
          nuevoCarrito.push({
            id: producto.id,
            nombre: producto.nombre || producto.plato,
            precio: Number(producto.precio),
            imagen_url:
              producto.imagen_url ||
              producto.imagenUrl ||
              producto.foto_url ||
              "",
            cantidad: Number(producto.cantidad),
          });
        }
      });

      return nuevoCarrito;
    });
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
        reemplazarCarrito,
        anadirLoteAlCarrito,
        totalProductos,
        totalPrecio,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
}