
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { List } from "lucide-react";
import PoliciesSidebar from "./PoliciesSidebar";
import PoliciesContent from "./PoliciesContent";
import "../styles/Policies.css";

export default function Policies() {
  const location = useLocation();
  const navigate = useNavigate();

  const getPolicyFromPath = (pathname) => {
    const policy = pathname.split("/")[2];

    const validPolicies = [
      "terms-and-conditions",
      "return-policy",
      "shipping-policy",
      "privacy-policy",
      "faq",
    ];

    return validPolicies.includes(policy) ? policy : "welcome";
  };

  const [activePolicy, setActivePolicy] = useState(() =>
    getPolicyFromPath(location.pathname)
  );
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

  useEffect(() => {
    setActivePolicy(getPolicyFromPath(location.pathname));
  }, [location.pathname]);

  const handleSelectPolicy = (policy) => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    navigate(
      policy === "welcome" ? "/policies" : `/policies/${policy}`
    );

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
