
# Electro-Commerce CR

<p align="left">
  <img src="src/assets/ElectroLogo.png" alt="Logo Electro-Commerce CR" width="200">
</p>

Electro-Commerce CR es una aplicación web de comercio electrónico desarrollada con React.

El proyecto permite buscar productos electrónicos, aplicar filtros, consultar información detallada y revisar la disponibilidad de los productos en diferentes sucursales.

> [!IMPORTANT]
> Para ver las notas de la versión reciente, **[ir aquí](#estado-del-proyecto)**.

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
* Inicio de sesión con usuarios existentes en Algolia.
* Cierre de sesión.
* Personalización del catálogo según la actividad del usuario.
* Visualización de productos vistos recientemente.
* Registro de eventos de interacción para Analytics.
* Consulta de métricas de actividad del usuario.
* Usuarios con roles B2C, B2B y Administrador.
* Control de acceso según el rol del usuario.
* Precios diferenciados y condiciones comerciales para clientes B2B.
* Selección de sucursal e inventario distribuido en varias sucursales.
* Consulta del historial y el detalle de las órdenes del usuario.
* Panel administrativo con consulta de órdenes, productos e inventario.
* Modificación simulada del inventario desde el panel administrativo.

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

Para cargar los datos iniciales a los índices de Algolia se pueden ejecutar los siguientes comandos:

```bash
npm run seed-algolia
npm run seed-users-algolia
npm run seed-orders-algolia
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
VITE_ALGOLIA_USERS_INDEX_NAME=grupo-05_users
VITE_ALGOLIA_ORDERS_INDEX_NAME=grupo-05_orders
VITE_ALGOLIA_USERS_USERNAME_FIELD=username
VITE_ALGOLIA_USERS_PASSWORD_FIELD=password
```

También se utilizan las siguientes variables para cargar los datos a los índices:

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
│   ├── admin/
│   ├── analytics/
│   ├── auth/
│   ├── cart/
│   ├── catalog/
│   ├── checkout/
│   ├── commercial-policies/
│   ├── order-confirmation/
│   ├── orders/
│   ├── pay/
│   └── product-detail/
├── locales/
├── pages/
├── styles/
├── utils/
├── App.jsx
├── Home.jsx
└── main.jsx
```

Los componentes relacionados con el catálogo se encuentran en `features/catalog`, los relacionados con el detalle de productos en `features/product-detail` y los del panel administrativo en `features/admin`.

## Algolia

Algolia se utiliza para manejar la búsqueda y filtrado de productos.

El proyecto permite buscar productos por texto y aplicar filtros según:

* Categoría.
* Marca.
* Precio.

También se utiliza para obtener la información detallada de cada producto.

Además del catálogo, la aplicación utiliza tres índices, cargados desde los archivos de la carpeta `data/` mediante los scripts de seed:

| Índice | Contenido |
|---|---|
| `grupo-05_products` | Catálogo de productos B2C y B2B, condiciones comerciales y stock por sucursal. |
| `grupo-05_users` | Usuarios de prueba con su rol y, para clientes B2B, los datos de la empresa. |
| `grupo-05_orders` | Órdenes de ejemplo que forman el historial inicial. |

La aplicación solo consulta estos índices. Las órdenes nuevas y las modificaciones del administrador se guardan en `localStorage`, sin realizar escrituras en Algolia.

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
* Para clientes B2B se muestra la información de la empresa y su cédula jurídica.

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

## Inicio de sesión y personalización

Este módulo incorpora el acceso de usuarios mediante cuentas existentes en Algolia, permitiendo iniciar y cerrar sesión dentro de la aplicación.

La información y actividad de cada usuario se administra de forma independiente, evitando que los datos de una cuenta se mezclen con los de otra.

Entre sus funcionalidades se incluyen:

* **Inicio de sesión:** permite acceder utilizando usuarios existentes en Algolia.
* **Cierre de sesión:** permite finalizar la sesión del usuario actual.
* **Productos vistos recientemente:** el catálogo muestra los productos que el usuario ha consultado anteriormente.
* **Búsquedas recientes:** se presenta el historial de búsquedas realizadas por el usuario para facilitar la navegación y personalizar su experiencia.

## Analytics

Este módulo incorpora una simulación de Analytics que registra las interacciones reales de los usuarios con la aplicación, permitiendo recopilar información sobre su actividad durante el proceso de navegación y compra.

Los eventos registrados incluyen:

* Búsquedas de productos.
* Visualizaciones de productos.
* Adiciones de productos al carrito.
* Compras completadas.

Además, se incorpora una página de Analytics que presenta cuatro métricas de actividad, permitiendo consultar y visualizar información relacionada con las interacciones de los usuarios en el comercio electrónico.

La información recopilada permite representar el comportamiento de los usuarios y ofrecer una experiencia de compra personalizada a partir de sus interacciones con la aplicación.

## Usuarios y roles

La aplicación adapta su comportamiento según el rol del usuario que inicia sesión. La autenticación es simulada: los usuarios se consultan en el índice `grupo-05_users` de Algolia y no existe un proceso de registro de nuevas cuentas.

Estos son los usuarios de prueba (ficticios):

| Usuario | Contraseña | Rol | Descripción |
|---|---|---|---|
| `erin` | `PruebaErin123!` | B2C | Cliente consumidor tradicional. |
| `johnsy` | `PruebaJohnsy123!` | B2B | Cliente empresa (Electro Soluciones del Pacífico S.A.). |
| `david` | `PruebaDavid123!` | ADMIN | Administrador de la plataforma. |
| `invitado` | `PruebaInvitado123!` | Sin rol válido | Usuario para probar el acceso denegado. |

La interfaz muestra en el encabezado el usuario activo, su tipo (Cliente o Administrador) y su rol.

### Control de acceso

El control de acceso se implementó a nivel de la interfaz (RBAC) con la función `can(role, permission)` y el componente `RoleGuard`, que muestra la pantalla de "Acceso denegado" cuando el rol no tiene el permiso necesario. Los permisos por rol son:

| Funcionalidad | B2C | B2B | ADMIN |
|---|---|---|---|
| Consultar catálogo | ✓ | ✓ | ✓ |
| Buscar productos | ✓ | ✓ | ✓ |
| Agregar productos al carrito | ✓ | ✓ | — |
| Checkout | ✓ | ✓ | — |
| Consultar órdenes propias | ✓ | ✓ | — |
| Consultar todas las órdenes | — | — | ✓ |
| Consultar información administrativa | — | — | ✓ |
| Administración simulada | — | — | ✓ |

Otros comportamientos del acceso:

* Un usuario inválido o con contraseña incorrecta no puede iniciar sesión.
* Un usuario sin rol válido no puede ingresar y se le informa el motivo.
* Un cliente que intenta acceder al panel administrativo recibe el mensaje de "Acceso denegado".
* Un visitante sin sesión conserva la navegación y la compra con precios B2C.
* Las opciones de carrito y compra se ocultan para el administrador.

## Precios y condiciones B2B

Cada producto incorpora un precio B2C y un bloque `b2b` con el precio B2B, su descuento y la cantidad mínima de compra. La aplicación selecciona automáticamente el precio según el usuario autenticado, mediante las funciones centralizadas de `utils/pricing.js`.

El precio correspondiente se muestra de forma consistente en el catálogo, las sugerencias del buscador, el detalle del producto, el carrito, el checkout, el resumen de compra y la orden generada. El filtro de precios también se ajusta para clientes B2B.

### Condición comercial seleccionada

Se implementó la **cantidad mínima de compra**:

| Tipo de cliente | Cantidad mínima |
|---|---|
| B2C | 1 unidad |
| B2B | 5 unidades |

Esta condición se seleccionó porque las empresas compran por volumen o para reposición de inventario, por lo que se exige una cantidad mínima que diferencia esta compra de la de un consumidor final.

### Reglas de validación

* Al agregar un producto, un cliente B2B recibe automáticamente la cantidad mínima.
* Si la cantidad de una línea es inferior al mínimo, se muestra un mensaje en el carrito y en el checkout.
* No se permite continuar con la compra mientras exista una cantidad inferior al mínimo.
* Si la información de precio de un producto es inválida, se informa y no se permite comprarlo.

## Multi-inventario

El inventario de cada producto está distribuido en cuatro sucursales, definidas en el campo `branches` del producto con su stock y disponibilidad:

| Sucursal | Identificador |
|---|---|
| San José Centro | `SJ-01` |
| Heredia | `HER-01` |
| Alajuela | `ALA-01` |
| Limón | `LIM-01` |

Durante la compra se aplican las siguientes reglas:

* El usuario selecciona la sucursal en el carrito y la selección se guarda por usuario.
* La aplicación consulta y muestra las unidades disponibles de cada producto en la sucursal elegida.
* No se permite agregar una cantidad superior al inventario disponible, y se informa la razón (por ejemplo, "Solo hay 1 unidad en San José Centro").
* Si un producto no tiene existencias en la sucursal, se informa al usuario y se le pide elegir otra sucursal o quitar el producto.
* Seleccionar una sucursal es un requisito para continuar con la compra.
* La sucursal queda asociada a la orden.

## Órdenes B2B y B2C

Cada orden conserva la información necesaria para identificar las condiciones en las que se realizó la compra:

* Número de orden y fecha.
* Usuario, rol y datos del cliente.
* Empresa y cédula jurídica, cuando corresponde.
* Sucursal seleccionada.
* Productos, cantidades y precio aplicado.
* Condiciones comerciales (tipo de cliente, lista de precios y cantidad mínima).
* Subtotal, impuestos, costo de envío y total.
* Estado de la orden y estado del pago.

La sección "Mis órdenes" permite consultar el historial del usuario autenticado y el detalle de cada compra. Se accede desde el encabezado, la página de cuenta y la confirmación de la compra. Si la orden no existe o pertenece a otro usuario, se muestra "Orden no encontrada".

Las órdenes se leen desde el índice `grupo-05_orders` de Algolia y desde `localStorage`, combinando el historial inicial con las órdenes nuevas. Si una orden existe en ambos orígenes, tiene prioridad la local. Si Algolia no está disponible, se muestran las órdenes locales con un aviso.

## Panel administrativo

El panel administrativo está disponible únicamente para el usuario con rol ADMIN, desde la opción "Panel admin" del encabezado. Cuenta con tres pestañas, y la pestaña activa se conserva en la URL:

* **Órdenes:** muestra todas las órdenes de la tienda con número de orden, fecha, cliente, tipo de cliente, empresa, total, sucursal, estado de la orden y estado del pago. Incluye un buscador por orden, cliente o empresa.
* **Productos:** muestra la categoría, el precio B2C, el precio B2B, la cantidad mínima B2B, el stock total y la disponibilidad de cada producto, con búsqueda y paginación.
* **Inventario por sucursal:** muestra las unidades de cada producto en cada sucursal y el total, marcando las sucursales sin unidades como "Sin stock".

### Operación simulada

Desde la pestaña de inventario, el administrador puede modificar las unidades de un producto en una sucursal. Al guardar el cambio:

* Se muestra un mensaje con el valor anterior y el nuevo, y la celda modificada indica el valor anterior ("Antes").
* El cambio se guarda en `localStorage` (clave `stockOverrides`) y no modifica el índice de productos de Algolia.
* El cambio se refleja en la tienda: catálogo, buscador, detalle del producto, carrito y checkout muestran y validan el inventario modificado.
* El botón "Restablecer inventario original" elimina todos los cambios, con una confirmación dentro de la página.

Las validaciones de la operación informan cuando el valor está vacío, no es un número, no es entero, es negativo, supera las 9999 unidades, es igual al actual, o cuando el producto no tiene registrada la sucursal o el navegador no permite guardar los datos.

## Escenarios de prueba

| Escenario | Usuario | Resultado esperado |
|---|---|---|
| Inicio de sesión B2C | `erin` | Se muestra el usuario, el tipo Cliente y el rol B2C. |
| Inicio de sesión B2B | `johnsy` | Se muestra el rol B2B y la información de la empresa. |
| Inicio de sesión Admin | `david` | Se muestra el rol ADMIN y el acceso al panel administrativo. |
| Usuario sin rol válido | `invitado` | Se informa que no tiene un rol válido y no se permite ingresar. |
| Precio B2C y B2B | `erin` y `johnsy` | Cada usuario ve el precio de su lista en catálogo, carrito y orden. |
| Condición comercial B2B | `johnsy` | No se permite continuar con menos de 5 unidades por producto. |
| Selección de sucursal | `erin` o `johnsy` | Se muestra la disponibilidad de la sucursal elegida. |
| Validación de inventario | `erin` o `johnsy` | No se permite agregar más unidades que las disponibles. |
| Generación de orden B2C y B2B | `erin` y `johnsy` | La orden conserva el rol, la sucursal, el precio y las condiciones comerciales. |
| Consulta administrativa de órdenes | `david` | La pestaña de órdenes muestra las órdenes de todos los usuarios. |
| Restricción de acceso entre roles | `erin` o `johnsy` | Al abrir el panel administrativo se muestra "Acceso denegado". |
| Modificación simulada de inventario | `david` y `erin` | El cliente ve el inventario modificado por el administrador. |

## Estado del proyecto

**Versión 1.5 (Actual)**

Esta versión incorpora el entorno B2B: usuarios con roles (B2C, B2B y Administrador), control de acceso a nivel de la interfaz, precios diferenciados con cantidad mínima de compra para clientes B2B e inventario distribuido en cuatro sucursales con selección de sucursal durante la compra.

Además, se incorporan el historial y el detalle de las órdenes de cada usuario, y un panel administrativo con la consulta de todas las órdenes, productos e inventario por sucursal. El administrador puede realizar una modificación simulada del inventario, guardada en el navegador y reflejada en la tienda. Los datos se organizan en tres índices de Algolia: productos, usuarios y órdenes.

**Versión 1.4**

Esta versión incorpora la simulación de Analytics y la personalización del comercio electrónico a partir de las interacciones de los usuarios. Se implementa el registro de eventos relacionados con las búsquedas, visualizaciones de productos, adiciones al carrito y compras completadas.

Además, se incorpora el acceso mediante usuarios existentes en Algolia, el cierre de sesión y la separación de historiales, métricas y otros datos por usuario. El catálogo muestra productos vistos y búsquedas recientes, mientras que una nueva página de Analytics permite consultar cuatro métricas de actividad.

**Versión 1.3**

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
