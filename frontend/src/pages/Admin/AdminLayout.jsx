import { Outlet, Link } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div style={{marginTop: 120, display: "flex", gap: 20 }}>
      <aside style={{ width: 220 }}>
        <h3>Panel Admin</h3>
        <nav style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <Link to="/admin">Dashboard</Link>
          <Link to="/admin/platos">Platos</Link>
          <Link to="/admin/subir-foto">Subir foto</Link>
        </nav>
      </aside>

      <section style={{ flex: 1 }}>
        <Outlet />
      </section>
      <button
      onClick={() => {
          localStorage.removeItem("token_admin");
          window.location.href = "/admin/login";
        }}>
       Cerrar sesión
        </button>

    </div>
    
  );
}