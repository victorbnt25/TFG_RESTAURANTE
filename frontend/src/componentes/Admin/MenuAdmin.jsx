import { NavLink } from "react-router-dom";

export default function MenuAdmin() {
  const estilo = ({ isActive }) => ({
    display: "block",
    padding: "8px 0",
    fontWeight: isActive ? "bold" : "normal",
  });

  return (
    <nav>
      <NavLink to="/admin" end style={estilo}>Dashboard</NavLink>
      <NavLink to="/admin/platos" style={estilo}>Platos</NavLink>
      <NavLink to="/admin/subir-foto" style={estilo}>Subir foto</NavLink>
    </nav>
  );
}
