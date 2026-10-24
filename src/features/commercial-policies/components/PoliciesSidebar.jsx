import { useEffect, useState } from "react";
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

export default function PoliciesSidebar({
  activePolicy,
  onSelectPolicy,
  sections = [],
}) {
  const [expandedPolicy, setExpandedPolicy] = useState(activePolicy);

  useEffect(() => {
    setExpandedPolicy(activePolicy);
  }, [activePolicy]);

  const handlePolicyClick = (policyId) => {
    if (activePolicy === policyId) {
      setExpandedPolicy((current) =>
        current === policyId ? null : policyId
      );
      return;
    }

    setExpandedPolicy(policyId);
    onSelectPolicy(policyId);
  };

  const handleSectionClick = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <aside className="policies-sidebar">
      <div className="policies-sidebar-content">
        <h2 className="policies-sidebar-title">
          Políticas comerciales
        </h2>

        <ul className="policies-sidebar-list">
          {policies.map((policy) => {
            const isActive = activePolicy === policy.id;
            const isExpanded = expandedPolicy === policy.id && policy.id !== "welcome";
            const hasSections = isActive && sections.length > 0;

            return (
              <li key={policy.id} className="policies-sidebar-item">
                <button
                  type="button"
                  className={`policies-sidebar-button ${
                    isActive ? "active" : ""
                  }`}
                  onClick={() => handlePolicyClick(policy.id)}
                  aria-current={isActive ? "page" : undefined}
                  aria-expanded={hasSections ? isExpanded : undefined}
                >
                  <span className="policies-sidebar-label">
                    {policy.label}
                  </span>

                  <ChevronRight
                    className={`policies-sidebar-arrow ${
                      isExpanded ? "expanded" : ""
                    }`}
                    size={20}
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                </button>

                {hasSections && isExpanded && (
                  <ul className="policies-sidebar-sublist">
                    {sections.map((section) => (
                      <li
                        key={section.id}
                        className={`policies-sidebar-subitem ${
                          section.level === "h3" ? "nested" : ""
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => handleSectionClick(section.id)}
                        >
                          {section.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}