import { HashRouter, Route, Routes, Link, useLocation } from "react-router-dom";
import { InstantSearch } from "react-instantsearch";
import Home from './Home'
import CatalogPage from './pages/CatalogPage'
import ProductDetail from './pages/ProductDetail'
import Header from './components/Header'
import Footer from './components/Footer'
import searchClient from './features/catalog/services/algolia'
import './App.css'

/*
 * Objetivo:
 * Definir la estructura principal de la aplicación, configurar las rutas
 * disponibles y conectar el sistema de búsqueda con Algolia.
 *
 * Entrada:
 * - La ubicación actual de la aplicación, obtenida mediante useLocation.
 * - Una categoría opcional recibida desde el estado de navegación.
 * - El cliente de búsqueda de Algolia.
 * - El nombre del índice de Algolia definido en las variables de entorno.
 *
 * Salida:
 * - Muestra el Header, el contenido correspondiente a la ruta actual
 *   y el Footer.
 * - Permite navegar entre la página principal, el catálogo de productos
 *   y el detalle de cada producto.
 * - Inicializa la búsqueda en Algolia utilizando la categoría recibida,
 *   cuando esta existe.
 *
 * Restricciones:
 * - El componente debe ejecutarse dentro de un Router para poder utilizar useLocation.
 * - El cliente de Algolia debe estar correctamente configurado.
 * - La variable VITE_ALGOLIA_INDEX_NAME debe existir en las variables de entorno.
 * - Las rutas "/", "/search" y "/producto/:id" deben utilizar componentes válidos.
 * - Si se recibe una categoría desde la navegación, esta se utiliza como consulta inicial
 *   para filtrar los resultados de búsqueda.
 */

function App() {

  const location = useLocation();
  const category = location.state?.category;
  const query = category ? category : "";

  return (
    <InstantSearch
      key={query}
      searchClient={searchClient}
      indexName={import.meta.env.VITE_ALGOLIA_INDEX_NAME}
      initialUiState={{
          [import.meta.env.VITE_ALGOLIA_INDEX_NAME]: {
              query: query
          }
      }}
    >
      <Header />
      <main>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<CatalogPage />} />
            <Route path="/producto/:id" element={<ProductDetail />} />
        </Routes>
      </main>
      <Footer />
    </InstantSearch>
  )
}

export default App
