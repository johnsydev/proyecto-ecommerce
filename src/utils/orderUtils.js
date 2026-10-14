import { ORDER_STATUS, PAYMENT_STATUS, TERMS_AND_CONDITIONS_VERSION, PRIVACY_POLICY_VERSION } from "./constants";
import { calculateCartSummary } from "./cartCalculations";

export function generateOrder({ cart, client, delivery }) {
    const {
        subtotal,
        iva,
        costoEnvio,
        total,
        deliveryDate,
    } = calculateCartSummary(cart);

    const date = new Intl.DateTimeFormat("sv-SE", {
        timeZone: "America/Costa_Rica",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hourCycle: "h23",
    }).format(new Date()).replace(" ", "T");

    return {
        orderNumber: generateOrderId(),
        date: date,

        client: {
            ...client,
            phone: getPrettyPhoneNumber(client.phone),
        },
        delivery: {
            ...delivery,
            estimatedDate: deliveryDate.toISOString(),
        },

        products: cart.map((product) => ({
            productId: product.objectID ?? product.id,
            name: product.title,
            quantity: Number(product.order_quantity || 1),
            originalUnitPrice: Number(product.b2c?.regular_price ?? 0),
            saleUnitPrice: Number(
                product.b2c?.sale_price ??
                product.b2c?.regular_price ??
                0
            ),
            discount_percentage: Number(product.b2c?.discount_percentage || 0),
            iva_percentage: 13,
            image_url: product.image_url || product.imageUrl, 
        })),

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