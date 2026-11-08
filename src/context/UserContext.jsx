import { UserContext } from "./useUser";
import { useState } from "react";
import { getCurrentUser, loginUser, logoutUser } from "../utils/userStorage";
import { ANALYTICS_EVENTS, recordEvent } from "../utils/analyticsStorage";

/*
 * Objetivo:
 * Compartir el usuario activo y las acciones de acceso mediante Algolia.
 *
 * Entrada:
 * - children: Componentes que consumen el contexto.
 *
 * Salida:
 * - Usuario activo y funciones para iniciar y cerrar sesión.
 *
 * Restricciones:
 * - Valida credenciales de prueba contra usuarios existentes en Algolia.
 * - Registra LOGIN al completar un acceso explícito.
 * - Recuperar el usuario al recargar no genera otro LOGIN.
 */
export function UserProvider({ children }) {
  const [user, setUser] = useState(getCurrentUser);

  const login = async (username, password) => {
    const current = await loginUser(username, password);

    setUser(current);

    recordEvent(ANALYTICS_EVENTS.LOGIN, {
      method: "algolia",
    });

    return current;
  };

  const logout = () => {
    logoutUser();
    setUser(null);

    window.dispatchEvent(new Event("analytics-updated"));
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}
