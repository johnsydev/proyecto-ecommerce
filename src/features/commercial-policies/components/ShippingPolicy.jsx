import React from 'react';
import { CalendarDays } from 'lucide-react';

export default function ShippingPolicy() {
  return (
    <div className="policies-content">
      <section>
        <h1>Política de Envíos y Entregas</h1>

        <div className="policy-updated">
          <CalendarDays size={15} />
          <span>Última actualización: 23 de octubre de 2026</span>
        </div>

        <p>
          En Electro-Commerce CR sabemos que cuando estás trabajando en un prototipo o proyecto 
          electrónico, el tiempo es vital. Por eso nos comprometemos a despachar tus microcontroladores, 
          sensores y componentes de la forma más rápida y segura posible. A continuación, detallamos 
          nuestras condiciones de entrega.
        </p>

        <h2>1. Cobertura de entrega</h2>
        <p>
          Ofrecemos cobertura de envío a <strong>todo el territorio nacional de Costa Rica</strong>. 
          Para garantizar la entrega en zonas alejadas o de difícil acceso, utilizamos los servicios 
          certificados de Correos de Costa Rica y servicios de mensajería privada de confianza.
        </p>
        <p>
          <strong>Retiro en sucursal:</strong> Si prefieres retirar tus componentes en persona, 
          ofrecemos la opción de entrega en cualquiera de nuestras sucursales físicas habilitadas: 
          San José Centro, Heredia, Alajuela y Limón. Esta opción no tiene costo adicional, pero 
          está sujeta a la disponibilidad de inventario en la sucursal seleccionada al momento del checkout.
        </p>

        <h2>2. Tiempos estimados de envío</h2>
        <p>
          Los tiempos de entrega varían según la ubicación geográfica del cliente y la disponibilidad 
          del producto en nuestros almacenes. De manera general:
        </p>
        <ul>
          <li><strong>Gran Área Metropolitana (GAM):</strong> De 1 a 3 días hábiles.</li>
          <li><strong>Zonas Rurales y Resto del País:</strong> De 3 a 5 días hábiles.</li>
        </ul>
        <p>
          En el carrito de compras, nuestro sistema calculará de manera automática la fecha estimada 
          de entrega basándose en el componente con el mayor tiempo de despacho de su orden. Los pedidos 
          realizados después de las 3:00 p.m., fines de semana o días feriados, comenzarán a procesarse 
          el siguiente día hábil.
        </p>

        <h2>3. Costos de envío</h2>
        <p>
          Nuestro sistema de cobro de envíos es transparente y se calcula en el resumen de su carrito 
          antes de realizar el pago:
        </p>
        <ul>
          <li>
            <strong>Tarifa estándar:</strong> Aplicamos una tarifa fija y única de <strong>₡3,000</strong> para 
            el envío de paquetes a cualquier parte del país.
          </li>
          <li>
            <strong>Envío Gratis:</strong> En Electro-Commerce CR contamos con componentes seleccionados 
            marcados con la etiqueta de "Envío Gratis". Si <strong>todos</strong> los productos incluidos 
            en su orden cuentan con esta promoción, el costo total de envío será de ₡0. Si su carrito 
            combina productos con y sin envío gratuito, se aplicará la tarifa estándar.
          </li>
        </ul>

        <h2>4. Restricciones o condiciones especiales</h2>
        <p>
          Para asegurar la integridad de sus componentes electrónicos, aplicamos las siguientes medidas 
          y restricciones:
        </p>
        <ul>
          <li>
            <strong>Embalaje técnico:</strong> Todos los componentes sensibles (como placas ESP32, 
            Arduinos y chips) son enviados exclusivamente en bolsas antiestáticas (ESD) y protegidos con 
            plástico de burbujas. No enviamos placas en sobres simples de papel.
          </li>
          <li>
            <strong>Dirección de entrega:</strong> El cliente es completamente responsable de proporcionar 
            una dirección exacta y detallada (Provincia, Cantón, Distrito y señas precisas). Cualquier 
            devolución o retraso por errores en la dirección de entrega generará un recargo por reenvío 
            que deberá ser asumido por el cliente.
          </li>
          <li>
            <strong>Recepción del paquete:</strong> El paquete puede ser recibido por cualquier persona 
            mayor de edad que se encuentre en la dirección de destino. Es responsabilidad de quien recibe 
            verificar que la caja o sobre no presente alteraciones físicas o daños antes de firmar el 
            recibido de la mensajería.
          </li>
          <li>
            <strong>Casos de fuerza mayor:</strong> Electro-Commerce CR no se hace responsable por 
            retrasos en la entrega derivados de situaciones fuera de nuestro control, tales como bloqueos 
            en carreteras, huelgas, desastres naturales o condiciones climáticas extremas.
          </li>
        </ul>
      </section>
    </div>
  );
}