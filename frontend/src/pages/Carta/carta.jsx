import { useState } from "react";
import hamburguesasData from "../../data/hamburguesas.js";

function Carta() {
  const [mostrarHamburguesas, setMostrarHamburguesas] = useState(false);

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

        {mostrarHamburguesas && (
          <div className="carta-grid">
            {hamburguesasData.map((burger) => (
              <article key={burger.id} className="carta-card">
                <h3>{burger.nombre}</h3>
                <p>{burger.ingredientes}</p>
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

export default Carta;
