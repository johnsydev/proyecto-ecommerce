import { useState } from "react";
import { ChevronDown } from "lucide-react";

import "../styles/FAQ.css";

const faqCategories = [
  {
    id: "compras",
    title: "Compras",
    questions: [
      {
        id: "compatibilidad",
        question:
          "¿Cómo sé si un microcontrolador o sensor es compatible con mi proyecto?",
        answer: (
          <>
            En la página de detalles de cada producto en nuestro catálogo,
            encontrarás las especificaciones técnicas completas (voltaje de
            operación, tipo de conexión y datasheet si aplica). Además, puedes
            usar nuestra barra de búsqueda avanzada y filtros laterales para
            encontrar exactamente lo que necesitas.
          </>
        ),
      },
      {
        id: "modificar-orden",
        question:
          "¿Puedo modificar o cancelar mi orden después de haberla confirmado?",
        answer: (
          <>
            Una vez que el pago ha sido procesado y la orden entra a nuestro
            sistema de despacho, no es posible modificarla directamente desde
            tu cuenta. Sin embargo, si te comunicas inmediatamente (dentro de
            la primera hora) a nuestro WhatsApp de soporte, haremos lo posible
            por ajustar tu pedido antes de entregarlo a la mensajería.
          </>
        ),
      },
      {
        id: "descuentos",
        question:
          "¿Ofrecen precios al por mayor o descuentos para proyectos universitarios?",
        answer: (
          <>
            ¡Sí! Apoyamos a la comunidad estudiantil y a los grandes proyectos.
            Si necesitas comprar más de 20 unidades del mismo componente, por
            ejemplo para un laboratorio de robótica, escríbenos a{" "}
            <a href="mailto:info@electrocommerce.cr">
              info@electrocommerce.cr
            </a>{" "}
            para solicitar una cotización con un descuento especial aplicado.
          </>
        ),
      },
    ],
  },
  {
    id: "pagos",
    title: "Pagos",
    questions: [
      {
        id: "metodos-pago",
        question: "¿Cuáles son los métodos de pago aceptados en la tienda?",
        answer: (
          <>
            Para tu comodidad y seguridad, en Electro-Commerce CR aceptamos
            pagos mediante tarjetas de crédito y débito (Visa, Mastercard y
            AMEX) procesadas a través de nuestra pasarela de pago cifrada.
            También aceptamos SINPE Móvil y Tasa Cero.
          </>
        ),
      },
      {
        id: "seguridad-pago",
        question: "¿Es seguro ingresar los datos de mi tarjeta en su página?",
        answer: (
          <>
            No almacenamos los números de tu tarjeta ni códigos de seguridad
            en nuestros servidores. El procesamiento se realiza mediante
            conexiones cifradas (SSL/TLS) y pasarelas de pago que cumplen con
            estándares de seguridad bancaria (PCI-DSS).
          </>
        ),
      },
      {
        id: "pago-rechazado",
        question:
          "¿Qué hago si mi pago es rechazado pero el monto fue debitado?",
        answer: (
          <>
            En ocasiones, el banco puede retener temporalmente los fondos
            aunque la pasarela haya rechazado la transacción. Este monto suele
            liberarse automáticamente en 24-48 horas. Si tienes dudas,
            contáctanos con el número de intento de orden para verificar el
            estado real en nuestro sistema.
          </>
        ),
      },
    ],
  },
  {
    id: "envios",
    title: "Envíos",
    questions: [
      {
        id: "envios-nacionales",
        question: "¿Hacen envíos fuera del Gran Área Metropolitana (GAM)?",
        answer: (
          <>
            ¡Sí! Realizamos envíos a todo el territorio nacional en Costa Rica
            a través de nuestros servicios de mensajería aliados y Correos de
            Costa Rica. El costo estándar es de ₡3,000.
          </>
        ),
      },
      {
        id: "envio-gratis",
        question: '¿Cómo funciona la promoción de "Envío Gratis"?',
        answer: (
          <>
            Si tu carrito de compras contiene <strong>únicamente</strong>{" "}
            productos marcados en el catálogo con la etiqueta de "Envío Gratis",
            no pagarás ningún costo adicional por el envío. Si combinas
            productos con y sin esta etiqueta, se aplicará la tarifa estándar
            de ₡3,000.
          </>
        ),
      },
      {
        id: "retiro-sucursal",
        question: "¿Puedo recoger mi pedido personalmente?",
        answer: (
          <>
            Durante el checkout puedes seleccionar la opción de retiro en
            sucursal de forma gratuita. Contamos con puntos de entrega en San
            José Centro, Heredia, Alajuela y Limón. Te notificaremos por correo
            cuando tu paquete esté listo para ser retirado.
          </>
        ),
      },
    ],
  },
  {
    id: "devoluciones",
    title: "Devoluciones",
    questions: [
      {
        id: "producto-defectuoso",
        question:
          "¿Qué debo hacer si recibo un componente defectuoso o equivocado?",
        answer: (
          <>
            Si recibes un producto con defectos de fábrica o por error de
            despacho, tienes un plazo máximo de 10 días hábiles para
            notificarnos. Es indispensable que el componente no haya sido
            soldado, manipulado incorrectamente ni sometido a cortocircuitos.
            Escríbenos a{" "}
            <a href="mailto:soporte@electrocommerce.cr">
              soporte@electrocommerce.cr
            </a>{" "}
            para iniciar el proceso.
          </>
        ),
      },
      {
        id: "costo-devolucion",
        question:
          "¿Quién asume el costo de envío en caso de una devolución?",
        answer: (
          <>
            Si la devolución se debe a un error nuestro al despachar o a un
            defecto de fábrica comprobado, Electro-Commerce CR cubrirá los
            costos de envío de retorno. Si el cambio es por una equivocación
            del cliente al elegir el componente, el costo de mensajería deberá
            ser asumido por el comprador.
          </>
        ),
      },
      {
        id: "tiempo-reembolso",
        question:
          "¿Cuánto tiempo tarda en procesarse un reembolso o reemplazo?",
        answer: (
          <>
            Una vez que recibimos el componente devuelto y nuestro departamento
            técnico verifica su estado, el envío del reemplazo o la emisión del
            reembolso se procesará en un máximo de 3 a 5 días hábiles.
          </>
        ),
      },
    ],
  },
  {
    id: "atencion",
    title: "Atención al Cliente",
    questions: [
      {
        id: "contactar-soporte",
        question:
          "¿Cómo puedo contactar a soporte técnico si tengo problemas con mi orden?",
        answer: (
          <>
            Puedes ponerte en contacto con nuestro equipo de atención al
            cliente a través del número telefónico 4350-2222, enviándonos un
            mensaje por WhatsApp o escribiendo al correo{" "}
            <a href="mailto:info@electrocommerce.cr">
              info@electrocommerce.cr
            </a>
            .
          </>
        ),
      },
      {
        id: "horario-atencion",
        question: "¿Cuál es el horario de atención al cliente?",
        answer: (
          <>
            Nuestro equipo de soporte técnico y servicio al cliente está
            disponible de lunes a sábado, de 8:00 a. m. a 5:00 p. m. Los
            correos recibidos fuera de este horario serán respondidos a primera
            hora del siguiente día hábil.
          </>
        ),
      },
      {
        id: "asesoria-tecnica",
        question:
          "¿Ofrecen asesoría técnica para conectar los componentes comprados?",
        answer: (
          <>
            Nuestro enfoque principal es la venta de componentes electrónicos.
            Aunque no desarrollamos proyectos a la medida ni ofrecemos clases
            de programación, nuestro equipo puede orientarte sobre dónde
            encontrar los datasheets de los sensores adquiridos o resolver
            dudas básicas de alimentación y voltajes para evitar daños en tus
            placas.
          </>
        ),
      },
    ],
  },
];

export default function PreguntasFrecuentes() {
  const [openCategories, setOpenCategories] = useState(() =>
    Object.fromEntries(faqCategories.map((category) => [category.id, true]))
  );
  const [openQuestions, setOpenQuestions] = useState({});

  const toggleCategory = (categoryId) => {
    setOpenCategories((current) => ({
      ...current,
      [categoryId]: !current[categoryId],
    }));
  };

  const toggleQuestion = (questionId) => {
    setOpenQuestions((current) => ({
      ...current,
      [questionId]: !current[questionId],
    }));
  };

  return (
    <div className="policies-content policies-faq">
      <div className="faq-page">
        <h1>Preguntas Frecuentes (FAQ)</h1>

        <p className="faq-introduction">
          ¿Tienes dudas sobre cómo comprar tus componentes electrónicos en
          Electro-Commerce CR? Aquí encontrarás respuestas a las preguntas
          más comunes para ayudarte a resolverlas rápidamente.
        </p>

        <div className="faq-categories">
          {faqCategories.map((category, index) => {
            const categoryIsOpen = Boolean(openCategories[category.id]);

            return (
              <div
                key={category.id}
                className={`faq-category ${
                  categoryIsOpen ? "is-open" : ""
                }`}
              >
                <h2 className="faq-category-title">
                  <button
                    type="button"
                    className="faq-category-toggle"
                    onClick={() => toggleCategory(category.id)}
                    aria-expanded={categoryIsOpen}
                  >

                    <span className="faq-category-name">
                      {category.title}
                    </span>

                    <ChevronDown
                      className="faq-category-arrow"
                      size={20}
                      aria-hidden="true"
                    />
                  </button>
                </h2>

                <div
                  className="faq-category-content"
                  hidden={!categoryIsOpen}
                >
                  {category.questions.map((item) => {
                    const questionIsOpen = Boolean(
                      openQuestions[item.id]
                    );

                    return (
                      <div
                        key={item.id}
                        className={`faq-question ${
                          questionIsOpen ? "is-open" : ""
                        }`}
                      >
                        <h3 className="faq-question-title">
                          <button
                            type="button"
                            className="faq-question-toggle"
                            onClick={() => toggleQuestion(item.id)}
                            aria-expanded={questionIsOpen}
                          >
                            <span>{item.question}</span>

                            <ChevronDown
                              className="faq-question-arrow"
                              size={17}
                              aria-hidden="true"
                            />
                          </button>
                        </h3>

                        <div
                          className="faq-answer"
                          hidden={!questionIsOpen}
                        >
                          <p>{item.answer}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}