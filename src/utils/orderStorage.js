import { ORDER_STATUS, PAYMENT_STATUS } from "./constants";

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

function read(key, fallback) {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch {
        return fallback;
    }
}

function write(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch {
        return;
    }
}

function nowISO() {
    return new Date().toISOString();
}

export function getOrders() {
    const list = read(ORDERS_KEY, []);
    return Array.isArray(list) ? list : [];
}

export function getOrder(orderNumber) {
    return getOrders().find((order) => order.orderNumber === orderNumber) ?? null;
}

export function getCurrentOrder() {
    const orderNumber = read(CURRENT_KEY, null);
    return orderNumber ? getOrder(orderNumber) : null;
}

export function getLastConfirmedOrder() {
    const orderNumber = read(LAST_CONFIRMED_KEY, null);
    return orderNumber ? getOrder(orderNumber) : null;
}

export function clearCurrentOrder() {
    localStorage.removeItem(CURRENT_KEY);
}

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

export function updateOrder(orderNumber, change) {
    const order = getOrder(orderNumber);
    if (!order) return null;

    const updated = typeof change === "function" ? change(order) : { ...order, ...change };
    return saveOrder(updated);
}

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

export function markPaymentStarted(orderNumber) {
    return updateOrder(orderNumber, { paymentInProgress: true });
}

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