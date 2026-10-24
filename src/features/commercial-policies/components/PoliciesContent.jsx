import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import PoliciesWelcome from "./PoliciesWelcome";
import TermsAndConditions from "./TermsAndConditions";
import ReturnPolicy from "./ReturnPolicy";
import ShippingPolicy from "./ShippingPolicy";
import PrivacyPolicy from "./PrivacyPolicy";
import FAQ from "./FAQ";
import "../styles/PoliciesContent.css";

export default function PoliciesContent({
    activePolicy,
    onSelectPolicy,
    onSectionsChange,
}) {
    const [showScroll, setShowScroll] = useState(false);

   
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowScroll(true);
            } else {
                setShowScroll(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const container = document.querySelector(".policies-content");

        if (!container || activePolicy === "" || activePolicy === "faq") {
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

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const renderPolicyComponent = () => {
        if (activePolicy === "welcome") {
            return <PoliciesWelcome onSelectPolicy={onSelectPolicy} />;
        } else if (activePolicy === "terms-and-conditions") {
            return <TermsAndConditions />;
        } else if (activePolicy === "return-policy") {
            return <ReturnPolicy />;
        } else if (activePolicy === "shipping-policy") {
            return <ShippingPolicy />;
        } else if (activePolicy === "privacy-policy") {
            return <PrivacyPolicy />;
        } else if (activePolicy === "faq") {
            return <FAQ />;
        }

        return (
            <div className="policies-content">
                <section id="privacy-policy">
                    <h2 className="policies-content-title">Título</h2>
                    <p>Este es el contenido de la sección.</p>
                </section>
            </div>
        );
    };

    return (
        <>
            {renderPolicyComponent()}

            
            {activePolicy !== "welcome" && activePolicy !== "" && (
                <button
                    className={`policy-scroll-top ${showScroll ? 'visible' : ''}`}
                    onClick={scrollToTop}
                    aria-label="Volver arriba"
                >
                    <ArrowUp size={22} strokeWidth={2.5} />
                </button>
            )}
        </>
    );
}