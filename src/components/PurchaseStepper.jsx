import "../styles/PurchaseStepper.css";

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