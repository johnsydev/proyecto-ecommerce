import SearchBar from "../features/catalog/components/SearchBar";
import "../styles/Header.css";
import robotLogo from "../assets/ElectroLogo.png";

export default function Header() {
    return (
        <header className="site-header">
            <div className="header-container">
                
               
                <a href="#/search" className="header-brand">
                    <img src={robotLogo} alt="Electro-Commerce CR Logo" className="header-logo-img" />
                    <span className="header-title">Electro-Commerce CR</span>
                </a>

                
                <div className="header-search-container">
                    <SearchBar />
                </div>

                
                <div className="header-actions">
                    <div className="header-account">
                        <div className="account-icon-wrapper">
                                <svg className="account-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                        </div>
                        <div className="account-text">
                            <span className="account-label">Cuenta</span>
                            <div className="account-links">
                                <a href="#signin">Acceso</a>
                                <span className="separator">/</span>
                                <a href="#signup">Registro</a>
                            </div>
                        </div>
                    </div>

                    <div className="header-cart-btn">
                        <svg className="cart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="9" cy="21" r="1"></circle>
                            <circle cx="20" cy="21" r="1"></circle>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                        </svg>
                        <span className="cart-badge">0</span>
                    </div>
                </div>

            </div>
        </header>
    );
}