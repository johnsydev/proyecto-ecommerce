import { useEffect, useState } from "react";
import { loadAllOrders } from "../services/adminOrdersService";

/*
 * Objetivo:
 * Cargar todas las órdenes para la pestaña de órdenes del panel administrativo.
 *
 * Salida:
 * - { orders, loading, historyError }.
 */
export function useAdminOrders() {
  const [state, setState] = useState({
    orders: [],
    loading: true,
    historyError: false,
  });

  useEffect(() => {
    let cancelled = false;

    loadAllOrders()
      .then(({ orders, historyError }) => {
        if (!cancelled) setState({ orders, loading: false, historyError });
      })
      .catch(() => {
        if (!cancelled) {
          setState({ orders: [], loading: false, historyError: true });
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}