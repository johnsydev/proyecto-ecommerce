import searchClient from "../../catalog/services/algolia";

/*
 * Objetivo:
 * Validar el acceso del laboratorio contra usuarios existentes en Algolia.
 *
 * Entrada:
 * - username: Identificador ingresado por el usuario.
 * - password: Contraseña de prueba, sin modificar espacios ni mayúsculas.
 *
 * Salida:
 * - Identidad del usuario, sin incluir la contraseña.
 *
 * Restricciones:
 * - No crea ni modifica registros en Algolia.
 * - El campo de usuario debe ser searchable en el índice.
 * - Compara credenciales ficticias en texto como simulación del laboratorio.
 * - No constituye autenticación segura para producción.
 */
export async function authenticateUser(username, password) {
  const indexName = import.meta.env.VITE_ALGOLIA_USERS_INDEX_NAME?.trim();
  const usernameField =
    import.meta.env.VITE_ALGOLIA_USERS_USERNAME_FIELD?.trim() || "username";
  const passwordField =
    import.meta.env.VITE_ALGOLIA_USERS_PASSWORD_FIELD?.trim() || "password";

  if (!indexName) {
    throw new Error(
      "Falta configurar VITE_ALGOLIA_USERS_INDEX_NAME para iniciar sesión.",
    );
  }

  const identifier = String(username ?? "").trim();

  if (!identifier || typeof password !== "string" || !password) {
    throw new Error("Ingresá tu usuario y contraseña.");
  }

  const matches = [];
  let page = 0;
  let pageCount;

  try {
    do {
      const response = await searchClient.searchSingleIndex({
        indexName,
        searchParams: {
          query: identifier,
          restrictSearchableAttributes: [usernameField],
          attributesToRetrieve: ["objectID", usernameField, passwordField],
          typoTolerance: false,
          hitsPerPage: 100,
          page,
        },
      });

      matches.push(
        ...response.hits.filter(
          (hit) =>
            typeof hit[usernameField] === "string" &&
            hit[usernameField].trim().toLowerCase() === identifier.toLowerCase(),
        ),
      );

      pageCount = response.nbPages;
      page += 1;
    } while (page < pageCount && matches.length < 2);
  } catch {
    throw new Error(
      "No se pudo consultar el índice de usuarios. Revisá la conexión y la configuración de Algolia.",
    );
  }

  // Las coincidencias aproximadas o los usuarios duplicados no permiten ingresar.
  const account = matches.length === 1 ? matches[0] : null;

  if (
    !account ||
    !account.objectID ||
    typeof account[passwordField] !== "string" ||
    account[passwordField] !== password
  ) {
    throw new Error("Usuario o contraseña incorrectos.");
  }

  return {
    id: String(account.objectID),
    username: account[usernameField],
    provider: "algolia",
  };
}
