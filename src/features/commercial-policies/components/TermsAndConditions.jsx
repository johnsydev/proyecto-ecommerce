import React from 'react';

export default function TermsAndConditions() {
  return (
    <div className="policies-content">
      <section>
        <h1>Términos y Condiciones de Uso y Compra</h1>
        <p>
          Bienvenido a Electro-Commerce CR. Lea detenidamente estos Términos y Condiciones 
          ("Términos") antes de utilizar nuestro sitio web y adquirir cualquiera de nuestros 
          productos. Al acceder a esta plataforma, navegar en nuestro catálogo de componentes, 
          o confirmar una compra, usted acepta estar legalmente vinculado a las condiciones 
          aquí descritas.
        </p>

        <h2>1. Condiciones Generales del Servicio</h2>
        <p>
          Electro-Commerce CR es una plataforma virtual dedicada a la venta al detalle de 
          microcontroladores, sensores, placas de desarrollo y componentes electrónicos pasivos 
          en el territorio de Costa Rica. Nuestro catálogo, especificaciones técnicas y 
          disponibilidad de inventario se actualizan constantemente; sin embargo, nos reservamos 
          el derecho de modificar precios, descontinuar productos o limitar las cantidades de 
          venta por cliente sin previo aviso.
        </p>
        <p>
          El acceso a este sitio es gratuito y está destinado a personas mayores de edad con 
          capacidad legal para contratar. Queda estrictamente prohibido el uso de la plataforma 
          para fines ilícitos, suplantación de identidad, alteraciones informáticas (hacking), 
          o la extracción masiva de datos (web scraping) sin nuestra autorización explícita.
        </p>

        <h2>2. Proceso de Compra y Pagos</h2>
        <p>
          Toda orden ingresada a través de nuestra pasarela de pago electrónica se considerará 
          una solicitud de compra. Un contrato vinculante se formalizará únicamente cuando 
          Electro-Commerce CR procese el pago con éxito y emita una confirmación formal de 
          pedido al correo electrónico suministrado por el cliente.
        </p>
        <p>
          Todos los precios mostrados en el catálogo se presentan en colones costarricenses (₡) 
          e incluyen el Impuesto sobre el Valor Agregado (IVA). Las tarifas de envío, si 
          aplican (basadas en promociones o disponibilidad de "envío gratuito"), se calcularán 
          y mostrarán claramente en el módulo de checkout antes de la confirmación del pago.
        </p>

        <h2>3. Responsabilidades del Cliente</h2>
        <p>
          Para garantizar un proceso de compra exitoso y un uso adecuado de los componentes 
          tecnológicos, el cliente acepta y asume las siguientes responsabilidades:
        </p>
        <ul>
          <li>
            Suministrar información veraz, exacta y actualizada durante el proceso de registro 
            y compra (nombre completo, dirección exacta de entrega en Costa Rica, y correo de 
            contacto).
          </li>
          <li>
            Verificar meticulosamente las especificaciones técnicas del producto antes de 
            finalizar la orden, incluyendo voltajes de operación (ej. 3.3V vs 5V), pines de 
            conexión y compatibilidad de protocolos (I2C, SPI, UART).
          </li>
          <li>
            Manipular los componentes electrónicos adquiridos con las medidas de seguridad 
            pertinentes. Esto incluye el uso de pulseras o alfombras antiestáticas (ESD) para 
            evitar descargas que puedan dañar los microcontroladores (como chips ESP32, RP2040 
            o ATmega).
          </li>
          <li>
            Mantener la confidencialidad de sus credenciales de acceso a la plataforma (en caso 
            de crear una cuenta) y notificar inmediatamente sobre cualquier uso no autorizado.
          </li>
        </ul>

        <h2>4. Responsabilidades de Electro-Commerce CR</h2>
        <p>
          Como comercio responsable e impulsador del movimiento "maker" y tecnológico nacional, 
          Electro-Commerce CR se compromete a:
        </p>
        <ul>
          <li>
            Garantizar que todos los productos exhibidos (placas, sensores, pantallas y 
            accesorios) sean nuevos y correspondan íntegramente a la descripción, marca (ej. 
            Espressif, Seeed Studio, Adafruit) y modelo ofertado en el catálogo.
          </li>
          <li>
            Procesar y despachar los pedidos dentro de los plazos estimados mostrados en el 
            sitio (ej. 1 a 4 días hábiles), utilizando un embalaje altamente seguro (bolsas 
            antiestáticas y aislamiento) para prevenir daños mecánicos o eléctricos durante 
            el transporte.
          </li>
          <li>
            Proteger la información financiera del cliente mediante pasarelas de pago 
            encriptadas y seguras, sin almacenar directamente números de tarjetas de crédito.
          </li>
          <li>
            Atender oportunamente cualquier consulta técnica básica o reclamo a través de 
            nuestros canales oficiales de servicio al cliente.
          </li>
        </ul>

        <h2>5. Modificaciones a los Términos</h2>
        <p>
          Electro-Commerce CR se reserva el derecho de actualizar, modificar o reemplazar 
          cualquier parte de estos Términos publicando las actualizaciones en este sitio web. 
          Es responsabilidad del usuario revisar periódicamente esta página para identificar 
          cambios. El uso continuo de la plataforma después de la publicación de cualquier 
          modificación constituye la aceptación tácita de dichos cambios.
        </p>
      </section>
    </div>
  );
}