import React, { useState } from "react";
import PoliciesSidebar from "./PoliciesSidebar";
import PoliciesContent from "./PoliciesContent";
import "../styles/Policies.css";

export default function Policies() {
  const [activePolicy, setActivePolicy] = useState("welcome");

  return (
    <div className="policies-page">
      <div className="policies-main-panel">
        <section className="policies-sidebar-component">
          <PoliciesSidebar
            activePolicy={activePolicy}
            onSelectPolicy={setActivePolicy}
          />
        </section>

        <section className="policies-content-component">
          <PoliciesContent activePolicy={activePolicy} />
        </section>
      </div>
    </div>
  );
}