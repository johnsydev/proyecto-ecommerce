import {
  FileText,
  RotateCcw,
  Truck,
  ShieldCheck,
  CircleHelp,
  ArrowRight,
} from "lucide-react";
import "../styles/PoliciesWelcome.css";

const policyCards = [
  {
    id: "terms-and-conditions",
    title: "Términos y Condiciones",
    description:
      "Conozca las condiciones de uso del sitio y las responsabilidades de compra.",
    icon: FileText,
  },
  {
    id: "return-policy",
    title: "Política de Devoluciones",
    description:
      "Consulte los requisitos, plazos y pasos para solicitar una devolución.",
    icon: RotateCcw,
  },
  {
    id: "shipping-policy",
    title: "Política de Envíos",
    description:
      "Información sobre las entregas, los costos y los tiempos estimados.",
    icon: Truck,
  },
  {
    id: "privacy-policy",
    title: "Política de Privacidad",
    description:
      "Descubra cómo gestionamos y protegemos tu información personal.",
    icon: ShieldCheck,
  },
  {
    id: "faq",
    title: "Preguntas Frecuentes",
    description:
      "Encuentre respuestas a las dudas más comunes sobre compras y pagos.",
    icon: CircleHelp,
  },
];

export default function PoliciesWelcome({ onSelectPolicy }) {
  return (
    <div className="policies-welcome">
      <div className="policies-welcome-header">
        <h1 className="policies-welcome-title">
            Información para tu compra
        </h1>

        <p className="policies-welcome-description">
            Consultá nuestras políticas de compra, envíos, devoluciones y privacidad.
        </p>
      </div>

      <div className="policies-welcome-section">
        <h2 className="policies-welcome-section-title">
          ¿Qué información necesitás?
        </h2>

        <p className="policies-welcome-section-description">
          Seleccioná una categoría para conocer todos los detalles.
        </p>
      </div>

      <div className="policies-welcome-cards">
        {policyCards.map((policy) => {
          const Icon = policy.icon;

          return (
            <button
              key={policy.id}
              type="button"
              className="policies-welcome-card"
              onClick={() => onSelectPolicy(policy.id)}
            >
              <div className="policies-welcome-card-icon">
                <Icon size={26} strokeWidth={1.8} />
              </div>

              <div className="policies-welcome-card-content">
                <h3 className="policies-welcome-card-title">
                  {policy.title}
                </h3>

                <p className="policies-welcome-card-description">
                  {policy.description}
                </p>
              </div>

              <div className="policies-welcome-card-footer">
                <span>Consultar información</span>

                <ArrowRight
                  size={18}
                  strokeWidth={2}
                  className="policies-welcome-card-arrow"
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}