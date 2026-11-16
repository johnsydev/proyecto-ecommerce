import searchClient from "../../catalog/services/algolia";
import { expireStaleOrders, getOrders } from "../../../utils/orderStorage";

/*
 * Objetivo:
 * Obtener las órdenes de un usuario desde los dos mecanismos de persistencia:
 * el historial indexado en Algolia y las órdenes nuevas guardadas en localStorage.
 *
 * Entrada:
 * - userId: Identificador del usuario activo.
 *
 * Salida:
 * - orders: Órdenes del usuario, de la más reciente a la más antigua.
 * - historyError: true si no se pudo consultar el historial de Algolia.
 *
 * Restricciones:
 * - Solo devuelve órdenes cuyo userId coincide con el solicitado.
 * - Si una orden existe en ambos orígenes, prevalece la local (más reciente).
 * - La aplicación no escribe en Algolia; las órdenes nuevas permanecen en localStorage.
 * - Un fallo de Algolia no impide mostrar las órdenes locales.
 */
export async function loadUserOrders(userId) {
  const indexName = import.meta.env.VITE_ALGOLIA_ORDERS_INDEX_NAME?.trim();

  expireStaleOrders();
  const localOrders = getOrders();

  let remoteOrders = [];
  let historyError = false;

  if (indexName && userId) {
    try {
      const response = await searchClient.searchSingleIndex({
        indexName,
        searchParams: {
          query: "",
          filters: `userId:"${userId}"`,
          hitsPerPage: 100,
          attributesToHighlight: [],
        },
      });

      remoteOrders = response.hits.filter((hit) => hit.userId === userId);
    } catch {
      historyError = true;
    }
  } else {
    historyError = true;
  }

  const byNumber = new Map();
  [...remoteOrders, ...localOrders].forEach((order) => {
    byNumber.set(order.orderNumber, order);
  });

  return {
    orders: [...byNumber.values()].sort(
      (a, b) => getOrderTimestamp(b) - getOrderTimestamp(a),
    ),
    historyError,
  };
}

export function getOrderTimestamp(order) {
  const timestamp = Number(order.dateTimestamp);
  if (Number.isFinite(timestamp) && timestamp > 0) return timestamp;

  const parsed = new Date(order.date ?? order.createdAt).getTime();
  return Number.isNaN(parsed) ? 0 : parsed;
}

export function getOrderCurrencySymbol(order) {
  return order.currencySymbol ?? (order.currency === "CRC" ? "₡" : "$");
}

export function formatOrderMoney(order, value) {
  return `${getOrderCurrencySymbol(order)}${Number(value ?? 0).toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
}

export function formatOrderDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("es-CR", { dateStyle: "long", timeStyle: "short" });
}
