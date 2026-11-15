import { Store } from "lucide-react";
import { BRANCHES } from "../../../utils/inventory";
import { getLineIssue, BRANCH_REQUIRED_MESSAGE } from "../../../utils/cartValidation";
import { useUser } from "../../../context/useUser";
import "../styles/BranchSelector.css";

/*
   * Objetivo:
   *   - Permitir elegir la sucursal desde la que se despachará o retirará la compra.
   *   - Indicar cuántos productos del carrito tienen problemas de inventario en cada sucursal.
   *
   * Entrada:
   *   - cart: Arreglo de productos en el carrito.
   *   - branchId: Identificador de la sucursal seleccionada o null.
   *   - onSelect: Función que recibe el identificador de la sucursal elegida.
   *
   * Salida:
   *   - Lista de sucursales con su disponibilidad para el carrito actual.
   *
   * Restricciones:
   *   - La disponibilidad se calcula con las mismas reglas que valida el carrito.
   */
export default function BranchSelector({ cart, branchId, onSelect }) {
  const { user } = useUser();

  return (
    <section className="branch-selector" aria-labelledby="branch-selector-title">
      <div className="branch-selector-header">
        <Store size={20} aria-hidden="true" />
        <div>
          <h2 id="branch-selector-title">Sucursal de retiro o despacho</h2>
          <p>Elige la sucursal para consultar la disponibilidad de tu pedido.</p>
        </div>
      </div>

      <div className="branch-options" role="radiogroup" aria-labelledby="branch-selector-title">
        {BRANCHES.map((branch) => {
          const problems = cart.filter((product) =>
            getLineIssue(product, user, branch.branch_id)
          ).length;
          const isSelected = branch.branch_id === branchId;

          return (
            <button
              type="button"
              role="radio"
              aria-checked={isSelected}
              key={branch.branch_id}
              className={`branch-option ${isSelected ? "is-selected" : ""}`}
              onClick={() => onSelect(branch.branch_id)}
            >
              <strong>{branch.name}</strong>
              <span className={problems === 0 ? "branch-ok" : "branch-warning"}>
                {problems === 0
                  ? "Disponible para todo tu pedido"
                  : `${problems} ${problems === 1 ? "producto" : "productos"} sin disponibilidad`}
              </span>
            </button>
          );
        })}
      </div>

      {!branchId && (
        <p className="branch-required-message" role="status">
          {BRANCH_REQUIRED_MESSAGE}
        </p>
      )}
    </section>
  );
}
