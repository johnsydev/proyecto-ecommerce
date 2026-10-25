import React from 'react';
import { CalendarDays } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="policies-content">
      <section>
        <h1>Aviso y Política de Privacidad</h1>

        <div className="policy-updated">
          <CalendarDays size={15} />
          <span>Última actualización: 23 de octubre de 2026</span>
        </div>

        <p>
          En Electro-Commerce CR valoramos profundamente tu confianza. Sabemos que la privacidad de tus 
          datos personales es fundamental, por lo que nos comprometemos a proteger la información que 
          compartes con nosotros al navegar en nuestro catálogo, crear una cuenta o adquirir componentes 
          electrónicos. Esta política describe cómo recopilamos, utilizamos y protegemos tu información.
        </p>

        <h2>1. Información que recopila la tienda</h2>
        <p>
          Para ofrecerte una experiencia de compra fluida y personalizada, recopilamos la siguiente 
          información estrictamente necesaria:
        </p>
        <ul>
          <li>
            <strong>Datos de identificación y contacto:</strong> Nombre completo, correo electrónico y 
            número de teléfono (requeridos al momento de registrarse o finalizar una compra).
          </li>
          <li>
            <strong>Datos de envío:</strong> Dirección física exacta dentro de Costa Rica (Provincia, 
            Cantón, Distrito y señas) para garantizar la entrega precisa de tus paquetes mediante 
            nuestros servicios de mensajería.
          </li>
          <li>
            <strong>Datos de navegación:</strong> Información anónima recopilada automáticamente 
            durante tu visita, como historial de búsqueda de componentes, categorías visitadas, 
            dirección IP e interacción con nuestro carrito de compras.
          </li>
        </ul>
        <p>
          <em>Nota importante:</em> Electro-Commerce CR <strong>NO</strong> almacena ni procesa directamente 
          información financiera, como números de tarjetas de crédito o códigos CVV. Todos los pagos 
          se procesan a través de pasarelas de pago certificadas de terceros que cumplen con los 
          estándares de seguridad PCI-DSS.
        </p>

        <h2>2. Uso de la información del cliente</h2>
        <p>
          Los datos recopilados son utilizados bajo el principio de minimización de datos y 
          exclusivamente para los siguientes fines operativos y comerciales:
        </p>
        <ul>
          <li>
            <strong>Procesamiento de órdenes:</strong> Para gestionar tus compras, emitir la 
            facturación correspondiente y coordinar la logística de envío a tu domicilio o a 
            nuestras sucursales.
          </li>
          <li>
            <strong>Comunicación y Soporte:</strong> Para enviarte actualizaciones sobre el estado 
            de tu pedido (ej. notificaciones de despacho), responder consultas técnicas sobre 
            microcontroladores o gestionar solicitudes de garantía.
          </li>
          <li>
            <strong>Mejora del servicio:</strong> Para optimizar nuestro catálogo de Algolia, 
            analizar tendencias de búsqueda (ej. saber qué sensores son los más buscados por los 
            "makers" locales) y mejorar el diseño de nuestra plataforma.
          </li>
        </ul>
        <p>
          En ningún caso Electro-Commerce CR venderá, alquilará o cederá tu información personal 
          a bases de datos de terceros, anunciantes o agencias de marketing externas sin tu 
          consentimiento explícito.
        </p>

        <h2>3. Medidas básicas de protección de datos</h2>
        <p>
          Implementamos medidas técnicas y administrativas para evitar la pérdida, mal uso, acceso 
          no autorizado o alteración de tus datos:
        </p>
        <ul>
          <li>
            <strong>Encriptación:</strong> Toda la transmisión de datos entre tu navegador y 
            nuestros servidores se realiza mediante protocolos de seguridad cifrados (SSL/TLS).
          </li>
          <li>
            <strong>Control de acceso:</strong> El acceso a la base de datos de clientes está 
            estrictamente restringido al personal autorizado de Electro-Commerce CR que necesita 
            dicha información para procesar los pedidos.
          </li>
          <li>
            <strong>Gestión de credenciales:</strong> Las contraseñas de las cuentas de usuario 
            son almacenadas de forma encriptada (hashing) en nuestra base de datos.
          </li>
        </ul>

        <h2>4. Derechos del usuario</h2>
        <p>
          Como titular de tus datos, tienes derecho a solicitar en cualquier momento la 
          actualización, rectificación o eliminación total de tu información personal y cuenta 
          de usuario de nuestros registros. Para ejercer este derecho, puedes contactarnos 
          directamente al correo <strong>privacidad@electrocommerce.cr</strong>.
        </p>
      </section>
    </div>
  );
}