import { useEffect, useState } from "react";
import { loadAllProducts } from "../services/adminProductsService";

/*
 * Objetivo:
 * Cargar el catálogo para las pestañas de productos e inventario.
 *
 * Salida:
 * - { products, loading, error }.
 */
export function useAdminProducts() {
  const [state, setState] = useState({
    products: [],
    loading: true,
    error: false,
  });

  useEffect(() => {
    let cancelled = false;

    loadAllProducts()
      .then((products) => {
        if (!cancelled) setState({ products, loading: false, error: false });
      })
      .catch(() => {
        if (!cancelled) setState({ products: [], loading: false, error: true });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}