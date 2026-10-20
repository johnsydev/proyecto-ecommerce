import { ChevronRight } from "lucide-react";
import "../styles/PoliciesSidebar.css";

const policies = [
  { id: "welcome", label: "Inicio" },
  { id: "terms-and-conditions", label: "Términos y Condiciones" },
  { id: "return-policy", label: "Política de Devoluciones" },
  { id: "shipping-policy", label: "Política de Envíos" },
  { id: "privacy-policy", label: "Política de Privacidad" },
  { id: "faq", label: "Preguntas Frecuentes (FAQ)" },
];

export default function PoliciesSidebar({ activePolicy, onSelectPolicy }) {
  return (
    <aside className="policies-sidebar">
      <div className="policies-sidebar-content">
        <h2 className="policies-sidebar-title">
          Políticas comerciales
        </h2>

        <ul className="policies-sidebar-list">
          {policies.map((policy) => (
            <li key={policy.id} className="policies-sidebar-item">
              <button
                type="button"
                className={`policies-sidebar-button ${
                  activePolicy === policy.id ? "active" : ""
                }`}
                onClick={() => onSelectPolicy(policy.id)}
                aria-current={
                  activePolicy === policy.id ? "page" : undefined
                }
              >
                <span className="policies-sidebar-label">
                  {policy.label}
                </span>

                <ChevronRight
                  className="policies-sidebar-arrow"
                  size={20}
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}