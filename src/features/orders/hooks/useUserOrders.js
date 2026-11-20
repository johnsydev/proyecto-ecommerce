import { useEffect, useState } from "react";
import { loadUserOrders } from "../services/ordersService";

/*
 * Objetivo:
 * Cargar las órdenes del usuario activo para las pantallas de órdenes.
 *
 * Entrada:
 * - userId: Identificador del usuario activo.
 *
 * Salida:
 * - { orders, loading, historyError }.
 */
export function useUserOrders(userId) {
  const [state, setState] = useState({
    orders: [],
    loading: true,
    historyError: false,
  });

  useEffect(() => {
    let cancelled = false;

    loadUserOrders(userId).then(({ orders, historyError }) => {
      if (!cancelled) setState({ orders, loading: false, historyError });
    });

    return () => {
      cancelled = true;
    };
  }, [userId]);

  return state;
}
