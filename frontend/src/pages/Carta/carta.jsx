// Importamos el hook useState desde React para manejar estado
import { useState } from "react";

// Importamos los datos de hamburguesas (simulan la base de datos)
import hamburguesasData from "../../data/hamburguesas.js";

// Definimos el componente Carta
function Carta() {

  // Estado que controla si se muestran o no las hamburguesas
  // false → las hamburguesas están ocultas
  // true  → las hamburguesas se muestran
  const [mostrarHamburguesas, setMostrarHamburguesas] = useState(false);

  // El return define lo que se renderiza en pantalla
  return (
    // Contenedor principal de la página Carta
    <section className="container carta">

      {/* Título principal de la página */}
      <h1 className="title">Nuestra carta</h1>

      {/* Texto descriptivo introductorio */}
      <p className="text">
        Descubre nuestra selección de platos elaborados con ingredientes de
        primera calidad.
      </p>

      {/* Sección específica de hamburguesas */}
      <section className="carta-seccion" id="hamburguesas">

        {/* Título de la sección de hamburguesas */}
        <h2 className="carta-titulo">Hamburguesas</h2>

        {/* 
          Botón que cambia el estado mostrarHamburguesas a true
          Al pulsarlo, React vuelve a renderizar el componente
          y se muestran las hamburguesas
        */}
        <button
          className="btn-carta"
          onClick={() => setMostrarHamburguesas(true)}
        >
          Ver hamburguesas
        </button>

        {/*
          Renderizado condicional:
          - Si mostrarHamburguesas es true → se muestra la lista
          - Si es false → no se muestra nada
        */}
        {mostrarHamburguesas && (

          // Contenedor en forma de grid para las tarjetas
          <div className="carta-grid">

            {/*
              Recorremos el array de hamburguesas con map()
              Por cada hamburguesa se genera una tarjeta
            */}
            {hamburguesasData.map((burger) => (

              // Tarjeta individual de cada hamburguesa
              // La key es obligatoria para listas en React
              <article key={burger.id} className="carta-card">

                {/* Nombre de la hamburguesa */}
                <h3>{burger.nombre}</h3>

                {/* Lista de ingredientes */}
                <p>{burger.ingredientes}</p>

                {/* Precio formateado con dos decimales */}
                <span className="precio">
                  {burger.precio.toFixed(2)} €
                </span>

              </article>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}

// Exportamos el componente para poder usarlo en App.jsx
export default Carta;
