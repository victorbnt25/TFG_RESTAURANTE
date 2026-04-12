import { createContext, useContext, useEffect, useState } from "react";
import { 
  obtenerCategorias, 
  obtenerPlatos, 
  obtenerMesas, 
  obtenerPolitica,
  API_URL 
} from "../servicios/api";

const DataContext = createContext();

export function useData() {
  return useContext(DataContext);
}

export function DataProvider({ children }) {
  const [platos, setPlatos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [mesas, setMesas] = useState([]);
  const [politica, setPolitica] = useState("");
  const [cargandoTodo, setCargandoTodo] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    inicializarApp();
  }, []);

  async function inicializarApp() {
    try {
      setCargandoTodo(true);
      
      // 1. Cargamos todos los datos en paralelo para ahorrar tiempo
      const [datosPlatos, datosCategorias, datosMesas, datosPolitica] = await Promise.all([
        obtenerPlatos(),
        obtenerCategorias(),
        obtenerMesas(),
        obtenerPolitica()
      ]);

      setPlatos(datosPlatos);
      setCategorias(datosCategorias);
      setMesas(datosMesas);
      setPolitica(datosPolitica.politica);

      // 2. Precargamos las imágenes en segundo plano para que no haya parpadeos
      await precargarImagenes(datosPlatos);

      // Pequeño retardo artificial para que el splash screen no parpadee si la red es ultra rápida
      setTimeout(() => {
        setCargandoTodo(false);
      }, 500);

    } catch (err) {
      console.error("Error inicializando la aplicación:", err);
      setError("No se pudo conectar con el restaurante. Por favor, reintenta.");
      setCargandoTodo(false);
    }
  }

  async function precargarImagenes(listaPlatos) {
    const promesas = listaPlatos
      .filter(p => p.imagen_url || p.imagenUrl)
      .map(p => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = `${API_URL}${p.imagen_url || p.imagenUrl}`;
          img.onload = resolve;
          img.onerror = resolve; // Continuamos aunque una imagen falle
        });
      });
    
    // Esperamos a que las imágenes más importantes carguen
    return Promise.all(promesas);
  }

  // Función para refrescar datos manualmente (ej. tras una edición en admin)
  async function refrescarDatos() {
    const [datosPlatos, datosCategorias, datosMesas] = await Promise.all([
      obtenerPlatos(),
      obtenerCategorias(),
      obtenerMesas()
    ]);
    setPlatos(datosPlatos);
    setCategorias(datosCategorias);
    setMesas(datosMesas);
  }

  return (
    <DataContext.Provider
      value={{
        platos,
        categorias,
        mesas,
        politica,
        cargandoTodo,
        error,
        refrescarDatos
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
