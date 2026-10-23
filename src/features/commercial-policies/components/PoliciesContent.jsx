import PoliciesWelcome from "./PoliciesWelcome";

export default function PoliciesContent({ activePolicy, onSelectPolicy }) {
    if (activePolicy === "welcome") {
        return <PoliciesWelcome onSelectPolicy={onSelectPolicy} />;
    }

    return (
        <div className="policies-content">
            <section id="privacy-policy">
                <h2 className="policies-content-title">Titulo</h2>
                <p>
                    Este es el contenido de la política de privacidad. Aquí puedes detallar cómo manejas la información personal de los usuarios, qué datos recopilas, cómo los utilizas y cómo los proteges.
                </p>
            </section>
        </div>
    );
}