import "../styles/Footer.css";

import robotLogo from "../assets/ElectroLogo.png"; 

export default function Footer() {
    return (
        <footer className="site-footer">

            <div className="footer-main">
                
                <div className="footer-brand-newsletter">
                    <div className="footer-brand-header">
                        <img src={robotLogo} alt="Logo" className="footer-mini-logo" />
                        <h2 className="footer-headline">Electro-Commerce CR</h2>
                    </div>
                    <p className="footer-subtext">
                        Recibe actualizaciones exclusivas sobre nuevos microcontroladores, sensores y ofertas directo en tu correo.
                    </p>
                    <form className="footer-form" onSubmit={(e) => e.preventDefault()}>
                        <input type="email" placeholder="Correo electrónico" className="footer-input" />
                        <button type="submit" className="footer-submit-btn">→</button>
                    </form>
                </div>

               
                <div className="footer-links-grid">
                    <div className="footer-column">
                        <h4>Tienda</h4>
                        <ul>
                            <li><a href="/">Catálogo</a></li>
                            <li><a href="/">Componentes Pasivos</a></li>
                            <li><a href="/">Microcontroladores</a></li>
                            <li><a href="/">Sensores y Módulos</a></li>
                        </ul>
                    </div>

                    <div className="footer-column">
                        <h4>Sucursales</h4>
                        <ul>
                            <li><a href="#sj">San José Centro</a></li>
                            <li><a href="#her">Heredia</a></li>
                            <li><a href="#ala">Alajuela</a></li>
                            <li><a href="#lim">Limón</a></li>
                        </ul>
                    </div>

                    <div className="footer-column contact-column">
                        <h4>Contáctanos</h4>
                        <ul>
                            <li>
                                <svg className="contact-icon" viewBox="0 0 16 16"><path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.678.678 0 0 0-.122-.58L3.654 1.328z"/></svg>
                                (+506) 4350-2222
                            </li>
                            <li>
                                <svg className="contact-icon" viewBox="0 0 16 16"><path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555ZM0 4.697v7.104l5.803-3.558L0 4.697ZM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757Zm3.436-.586L16 11.801V4.697l-5.803 3.546Z"/></svg>
                                info@electrocommerce.cr
                            </li>
                            <li>
                                <svg className="contact-icon" viewBox="0 0 16 16"><path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/></svg>
                                San José, Costa Rica
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            
            <div className="footer-bottom">
                <div className="footer-copyright">
                    &copy; {new Date().getFullYear()} Electro-Commerce CR. Todos los derechos reservados.
                </div>
                
                <div className="footer-legal">
                    <a href="#terminos">Términos de Uso</a>
                    <a href="#privacidad">Política de Privacidad</a>
                </div>
            </div>
        </footer>
    );
}