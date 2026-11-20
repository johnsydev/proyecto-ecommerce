import { ORDER_LABELS, PAYMENT_LABELS } from "../../../utils/constants";

/*
 * Objetivo:
 * Mostrar el estado de una orden o de su pago con un color según el estado.
 *
 * Entrada:
 * - status: Valor del estado (por ejemplo CONFIRMED o APPROVED).
 * - type: "order" para el estado de la orden; "payment" para el del pago.
 */
export default function StatusPill({ status, type = "order" }) {
  const labels = type === "payment" ? PAYMENT_LABELS : ORDER_LABELS;

  return (
    <span className={`orders-pill orders-pill--${String(status).toLowerCase()}`}>
      {labels[status] ?? status ?? "—"}
    </span>
  );
}
