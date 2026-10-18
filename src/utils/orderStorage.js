import { ORDER_STATUS, PAYMENT_STATUS } from "./constants";

/*
   * Objetivo:
   *   - Proporcionar funciones para almacenar, recuperar y actualizar órdenes en el almacenamiento local.
   * 
   * Entrada:
   *   - Ninguna entrada directa; interactúa con el almacenamiento local.
   * 
   * Salida:
   *   - Funciones para manipular órdenes y su estado.
   */
export const MAX_PAYMENT_ATTEMPTS = 3;
export const ORDER_EXPIRATION_MINUTES = 30;

export const FAILURE_REASON = {
    MAX_ATTEMPTS_REACHED: "MAX_ATTEMPTS_REACHED",
    ORDER_EXPIRED: "ORDER_EXPIRED",
    NETWORK_OFFLINE: "NETWORK_OFFLINE",
    ORDER_ABANDONED: "ORDER_ABANDONED",
};

const ORDERS_KEY = "orders";
const CURRENT_KEY = "currentOrderNumber";
const LAST_CONFIRMED_KEY = "lastConfirmedOrderNumber";

/*
   * Objetivo:
   *   - Leer un ítem del almacenamiento local y parsearlo desde JSON.
   * 
   * Entrada:
   *   - key: Clave del ítem a leer.
   *   - fallback: Valor a retornar si no se encuentra el ítem o ocurre un error.
   * 
   * Salida:
   *   - Valor parseado desde JSON o el valor de fallback.
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
   *   - Escribir un ítem en el almacenamiento local como JSON.
   * 
   * Entrada:
   *   - key: Clave del ítem a escribir.
   *   - value: Valor a almacenar.
   * 
   * Salida:
   *   - Ninguna salida; el valor se almacena en el almacenamiento local.
   */
function write(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch {
        return;
    }
}
/*
   * Objetivo:
   *   - Obtener la fecha y hora actual en formato ISO.
   * 
   * Entrada:
   *   - Ninguna entrada.
   * 
   * Salida:
   *   - Cadena con la fecha y hora actual en formato ISO.
   */
function nowISO() {
    return new Date().toISOString();
}

/*
   * Objetivo:
   *   - Obtener la lista de todas las órdenes almacenadas.
   * 
   * Entrada:
   *   - Ninguna entrada.
   * 
   * Salida:
   *   - Array con todas las órdenes almacenadas.
   */
export function getOrders() {
    const list = read(ORDERS_KEY, []);
    return Array.isArray(list) ? list : [];
}

/*
   * Objetivo:
   *   - Obtener una orden específica por su número de orden.
   * 
   * Entrada:
   *   - orderNumber: Número de la orden a buscar.
   * 
   * Salida:
   *   - Objeto de la orden si se encuentra, o null si no existe.
   */
export function getOrder(orderNumber) {
    return getOrders().find((order) => order.orderNumber === orderNumber) ?? null;
}

/*
   * Objetivo:
   *   - Obtener la orden actualmente activa.
   * 
   * Entrada:
   *   - Ninguna entrada.
   * 
   * Salida:
   *   - Objeto de la orden actual si existe, o null si no hay orden activa.
   */
export function getCurrentOrder() {
    const orderNumber = read(CURRENT_KEY, null);
    return orderNumber ? getOrder(orderNumber) : null;
}

/*
   * Objetivo:
   *   - Obtener la última orden confirmada.
   * 
   * Entrada:
   *   - Ninguna entrada.
   * 
   * Salida:
   *   - Objeto de la última orden confirmada si existe, o null si no hay ninguna.
   */
export function getLastConfirmedOrder() {
    const orderNumber = read(LAST_CONFIRMED_KEY, null);
    return orderNumber ? getOrder(orderNumber) : null;
}

/*
   * Objetivo:
   *   - Limpiar la orden actualmente activa del almacenamiento local.
   * 
   * Entrada:
   *   - Ninguna entrada.
   * 
   * Salida:
   *   - Ninguna salida; la orden actual se elimina del almacenamiento local.
   */
export function clearCurrentOrder() {
    localStorage.removeItem(CURRENT_KEY);
}

/*
   * Objetivo:
   *   - Guardar una orden en el almacenamiento local.
   * 
   * Entrada:
   *   - order: Objeto de la orden a guardar.
   * 
   * Salida:
   *   - Objeto de la orden guardada, incluyendo la fecha de actualización.
   */

function saveOrder(order) {
    const list = getOrders();
    const index = list.findIndex((item) => item.orderNumber === order.orderNumber);
    const saved = { ...order, updatedAt: nowISO() };

    if (index >= 0) {
        list[index] = saved;
    } else {
        list.unshift(saved);
    }

    write(ORDERS_KEY, list);
    return saved;
}

/*
   * Objetivo:
   *   - Actualizar una orden existente con cambios específicos.
   * 
   * Entrada:
   *   - orderNumber: Número de la orden a actualizar.
   *   - change: Objeto con los cambios a aplicar o función que recibe la orden actual y devuelve la orden actualizada.
   * 
   * Salida:
   *   - Objeto de la orden actualizada si la orden existe, o null si no se encuentra la orden.
   */
export function updateOrder(orderNumber, change) {
    const order = getOrder(orderNumber);
    if (!order) return null;

    const updated = typeof change === "function" ? change(order) : { ...order, ...change };
    return saveOrder(updated);
}

/*
   * Objetivo:
   *   - Crear una nueva orden o reutilizar la orden actualmente activa si es posible.
   * 
   * Entrada:
   *   - newOrder: Objeto de la nueva orden a crear.
   *   - reuse: Booleano que indica si se debe reutilizar la orden activa si existe.
   * 
   * Salida:
   *   - Objeto de la orden creada o reutilizada.
   */
export function createOrReuseOrder(newOrder, reuse = false) {
    expireStaleOrders();
    const existing = getCurrentOrder();

    if (existing && existing.orderStatus === ORDER_STATUS.PENDING) {
        if (reuse) {
            return saveOrder({
                ...newOrder,
                orderNumber: existing.orderNumber,
                createdAt: existing.createdAt,
                paymentStatus: existing.paymentStatus,
                paymentAttempts: existing.paymentAttempts ?? 0,
                paymentHistory: existing.paymentHistory ?? [],
                paymentInProgress: existing.paymentInProgress ?? false,
            });
        }

        updateOrder(existing.orderNumber, {
            orderStatus: ORDER_STATUS.FAILED,
            paymentInProgress: false,
            failureReason: FAILURE_REASON.ORDER_ABANDONED,
            failedAt: nowISO(),
        });
    }

    const created = saveOrder({
        paymentAttempts: 0,
        paymentHistory: [],
        paymentInProgress: false,
        createdAt: nowISO(),
        ...newOrder,
    });

    write(CURRENT_KEY, created.orderNumber);
    return created;
}

/*
   * Objetivo:
   *   - Marcar el inicio de un intento de pago para una orden específica.
   * 
   * Entrada:
   *   - orderNumber: Número de la orden para la cual se inicia el pago.
   * 
   * Salida:
   *   - Objeto de la orden actualizada con el estado de pago en progreso.
   */

export function markPaymentStarted(orderNumber) {
    return updateOrder(orderNumber, { paymentInProgress: true });
}

/*
   * Objetivo:
   *   - Aplicar un intento de pago a una orden específica, actualizando su historial y estado de pago.
   * 
   * Entrada:
   *   - order: Objeto de la orden a la cual se aplica el intento de pago.
   *   - response: Objeto de respuesta del intento de pago, incluyendo estado, razón y detalles de la transacción.
   * 
   * Salida:
   *   - Objeto de la orden actualizada con el resultado del intento de pago.
   */

function applyAttempt(order, response) {
    const attempts = (order.paymentAttempts ?? 0) + 1;

    const history = [
        ...(order.paymentHistory ?? []),
        {
            attempt: attempts,
            status: response.status,
            reason: response.reason ?? null,
            transactionId: response.transactionId ?? null,
            at: response.processedAt ?? nowISO(),
        },
    ];

    const base = { ...order, paymentAttempts: attempts, paymentHistory: history, paymentInProgress: false };

    if (response.status === "PAYMENT_APPROVED") {
        return {
            ...base,
            paymentStatus: PAYMENT_STATUS.APPROVED,
            orderStatus: ORDER_STATUS.CONFIRMED,
            transactionId: response.transactionId,
            paidAt: response.processedAt ?? nowISO(),
            currencySymbol: response.currencySymbol ?? order.currencySymbol,
            failureReason: null,
        };
    }

    if (response.reason === "NETWORK_OFFLINE") {
        return {
            ...base,
            paymentStatus: PAYMENT_STATUS.ERROR,
            orderStatus: ORDER_STATUS.FAILED,
            failureReason: FAILURE_REASON.NETWORK_OFFLINE,
            failedAt: nowISO(),
        };
    }

    const paymentStatus =
        response.status === "PAYMENT_DECLINED" ? PAYMENT_STATUS.DECLINED : PAYMENT_STATUS.ERROR;

    if (attempts >= MAX_PAYMENT_ATTEMPTS) {
        return {
            ...base,
            paymentStatus,
            orderStatus: ORDER_STATUS.FAILED,
            failureReason: FAILURE_REASON.MAX_ATTEMPTS_REACHED,
            failedAt: nowISO(),
        };
    }

    return { ...base, paymentStatus, orderStatus: ORDER_STATUS.PENDING };
}

/*
   * Objetivo:
   *   - Registrar un intento de pago para una orden específica.
   * 
   * Entrada:
   *   - orderNumber: Número de la orden para la cual se registra el intento de pago.
   *   - response: Objeto de respuesta del intento de pago, incluyendo estado, razón y detalles de la transacción.
   * 
   * Salida:
   *   - Objeto de la orden actualizada con el resultado del intento de pago.
   */
export function recordPaymentAttempt(orderNumber, response) {
    const updated = updateOrder(orderNumber, (order) =>
        order.orderStatus === ORDER_STATUS.PENDING ? applyAttempt(order, response) : order
    );

    if (updated?.orderStatus === ORDER_STATUS.CONFIRMED) {
        write(LAST_CONFIRMED_KEY, updated.orderNumber);
        clearCurrentOrder();
    }

    return updated;
}

/*
   * Objetivo:
   *   - Recuperar un pago interrumpido para una orden específica.
   * 
   * Entrada:
   *   - orderNumber: Número de la orden para la cual se intenta recuperar el pago interrumpido.
   * 
   * Salida:
   *   - Objeto que indica la orden actualizada y si hubo un pago interrumpido.
   */

export function recoverInterruptedPayment(orderNumber) {
    const order = getOrder(orderNumber);

    if (!order || !order.paymentInProgress || order.orderStatus !== ORDER_STATUS.PENDING) {
        return { order, interrupted: false };
    }

    const updated = updateOrder(orderNumber, (current) =>
        applyAttempt(current, {
            status: "PAYMENT_ERROR",
            reason: "PAYMENT_INTERRUPTED",
            processedAt: nowISO(),
        })
    );

    return { order: updated, interrupted: true };
}

/*
   * Objetivo:
   *   - Expirar órdenes pendientes que han estado inactivas por más tiempo del permitido.
   * 
   * Entrada:
   *   - Ninguna.
   * 
   * Salida:
   *   - Booleano que indica si alguna orden fue expirada.
   */
export function expireStaleOrders() {
    const limit = Date.now() - ORDER_EXPIRATION_MINUTES * 60 * 1000;
    let changed = false;

    const list = getOrders().map((order) => {
        if (order.orderStatus !== ORDER_STATUS.PENDING) {
            return order;
        }

        const lastActivity = new Date(order.updatedAt ?? order.createdAt ?? order.date).getTime();
        if (Number.isNaN(lastActivity) || lastActivity >= limit) {
            return order;
        }

        changed = true;
        return {
            ...order,
            orderStatus: ORDER_STATUS.FAILED,
            paymentInProgress: false,
            failureReason: FAILURE_REASON.ORDER_EXPIRED,
            failedAt: nowISO(),
        };
    });

    if (changed) {
        write(ORDERS_KEY, list);
    }

    return changed;
}