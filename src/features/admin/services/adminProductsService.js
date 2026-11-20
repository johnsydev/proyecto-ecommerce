import searchClient from "../../catalog/services/algolia";

/*
 * Objetivo:
 * Obtener el catálogo completo de productos para el panel administrativo.
 *
 * Salida:
 * - Arreglo con los productos del índice de Algolia.
 *
 * Restricciones:
 * - Requiere la variable VITE_ALGOLIA_INDEX_NAME.
 * - Lanza un error si no se puede consultar Algolia; quien la llama decide
 *   cómo informarlo al usuario.
 * - Se omiten los registros sin objectID.
 */
export async function loadAllProducts() {
  const indexName = import.meta.env.VITE_ALGOLIA_INDEX_NAME?.trim();

  if (!indexName) {
    throw new Error("Falta configurar el índice de productos.");
  }

  const response = await searchClient.searchSingleIndex({
    indexName,
    searchParams: {
      query: "",
      hitsPerPage: 1000,
      attributesToHighlight: [],
    },
  });

  return response.hits.filter((product) => product?.objectID);
}