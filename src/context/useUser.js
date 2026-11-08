import { createContext, useContext } from "react";

export const UserContext = createContext(null);

/*
 * Objetivo:
 * Consultar el usuario activo y sus acciones de acceso.
 *
 * Salida:
 * - Valores del contexto de usuario.
 *
 * Restricciones:
 * - Debe utilizarse dentro de UserProvider.
 */
export function useUser() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser debe utilizarse dentro de UserProvider");
  }

  return context;
}
