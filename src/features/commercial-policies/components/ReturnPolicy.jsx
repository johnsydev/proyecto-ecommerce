import React from 'react';
import { CalendarDays } from 'lucide-react';

export default function ReturnPolicy() {
  return (
    <div className="policies-content">
      <section>
        <h1>Política de Devoluciones y Garantías</h1>

        <div className="policy-updated">
          <CalendarDays size={15} />
          <span>Última actualización: 22 de octubre de 2026</span>
        </div>

        <p>
          En Electro-Commerce CR nos enorgullecemos de ofrecer componentes electrónicos y microcontroladores 
          de la más alta calidad para sus proyectos. Entendemos que en el mundo del prototipado y 
          la electrónica, a veces las cosas no salen como se planean. Por ello, hemos establecido 
          una política clara y justa para el manejo de devoluciones y aplicación de garantías.
        </p>

        <h2>1. Plazo para solicitar devoluciones</h2>
        <p>
          El cliente dispone de un plazo máximo de <strong>diez (10) días hábiles</strong> contados a partir de 
          la fecha de recepción de su pedido (según registro de nuestra mensajería o Correos de Costa Rica) 
          para reportar cualquier inconveniente y solicitar una devolución, ya sea por defectos de fábrica 
          o por errores comprobados en el despacho de nuestra parte (por ejemplo, recibir un Arduino Nano en lugar de un ESP32).
        </p>
        <p>
          Para garantías técnicas específicas por defectos de fábrica prolongados, el plazo dependerá del tipo 
          de componente, variando entre 3 a 12 meses, según se indica en la ficha de cada producto en nuestro catálogo.
        </p>

        <h2>2. Condiciones para aprobar una devolución</h2>
        <p>
          Para que una solicitud de devolución o cambio sea aceptada y procesada por nuestro equipo de 
          soporte técnico, debe cumplir estrictamente con los siguientes requisitos:
        </p>
        <ul>
          <li>
            El producto debe estar en su estado original, con todos sus accesorios, manuales, empaques, y 
            bolsas antiestáticas selladas (en caso de no haber sido utilizadas).
          </li>
          <li>
            Debe presentar el comprobante de compra (factura digital) y el número de orden generado 
            por nuestra plataforma.
          </li>
          <li>
            El componente no debe presentar señales de manipulación incorrecta, soldadura, recortes en los pines, 
            ni daños físicos ocasionados por caídas o ensamblaje forzado.
          </li>
          <li>
            Las placas o sensores devueltos serán sometidos a una evaluación técnica para confirmar que el fallo 
            es de origen y no provocado.
          </li>
        </ul>

        <h2>3. Casos en los que no se aceptan devoluciones</h2>
        <p>
          Debido a la naturaleza sensible de la electrónica de prototipado, Electro-Commerce CR <strong>NO</strong> aceptará 
          devoluciones ni aplicará garantías en los siguientes escenarios:
        </p>
        <ul>
          <li>
            Componentes que hayan sido soldados, modificados, o cuyos pines hayan sido cortados o alterados de cualquier forma.
          </li>
          <li>
            Placas, sensores o módulos que hayan sufrido cortocircuitos por sobrecarga (ej. aplicar 5V a un 
            módulo de 3.3V) o polaridad invertida.
          </li>
          <li>
            Daños causados por descargas electrostáticas (ESD) debidos a la manipulación sin el equipo de protección adecuado.
          </li>
          <li>
            Componentes pasivos o consumibles (resistencias, capacitores, LEDs, cables puente/jumper, estaño) una vez 
            que el empaque original haya sido abierto.
          </li>
          <li>
            Solicitudes realizadas fuera del plazo estipulado en el punto 1.
          </li>
        </ul>

        <h2>4. Procedimiento general para gestionar solicitudes</h2>
        <p>
          Si su producto cumple con las condiciones establecidas y desea proceder con una solicitud, por favor 
          siga estos pasos:
        </p>
        <ol>
          <li>
            Envíe un correo electrónico a <strong>soporte@electrocommerce.cr</strong> con el asunto: <em>"Solicitud de Devolución - [Su Número de Orden]"</em>.
          </li>
          <li>
            En el cuerpo del correo, explique detalladamente el problema y adjunte fotografías o videos claros 
            que muestren el estado físico del componente y el defecto reportado.
          </li>
          <li>
            Nuestro equipo técnico revisará su caso y emitirá una pre-aprobación o rechazo en un plazo no mayor 
            a 48 horas hábiles.
          </li>
          <li>
            De ser pre-aprobada, le indicaremos los pasos para enviar el componente a nuestras oficinas para su 
            revisión física. Los costos de envío de la devolución correrán por cuenta del cliente, salvo que se 
            demuestre que el error fue de despacho por parte de la tienda.
          </li>
          <li>
            Tras la evaluación física, si procede la garantía, emitiremos una nota de crédito o el reemplazo del producto.
          </li>
        </ol>
      </section>
    </div>
  );
}