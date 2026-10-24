import React, { useState } from "react";
import PoliciesSidebar from "./PoliciesSidebar";
import PoliciesContent from "./PoliciesContent";
import "../styles/Policies.css";

export default function Policies() {
  const [activePolicy, setActivePolicy] = useState("welcome");
  const [policySections, setPolicySections] = useState([]);

  return (
    <div className="policies-page">
      <div className="policies-main-panel">
        <section className="policies-sidebar-component">
          <PoliciesSidebar
              activePolicy={activePolicy}
              onSelectPolicy={setActivePolicy}
              sections={policySections}
          />
        </section>

        <section className="policies-content-component">
          <PoliciesContent
              activePolicy={activePolicy}
              onSelectPolicy={setActivePolicy}
              onSectionsChange={setPolicySections}
          />
        </section>
      </div>
    </div>
  );
}