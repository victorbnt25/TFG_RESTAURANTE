function Carta() {
  return (
    <section className="container carta">
      <h1 className="title">Nuestra carta</h1>
      <p className="text">
        Descubre nuestra selección de platos elaborados con ingredientes de
        primera calidad.
      </p>

      {/* Hamburguesas */}
      <section className="carta-seccion" id="hamburguesas">
        <h2 className="carta-titulo">Hamburguesas</h2>
        {/* Productos cargados desde BD */}
      </section>

      {/* Entrantes */}
      <section className="carta-seccion" id="entrantes">
        <h2 className="carta-titulo">Entrantes</h2>
        {/* Productos cargados desde BD */}
      </section>

      {/* Acompañamientos */}
      <section className="carta-seccion" id="acompanamientos">
        <h2 className="carta-titulo">Acompañamientos</h2>
        {/* Productos cargados desde BD */}
      </section>

      {/* Postres */}
      <section className="carta-seccion" id="postres">
        <h2 className="carta-titulo">Postres</h2>
        {/* Productos cargados desde BD */}
      </section>

      {/* Bebidas */}
      <section className="carta-seccion" id="bebidas">
        <h2 className="carta-titulo">Bebidas</h2>
        {/* Productos cargados desde BD */}
      </section>
    </section>
  );
}

export default Carta;