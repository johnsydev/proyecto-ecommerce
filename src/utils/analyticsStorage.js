const EVENTS_KEY = "analyticsEvents";
const SESSION_KEY = "analyticsSessionId";

export const ANALYTICS_EVENTS = {
  SESSION_START: "SESSION_START",
  SEARCH: "SEARCH",
  PRODUCT_VIEW: "PRODUCT_VIEW",
  ADD_TO_CART: "ADD_TO_CART",
  CHECKOUT_START: "CHECKOUT_START",
  PURCHASE_COMPLETED: "PURCHASE_COMPLETED",
};

/*
 * Objetivo:
 * Leer un valor del almacenamiento local.
 *
 * Entrada:
 * - key: Clave del valor almacenado.
 * - fallback: Valor utilizado si no existen datos válidos.
 *
 * Salida:
 * - Valor convertido desde JSON o el valor de respaldo.
 */
function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

/*
 * Objetivo:
 * Guardar un valor en el almacenamiento local.
 *
 * Entrada:
 * - key: Clave del valor.
 * - value: Datos que se desean guardar.
 *
 * Salida:
 * - Booleano que indica si los datos se guardaron correctamente.
 */
function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

/*
 * Objetivo:
 * Obtener o crear el identificador de la sesión activa.
 *
 * Entrada:
 * - Ninguna.
 *
 * Salida:
 * - Identificador de la sesión.
 *
 * Restricciones:
 * - El navegador debe permitir el uso de sessionStorage.
 */
export function getSessionId() {
  let sessionId = sessionStorage.getItem(SESSION_KEY);

  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, sessionId);
  }

  return sessionId;
}

/*
 * Objetivo:
 * Obtener los eventos registrados durante la sesión activa.
 *
 * Entrada:
 * - Ninguna.
 *
 * Salida:
 * - Array de eventos de la sesión.
 */
export function getEvents() {
  const events = read(EVENTS_KEY, []);
  const sessionId = getSessionId();

  if (!Array.isArray(events)) {
    return [];
  }

  return events.filter(
    (event) =>
      event &&
      event.sessionId === sessionId &&
      typeof event.type === "string" &&
      typeof event.createdAt === "string",
  );
}

/*
 * Objetivo:
 * Registrar una acción del usuario durante la sesión activa.
 *
 * Entrada:
 * - type: Tipo de evento.
 * - data: Información relevante de la acción.
 * - uniqueKey: Identificador opcional para evitar eventos duplicados.
 *
 * Salida:
 * - Evento guardado, evento existente o null si no se pudo guardar.
 *
 * Restricciones:
 * - El tipo debe estar definido en ANALYTICS_EVENTS.
 * - No se deben incluir datos de tarjetas ni datos personales del comprador.
 */
export function recordEvent(type, data = {}, uniqueKey = null) {
  if (!Object.values(ANALYTICS_EVENTS).includes(type)) {
    return null;
  }

  const sessionId = getSessionId();
  const stored = read(EVENTS_KEY, []);
  const events = Array.isArray(stored)
    ? stored.filter((event) => event && typeof event === "object")
    : [];

  if (uniqueKey !== null) {
    const existing = events.find(
      (event) =>
        event.sessionId === sessionId &&
        event.type === type &&
        event.uniqueKey === uniqueKey,
    );

    if (existing) {
      return existing;
    }
  }

  const event = {
    id: crypto.randomUUID(),
    sessionId,
    type,
    createdAt: new Date().toISOString(),
    data,
    uniqueKey,
  };

  if (!write(EVENTS_KEY, [...events, event])) {
    return null;
  }

  window.dispatchEvent(new Event("analytics-updated"));

  return event;
}

/*
 * Objetivo:
 * Registrar el inicio de la sesión anónima una única vez.
 *
 * Entrada:
 * - Ninguna.
 *
 * Salida:
 * - Evento correspondiente al inicio de sesión.
 *
 * Restricciones:
 * - Representa una sesión de navegación, no una autenticación.
 */
export function startSession() {
  return recordEvent(
    ANALYTICS_EVENTS.SESSION_START,
    { mode: "anonymous" },
    "session-start",
  );
}

/*
 * Objetivo:
 * Obtener las búsquedas recientes sin repetir términos.
 *
 * Entrada:
 * - limit: Cantidad máxima de búsquedas.
 *
 * Salida:
 * - Array de textos buscados, del más reciente al más antiguo.
 */
export function getRecentSearches(limit = 5) {
  const searches = [];
  const seen = new Set();

  getEvents()
    .slice()
    .reverse()
    .forEach((event) => {
      if (event.type !== ANALYTICS_EVENTS.SEARCH) {
        return;
      }

      const query = String(event.data?.query ?? "").trim();
      const normalized = query.toLocaleLowerCase("es");

      if (query && !seen.has(normalized)) {
        seen.add(normalized);
        searches.push(query);
      }
    });

  return searches.slice(0, limit);
}

/*
 * Objetivo:
 * Obtener los productos vistos recientemente sin repetir productos.
 *
 * Entrada:
 * - limit: Cantidad máxima de productos.
 *
 * Salida:
 * - Array de productos, del más reciente al más antiguo.
 *
 * Restricciones:
 * - Los eventos deben contener data.product con id u objectID.
 */
export function getRecentlyViewed(limit = 5) {
  const products = [];
  const seen = new Set();

  getEvents()
    .slice()
    .reverse()
    .forEach((event) => {
      if (event.type !== ANALYTICS_EVENTS.PRODUCT_VIEW) {
        return;
      }

      const product = event.data?.product;
      const productId = product?.id ?? product?.objectID;

      if (productId === undefined || productId === null) {
        return;
      }

      const key = String(productId);

      if (!seen.has(key)) {
        seen.add(key);
        products.push(product);
      }
    });

  return products.slice(0, limit);
}

/*
 * Objetivo:
 * Calcular las métricas de interacción de la sesión activa.
 *
 * Entrada:
 * - Ninguna.
 *
 * Salida:
 * - Cantidad de visualizaciones, búsquedas, unidades agregadas y compras.
 *
 * Restricciones:
 * - Las unidades agregadas representan incrementos efectivos del carrito.
 * - Cada compra se cuenta una sola vez por número de orden.
 */
export function getAnalyticsSummary() {
  const events = getEvents();
  const purchases = new Set();

  const summary = {
    productViews: 0,
    searches: 0,
    productsAdded: 0,
    purchases: 0,
  };

  events.forEach((event) => {
    switch (event.type) {
      case ANALYTICS_EVENTS.PRODUCT_VIEW:
        summary.productViews += 1;
        break;

      case ANALYTICS_EVENTS.SEARCH:
        summary.searches += 1;
        break;

      case ANALYTICS_EVENTS.ADD_TO_CART: {
        const quantity = Number(event.data?.quantity);

        if (Number.isInteger(quantity) && quantity > 0) {
          summary.productsAdded += quantity;
        }
        break;
      }

      case ANALYTICS_EVENTS.PURCHASE_COMPLETED:
        if (event.data?.orderNumber) {
          purchases.add(event.data.orderNumber);
        }
        break;

      default:
        break;
    }
  });

  summary.purchases = purchases.size;

  return summary;
}
