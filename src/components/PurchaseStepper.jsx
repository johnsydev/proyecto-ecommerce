import "../styles/PurchaseStepper.css";

/*
  * Objetivo:
  * Componente que muestra el progreso de la compra en un paso a paso visual.
  * Muestra el paso actual y los pasos completados en la interfaz de usuario.
  * Actualiza visualmente el progreso a medida que el usuario avanza en el proceso de compra.
  * Recibe el paso actual como prop y lo utiliza para determinar qué pasos están completados y cuál está activo.
  * Utiliza una lista de pasos predefinidos para renderizar el componente de manera dinámica.
  * 
  * Entrada:
  *   - currentStep: Número del paso actual en el proceso de compra.
  * Salida:
  *   - Renderizado del componente de progreso de compra con el paso actual destacado.
  * Restricciones:
  *   - currentStep debe ser un número válido correspondiente a uno de los pasos definidos en STEPS.
*/

const STEPS = [
  { number: 1, label: "Carrito", title: "Mi carrito", description: "Revisa tus productos antes de continuar con la compra." },
  { number: 2, label: "Checkout", title: "Checkout", description: "Completa la información de envío y pago." },
  { number: 3, label: "Pago", title: "Proceso de pago", description: "Selecciona tu método de pago y completa la transacción." },
  { number: 4, label: "Confirmación", title: "Confirmación", description: "Confirma tu pedido y recibe tu confirmación por email." },
];

export default function PurchaseStepper({ currentStep }) {
  const activeStep =
    STEPS.find((step) => step.number === currentStep) ?? STEPS[0];

  return (
    <div className="cart-checkout-header">
      <div className="cart-checkout-heading">
        <h1>{activeStep.title}</h1>
        <p>{activeStep.description}</p>
      </div>

      <nav className="purchase-stepper" aria-label="Progreso de compra">
        {STEPS.map((step, index) => {
          const isCompleted = step.number < currentStep;
          const isActive = step.number === currentStep;

          return (
            <div className="purchase-step-wrapper" key={step.number}>
              <div
                className={[
                  "purchase-step",
                  isActive ? "active" : "",
                  isCompleted ? "completed" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                aria-current={isActive ? "step" : undefined}
              >
                <span className="purchase-step-number">
                  {isCompleted ? "✓" : step.number}
                </span>

                <span className="purchase-step-label">{step.label}</span>
              </div>

              {index < STEPS.length - 1 && (
                <span
                  className={[
                    "purchase-step-line",
                    isCompleted ? "completed" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  aria-hidden="true"
                />
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
}