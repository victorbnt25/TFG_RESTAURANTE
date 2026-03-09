import { useEffect, useState } from "react";
import { listarMesas, crearMesa, eliminarMesa, actualizarMesa } from "../../servicios/adminApi";
import "./admin.css";

export default function AdminMesas() {
  const [mesas, setMesas] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  
  // Estados para edición
  const [mesaEditando, setMesaEditando] = useState(null);
  const [formData, setFormData] = useState({ codigo: "", capacidad: "", zona: "SALA" });

  useEffect(() => { 
    fetchMesas(); 
  }, []);

  const fetchMesas = async () => {
    try {
      const data = await listarMesas();
      setMesas(data);
    } catch (e) { setError(e.message); }
  };

  const getNextMesaCode = () => {
    const codes = mesas
      .map(m => m.codigo)
      .filter(c => c.startsWith("M-"))
      .map(c => parseInt(c.split("-")[1]))
      .filter(n => !isNaN(n));
    
    const maxNum = codes.length > 0 ? Math.max(...codes) : 0;
    return `M-${maxNum + 1}`;
  };

  // Al cambiar campos del formulario
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Cargar mesa en el formulario para editar
  const prepararEdicion = (mesa) => {
    setMesaEditando(mesa);
    setFormData({
      codigo: mesa.codigo,
      capacidad: mesa.capacidad,
      zona: mesa.zona
    });
    setMensaje("");
    setError("");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelarEdicion = () => {
    setMesaEditando(null);
    setFormData({ codigo: "", capacidad: "", zona: "SALA" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setMensaje("");
    setError("");

    try {
      if (mesaEditando) {
        // ACTUALIZAR
        await actualizarMesa(mesaEditando.id, formData);
        setMensaje("✅ Mesa actualizada correctamente");
        setMesaEditando(null);
      } else {
        // CREAR
        const body = {
          codigo: e.target.codigo.value || getNextMesaCode(),
          capacidad: formData.capacidad,
          zona: formData.zona,
        };
        await crearMesa(body);
        setMensaje("✅ Mesa añadida correctamente");
      }
      
      setFormData({ codigo: "", capacidad: "", zona: "SALA" });
      e.target.reset();
      await fetchMesas();
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
            {mesaEditando ? `Editando Mesa: ${mesaEditando.codigo}` : "Gestión de Mesas"}
        </h2>

        {mensaje && <p className="mensaje-exito">{mensaje}</p>}
        {error && <p className="mensaje-error">{error}</p>}

        {/* Formulario dual: Crea o Edita */}
        <form onSubmit={handleSubmit} className="platos-form-horizontal">
          <div className="form-group">
            <label style={{color: '#888', fontSize: '0.8rem', display: 'block', marginBottom: '5px'}}>Código</label>
            <input 
              name="codigo" 
              placeholder="Código (ej: T-01)" 
              value={formData.codigo || (mesaEditando ? "" : getNextMesaCode())}
              onChange={handleChange}
              required 
            />
          </div>
          <div className="form-group">
            <label style={{color: '#888', fontSize: '0.8rem', display: 'block', marginBottom: '5px'}}>Capacidad</label>
            <input 
                name="capacidad" 
                type="number" 
                placeholder="Capacidad" 
                value={formData.capacidad}
                onChange={handleChange}
                required 
            />
          </div>
          <div className="form-group">
            <label style={{color: '#888', fontSize: '0.8rem', display: 'block', marginBottom: '5px'}}>Zona</label>
            <select name="zona" value={formData.zona} onChange={handleChange}>
              <option value="SALA">Sala</option>
              <option value="TERRAZA">Terraza</option>
              <option value="BARRA">Barra</option>
              <option value="PRIVADO">Privado</option>
            </select>
          </div>
          
          <div style={{display: 'flex', gap: '10px'}}>
              <button type="submit" disabled={cargando} className="btn-add">
                {cargando ? "PROCESANDO..." : (mesaEditando ? "GUARDAR" : "+ AÑADIR")}
              </button>
              {mesaEditando && (
                  <button type="button" onClick={cancelarEdicion} className="btn-delete-link" style={{border: '1px solid #444'}}>
                      CANCELAR
                  </button>
              )}
          </div>
        </form>

        <div className="tabla-header">
          <h3 className="admin-subtitle">Lista de Mesas</h3>
        </div>

        <div className="contenedor-tabla">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Capacidad</th>
                <th>Zona</th>
                <th>Estado</th>
                <th>Activo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {mesas.map((m) => (
                <tr key={m.id} style={{background: mesaEditando?.id === m.id ? 'rgba(184, 134, 11, 0.1)' : ''}}>
                  <td><strong>{m.codigo}</strong></td>
                  <td>{m.capacidad} pers.</td>
                  <td><span className={`badge ${m.zona.toLowerCase()}`}>{m.zona}</span></td>
                  <td>{m.estado}</td>
                  <td>{m.activo ? "✅" : "❌"}</td>
                  <td style={{display: 'flex', gap: '8px'}}>
                    <button onClick={() => prepararEdicion(m)} className="btn-edit-table" style={{fontSize: '0.8rem'}}>Editar</button>
                    <button onClick={async () => {
                      if (!window.confirm(`¿Estás seguro de eliminar la mesa "${m.codigo}"?`)) return;
                      setCargando(true);
                      try {
                        await eliminarMesa(m.id);
                        await fetchMesas();
                        setMensaje("✅ Mesa eliminada");
                        if(mesaEditando?.id === m.id) cancelarEdicion();
                      } catch (e) { setError(e.message); } finally { setCargando(false); }
                    }} className="btn-delete-link">Borrar</button>
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
