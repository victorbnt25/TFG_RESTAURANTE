import { Outlet, Link, useLocation } from "react-router-dom";
import "./admin.css";

export default function AdminLayout() {
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token_admin");
    window.location.href = "/admin/login";
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h3 className="admin-title-graffiti" style={{ fontSize: "1.8rem" }}>Panel Admin</h3>
        
        <nav className="admin-nav">
           <Link 
            to="/admin/platos" 
            className={`admin-nav-link ${location.pathname === "/admin/platos" ? "active" : ""}`}
          >
            Platos
          </Link>
          <Link 
            to="/admin" 
            className={`admin-nav-link ${location.pathname === "/admin" ? "active" : ""}`}
          >
            Dashboard
          </Link>
         
          <Link 
            to="/admin/mesas" 
            className={`admin-nav-link ${location.pathname === "/admin/mesas" ? "active" : ""}`}
          >
            Mesas
          </Link>
        </nav>

        <button 
          onClick={handleLogout} 
          className="btn-delete" 
          style={{ marginTop: "auto" }}
        >
          CERRAR SESIÓN
        </button>
      </aside>

      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}