import searchClient from "../../catalog/services/algolia";
import { getOrderTimestamp } from "../../orders/services/ordersService";

/*
 * Objetivo:
 * Leer las órdenes guardadas en localStorage por todos los usuarios que han
 * comprado desde este navegador.
 *
 * Salida:
 * - Arreglo con las órdenes de todas las claves "orders" y "orders:...".
 *
 * Restricciones:
 * - Se ignoran las claves con datos dañados.
 * - Si localStorage no está disponible se devuelve un arreglo vacío.
 */
function readLocalOrders() {
  const orders = [];

  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);

      if (key !== "orders" && !key.startsWith("orders:")) continue;

      try {
        const list = JSON.parse(localStorage.getItem(key));
        if (Array.isArray(list)) orders.push(...list);
      } catch {
        continue;
      }
    }
  } catch {
    return [];
  }

  return orders;
}

/*
 * Objetivo:
 * Obtener todas las órdenes de la tienda para el panel administrativo.
 *
 * Salida:
 * - orders: Órdenes de todos los usuarios, de la más reciente a la más antigua.
 * - historyError: true si no se pudo consultar el índice de órdenes de Algolia.
 *
 * Restricciones:
 * - Une el historial de Algolia con las órdenes nuevas guardadas en localStorage.
 * - Si una orden existe en ambos orígenes, prevalece la local (más reciente).
 * - Un fallo de Algolia no impide mostrar las órdenes locales.
 * - Solo se incluyen registros que tengan número de orden.
 */
export async function loadAllOrders() {
  const indexName = import.meta.env.VITE_ALGOLIA_ORDERS_INDEX_NAME?.trim();

  let remoteOrders = [];
  let historyError = false;

  if (indexName) {
    try {
      const response = await searchClient.searchSingleIndex({
        indexName,
        searchParams: {
          query: "",
          hitsPerPage: 1000,
          attributesToHighlight: [],
        },
      });

      remoteOrders = response.hits;
    } catch {
      historyError = true;
    }
  } else {
    historyError = true;
  }

  const byNumber = new Map();
  [...remoteOrders, ...readLocalOrders()].forEach((order) => {
    if (order?.orderNumber) byNumber.set(order.orderNumber, order);
  });

  return {
    orders: [...byNumber.values()].sort(
      (a, b) => getOrderTimestamp(b) - getOrderTimestamp(a),
    ),
    historyError,
  };
}