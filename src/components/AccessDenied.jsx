import { Link } from "react-router-dom";
import sadRobot from "../assets/electroTriste.png";
import "../styles/AccessDenied.css";

/*
 * Objetivo:
 * Informar que el usuario actual no puede acceder a una sección.
 *
 * Entrada:
 * - isLoggedIn: Indica si existe una sesión activa.
 *
 * Salida:
 * - Mensaje de acceso denegado con enlaces para continuar navegando.
 *
 * Restricciones:
 * - Sin sesión, invita a iniciar sesión; con sesión, indica falta de permisos.
 */
export default function AccessDenied({ isLoggedIn }) {
  return (
    <section className="access-denied" role="alert">
      <img
        src={sadRobot}
        alt="Mascota de Electro-Commerce CR triste"
        className="access-denied-mascot"
      />
      <h1>Acceso denegado</h1>
      <p>
        {isLoggedIn
          ? "Tu rol no tiene permisos para ver esta sección."
          : "Necesitás iniciar sesión con un rol autorizado para ver esta sección."}
      </p>

      <div className="access-denied-actions">
        <Link to="/search" className="access-denied-primary">
          Volver al catálogo
        </Link>
        {!isLoggedIn && (
          <Link to="/signin" className="access-denied-secondary">
            Iniciar sesión
          </Link>
        )}
      </div>
    </section>
  );
}
