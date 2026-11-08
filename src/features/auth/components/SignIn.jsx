import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  History,
  LoaderCircle,
  LockKeyhole,
  LogOut,
  Search,
  UserRound,
} from "lucide-react";
import robotLogo from "../../../assets/ElectroLogo.png";
import { useUser } from "../../../context/useUser";
import "../styles/SignIn.css";

/*
 * Objetivo:
 * Permitir el inicio y cierre de sesión con usuarios existentes en Algolia.
 *
 * Entrada:
 * - Usuario y contraseña ingresados en el formulario.
 *
 * Salida:
 * - Usuario identificado y navegación al catálogo.
 *
 * Restricciones:
 * - No registra ni crea usuarios.
 * - Consulta las cuentas de prueba del índice configurado en Algolia.
 * - Bloquea el formulario mientras se validan las credenciales.
 */
export default function SignIn() {
  const { user, login, logout } = useUser();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submittingRef = useRef(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submittingRef.current) return;

    submittingRef.current = true;
    setIsSubmitting(true);
    setError("");

    try {
      await login(username, password);
      setPassword("");
      navigate("/search", { replace: true });
    } catch (error) {
      setError(error.message);
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    setError("");

    try {
      logout();
      navigate("/search", { replace: true });
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="signin-page">
      <div className="signin-layout">
        <aside className="signin-welcome" aria-label="Electro-Commerce CR">
          <span className="signin-brand">Electro-Commerce CR</span>

          <img
            src={robotLogo}
            alt="Mascota de Electro-Commerce CR"
            className="signin-mascot"
          />

          <div className="signin-welcome-content">
            <span className="signin-eyebrow">TU ESPACIO EN LA TIENDA</span>
            <h2>{user ? "Sigue explorando." : "Qué bueno verte de nuevo."}</h2>
            <p>
              Retoma tus búsquedas y vuelve a encontrar los productos
              que te interesaron.
            </p>

            <ul className="signin-benefits">
              <li><History size={18} aria-hidden="true" /> Tus productos vistos recientemente</li>
              <li><Search size={18} aria-hidden="true" /> Tus búsquedas, siempre a mano</li>
            </ul>
          </div>
        </aside>

        <section className="signin-card" aria-labelledby="signin-title">
          <Link to="/search" className="signin-back">
            <ArrowLeft size={16} aria-hidden="true" />
            Volver al catálogo
          </Link>

          <div className="signin-heading">
            <span className="signin-label">{user ? "MI CUENTA" : "BIENVENIDO A ELECTRO-COMMERCE"}</span>
            <div className="signin-title-row">
              <div className="signin-icon">
                <UserRound size={24} aria-hidden="true" />
              </div>
              <h1 id="signin-title">{user ? "Tu cuenta" : "Iniciar sesión"}</h1>
            </div>
            <p className="signin-description">
              {user
                ? "Tu historial y tu actividad, en un solo lugar."
                : "Ingresa tus datos para continuar con tu cuenta."}
            </p>
          </div>

          {user ? (
            <div className="signin-account">
              <div className="signin-user-details">
                <span className="signin-user-avatar" aria-hidden="true">
                  {user.username.charAt(0).toUpperCase()}
                </span>
                <div>
                  <span className="signin-user-caption">Sesión iniciada como</span>
                  <strong>{user.username}</strong>
                </div>
              </div>

              <Link to="/analytics" className="signin-submit">
                Ver mi actividad <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <button type="button" className="signin-secondary" onClick={handleLogout}>
                <LogOut size={17} aria-hidden="true" /> Cerrar sesión
              </button>
            </div>
          ) : (
            <form className="signin-form" onSubmit={handleSubmit} aria-busy={isSubmitting}>
              <div className="signin-field">
                <label htmlFor="signin-username">Nombre de usuario</label>
                <div className="signin-input-wrapper">
                  <UserRound size={18} className="signin-field-icon" aria-hidden="true" />
                  <input
                    id="signin-username"
                    name="username"
                    type="text"
                    value={username}
                    onChange={(event) => {
                      setUsername(event.target.value);
                      setError("");
                    }}
                    placeholder="Tu nombre de usuario"
                    autoComplete="username"
                    autoCapitalize="none"
                    spellCheck={false}
                    disabled={isSubmitting}
                    aria-describedby={error ? "signin-error" : undefined}
                    aria-invalid={Boolean(error)}
                    required
                  />
                </div>
              </div>

              <div className="signin-field">
                <label htmlFor="signin-password">Contraseña</label>
                <div className="signin-input-wrapper">
                  <LockKeyhole size={18} className="signin-field-icon" aria-hidden="true" />
                  <input
                    id="signin-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);
                      setError("");
                    }}
                    placeholder="Ingresa tu contraseña"
                    autoComplete="current-password"
                    disabled={isSubmitting}
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? "signin-error" : undefined}
                    required
                  />
                  <button
                    type="button"
                    className="signin-password-toggle"
                    onClick={() => setShowPassword((current) => !current)}
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    aria-controls="signin-password"
                    disabled={isSubmitting}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && <p id="signin-error" className="signin-error" role="alert">{error}</p>}

              <button type="submit" className="signin-submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <><LoaderCircle size={18} className="signin-spinner" aria-hidden="true" /> Validando acceso...</>
                ) : (
                  <>Iniciar sesión <ArrowRight size={18} aria-hidden="true" /></>
                )}
              </button>
            </form>
          )}

          {user && error && <p id="signin-error" className="signin-error" role="alert">{error}</p>}
        </section>
      </div>
    </div>
  );
}
