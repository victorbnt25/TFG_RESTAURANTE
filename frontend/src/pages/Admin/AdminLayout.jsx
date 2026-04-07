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
        <h3 className="admin-title-graffiti" style={{ fontSize: "1.8rem" }}>
          Panel Admin
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
            Política Legal
          </Link>
        </nav>

        <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "10px" }}>
          <Link
            to="/"
            className="btn-add"
            style={{ textAlign: "center", textDecoration: "none", backgroundColor: "#fff", color: "#000" }}
          >
            VOLVER A LA WEB
          </Link>
          
          <button
            onClick={handleLogout}
            className="btn-delete"
          >
            CERRAR SESIÓN
          </button>
        </div>
      </aside>

      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}