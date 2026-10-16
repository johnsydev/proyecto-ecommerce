import { ORDER_STATUS, PAYMENT_STATUS } from "./constants";

export const MAX_PAYMENT_ATTEMPTS = 3;
export const ORDER_EXPIRATION_MINUTES = 30;

export const FAILURE_REASON = Object.freeze({
    MAX_ATTEMPTS_REACHED: "MAX_ATTEMPTS_REACHED",
    ORDER_EXPIRED: "ORDER_EXPIRED",
});

const KEYS = Object.freeze({
    orders: "orders",
    current: "currentOrderNumber",
    lastConfirmed: "lastConfirmedOrderNumber",
});



const read = (key, fallback) => {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch {
        return fallback;
    }
};

const write = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch {
        return false;
    }
};

const nowISO = () => new Date().toISOString();


export const getOrders = () => {
    const list = read(KEYS.orders, []);
    return Array.isArray(list) ? list : [];
};

export const getOrder = (orderNumber) =>
    getOrders().find((order) => order.orderNumber === orderNumber) ?? null;

export const getCurrentOrder = () => {
    const orderNumber = read(KEYS.current, null);
    return orderNumber ? getOrder(orderNumber) : null;
};

export const getLastConfirmedOrder = () => {
    const orderNumber = read(KEYS.lastConfirmed, null);
    return orderNumber ? getOrder(orderNumber) : null;
};

export const clearCurrentOrder = () => {
    try {
        localStorage.removeItem(KEYS.current);
    } catch {
        
    }
};


function saveOrder(order) {
    const list = getOrders();
    const index = list.findIndex((item) => item.orderNumber === order.orderNumber);
    const stamped = { ...order, updatedAt: nowISO() };

    if (index >= 0) {
        list[index] = stamped;
    } else {
        list.unshift(stamped);
    }

    write(KEYS.orders, list);
    return stamped;
}

export function updateOrder(orderNumber, patch) {
    const current = getOrder(orderNumber);
    if (!current) {
        return null;
    }
    const next = typeof patch === "function" ? patch(current) : { ...current, ...patch };
    return saveOrder(next);
}


export function createOrReuseOrder(newOrder) {
    expireStaleOrders();
    const existing = getCurrentOrder();

    if (existing && existing.orderStatus === ORDER_STATUS.PENDING) {
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

    const created = saveOrder({
        paymentAttempts: 0,
        paymentHistory: [],
        paymentInProgress: false,
        createdAt: nowISO(),
        ...newOrder,
    });
    write(KEYS.current, created.orderNumber);
    return created;
}


export const markPaymentStarted = (orderNumber) =>
    updateOrder(orderNumber, { paymentInProgress: true });


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
        write(KEYS.lastConfirmed, updated.orderNumber);
        clearCurrentOrder(); // ya no hay una orden "en proceso"
    }
    return updated;
}

export function recoverInterruptedPayment(orderNumber) {
    const order = getOrder(orderNumber);
    if (!order || !order.paymentInProgress || order.orderStatus !== ORDER_STATUS.PENDING) {
        return { order, interrupted: false };
    }

    const updated = updateOrder(orderNumber, (o) =>
        applyAttempt(o, { status: "PAYMENT_ERROR", reason: "PAYMENT_INTERRUPTED", processedAt: nowISO() })
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
        write(KEYS.orders, list);
    }
    return changed;
}