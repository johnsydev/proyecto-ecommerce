import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

/*
 * Objetivo:
 * Iniciar la aplicación de React y renderizar el componente principal App
 * dentro del elemento "root" definido en el archivo HTML.
 *
 * Entrada:
 * - El componente App.jsx, que contiene la estructura principal de la aplicación.
 * - El archivo index.css, que contiene los estilos generales.
 * - El elemento con id "root" definido en el archivo HTML.
 *
 * Salida:
 * - Renderiza la aplicación completa dentro del navegador.
 * - Habilita la navegación entre diferentes rutas mediante HashRouter.
 * - Ejecuta la aplicación utilizando React.StrictMode para ayudar a detectar
 *   posibles problemas durante el desarrollo.
 *
 * Restricciones:
 * - Debe existir un elemento con id "root" en el archivo HTML.
 * - El componente App.jsx debe existir y estar correctamente importado.
 * - El archivo index.css debe encontrarse en la ruta indicada.
 * - La aplicación debe tener instaladas las dependencias de React,
 *   ReactDOM y react-router-dom.
 */

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
)