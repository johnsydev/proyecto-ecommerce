
/*
   * Objetivo:
   *   - Definir constantes utilizadas en la aplicación, incluyendo estados de órdenes, estados de pagos y versiones de políticas.
   */

export const ORDER_STATUS = Object.freeze({
    PENDING: "PENDING",
    CONFIRMED: "CONFIRMED",
    DELIVERED: "DELIVERED",
    FAILED: "FAILED",
});

export const PAYMENT_STATUS = Object.freeze({
    PENDING: "PENDING",
    APPROVED: "APPROVED",
    DECLINED: "DECLINED",
    ERROR: "ERROR",
});

export const TERMS_AND_CONDITIONS_VERSION = "1.0.0";
export const PRIVACY_POLICY_VERSION = "1.0.0";