import "../styles/StoresStock.css";

/*
 * Objetivo:
 * Mostrar la disponibilidad de un producto en cada sucursal e indicar
 * visualmente el nivel de existencias mediante diferentes colores.
 *
 * Entrada:
 * - Recibe mediante la propiedad branches una lista de sucursales.
 * - Cada sucursal debe incluir su identificador, nombre y cantidad disponible.
 *
 * Salida:
 * - Muestra una lista con las sucursales y la cantidad disponible del producto.
 * - Muestra "Sin existencias" cuando una sucursal no tiene unidades disponibles.
 * - Asigna un color según la cantidad de stock disponible.
 *
 * Restricciones:
 * - La propiedad branches debe contener una lista válida de sucursales.
 * - Cada sucursal debe incluir branch_id, name y stock_quantity.
 * - Si el stock es de 10 unidades o más, se utiliza el color verde.
 * - Si el stock está entre 5 y 9 unidades, se utiliza el color naranja.
 * - Si el stock está entre 1 y 4 unidades, se utiliza el color rojo.
 * - Si el stock es 0 o menor, se muestra el mensaje "Sin existencias".
 * - El archivo StoresStock.css debe estar correctamente importado.
 */

export default function StoresStock({ branches }) {

    const colorStock = (stock) => {
        if (stock >= 10) {
            return "green";
        } else if (stock >= 5) {
            return "orange";
        }
        else {
            return "red";
        }
    };

    return (
        <div className="pi-product-stock-branches">
            <h3>Disponibilidad en sucursales:</h3>
            <ul className="pi-branch-list">
                {branches.map((branch) => (
                    <li key={branch.branch_id} className="pi-branch-item">
                        <span className="pi-branch-title">{branch.name}</span>
                        {
                            branch.stock_quantity <= 0 ? (
                                <span className={`stock-color-red`}>Sin existencias</span>
                            ) : (
                                <span className={`stock-color-${colorStock(branch.stock_quantity)}`}>{branch.stock_quantity} disponible{(branch.stock_quantity > 1 ? "s" : "")}</span>
                            )
                        }

                    </li>
                ))}
            </ul>
        </div>
    );
}