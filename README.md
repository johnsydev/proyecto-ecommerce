# Electro-Commerce CR

<p align="left">
  <img src="src/assets/ElectroLogo.png" alt="Logo Electro-Commerce CR" width="200">
</p>

Electro-Commerce CR es una aplicación web de comercio electrónico desarrollada con React.

El proyecto permite buscar productos electrónicos, aplicar filtros, consultar información detallada y revisar la disponibilidad de los productos en diferentes sucursales.

> [!IMPORTANT]
> Para ver las notas de la versión reciente, **[ir aquí](#carrito-de-compras)**.

## Funcionalidades

* Búsqueda de productos.
* Autocompletado de búsquedas.
* Historial de búsquedas recientes.
* Filtros por categoría, marca y precio.
* Paginación de productos.
* Vista detallada de cada producto.
* Visualización de descuentos y disponibilidad.
* Consulta de stock por sucursal.
* Diseño adaptable para computadora y dispositivos móviles.
* Carrito de Compras

## Tecnologías utilizadas

* React
* JavaScript
* Vite
* React Router DOM
* Algolia
* React InstantSearch
* Lucide React
* CSS

## Instalación y ejecución

Primero se debe clonar el repositorio:

```bash
git clone https://github.com/johnsydev/proyecto-ecommerce.git
```

Luego ingresar a la carpeta del proyecto:

```bash
cd proyecto-ecommerce
```

Instalar las dependencias:

```bash
npm install
```

Crear el archivo `.env` con las variables necesarias para Algolia.

Para cargar los productos de `data/products.json` al índice de Algolia se puede ejecutar:

```bash
npm run seed-algolia
```

Finalmente, iniciar el proyecto:

```bash
npm run dev
```

## Variables de entorno

Para utilizar Algolia es necesario crear un archivo `.env` con las siguientes variables:

```env
VITE_ALGOLIA_APP_ID=tu_app_id
VITE_ALGOLIA_SEARCH_API_KEY=tu_search_api_key
VITE_ALGOLIA_INDEX_NAME=grupo-05_products
```

También se utilizan las siguientes variables para cargar los productos al índice:

```env
ALGOLIA_APP_ID=tu_app_id
ALGOLIA_WRITE_API_KEY=tu_write_api_key
```

## Estructura general del proyecto

El proyecto está dividido principalmente en:

```text
src/
├── components/
├── context/
├── locales/
├── features/
│   ├── catalog/
│   └── product-detail/
├── pages/
├── styles/
├── App.jsx
├── Home.jsx
└── main.jsx
```

Los componentes relacionados con el catálogo se encuentran en `features/catalog` y los relacionados con el detalle de productos en `features/product-detail`.

## Algolia

Algolia se utiliza para manejar la búsqueda y filtrado de productos.

El proyecto permite buscar productos por texto y aplicar filtros según:

* Categoría.
* Marca.
* Precio.

También se utiliza para obtener la información detallada de cada producto.

## Carrito de Compras

El módulo del carrito se utiliza para gestionar y almacenar temporalmente los productos que el usuario desea adquirir.

El proyecto administra la información del carrito mediante los siguientes mecanismos:

* Estado global: Se implementó utilizando Context API y useReducer para permitir que diferentes partes de la aplicación consulten o modifiquen el carrito sin depender de la transmisión manual de propiedades (props).   
* Persistencia de datos: Se utiliza localStorage para asegurar que el carrito y sus cantidades se recuperen intactos incluso si el usuario recarga la ventana del navegador.   

Para mejorar la experiencia de usuario y la lógica de compra, se definieron los siguientes comportamientos:

* Eliminación automática: Se estableció como regla de negocio que, si el usuario disminuye la cantidad de un producto en el selector y esta llega a 0, el artículo se elimina automáticamente del carrito.   
* Cálculos dinámicos: La interfaz actualiza instantáneamente el subtotal de cada línea, el subtotal de la orden, el IVA (13%) y los costos de envío ante cualquier modificación.   
* Navegación ágil: Se incluyó un botón flotante de "volver arriba" en la vista detallada del carrito para facilitar la navegación cuando se han agregado múltiples productos y se hace un desplazamiento largo hacia abajo.
* Estados vacíos (Empty State): Si el carrito no tiene productos, se oculta el resumen de compra y se muestra una interfaz amigable invitando al usuario a volver al catálogo

## Estado del proyecto

**Versión 1.1 (Actual)**

Esta versión incluye la implementación de un carrito de compras completamente funcional. Se integró el manejo de estado global de la aplicación, el cálculo automático y en tiempo real de los montos (subtotales, IVA y envío), y la persistencia de datos en el navegador para que el usuario no pierda sus productos al recargar la página. 


**Versión 1.0**

Esta versión incluye las funcionalidades principales del catálogo, búsqueda, filtros, paginación y visualización detallada de productos.

Algunas funcionalidades como el carrito de compras, inicio de sesión y registro se encuentran únicamente a nivel visual y pueden ser desarrolladas en futuras versiones.

## Autores

**Grupo 05**

* Erin Camacho González
* Johnsy López Aguilar
* David Calvo García
