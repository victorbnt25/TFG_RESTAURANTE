import Cabecera from "./componentes/Cabecera/cabecera.jsx";
import Footer from "./componentes/Footer/footer.jsx";
import Hero from "./componentes/Hero/hero.jsx";
import "./App.css";

function App() {
  return (
    <div className="layout">
      <Cabecera />

      <main className="contenido">
       <Hero />
      </main>

      <Footer />
    </div>
  );
}

export default App;
