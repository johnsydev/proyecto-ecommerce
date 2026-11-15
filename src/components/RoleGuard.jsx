import { useUser } from "../context/useUser";
import AccessDenied from "./AccessDenied";

/*
 * Objetivo:
 * Proteger una ruta o sección según el permiso requerido.
 *
 * Entrada:
 * - permission: Valor de PERMISSIONS que debe poseer el rol actual.
 * - children: Contenido visible únicamente con el permiso.
 *
 * Salida:
 * - El contenido protegido o el mensaje de acceso denegado.
 *
 * Restricciones:
 * - Debe utilizarse dentro de UserProvider.
 */
export default function RoleGuard({ permission, children }) {
  const { user, can } = useUser();

  if (!can(permission)) {
    return <AccessDenied isLoggedIn={Boolean(user)} />;
  }

  return children;
}
