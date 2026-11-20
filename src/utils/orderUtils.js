import { ORDER_STATUS, PAYMENT_STATUS, TERMS_AND_CONDITIONS_VERSION, PRIVACY_POLICY_VERSION } from "./constants";
import { calculateCartSummary } from "./cartCalculations";
import { getCommercialConditions, getPriceInfo } from "./pricing";

/*
   * Objetivo:
   *   - Generar un objeto de orden basado en el carrito, cliente y detalles de entrega proporcionados.
   * 
   * Entrada:
   *   - cart: Arreglo de productos en el carrito.
   *   - client: Objeto con la información del cliente.
   *   - delivery: Objeto con la información de entrega.
   *   - user: Usuario activo (null para visitante); define rol, empresa y lista de precios.
   *   - branch: Sucursal seleccionada para la orden.
   * 
   * Salida:
   *   - Objeto de la orden generada con detalles de productos, totales, estado de la orden, sucursal,
   *     condiciones comerciales y versiones de políticas.
   * 
   * Restricciones:
   *   - Los precios de cada línea provienen de getPriceInfo, igual que los mostrados en carrito y checkout.
   */

export function generateOrder({ cart, client, delivery, user = null, branch }) {
    const {
        subtotal,
        iva,
        costoEnvio,
        total,
        deliveryDate,
    } = calculateCartSummary(cart, user);

    const now = new Date();

    const date = new Intl.DateTimeFormat("sv-SE", {
        timeZone: "America/Costa_Rica",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hourCycle: "h23",
    }).format(now).replace(" ", "T");

    const orderNumber = generateOrderId();

    return {
        objectID: orderNumber,
        orderNumber,
        date: date,
        dateTimestamp: now.getTime(),

        userId: user?.id ?? null,
        username: user?.username ?? null,
        role: user?.role ?? null,

        client: {
            ...client,
            phone: getPrettyPhoneNumber(client.phone),
        },
        company: user?.company
            ? { name: user.company, taxId: user.taxId ?? null }
            : null,
        commercialConditions: getCommercialConditions(user),
        branch: branch
            ? {
                branch_id: branch.branch_id,
                name: branch.name,
                province: branch.province,
            }
            : null,
        delivery: {
            ...delivery,
            estimatedDate: deliveryDate.toISOString(),
        },

        products: cart.map((product) => {
            const { priceList, unitPrice, regularPrice, discountPercentage } =
                getPriceInfo(product, user);
            const quantity = Number(product.order_quantity || 1);

            return {
                productId: product.objectID ?? product.id,
                name: product.title,
                quantity,
                priceList,
                originalUnitPrice: regularPrice,
                saleUnitPrice: unitPrice,
                discount_percentage: discountPercentage,
                iva_percentage: 13,
                lineSubtotal: unitPrice * quantity,
                image_url: product.image_url || product.imageUrl,
            };
        }),

        currency: cart[0]?.currency ?? "CRC",
        subtotal,
        total_iva: iva,
        shippingCost: costoEnvio,
        total,

        orderStatus: ORDER_STATUS.PENDING,
        paymentStatus: PAYMENT_STATUS.PENDING,

        termsAndConditionsVersion: TERMS_AND_CONDITIONS_VERSION,
        privacyPolicyVersion: PRIVACY_POLICY_VERSION,
    };
}

/*
   * Objetivo:
   *   - Generar un identificador único para una orden.
   * 
   * Entrada:
   *   - Ninguna.
   * 
   * Salida:
   *   - Cadena de texto que representa el identificador único de la orden.
   */

const generateOrderId = () => {
    const date = new Intl.DateTimeFormat("en-CA", {
        timeZone: "America/Costa_Rica",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).format(new Date()).replaceAll("-", "");

    const random = Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();

    return `ORD-${date}-${random}`;
};

/*
   * Objetivo:
   *   - Formatear un número de teléfono de manera legible para Costa Rica.
   * 
   * Entrada:
   *   - phone: Cadena de texto que representa el número de teléfono.
   * 
   * Salida:
   *   - Cadena de texto con el número de teléfono formateado.
   */
  
const getPrettyPhoneNumber = (phone) => {
    const cleaned = phone.replace(/[\s()-]/g, "");

    let localNumber = cleaned;

    if (cleaned.startsWith("+506")) {
        localNumber = cleaned.slice(4);
    } else if (cleaned.startsWith("506") && cleaned.length === 11) {
        localNumber = cleaned.slice(3);
    }

    if (/^[0-9]{8}$/.test(localNumber)) {
        return `+506 ${localNumber.slice(0, 4)} ${localNumber.slice(4)}`;
    }

    return phone;
};