import { Outlet, Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Bell, Home, LayoutDashboard, Utensils, ShoppingBag, ChefHat, Table, FileText, LogOut } from "lucide-react";
import { listarPedidos } from "../../servicios/adminApi";
import "./admin.css";


export default function AdminLayout() {
  const location = useLocation();

  const [orderCount, setOrderCount] = useState(null);
  const [showToast, setShowToast] = useState(false);

  const handleLogout = () => {
    sessionStorage.removeItem("usuario");
    localStorage.removeItem("token_admin");
    window.location.href = "/";
  };

  // Polling global para nuevos pedidos
  useEffect(() => {
    const checkOrders = async () => {
      try {
        const data = await listarPedidos();
        const count = data.length;
        
        if (orderCount !== null && count > orderCount) {
          setShowToast(true);
          // Ocultar toast tras 5 segundos
          setTimeout(() => setShowToast(false), 5000);
        }
        setOrderCount(count);
      } catch (err) {
        console.error("Error polling orders:", err);
      }
    };

    // Ejecutar inmediatamente y luego cada 15s
    checkOrders();
    const interval = setInterval(checkOrders, 15000);
    return () => clearInterval(interval);
  }, [orderCount]);


  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h3 className="admin-title-graffiti" style={{ fontSize: "1.8rem", display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ShoppingBag /> Panel
        </h3>


        <nav className="admin-nav">
          <Link
            to="/admin"
            className={`admin-nav-link ${
              location.pathname === "/admin" ? "active" : ""
            }`}
          >
            Dashboard
          </Link>

          <Link
            to="/admin/platos"
            className={`admin-nav-link ${
              location.pathname === "/admin/platos" ? "active" : ""
            }`}
          >
            Platos
          </Link>

          <Link
            to="/admin/pedidos"
            className={`admin-nav-link ${
              location.pathname === "/admin/pedidos" ? "active" : ""
            }`}
          >
            Pedidos
          </Link>

          <Link
            to="/admin/cocina"
            className={`admin-nav-link ${
              location.pathname === "/admin/cocina" ? "active" : ""
            }`}
          >
            Cocina
          </Link>

          <Link
            to="/admin/mesas"
            className={`admin-nav-link ${
              location.pathname === "/admin/mesas" ? "active" : ""
            }`}
          >
            Mesas
          </Link>

          <Link
            to="/admin/politica"
            className={`admin-nav-link ${
              location.pathname === "/admin/politica" ? "active" : ""
            }`}
          >
            Política
          </Link>
        </nav>

        <Link
          to="/"
          className="btn-admin-home"
          style={{ marginTop: "auto", marginBottom: "10px", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          <Home size={18} /> INICIO
        </Link>

        <button
          onClick={handleLogout}
          className="btn-admin-logout"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          <LogOut size={18} /> SALIR
        </button>
      </aside>

      {showToast && (
        <div className="admin-global-toast" onClick={() => setShowToast(false)}>
          <div className="toast-icon"><Bell className="bell-anim" /></div>
          <div className="toast-content">
            <strong>¡Nuevo pedido recibido!</strong>
            <span>Hay actividad reciente en la cocina.</span>
          </div>
        </div>
      )}


      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}