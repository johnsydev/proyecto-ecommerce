import { readFileSync } from "node:fs";
import { algoliasearch } from "algoliasearch";
import dotenv from "dotenv";

/*
 * Objetivo:
 * Crear o actualizar el índice de cuentas ficticias para el inicio de sesión,
 * incluyendo el rol (B2C, B2B o ADMIN) y los datos de empresa de cada usuario.
 *
 * Entrada:
 * - ALGOLIA_APP_ID y ALGOLIA_WRITE_API_KEY del archivo .env.
 * - Las cuentas ficticias de data/users.json.
 *
 * Salida:
 * - Índice grupo-05_users con búsqueda por nombre de usuario.
 *
 * Restricciones:
 * - No modifica el índice de productos ni elimina registros existentes;
 *   los usuarios se insertan o actualizan por su objectID.
 * - Los clientes B2B deben tener empresa y cédula jurídica (taxId).
 * - El rol "GUEST" del usuario "invitado" es intencionalmente inválido y
 *   sirve para probar el acceso de un usuario sin rol válido.
 * - Las contraseñas son exclusivamente datos de prueba del laboratorio.
 * - La clave de escritura se utiliza solo en este script de Node.
 */
dotenv.config({ quiet: true });

const INDEX_NAME = "grupo-05_users";
const appId = process.env.ALGOLIA_APP_ID;
const writeKey = process.env.ALGOLIA_WRITE_API_KEY;

if (!appId || !writeKey) {
  console.error("Faltan ALGOLIA_APP_ID o ALGOLIA_WRITE_API_KEY en .env.");
  process.exit(1);
}

const users = JSON.parse(
  readFileSync(new URL("../data/users.json", import.meta.url), "utf8"),
);

if (
  !Array.isArray(users) ||
  users.length === 0 ||
  users.some((user) => !user.objectID || !user.username || !user.password) ||
  new Set(users.map((user) => user.objectID)).size !== users.length ||
  new Set(users.map((user) => user.username.toLowerCase())).size !== users.length ||
  users.some((user) => !user.role) ||
  users.some((user) => user.role === "B2B" && (!user.company || !user.taxId))
) {
  throw new Error("El archivo de usuarios contiene registros inválidos o repetidos.");
}

const client = algoliasearch(appId, writeKey);

const settings = await client.setSettings({
  indexName: INDEX_NAME,
  indexSettings: {
    searchableAttributes: ["username"],
    typoTolerance: false,
  },
});

await client.waitForTask({ indexName: INDEX_NAME, taskID: settings.taskID });

await client.saveObjects({
  indexName: INDEX_NAME,
  objects: users,
  waitForTasks: true,
});

console.log(`Índice ${INDEX_NAME} actualizado con ${users.length} usuarios de prueba.`);
