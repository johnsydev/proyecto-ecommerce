import { authenticateUser } from "../features/auth/services/algoliaAuth";

const CURRENT_USER_KEY = "currentUser";

/*
 * Objetivo:
 * Recuperar la identidad activa en la pestaña.
 *
 * Salida:
 * - Usuario identificado mediante Algolia o null.
 *
 * Restricciones:
 * - Solo conserva identificador, nombre de usuario y proveedor.
 * - Las antiguas identidades locales no son accesos válidos.
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
      typeof user.username !== "string"
    ) {
      return null;
    }

    return { id: user.id, username: user.username, provider: user.provider };
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
