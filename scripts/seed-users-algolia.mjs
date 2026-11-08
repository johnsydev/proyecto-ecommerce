import { readFileSync } from "node:fs";
import { algoliasearch } from "algoliasearch";
import dotenv from "dotenv";

/*
 * Objetivo:
 * Crear el índice de cuentas ficticias para el inicio de sesión del laboratorio.
 *
 * Entrada:
 * - ALGOLIA_APP_ID y ALGOLIA_WRITE_API_KEY del archivo .env.
 * - Las cuentas ficticias de data/users.json.
 *
 * Salida:
 * - Índice grupo-05_users con búsqueda por nombre de usuario.
 *
 * Restricciones:
 * - No modifica el índice de productos ni sobrescribe índices existentes.
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
  new Set(users.map((user) => user.username.toLowerCase())).size !== users.length
) {
  throw new Error("El archivo de usuarios contiene registros inválidos o repetidos.");
}

const client = algoliasearch(appId, writeKey);

if (await client.indexExists({ indexName: INDEX_NAME })) {
  console.log(`El índice ${INDEX_NAME} ya existe. No se modificaron sus datos.`);
  process.exit(0);
}

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

console.log(`Índice ${INDEX_NAME} creado con ${users.length} usuarios de prueba.`);
