export const ROLES = Object.freeze({
  B2C: "B2C",
  B2B: "B2B",
  ADMIN: "ADMIN",
});

export const PERMISSIONS = Object.freeze({
  VIEW_CATALOG: "catalog.view",
  SEARCH_PRODUCTS: "products.search",
  ADD_TO_CART: "cart.add",
  CHECKOUT: "checkout.create",
  VIEW_OWN_ORDERS: "orders.viewOwn",
  VIEW_ALL_ORDERS: "orders.viewAll",
  VIEW_ADMIN_INFO: "admin.viewInfo",
  SIMULATE_ADMIN: "admin.simulate",
});

const CLIENT_PERMISSIONS = [
  PERMISSIONS.VIEW_CATALOG,
  PERMISSIONS.SEARCH_PRODUCTS,
  PERMISSIONS.ADD_TO_CART,
  PERMISSIONS.CHECKOUT,
  PERMISSIONS.VIEW_OWN_ORDERS,
];

// Tabla de permisos por rol del enunciado del Proyecto III.
const ROLE_PERMISSIONS = Object.freeze({
  [ROLES.B2C]: CLIENT_PERMISSIONS,
  [ROLES.B2B]: CLIENT_PERMISSIONS,
  [ROLES.ADMIN]: [
    PERMISSIONS.VIEW_CATALOG,
    PERMISSIONS.SEARCH_PRODUCTS,
    PERMISSIONS.VIEW_ALL_ORDERS,
    PERMISSIONS.VIEW_ADMIN_INFO,
    PERMISSIONS.SIMULATE_ADMIN,
  ],
});

// Visitante sin sesión: conserva la navegación y compra previas al proyecto.
const VISITOR_PERMISSIONS = [
  PERMISSIONS.VIEW_CATALOG,
  PERMISSIONS.SEARCH_PRODUCTS,
  PERMISSIONS.ADD_TO_CART,
  PERMISSIONS.CHECKOUT,
];

const ROLE_DETAILS = Object.freeze({
  [ROLES.B2C]: { type: "Cliente", label: "B2C" },
  [ROLES.B2B]: { type: "Cliente", label: "B2B" },
  [ROLES.ADMIN]: { type: "Administrador", label: "ADMIN" },
});

/*
 * Objetivo:
 * Indicar si un rol puede ejecutar una funcionalidad de la aplicación.
 *
 * Entrada:
 * - role: B2C, B2B, ADMIN o null para un visitante sin sesión.
 * - permission: Valor de PERMISSIONS.
 *
 * Salida:
 * - true si el rol dispone del permiso; false en cualquier otro caso.
 *
 * Restricciones:
 * - Un rol desconocido no tiene ningún permiso.
 */
export function can(role, permission) {
  if (role == null) return VISITOR_PERMISSIONS.includes(permission);

  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function isValidRole(role) {
  return Object.hasOwn(ROLE_PERMISSIONS, role);
}

// Tipo de usuario y rol que se muestran en la interfaz.
export function getRoleDetails(role) {
  return ROLE_DETAILS[role] ?? null;
}
