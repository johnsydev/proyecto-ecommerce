/*
 * Objetivo:
 * Crear y configurar el cliente de Algolia que utilizará la aplicación
 * para realizar búsquedas de productos.
 *
 * Entrada:
 * - La variable VITE_ALGOLIA_APP_ID con el identificador de la aplicación de Algolia.
 * - La variable VITE_ALGOLIA_SEARCH_API_KEY con la clave utilizada para realizar búsquedas.
 *
 * Salida:
 * - Exporta el objeto searchClient configurado para que pueda ser utilizado
 *   por otros componentes de la aplicación.
 *
 * Restricciones:
 * - Las variables VITE_ALGOLIA_APP_ID y VITE_ALGOLIA_SEARCH_API_KEY deben
 *   estar definidas correctamente en las variables de entorno.
 * - La clave utilizada debe tener permisos para realizar búsquedas en Algolia.
 * - Se necesita conexión a Internet para comunicarse con el servicio de Algolia.
 */

import { algoliasearch } from "algoliasearch";

const appId = import.meta.env.VITE_ALGOLIA_APP_ID;
const searchKey = import.meta.env.VITE_ALGOLIA_SEARCH_API_KEY;

const searchClient = algoliasearch(appId, searchKey);

export default searchClient;