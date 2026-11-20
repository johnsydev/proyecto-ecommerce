import { useState } from "react";
import {
  clearStockOverrides,
  readStockOverrides,
  saveStockOverride,
} from "../../../utils/stockOverrides";

/*
 * Objetivo:
 * Manejar los cambios de inventario del panel administrativo.
 *
 * Salida:
 * - overrides: Cambios guardados { idProducto: { idSucursal: unidades } }.
 * - saveOverride: Guarda las unidades de un producto en una sucursal; lanza
 *   un error si no se puede guardar.
 * - resetOverrides: Elimina todos los cambios y vuelve al inventario original.
 */
export function useStockOverrides() {
  const [overrides, setOverrides] = useState(readStockOverrides);

  const saveOverride = (productId, branchId, units) => {
    setOverrides(saveStockOverride(productId, branchId, units));
  };

  const resetOverrides = () => {
    clearStockOverrides();
    setOverrides({});
  };

  return { overrides, saveOverride, resetOverrides };
}