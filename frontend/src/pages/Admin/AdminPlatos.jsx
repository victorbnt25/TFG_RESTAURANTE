import { useEffect, useState } from "react";
import { listarPlatos, crearPlato, eliminarPlato, actualizarPlato, subirFotoPlato } from "../../servicios/adminApi";
import { API_URL } from "../../servicios/api";
import "./admin.css";

export default function AdminPlatos() {
  const [platos, setPlatos] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [filtro, setFiltro] = useState("TODOS");

  // Estados para edición
  const [platoEditando, setPlatoEditando] = useState(null);
  const [archivo, setArchivo] = useState(null);
  const [formData, setFormData] = useState({ nombre: "", precio: "", descripcion: "", tipo: "PRINCIPAL" });

  useEffect(() => { 
    fetchPlatos(); 
  }, []);

  const fetchPlatos = async () => {
    try {
      const data = await listarPlatos();
      setPlatos(data);
    } catch (e) { setError(e.message); }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const prepararEdicion = (plato) => {
    setPlatoEditando(plato);
    setFormData({
      nombre: plato.nombre,
      precio: plato.precio,
      descripcion: plato.descripcion || "",
      tipo: plato.tipo
    });
    setArchivo(null);
    setMensaje("");
    setError("");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelarEdicion = () => {
    setPlatoEditando(null);
    setArchivo(null);
    setFormData({ nombre: "", precio: "", descripcion: "", tipo: "PRINCIPAL" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setMensaje("");
    setError("");

    try {
      if (platoEditando) {
        // ACTUALIZAR
        await actualizarPlato(platoEditando.id, formData);
        if (archivo) {
          await subirFotoPlato(platoEditando.id, archivo);
        }
        setMensaje("✅ Producto actualizado correctamente");
        setPlatoEditando(null);
      } else {
        // CREAR
        const resp = await crearPlato(formData);
        if (archivo && resp.id) {
          await subirFotoPlato(resp.id, archivo);
        }
        setMensaje("✅ Plato añadido correctamente");
      }
      
      setFormData({ nombre: "", precio: "", descripcion: "", tipo: "PRINCIPAL" });
      setArchivo(null);
      e.target.reset();
      await fetchPlatos();
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="platos-container">
      <section className="platos-main full-width">
        <h2 className="admin-title-graffiti">
            {platoEditando ? `Editando: ${platoEditando.nombre}` : "Gestión de Carta"}
        </h2>

        {mensaje && <p className="mensaje-exito">{mensaje}</p>}
        {error && <p className="mensaje-error">{error}</p>}

        <form onSubmit={handleSubmit} className="platos-form-horizontal" style={{ flexWrap: 'wrap' }}>
          <div className="form-group" style={{ minWidth: '200px' }}>
            <label style={{color: '#888', fontSize: '0.8rem'}}>Nombre</label>
            <input name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Nombre del producto" required />
          </div>
          <div className="form-group" style={{ minWidth: '100px' }}>
            <label style={{color: '#888', fontSize: '0.8rem'}}>Precio (€)</label>
            <input name="precio" type="number" step="0.01" value={formData.precio} onChange={handleChange} placeholder="Precio" required />
          </div>
          <div className="form-group" style={{ minWidth: '150px' }}>
            <label style={{color: '#888', fontSize: '0.8rem'}}>Categoría</label>
            <select name="tipo" value={formData.tipo} onChange={handleChange}>
              <option value="PRINCIPAL">Hamburguesa</option>
              <option value="ENTRANTE">Entrante</option>
              <option value="POSTRE">Postre</option>
              <option value="BEBIDA">Bebida</option>
              <option value="GUARNICION">Guarnición</option>
            </select>
          </div>
          
          <div className="form-group" style={{ minWidth: '100%', marginTop: '10px' }}>
            <label style={{color: '#888', fontSize: '0.8rem'}}>Descripción</label>
            <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} rows="2" placeholder="Breve descripción..."></textarea>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '10px', alignItems: 'flex-end' }}>
             <div className="form-group">
                <label htmlFor="file-plato" className="custom-file-upload" style={{ padding: '8px', fontSize: '0.7rem' }}>
                  {archivo ? "✅ IMAGEN SELECCIONADA" : "📸 SUBIR FOTO"}
                </label>
                <input id="file-plato" type="file" className="input-file-hidden" onChange={(e) => setArchivo(e.target.files[0])} />
             </div>
             
             <button type="submit" disabled={cargando} className="btn-add">
               {cargando ? "PROCESANDO..." : (platoEditando ? "GUARDAR" : "+ AÑADIR")}
             </button>
             
             {platoEditando && (
               <button type="button" onClick={cancelarEdicion} className="btn-delete-link" style={{ textDecoration: 'none', border: '1px solid #444' }}>
                 CANCELAR
               </button>
             )}
          </div>
        </form>

        <div className="tabla-header">
          <h3 className="admin-subtitle">Lista de Productos</h3>
          <div className="filtros-container">
             <span>Filtrar por:</span>
             <select value={filtro} onChange={(e) => setFiltro(e.target.value)} className="select-filtro">
              <option value="TODOS">Todos</option>
              <option value="PRINCIPAL">Hamburguesas</option>
              <option value="ENTRANTE">Entrantes</option>
              <option value="POSTRE">Postres</option>
              <option value="BEBIDA">Bebidas</option>
              <option value="GUARNICION">Guarniciones</option>
            </select>
          </div>
        </div>

        <div className="contenedor-tabla">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Vista</th>
                <th>Nombre</th>
                <th>Tipo</th>
                <th>Precio</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {platos.filter(p => filtro === "TODOS" || p.tipo === filtro).map((p) => (
                <tr key={p.id} style={{background: platoEditando?.id === p.id ? 'rgba(184, 134, 11, 0.1)' : ''}}>
                  <td>{p.foto_url ? <img className="img-mini" src={`${API_URL}${p.foto_url}`} width="50" height="50" alt="" /> : <div className="no-img-mini">?</div>}</td>
                  <td><strong>{p.nombre}</strong></td>
                  <td><span className={`badge ${p.tipo.toLowerCase()}`}>{p.tipo}</span></td>
                  <td>{p.precio}€</td>
                  <td style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => prepararEdicion(p)} className="btn-edit-table" style={{ fontSize: '0.8rem' }}>Editar</button>
                    <button onClick={async () => {
                      if (!window.confirm(`¿Estás seguro de eliminar "${p.nombre}"?`)) return;
                      setCargando(true);
                      try {
                        await eliminarPlato(p.id);
                        await fetchPlatos();
                        setMensaje("✅ Producto eliminado");
                        if(platoEditando?.id === p.id) cancelarEdicion();
                      } catch (e) { setError(e.message); } finally { setCargando(false); }
                    }} className="btn-delete-link" style={{ textDecoration: 'none' }}>Borrar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}