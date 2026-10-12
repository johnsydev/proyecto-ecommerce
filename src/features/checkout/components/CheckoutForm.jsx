import { useState } from "react";
import "../styles/CheckoutForm.css";
import ubicacionesCR from "../../../data/ubicacionesCR.json";
import {
    isValidCedulaCR,
    isValidPhoneCR,
} from "../../../utils/validations";

export default function CheckoutForm({
    acceptedTerms,
    onTermsError,
    clientInfo,
    setClientInfo,
    deliveryInfo,
    setDeliveryInfo,
    onCheckoutSubmit,
}) {
    const {
        fullName,
        email,
        cedula,
        phone,
        requiresElectronicInvoice,
    } = clientInfo;

    const {
        province,
        canton,
        district,
        address,
        recipients,
        additionalNotes,
    } = deliveryInfo;

    const [validationErrors, setValidationErrors] = useState({});

    const provinciaSeleccionada = ubicacionesCR.provincias[province];

    const cantones = provinciaSeleccionada
        ? Object.entries(provinciaSeleccionada.cantones)
        : [];

    const cantonSeleccionado = provinciaSeleccionada?.cantones[canton];

    const distritos = cantonSeleccionado
        ? Object.entries(cantonSeleccionado.distritos)
        : [];

    const provincias = Object.entries(ubicacionesCR.provincias);

    const handleChangeClientData = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === "checkbox" ? checked : value;

        setClientInfo((prev) => ({
            ...prev,
            [name]: newValue,
        }));

        if (validationErrors[name]) {
            setValidationErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const handleChangeDeliveryData = (e) => {
        const { name, value } = e.target;

        setDeliveryInfo((prev) => {
            if (name === "province") {
                return {
                    ...prev,
                    province: value,
                    canton: "",
                    district: "",
                };
            }

            if (name === "canton") {
                return {
                    ...prev,
                    canton: value,
                    district: "",
                };
            }

            return {
                ...prev,
                [name]: value,
            };
        });

        setValidationErrors((prev) => {
            const updatedErrors = {
                ...prev,
                [name]: "",
            };

            if (name === "province") {
                updatedErrors.canton = "";
                updatedErrors.district = "";
            }

            if (name === "canton") {
                updatedErrors.district = "";
            }

            return updatedErrors;
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const errors = {};

        if (!fullName.trim()) {
            errors.fullName = "Ingresa tu nombre completo.";
        }

        if (!email.trim()) {
            errors.email = "Ingresa tu correo electrónico.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            errors.email =
                "Ingresa un correo válido. Ejemplo: usuario@correo.com.";
        }

        if (!isValidCedulaCR(cedula)) {
            errors.cedula =
                "Ingresa una cédula costarricense de 9 dígitos. Ejemplo: 1-2345-6789.";
        }

        if (!isValidPhoneCR(phone)) {
            errors.phone =
                "Ingresa un teléfono de Costa Rica de 8 dígitos. Ejemplos: 8888-8888 o +506 8888-8888.";
        }

        if (!province) {
            errors.province = "Selecciona una provincia.";
        }

        if (!canton) {
            errors.canton = "Selecciona un cantón.";
        }

        if (!district) {
            errors.district = "Selecciona un distrito.";
        }

        if (!address.trim()) {
            errors.address =
                "Ingresa la dirección exacta para entregar tu pedido.";
        }

        setValidationErrors(errors);

        if (Object.keys(errors).length > 0) {
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        if (!acceptedTerms) {
            onTermsError();
            return;
        }

        onCheckoutSubmit();
    };

    const getErrorProps = (name) => ({
        "aria-invalid": Boolean(validationErrors[name]),
        "aria-describedby": validationErrors[name]
            ? `${name}-error`
            : undefined,
    });

    const renderError = (name) =>
        validationErrors[name] ? (
            <p className="field-error" id={`${name}-error`} role="alert">
                {validationErrors[name]}
            </p>
        ) : null;

    return (
        <div className="checkout-form">
            <h2>Información de contacto</h2>

            <form
                id="checkout-form"
                onSubmit={handleSubmit}
                noValidate
            >
                <div className="form-group">
                    <label htmlFor="fullName">
                        Nombre completo <span className="field-required">*</span>
                    </label>
                    <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={fullName}
                        onChange={handleChangeClientData}
                        autoComplete="name"
                        placeholder="Ej. Juan Pérez Rodríguez"
                        {...getErrorProps("fullName")}
                        required
                    />
                    {renderError("fullName")}
                </div>

                <div className="form-group">
                    <label htmlFor="email">
                        Correo electrónico <span className="field-required">*</span>
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={handleChangeClientData}
                        autoComplete="email"
                        placeholder="Ej. usuario@correo.com"
                        {...getErrorProps("email")}
                        required
                    />
                    {renderError("email")}
                </div>

                <div className="form-group">
                    <label htmlFor="cedula">
                        Cédula de identidad <span className="field-required">*</span>
                    </label>
                    <input
                        type="text"
                        id="cedula"
                        name="cedula"
                        value={cedula}
                        onChange={handleChangeClientData}
                        inputMode="numeric"
                        autoComplete="off"
                        placeholder="Ej. 1-2345-6789"
                        {...getErrorProps("cedula")}
                        required
                    />
                    {renderError("cedula")}
                </div>

                <div className="form-group">
                    <label htmlFor="phone">
                        Teléfono <span className="field-required">*</span>
                    </label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={phone}
                        onChange={handleChangeClientData}
                        autoComplete="tel"
                        placeholder="Ej. 8888-8888 o +506 8888-8888"
                        {...getErrorProps("phone")}
                        required
                    />
                    {renderError("phone")}
                </div>

                <div className="form-group checkbox-group">
                    <label htmlFor="requiresElectronicInvoice">
                        <input
                            type="checkbox"
                            id="requiresElectronicInvoice"
                            name="requiresElectronicInvoice"
                            checked={requiresElectronicInvoice}
                            onChange={handleChangeClientData}
                        />
                        Requiere factura electrónica
                    </label>
                </div>

                <h2>Dirección de entrega</h2>

                <div className="form-group">
                    <label htmlFor="province">
                        Provincia <span className="field-required">*</span>
                    </label>
                    <select
                        id="province"
                        name="province"
                        value={province}
                        onChange={handleChangeDeliveryData}
                        {...getErrorProps("province")}
                        required
                    >
                        <option value="">Seleccione una provincia</option>

                        {provincias.map(([codigo, datos]) => (
                            <option key={codigo} value={codigo}>
                                {datos.nombre}
                            </option>
                        ))}
                    </select>
                    {renderError("province")}
                </div>

                <div className="form-group">
                    <label htmlFor="canton">
                        Cantón <span className="field-required">*</span>
                    </label>
                    <select
                        id="canton"
                        name="canton"
                        value={canton}
                        onChange={handleChangeDeliveryData}
                        disabled={!province || cantones.length === 0}
                        {...getErrorProps("canton")}
                        required
                    >
                        <option value="">Seleccione un cantón</option>

                        {cantones.map(([codigo, datos]) => (
                            <option key={codigo} value={codigo}>
                                {datos.nombre}
                            </option>
                        ))}
                    </select>
                    {renderError("canton")}
                </div>

                <div className="form-group">
                    <label htmlFor="district">
                        Distrito <span className="field-required">*</span>
                    </label>
                    <select
                        id="district"
                        name="district"
                        value={district}
                        onChange={handleChangeDeliveryData}
                        disabled={!canton || distritos.length === 0}
                        {...getErrorProps("district")}
                        required
                    >
                        <option value="">Seleccione un distrito</option>

                        {distritos.map(([codigo, nombre]) => (
                            <option key={codigo} value={codigo}>
                                {nombre}
                            </option>
                        ))}
                    </select>
                    {renderError("district")}
                </div>

                <div className="form-group">
                    <label htmlFor="address">
                        Dirección exacta <span className="field-required">*</span>
                    </label>
                    <textarea
                        id="address"
                        name="address"
                        value={address}
                        onChange={handleChangeDeliveryData}
                        autoComplete="street-address"
                        placeholder="Ej. 200 m norte de la iglesia, casa de portón negro"
                        rows={3}
                        {...getErrorProps("address")}
                        required
                    />
                    {renderError("address")}
                </div>

                <div className="form-group">
                    <label htmlFor="recipients">
                        Persona(s) que recibirán el pedido (opcional)
                    </label>
                    <textarea
                        id="recipients"
                        name="recipients"
                        value={recipients}
                        onChange={handleChangeDeliveryData}
                        placeholder="Ejemplo: Juan Pérez - 8888-8888, María López - 8888-8888"
                        rows={2}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="additionalNotes">
                        Indicaciones adicionales (opcional)
                    </label>
                    <textarea
                        id="additionalNotes"
                        name="additionalNotes"
                        value={additionalNotes}
                        onChange={handleChangeDeliveryData}
                        placeholder="Referencias, horario preferido, etc."
                        rows={2}
                    />
                </div>
            </form>
        </div>
    );
}