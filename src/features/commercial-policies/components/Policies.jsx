import React, { useEffect, useState } from "react";
import { List } from "lucide-react";
import PoliciesSidebar from "./PoliciesSidebar";
import PoliciesContent from "./PoliciesContent";
import "../styles/Policies.css";

export default function Policies() {
  const [activePolicy, setActivePolicy] = useState("welcome");
  const [policySections, setPolicySections] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  const handleSelectPolicy = (policy) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setActivePolicy(policy);
  };

  const handleSelectSection = (sectionId) => {
    setSidebarOpen(false);
  };

  return (
    <div className="policies-page">
      <div className="policies-main-panel">
        {sidebarOpen && (
          <div
            className="policies-sidebar-overlay"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <section
          className={`policies-sidebar-component ${
            sidebarOpen ? "open" : ""
          }`}
        >
          <PoliciesSidebar
            activePolicy={activePolicy}
            onSelectPolicy={handleSelectPolicy}
            onSelectSection={handleSelectSection}
            sections={policySections}
          />
        </section>

        <section className="policies-content-component">
          <button
            className="policies-sidebar-floating-btn"
            onClick={() => setSidebarOpen(true)}
            aria-label="Abrir índice de términos y políticas"
            aria-expanded={sidebarOpen}
          >
            <List size={27} strokeWidth={2.2} />
          </button>

          <PoliciesContent
            activePolicy={activePolicy}
            onSelectPolicy={handleSelectPolicy}
            onSectionsChange={setPolicySections}
          />
        </section>
      </div>
    </div>
  );
}