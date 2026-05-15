import { useEffect, useMemo, useRef, useState } from "react";
import { listarPedidos, cambiarEstadoPedido, eliminarPedido } from "../../servicios/adminApi";
import { Bell, CheckCircle, Calendar, ChevronLeft, ChevronRight, X } from "lucide-react";
import "./admin.css";

const ESTADOS = [
  "TODOS",
  "PENDIENTE",
  "PAGADO",
  "ENTREGADO",
  "CANCELADO",
];

const CustomDatePicker = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(value ? new Date(value) : new Date());
  const calendarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const handleSelectDay = (day) => {
    const selected = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    // Ajustar a formato YYYY-MM-DD local
    const yyyy = selected.getFullYear();
    const mm = String(selected.getMonth() + 1).padStart(2, '0');
    const dd = String(selected.getDate()).padStart(2, '0');
    onChange(`${yyyy}-${mm}-${dd}`);
    setIsOpen(false);
  };

  const renderDays = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const totalDays = daysInMonth(year, month);
    const startDay = firstDayOfMonth(year, month); // 0 (Dom) a 6 (Sab)
    
    // Ajustamos para que empiece en Lunes (1) si queremos, pero lo dejamos estándar por ahora
    const days = [];
    // Padding inicial
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day other-month"></div>);
    }
    // Días del mes
    const today = new Date();
    const selectedDate = value ? new Date(value) : null;

    for (let d = 1; d <= totalDays; d++) {
      const isToday = today.getDate() === d && today.getMonth() === month && today.getFullYear() === year;
      const isSelected = selectedDate && selectedDate.getDate() === d && selectedDate.getMonth() === month && selectedDate.getFullYear() === year;
      
      days.push(
        <div 
          key={d} 
          className={`calendar-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
          onClick={() => handleSelectDay(d)}
        >
          {d}
        </div>
      );
    }
    return days;
  };

  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  return (
    <div className="calendar-wrapper" ref={calendarRef}>
      <div 
        className="input-fecha-filtro" 
        onClick={() => setIsOpen(!isOpen)}
        style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '140px' }}
      >
        <Calendar size={16} color="var(--color-primary)" />
        {value ? value : "Seleccionar fecha"}
      </div>
      
      {value && (
        <button className="btn-clear-date" onClick={() => onChange("")}>
          <X size={14} />
        </button>
      )}

      {isOpen && (
        <div className="calendar-popover">
          <div className="calendar-header">
            <button className="calendar-nav-btn" onClick={handlePrevMonth}><ChevronLeft size={16} /></button>
            <div className="calendar-month-name">
              {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
            </div>
            <button className="calendar-nav-btn" onClick={handleNextMonth}><ChevronRight size={16} /></button>
          </div>
          <div className="calendar-grid">
            {["D", "L", "M", "X", "J", "V", "S"].map(d => (
              <div key={d} className="calendar-day-label">{d}</div>
            ))}
            {renderDays()}
          </div>
        </div>
      )}
    </div>
  );
};

export default function AdminPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState("TODOS");
  const [filtroFecha, setFiltroFecha] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [pedidoExpandido, setPedidoExpandido] = useState(null);
  const [actualizandoId, setActualizandoId] = useState(null);

  const [notificacionNuevoPedido, setNotificacionNuevoPedido] = useState("");
  const [idsPedidosNuevos, setIdsPedidosNuevos] = useState([]);

  const primerRender = useRef(true);
  const ultimoPedidoIdRef = useRef(null);
  const timeoutNotificacionRef = useRef(null);
  const tituloOriginalRef = useRef(document.title);

  const reproducirSonidoNuevoPedido = () => {
    try {
      const AudioContextClass =
        window.AudioContext || window.webkitAudioContext;

      if (!AudioContextClass) return;

      const contexto = new AudioContextClass();
      const oscilador = contexto.createOscillator();
      const ganancia = contexto.createGain();

      oscilador.type = "sine";
      oscilador.frequency.setValueAtTime(880, contexto.currentTime);
      oscilador.frequency.setValueAtTime(988, contexto.currentTime + 0.08);

      ganancia.gain.setValueAtTime(0.0001, contexto.currentTime);
      ganancia.gain.exponentialRampToValueAtTime(
        0.08,
        contexto.currentTime + 0.02
      );
      ganancia.gain.exponentialRampToValueAtTime(
        0.0001,
        contexto.currentTime + 0.35
      );

      oscilador.connect(ganancia);
      ganancia.connect(contexto.destination);

      oscilador.start();
      oscilador.stop(contexto.currentTime + 0.36);
    } catch (error) {
      console.error("No se pudo reproducir el sonido del pedido nuevo", error);
    }
  };

  const lanzarNotificacionNuevoPedido = (cantidadNuevos, nuevosIds) => {
    const texto =
      cantidadNuevos === 1
        ? "Ha entrado un pedido nuevo"
        : `Han entrado ${cantidadNuevos} pedidos nuevos`;

    setNotificacionNuevoPedido(texto);
    setIdsPedidosNuevos(nuevosIds);

    document.title = texto;

    reproducirSonidoNuevoPedido();

    if (timeoutNotificacionRef.current) {
      clearTimeout(timeoutNotificacionRef.current);
    }

    timeoutNotificacionRef.current = setTimeout(() => {
      setNotificacionNuevoPedido("");
      setIdsPedidosNuevos([]);
      document.title = tituloOriginalRef.current;
    }, 7000);
  };

  const cargarPedidos = async (mostrarLoader = true) => {
    try {
      if (mostrarLoader) {
        setCargando(true);
      }

      setError("");
      const data = await listarPedidos();

      if (data.length > 0) {
        const idMasNuevo = data[0].id;

        if (primerRender.current) {
          ultimoPedidoIdRef.current = idMasNuevo;
          primerRender.current = false;
        } else if (
          ultimoPedidoIdRef.current !== null &&
          idMasNuevo > ultimoPedidoIdRef.current
        ) {
          const nuevosPedidos = data.filter(
            (pedido) => pedido.id > ultimoPedidoIdRef.current
          );

          lanzarNotificacionNuevoPedido(
            nuevosPedidos.length,
            nuevosPedidos.map((pedido) => pedido.id)
          );

          ultimoPedidoIdRef.current = idMasNuevo;
        } else {
          ultimoPedidoIdRef.current = Math.max(
            ultimoPedidoIdRef.current || 0,
            idMasNuevo
          );
        }
      }

      setPedidos(data);
    } catch (e) {
      setError(e.message || "No se pudieron cargar los pedidos.");
    } finally {
      if (mostrarLoader) {
        setCargando(false);
      }
    }
  };

  useEffect(() => {
    cargarPedidos();

    const intervalo = setInterval(() => {
      cargarPedidos(false);
    }, 10000);

    return () => {
      clearInterval(intervalo);

      if (timeoutNotificacionRef.current) {
        clearTimeout(timeoutNotificacionRef.current);
      }

      document.title = tituloOriginalRef.current;
    };
  }, []);

  const cambiarEstado = async (id, estado) => {
    try {
      setActualizandoId(id);
      setMensaje("");
      setError("");

      await cambiarEstadoPedido(id, estado);
      setMensaje(`Estado del pedido #${id} actualizado a ${estado}`);
      await cargarPedidos(false);
    } catch (e) {
      setError(e.message || "No se pudo actualizar el estado del pedido.");
    } finally {
      setActualizandoId(null);
    }
  };

  const handleEliminarPedido = async (id) => {
    if (!window.confirm(`¿Estás seguro de eliminar permanentemente el pedido #${id}?`)) return;
    
    try {
      setActualizandoId(id);
      await eliminarPedido(id);
      setMensaje(`Pedido #${id} eliminado correctamente`);
      await cargarPedidos(false);
    } catch (e) {
      setError(e.message || "No se pudo eliminar el pedido.");
    } finally {
      setActualizandoId(null);
    }
  };

  const pedidosFiltrados = useMemo(() => {
    return pedidos.filter((pedido) => {
      const cumpleEstado =
        filtroEstado === "TODOS" || pedido.estado === filtroEstado;

      const cumpleFecha = !filtroFecha || (pedido.fecha && pedido.fecha.startsWith(filtroFecha));

      const textoBusqueda = busqueda.trim().toLowerCase();

      const cumpleBusqueda =
        textoBusqueda === "" ||
        String(pedido.id).includes(textoBusqueda) ||
        String(pedido.total).toLowerCase().includes(textoBusqueda) ||
        String(pedido.mesa || "").toLowerCase().includes(textoBusqueda) ||
        pedido.lineas.some((linea) =>
          linea.plato.toLowerCase().includes(textoBusqueda)
        );

      return cumpleEstado && cumpleFecha && cumpleBusqueda;
    });
  }, [pedidos, filtroEstado, filtroFecha, busqueda]);

  const resumen = useMemo(() => {
    return {
      total: pedidos.length,
      pendientes: pedidos.filter((p) => p.estado === "PENDIENTE").length,
      pagados: pedidos.filter((p) => p.estado === "PAGADO").length,
      entregados: pedidos.filter((p) => p.estado === "ENTREGADO").length,
      cancelados: pedidos.filter((p) => p.estado === "CANCELADO").length,
    };
  }, [pedidos]);

  const obtenerClaseEstado = (estado) => {
    switch (estado) {
      case "PENDIENTE":
        return "badge-estado badge-abierto";
      case "PAGADO":
        return "badge-estado badge-preparacion";
      case "ENTREGADO":
        return "badge-estado badge-servido";
      case "CANCELADO":
        return "badge-estado badge-cancelado";
      default:
        return "badge-estado";
    }
  };

  return (
    <div className="admin-pedidos-wrapper">
      <div className="admin-pedidos-header">
        <div>
          <h2 className="admin-title-graffiti">Pedidos</h2>
          <p className="admin-subtitle-text">
            Gestiona el flujo de cocina y controla el estado de cada pedido.
          </p>
        </div>

        <button
          className="btn-add"
          onClick={() => cargarPedidos()}
          type="button"
        >
          Actualizar
        </button>
      </div>

      {notificacionNuevoPedido && (
        <div className="alerta-nuevo-pedido">
          <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Bell size={18} />
            {notificacionNuevoPedido}
          </span>
          <button
            type="button"
            className="alerta-nuevo-pedido-cerrar"
            onClick={() => {
              setNotificacionNuevoPedido("");
              setIdsPedidosNuevos([]);
              document.title = tituloOriginalRef.current;
            }}
          >
            Cerrar
          </button>
        </div>
      )}

      <div className="admin-kpis-grid">
        <div className="admin-kpi-card">
          <span className="admin-kpi-label">Total pedidos</span>
          <strong className="admin-kpi-value">{resumen.total}</strong>
        </div>

        <div className="admin-kpi-card">
          <span className="admin-kpi-label">Pendientes</span>
          <strong className="admin-kpi-value">{resumen.pendientes}</strong>
        </div>

        <div className="admin-kpi-card">
          <span className="admin-kpi-label">Pagados</span>
          <strong className="admin-kpi-value">{resumen.pagados}</strong>
        </div>

        <div className="admin-kpi-card">
          <span className="admin-kpi-label">Entregados</span>
          <strong className="admin-kpi-value">{resumen.entregados}</strong>
        </div>

        <div className="admin-kpi-card">
          <span className="admin-kpi-label">Cancelados</span>
          <strong className="admin-kpi-value">{resumen.cancelados}</strong>
        </div>
      </div>

      <div className="admin-toolbar">
        <div className="filtros-container">
          <span>Estado:</span>
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="select-filtro"
          >
            {ESTADOS.map((estado) => (
              <option key={estado} value={estado}>
                {estado}
              </option>
            ))}
          </select>
        </div>

        <div className="filtros-container">
          <span>Fecha:</span>
          <CustomDatePicker 
            value={filtroFecha} 
            onChange={setFiltroFecha}
          />
        </div>

        <div className="admin-busqueda-box">
          <input
            type="text"
            placeholder="Buscar por ID, mesa, total o plato..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="admin-busqueda-input"
          />
        </div>
      </div>

      {mensaje && (
        <p className="mensaje-exito" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle size={16} /> {mensaje}
        </p>
      )}
      {error && <p className="mensaje-error">{error}</p>}
      {cargando && <p>Cargando pedidos...</p>}

      {!cargando && pedidosFiltrados.length === 0 && (
        <p>No hay pedidos que coincidan con el filtro actual.</p>
      )}

      {!cargando && pedidosFiltrados.length > 0 && (
        <div className="contenedor-tabla">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Fecha</th>
                <th>Zona</th>
                <th>Mesa</th>
                <th>Personas</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Productos</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {pedidosFiltrados.map((pedido) => {
                const totalUnidades = pedido.lineas.reduce(
                  (acumulador, linea) => acumulador + Number(linea.cantidad),
                  0
                );

                const expandido = pedidoExpandido === pedido.id;
                const esNuevo = idsPedidosNuevos.includes(pedido.id);

                return (
                  <tr
                    key={pedido.id}
                    className={esNuevo ? "fila-pedido-nuevo" : ""}
                  >
                    <td data-label="ID">
                      <strong>#{pedido.id}</strong>
                    </td>
                    <td data-label="FECHA">{pedido.fecha}</td>
                    <td data-label="ZONA">{pedido.zona}</td>
                    <td data-label="MESA">{pedido.mesa || "Sin mesa"}</td>
                    <td data-label="PERSONAS">{pedido.personas}</td>
                    <td data-label="TOTAL">{pedido.total} €</td>
                    <td data-label="ESTADO">
                      <span className={obtenerClaseEstado(pedido.estado)}>
                        {pedido.estado}
                      </span>
                    </td>
                    <td data-label="PRODUCTOS">
                      <div className="pedido-resumen-inline">
                        {pedido.lineas.map(l => `${l.cantidad}x ${l.plato}`).join(", ").substring(0, 40)}
                        {pedido.lineas.map(l => `${l.cantidad}x ${l.plato}`).join(", ").length > 40 ? "..." : ""}
                      </div>
                      <button
                        type="button"
                        className="btn-edit-table"
                        onClick={() =>
                          setPedidoExpandido(expandido ? null : pedido.id)
                        }
                      >
                        {expandido ? "Ocultar" : "Ver todo"}
                      </button>

                      {expandido && (
                        <div className="pedido-lineas-box">
                          {pedido.lineas.map((linea, indice) => (
                            <div key={indice} className="pedido-linea-item">
                              <span>
                                {linea.plato} x{linea.cantidad}
                              </span>
                              <span>{linea.precio} €</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                    <td data-label="ACCIONES">
                      <div className="pedido-acciones">
                        {pedido.estado === "PENDIENTE" && (
                          <>
                            <button
                              type="button"
                              className="btn-estado btn-estado-preparar"
                              onClick={() => cambiarEstado(pedido.id, "PAGADO")}
                              disabled={actualizandoId === pedido.id}
                            >
                              Pagado
                            </button>

                            <button
                              type="button"
                              className="btn-estado btn-estado-servido"
                              onClick={() => cambiarEstado(pedido.id, "ENTREGADO")}
                              disabled={actualizandoId === pedido.id}
                            >
                              Entregado
                            </button>

                            <button
                              type="button"
                              className="btn-estado btn-estado-cancelar"
                              onClick={() => cambiarEstado(pedido.id, "CANCELADO")}
                              disabled={actualizandoId === pedido.id}
                            >
                              Cancelar
                            </button>
                          </>
                        )}

                        {pedido.estado === "CANCELADO" && (
                          <>
                            <button
                              type="button"
                              className="btn-estado btn-estado-preparar"
                              onClick={() => cambiarEstado(pedido.id, "PENDIENTE")}
                              disabled={actualizandoId === pedido.id}
                            >
                              Reactivar
                            </button>
                            <button
                              type="button"
                              className="btn-estado btn-estado-cancelar"
                              onClick={() => handleEliminarPedido(pedido.id)}
                              disabled={actualizandoId === pedido.id}
                            >
                              Eliminar
                            </button>
                          </>
                        )}

                        {(pedido.estado === "PAGADO" || pedido.estado === "ENTREGADO") && (
                          <span style={{ color: '#666', fontSize: '0.75rem', fontWeight: '700' }}>
                            SIN ACCIONES
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}