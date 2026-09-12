import { readFileSync } from "node:fs";
import { algoliasearch } from "algoliasearch";
import dotenv from "dotenv";

/*
 * Objetivo:
 * Leer los productos almacenados en el archivo products.json y enviarlos
 * al índice de Algolia para que puedan ser utilizados posteriormente
 * en las búsquedas de la aplicación.
 *
 * Entrada:
 * - Las variables ALGOLIA_APP_ID y ALGOLIA_WRITE_API_KEY almacenadas
 *   en el archivo .env.
 * - El archivo products.json, que contiene la información de los productos
 *   que se desean indexar.
 *
 * Salida:
 * - Los productos quedan almacenados en el índice "grupo-05_products"
 *   de Algolia.
 * - Se muestran mensajes en consola indicando el inicio y la finalización
 *   del proceso de indexación.
 *
 * Restricciones:
 * - Las variables ALGOLIA_APP_ID y ALGOLIA_WRITE_API_KEY deben estar
 *   definidas en el archivo .env.
 * - El archivo products.json debe existir y contener un JSON válido.
 * - Los productos deben tener una estructura válida para poder ser
 *   enviados a Algolia.
 * - Se necesita conexión a Internet para comunicarse con Algolia.
 * - La API Key utilizada debe tener permisos para escribir en el índice.
 */

dotenv.config();

const appId = process.env.ALGOLIA_APP_ID;
const writeKey = process.env.ALGOLIA_WRITE_API_KEY;

if (!appId || !writeKey) {
  console.error(
    "Debe establecer ALGOLIA_APP_ID y ALGOLIA_WRITE_API_KEY en el archivo .env",
  );

  process.exit(1);
}

const INDEX_NAME = "grupo-05_products";
const products = JSON.parse(
  readFileSync(new URL("../data/products.json", import.meta.url), "utf8"),
);

const client = algoliasearch(appId, writeKey);

console.log(
  `Indexando ${products.length} productos en "${INDEX_NAME}" en la app "${appId}"...`,
);

await client.saveObjects({
  indexName: INDEX_NAME,
  objects: products,
  waitForTasks: true,
});

console.log(
  `${products.length} productos indexados correctamente en "${INDEX_NAME}", listos para ser buscados.`,
);
