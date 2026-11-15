import { readFileSync } from "node:fs";
import { algoliasearch } from "algoliasearch";
import dotenv from "dotenv";

/*
 * Objetivo:
 * Crear o actualizar el índice de órdenes con el historial inicial de compras
 * de los clientes B2C y B2B, para que el administrador pueda consultarlas.
 *
 * Entrada:
 * - ALGOLIA_APP_ID y ALGOLIA_WRITE_API_KEY del archivo .env.
 * - Las órdenes de ejemplo de data/orders.json.
 *
 * Salida:
 * - Índice grupo-05_orders configurado para buscar por número de orden,
 *   usuario, cliente, empresa y sucursal, y para filtrar por usuario, rol,
 *   sucursal y estados. Las órdenes más recientes aparecen primero.
 *
 * Restricciones:
 * - No modifica los índices de productos ni de usuarios.
 * - Las órdenes se insertan o actualizan por su objectID (número de orden);
 *   no se eliminan órdenes existentes.
 * - Cada orden debe indicar usuario, rol, sucursal y condiciones comerciales,
 *   y su total debe coincidir con subtotal + impuestos + envío.
 * - La clave de escritura se utiliza solo en este script de Node.
 */
dotenv.config({ quiet: true });

const INDEX_NAME = "grupo-05_orders";
const appId = process.env.ALGOLIA_APP_ID;
const writeKey = process.env.ALGOLIA_WRITE_API_KEY;

if (!appId || !writeKey) {
  console.error("Faltan ALGOLIA_APP_ID o ALGOLIA_WRITE_API_KEY en .env.");
  process.exit(1);
}

const orders = JSON.parse(
  readFileSync(new URL("../data/orders.json", import.meta.url), "utf8"),
);

const isValidOrder = (order) =>
  order.objectID &&
  order.objectID === order.orderNumber &&
  order.userId &&
  order.role &&
  order.branch?.branch_id &&
  order.commercialConditions?.priceList &&
  Array.isArray(order.products) &&
  order.products.length > 0 &&
  order.products.every((item) => item.quantity >= 1) &&
  Math.abs(order.subtotal + order.total_iva + order.shippingCost - order.total) < 0.01;

if (
  !Array.isArray(orders) ||
  orders.length === 0 ||
  !orders.every(isValidOrder) ||
  new Set(orders.map((order) => order.objectID)).size !== orders.length
) {
  throw new Error("El archivo de órdenes contiene registros inválidos o repetidos.");
}

const client = algoliasearch(appId, writeKey);

const settings = await client.setSettings({
  indexName: INDEX_NAME,
  indexSettings: {
    searchableAttributes: [
      "orderNumber",
      "username",
      "client.fullName",
      "company.name",
      "branch.name",
    ],
    attributesForFaceting: [
      "filterOnly(userId)",
      "role",
      "branch.branch_id",
      "orderStatus",
      "paymentStatus",
    ],
    customRanking: ["desc(dateTimestamp)"],
  },
});

await client.waitForTask({ indexName: INDEX_NAME, taskID: settings.taskID });

await client.saveObjects({
  indexName: INDEX_NAME,
  objects: orders,
  waitForTasks: true,
});

console.log(`Índice ${INDEX_NAME} actualizado con ${orders.length} órdenes de ejemplo.`);
