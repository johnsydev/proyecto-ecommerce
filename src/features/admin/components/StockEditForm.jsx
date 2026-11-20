import { useState } from "react";
import { validateStock } from "../utils/adminValidations";
import { BRANCHES, formatUnits, getBranch, getBranchStock } from "../../../utils/inventory";

/*
 * Objetivo:
 * Formulario con el que el administrador simula el cambio de inventario de
 * un producto en una sucursal.
 *
 * Entrada:
 * - product: Producto que se modifica.
 * - saveOverride: Función que guarda (idProducto, idSucursal, unidades).
 * - onSaved: Recibe el mensaje con el valor anterior y el nuevo.
 * - onCancel: Cierra el formulario.
 *
 * Salida:
 * - Formulario con la sucursal, las unidades actuales y las unidades nuevas.
 *
 * Restricciones:
 * - El producto debe tener registrada la sucursal elegida.
 * - Las unidades nuevas se validan con validateStock.
 * - Si no se puede guardar, el error se muestra en el formulario.
 */
export default function StockEditForm({ product, saveOverride, onSaved, onCancel }) {
  const [branchId, setBranchId] = useState(BRANCHES[0].branch_id);
  const [newValue, setNewValue] = useState("");
  const [error, setError] = useState("");

  const current = getBranchStock(product, branchId);

  const handleSubmit = (event) => {
    event.preventDefault();

    const hasBranch = product.branches?.some((item) => item.branch_id === branchId);

    if (!hasBranch) {
      setError("Este producto no tiene registrada esa sucursal en el inventario.");
      return;
    }

    const result = validateStock(newValue, current);

    if (result.error) {
      setError(result.error);
      return;
    }

    try {
      saveOverride(product.objectID, branchId, result.value);
    } catch (saveError) {
      setError(saveError.message);
      return;
    }

    onSaved(
      `Inventario de "${product.title}" en ${getBranch(branchId).name}: ${formatUnits(current)} → ${formatUnits(result.value)}. Los clientes ya ven este cambio en el catálogo.`,
    );
  };

  return (
    <form className="admin-edit-form" onSubmit={handleSubmit} noValidate>
      <strong>Modificar inventario: {product.title}</strong>

      <div className="admin-edit-fields">
        <label>
          Sucursal
          <select
            value={branchId}
            onChange={(event) => {
              setBranchId(event.target.value);
              setError("");
            }}
          >
            {BRANCHES.map((branch) => (
              <option key={branch.branch_id} value={branch.branch_id}>
                {branch.name}
              </option>
            ))}
          </select>
        </label>

        <div className="admin-edit-current">
          Unidades actuales
          <strong>{formatUnits(current)}</strong>
        </div>

        <label>
          Unidades nuevas
          <input
            type="text"
            inputMode="numeric"
            value={newValue}
            onChange={(event) => {
              setNewValue(event.target.value);
              setError("");
            }}
            aria-invalid={error !== ""}
          />
        </label>

        <div className="admin-edit-actions">
          <button type="submit" className="admin-btn admin-btn--primary">
            Guardar cambio
          </button>
          <button type="button" className="admin-btn" onClick={onCancel}>
            Cancelar
          </button>
        </div>
      </div>

      {error && (
        <p className="admin-edit-error" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}