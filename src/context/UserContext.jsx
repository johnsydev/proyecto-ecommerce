import { UserContext } from "./useUser";
import { useState } from "react";
import { getCurrentUser, loginUser, logoutUser } from "../utils/userStorage";
import { ANALYTICS_EVENTS, recordEvent } from "../utils/analyticsStorage";
import { can } from "../utils/permissions";

/*
 * Objetivo:
 * Compartir el usuario activo, su rol y las acciones de acceso mediante Algolia.
 *
 * Entrada:
 * - children: Componentes que consumen el contexto.
 *
 * Salida:
 * - Usuario activo, su rol, la función can(permission) y las funciones
 *   para iniciar y cerrar sesión.
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
    <UserContext.Provider
      value={{
        user,
        role: user?.role ?? null,
        can: (permission) => can(user?.role ?? null, permission),
        login,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
