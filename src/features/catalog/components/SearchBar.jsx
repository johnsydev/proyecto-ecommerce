import { useEffect, useMemo, useRef, createElement, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { autocomplete } from "@algolia/autocomplete-js";
import { getAlgoliaResults } from "@algolia/autocomplete-preset-algolia";
import { debounce } from "@algolia/autocomplete-shared";
import { createLocalStorageRecentSearchesPlugin } from "@algolia/autocomplete-plugin-recent-searches";
import { useSearchBox } from "react-instantsearch";
import searchClient from "../services/algolia";
import "../styles/SearchBar.css";

/*
 * Objetivo:
 * Permitir al usuario buscar productos mediante una barra de búsqueda
 * con autocompletado, sugerencias y almacenamiento de búsquedas recientes.
 *
 * Entrada:
 * - El texto ingresado por el usuario en la barra de búsqueda.
 * - Los productos obtenidos desde el índice de Algolia.
 * - La variable VITE_ALGOLIA_INDEX_NAME con el nombre del índice utilizado.
 * - Las búsquedas recientes almacenadas en el localStorage del navegador.
 *
 * Salida:
 * - Actualiza los resultados del catálogo de acuerdo con el texto buscado.
 * - Muestra hasta cinco productos como sugerencias de autocompletado.
 * - Permite abrir el detalle de un producto seleccionado.
 * - Guarda y muestra hasta cinco búsquedas recientes.
 * - Permite borrar todas las búsquedas recientes.
 * - Muestra información básica de los productos sugeridos, como imagen,
 *   nombre, modelo, precio, descuento y disponibilidad.
 *
 * Restricciones:
 * - El componente debe utilizarse dentro de InstantSearch para poder usar useSearchBox.
 * - Debe ejecutarse dentro de un Router para poder utilizar useNavigate.
 * - El cliente de Algolia debe estar correctamente configurado.
 * - La variable VITE_ALGOLIA_INDEX_NAME debe estar definida.
 * - Los productos deben contener los datos necesarios para mostrar las sugerencias,
 *   como objectID, title, image_url, b2c y precios.
 * - El navegador debe permitir el uso de localStorage para guardar las búsquedas recientes.
 * - La búsqueda se actualiza con un retraso de 300 milisegundos para evitar
 *   realizar una consulta por cada tecla presionada.
 * - Solo se muestran cinco productos como máximo en el autocompletado.
 */

export default function SearchBar() {
  const containerRef = useRef(null);
  const panelRootRef = useRef(null);
  const panelDomRef = useRef(null);
  const searchInstanceRef = useRef(null);
  const navigate = useNavigate();

  const { query, refine } = useSearchBox();

  const refineRef = useRef(refine);
  useEffect(() => {
    refineRef.current = refine;
  }, [refine]);

  const debouncedRefine = useMemo(
    () => debounce((value) => refineRef.current(value), 300),
    [],
  );

  const recentSearchesPlugin = useMemo(() => {
    const plugin = createLocalStorageRecentSearchesPlugin({
      key: "RECENT_SEARCH",
      limit: 5,
      transformSource({ source }) {
        return {
          ...source,
          onSelect({ item }) {
            if (item.query) {
              refineRef.current(item.query);
            }
          },
          templates: {
            ...source.templates,
            header() {
              return (
                <div className="ctg-recent-searches-header">
                  <span className="ctg-recent-searches-title">
                    Búsquedas recientes
                  </span>
                  <button
                    type="button"
                    className="ctg-recent-searches-clear-all"
                    onClick={(e) => {
                      e.stopPropagation();

                      Object.keys(localStorage)
                        .filter((k) => k.includes("RECENT_SEARCH"))
                        .forEach((k) => localStorage.removeItem(k));

                      searchInstanceRef.current?.refresh();
                      searchInstanceRef.current?.setIsOpen(false);
                    }}
                  >
                    Borrar todo
                  </button>
                </div>
              );
            },
          },
        };
      },
    });
    return plugin;
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const search = autocomplete({
      container: containerRef.current,
      panelContainer: containerRef.current, // se coloca en div
      placeholder: "Buscar productos...",
      openOnFocus: true,
      initialState: { query },
      detachedMediaQuery: "none",
      plugins: [recentSearchesPlugin],

      onSubmit({ state }) {
        refineRef.current(state.query);
      },
      onReset() {
        refineRef.current("");
      },
      onStateChange({ prevState, state }) {
        if (prevState.query !== state.query) {
          debouncedRefine(state.query);
        }
      },

      renderer: { createElement, Fragment, render: () => {} },
      render({ children }, root) {
        if (!panelRootRef.current || panelDomRef.current !== root) {
          panelDomRef.current = root;
          panelRootRef.current?.unmount();
          panelRootRef.current = createRoot(root);
        }
        panelRootRef.current.render(children);
      },

      getSources({ query }) {
        if (!query) return [];

        return [
          {
            sourceId: "productosAutocompletado",
            getItems() {
              return getAlgoliaResults({
                searchClient,
                queries: [
                  {
                    indexName: import.meta.env.VITE_ALGOLIA_INDEX_NAME,
                    params: { query, hitsPerPage: 5 },
                  },
                ],
              });
            },

            onSelect({ item, setIsOpen }) {
              if (item.title) {
                navigate(`/producto/${item.objectID}`);
              } else {
                refineRef.current(query);
              }
              setIsOpen(false);
            },

            templates: {
              header() {
                return (
                  <div className="ctg-autocomplete-header">
                    <span className="ctg-autocomplete-title">Productos</span>
                  </div>
                );
              },
              item({ item }) {
                const isOutOfStock = Number(item.stock_quantity) <= 0;
                const isEnabled = item.b2c?.enabled;

                return (
                  <div
                    className={`ctg-autocomplete-item ${isOutOfStock ? "is-out-of-stock" : ""}`}
                  >
                    <div className="ctg-autocomplete-item-image">
                      <img src={item.image_url} alt={item.title} />
                    </div>
                    <div className="ctg-autocomplete-item-info">
                      <strong>{item.title}</strong>
                      {item.model ? (
                        <p>
                          [{item.model}]{" "}
                          <span className="ctg-autocomplete-item-price">
                            {item.currency !== "CRC" ? "$" : "₡"}
                            {Number(item.b2c.sale_price).toLocaleString(
                              "en-US",
                            )}
                          </span>
                          {item.b2c.discount_percentage > 0 ? (
                            <span className="ctg-autocomplete-item-regular-price">
                              {item.currency !== "CRC" ? "$" : "₡"}
                              {Number(item.b2c.regular_price).toLocaleString(
                                "en-US",
                              )}
                            </span>
                          ) : null}
                          {isOutOfStock ? (
                            <span className="ctg-autocomplete-badge-out-of-stock">
                              {isEnabled ? "Sin existencias" : "No disponible"}
                            </span>
                          ) : null}
                        </p>
                      ) : null}
                    </div>
                  </div>
                );
              },
              noResults() {
                return (
                  <div className="ctg-autocomplete-empty">Sin resultados</div>
                );
              },
            },
          },
        ];
      },
    });

    searchInstanceRef.current = search; //guarda instancia para poder refrescar al borrar

    return () => {
      search.destroy();
      searchInstanceRef.current = null;
      panelRootRef.current?.unmount();
      panelRootRef.current = null;
    };
  }, []);

  return <div className="ctg-search-bar" ref={containerRef} />;
}
