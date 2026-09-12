/*
 * Objetivo:
 * Redirigir automáticamente al usuario desde la página principal
 * hacia la ruta de búsqueda de productos.
 *
 * Entrada:
 * - No recibe datos directamente.
 * - Utiliza la función navigate proporcionada por react-router-dom.
 *
 * Salida:
 * - Redirige al usuario a la ruta "/search".
 * - No muestra contenido visual, por eso el componente retorna null.
 *
 * Restricciones:
 * - El componente debe ejecutarse dentro de un Router para poder utilizar useNavigate.
 * - La ruta "/search" debe estar definida en la aplicación.
 * - La redirección se realiza al cargar el componente.
 */

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/search", { replace: true });
  }, [navigate]);

  return null;
}
