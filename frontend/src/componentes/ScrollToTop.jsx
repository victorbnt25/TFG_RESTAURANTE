import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Al cambiar la ruta, subimos el scroll al tope instantáneamente
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
