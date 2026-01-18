import Cabecera from "./componentes/Cabecera/cabecera.jsx";
import Footer from "./componentes/Footer/footer.jsx";
import "./App.css";

function App() {
  return (
    <div className="layout">
      <Cabecera />

      <main className="contenido">
        {/* aquí van tus páginas */}
      </main>

      <Footer />
    </div>
  );
}

export default App;
