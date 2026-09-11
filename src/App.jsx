import { HashRouter, Route, Routes, Link, useLocation } from "react-router-dom";
import { InstantSearch } from "react-instantsearch";
import Home from './Home'
import CatalogPage from './pages/CatalogPage'
import ProductDetail from './pages/ProductDetail'
import Header from './components/Header'
import Footer from './components/Footer'
import searchClient from './features/catalog/services/algolia'
import './App.css'

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
