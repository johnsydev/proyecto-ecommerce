
# Electro-Commerce CR

<p align="left">
  <img src="src/assets/ElectroLogo.png" alt="Logo Electro-Commerce CR" width="200">
</p>

Electro-Commerce CR es una aplicación web de comercio electrónico desarrollada con React.

El proyecto permite buscar productos electrónicos, aplicar filtros, consultar información detallada y revisar la disponibilidad de los productos en diferentes sucursales.

> [!IMPORTANT]
> Para ver las notas de la versión reciente, **[ir aquí](#políticas-comerciales)**.

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
* Checkout 
* Ordenes
* Procesamiento de pago Sandbox
* Consulta y navegación de políticas comerciales.

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
├── assets/
├── components/
├── context/
├── data/
├── features/
│   └── cart/
│   ├── catalog/
│   ├── product-detail/
│   ├── checkout/
│   ├── pay/
│   ├── order-confirmation/
│   └── commercial-policies/
├── locales/
├── pages/
├── styles/
├── utils/
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

## Checkout, Ordenes y Procesamiento de Pago

Este módulo completa el proceso de compra desde el carrito hasta la confirmación de la orden. El flujo es: Carrito → Checkout → Pago → Confirmación.

### Checkout

* Formulario con los datos del comprador y de entrega, con validaciones específicas para cada campo.
* Selección de provincia, cantón y distrito a partir de un archivo JSON.
* Aceptación de términos y condiciones como requisito para continuar.
* Resumen de la compra con subtotal, IVA, costo de envío y total, calculados con las mismas funciones del carrito.
* Si el carrito está vacío, se redirige de nuevo al carrito.

### Órdenes

Al continuar desde el checkout se genera una orden con número, fecha, datos del comprador y de entrega, productos, totales y estados. Las órdenes se guardan como un historial en `localStorage`, junto con el registro de cada intento de pago.

El estado de la orden y el estado del pago se manejan por separado:

| Situación | Estado del pago | Estado de la orden |
|---|---|---|
| Orden recién creada | `PENDING` | `PENDING` |
| Pago aprobado | `APPROVED` | `CONFIRMED` |
| Pago rechazado (puede reintentar) | `DECLINED` | `PENDING` |
| Error del servicio (puede reintentar) | `ERROR` | `PENDING` |
| No se puede completar la orden | el último estado del pago | `FAILED` |

Una orden pasa a `FAILED` cuando se agotan los 3 intentos de pago, cuando no hay conexión a internet al pagar, cuando permanece 30 minutos sin actividad o cuando se abandona y se inicia un nuevo checkout desde el carrito.

### Pago Sandbox

El componente `PaymentSandbox` simula un proveedor externo de pagos. Recibe el identificador de la orden, el monto, la moneda y los datos de la tarjeta, y devuelve `PAYMENT_APPROVED`, `PAYMENT_DECLINED` o `PAYMENT_ERROR`. Después, la página de pago actualiza la orden según el resultado.

Los escenarios se generan a partir del número de tarjeta. Estas son las tarjetas de prueba (ficticias):

| Tarjeta | Número | Resultado |
|---|---|---|
| Visa | `4242 4242 4242 4242` | Pago aprobado |
| Visa | `4000 0000 0000 0002` | Pago rechazado |
| Visa | `4000 0000 0000 0119` | Error del servicio |
| Mastercard | `5555 5555 5555 4444` | Pago aprobado |
| Mastercard | `5105 1051 0510 5100` | Pago rechazado |
| Mastercard | `5200 8282 8282 8210` | Error del servicio |

Para cualquier otra tarjeta con estructura válida, el resultado se simula de forma aleatoria, garantizando que cada tres intentos ocurran los tres escenarios. Para las pruebas se puede usar cualquier nombre, una fecha de vencimiento futura y un CVV de 3 dígitos.

Otros comportamientos del pago:

* Validación de la tarjeta: marca (Visa, Mastercard o American Express), longitud, algoritmo de Luhn, vencimiento y CVV.
* Máximo de 3 intentos de pago por orden, con mensajes que indican los intentos restantes.
* Botón y campos bloqueados mientras se procesa el pago, con indicador de carga.
* Si la página se cierra o recarga durante un pago, ese intento se registra como interrumpido y se avisa al usuario al volver.
* Si se regresa del pago al checkout para corregir datos, se reutiliza la misma orden.

### Confirmación

Cuando el pago es aprobado, la orden pasa a `CONFIRMED`, se vacía el carrito y se muestra la confirmación con el número de orden, los datos del comprador y de entrega, y el resumen de la compra.

## Políticas Comerciales

Este módulo incorpora una sección para consultar las políticas comerciales de Electro-Commerce CR.

La interfaz permite seleccionar las diferentes políticas desde una barra lateral y consultar su contenido en el panel correspondiente, así como su fecha de última actualización.

Las políticas comerciales son: Términos y Condiciones, Política de Devoluciones, Política de Envíos y Política de Privacidad. Además, se incluye una sección para Preguntas Frecuentes (FAQ).

En dispositivos móviles, el panel lateral se abre mediante un botón flotante para facilitar la navegación.

## Estado del proyecto

**Versión 1.3 (Actual)**

Esta versión incorpora la sección de políticas comerciales, permitiendo consultar la información correspondiente desde una interfaz dedicada y navegar entre las diferentes políticas disponibles fácilmente.


**Versión 1.2**

Esta versión incluye el proceso de checkout, la generación y gestión de órdenes con historial, el procesamiento de pago en ambiente Sandbox con sus tres escenarios (aprobado, rechazado y error del servicio) y la confirmación de la compra.


**Versión 1.1**

Esta versión incluye la implementación de un carrito de compras completamente funcional. Se integró el manejo de estado global de la aplicación, el cálculo automático y en tiempo real de los montos (subtotales, IVA y envío), y la persistencia de datos en el navegador para que el usuario no pierda sus productos al recargar la página. 


**Versión 1.0**

Esta versión incluye las funcionalidades principales del catálogo, búsqueda, filtros, paginación y visualización detallada de productos.

Algunas funcionalidades como el carrito de compras, inicio de sesión y registro se encuentran únicamente a nivel visual y pueden ser desarrolladas en futuras versiones.

## Autores

**Grupo 05**

* Erin Camacho González
* Johnsy López Aguilar
* David Calvo García
