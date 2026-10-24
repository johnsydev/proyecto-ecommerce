import { useEffect } from "react";
import PoliciesWelcome from "./PoliciesWelcome";
import TermsAndConditions from "./TermsAndConditions";
import ReturnPolicy from "./ReturnPolicy";
import "../styles/PoliciesContent.css";

export default function PoliciesContent({
    activePolicy,
    onSelectPolicy,
    onSectionsChange,
}) {
    useEffect(() => {
        const container = document.querySelector(".policies-content");

        if (!container || activePolicy === "welcome") {
            onSectionsChange([]);
            return;
        }

        const headings = container.querySelectorAll("h2, h3");

        const sections = Array.from(headings).map((heading, index) => {
            if (!heading.id) {
                heading.id = `policy-section-${index}`;
            }

            return {
                id: heading.id,
                label: heading.textContent.trim(),
                level: heading.tagName.toLowerCase(),
            };
        });

        onSectionsChange(sections);
    }, [activePolicy, onSectionsChange]);

    if (activePolicy === "welcome") {
        return <PoliciesWelcome onSelectPolicy={onSelectPolicy} />;
    } else if (activePolicy === "terms-and-conditions") {
        return <TermsAndConditions />;
    } else if (activePolicy === "return-policy") {
        return <ReturnPolicy />;
    }

    return (
        <div className="policies-content">
            <section id="privacy-policy">
                <h2 className="policies-content-title">Título</h2>
                <p>
                    Este es el contenido de la política de privacidad.
                </p>
            </section>
        </div>
    );
}