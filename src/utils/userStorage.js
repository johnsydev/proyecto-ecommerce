import { authenticateUser } from "../features/auth/services/algoliaAuth";
import { isValidRole } from "./permissions";

const CURRENT_USER_KEY = "currentUser";

/*
 * Objetivo:
 * Recuperar la identidad activa en la pestaña.
 *
 * Salida:
 * - Usuario identificado mediante Algolia o null.
 *
 * Restricciones:
 * - Conserva identificador, usuario, nombre, rol, empresa, identificación
 *   tributaria y proveedor.
 * - Las identidades locales o sin un rol válido no son accesos válidos.
 */
export function getCurrentUser() {
  try {
    const raw = sessionStorage.getItem(CURRENT_USER_KEY);
    const user = raw ? JSON.parse(raw) : null;

    if (
      !user ||
      user.provider !== "algolia" ||
      typeof user.id !== "string" ||
      !user.id ||
      typeof user.username !== "string" ||
      !isValidRole(user.role)
    ) {
      return null;
    }

    return {
      id: user.id,
      username: user.username,
      name: typeof user.name === "string" ? user.name : user.username,
      role: user.role,
      company: typeof user.company === "string" ? user.company : null,
      taxId: typeof user.taxId === "string" ? user.taxId : null,
      provider: user.provider,
    };
  } catch {
    return null;
  }
}

/*
 * Objetivo:
 * Iniciar sesión con una cuenta existente en el índice de Algolia.
 *
 * Entrada:
 * - username: Nombre de usuario.
 * - password: Contraseña de prueba.
 *
 * Salida:
 * - Identidad validada del usuario.
 *
 * Restricciones:
 * - No crea usuarios ni almacena contraseñas en el navegador.
 */
export async function loginUser(username, password) {
  const user = await authenticateUser(username, password);

  try {
    sessionStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } catch {
    throw new Error(
      "No se pudo guardar la sesión. Verificá que el navegador permita guardar datos.",
    );
  }

  return user;
}

/*
 * Objetivo:
 * Cerrar la sesión sin eliminar los historiales de Analytics.
 *
 * Salida:
 * - Elimina la identidad activa de la pestaña.
 */
export function logoutUser() {
  try {
    sessionStorage.removeItem(CURRENT_USER_KEY);
  } catch {
    throw new Error("No se pudo cerrar la sesión. Intentá nuevamente.");
  }

}
