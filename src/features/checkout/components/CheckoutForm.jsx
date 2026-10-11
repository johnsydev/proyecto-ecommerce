
import { useState } from "react";
import "../styles/CheckoutForm.css";
import ubicacionesCR from "../../../data/ubicacionesCR.json";

export default function CheckoutForm() {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        cedula: "",
        phone: "",
        requiereFactura: false,
        address: "",
        recipients: "",
        notes: "",
    });

    const [provincia, setProvincia] = useState("");
    const [canton, setCanton] = useState("");
    const [distrito, setDistrito] = useState("");

    const provincias = Object.entries(ubicacionesCR.provincias);

    const cantones = provincia
        ? Object.entries(
            ubicacionesCR.provincias[provincia].cantones
        )
        : [];

    const distritos = provincia && canton
        ? Object.entries(
            ubicacionesCR.provincias[provincia].cantones[canton].distritos
        )
        : [];

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const checkoutData = {
            ...formData,
            province: ubicacionesCR.provincias[provincia].nombre,
            canton: ubicacionesCR.provincias[provincia].cantones[canton].nombre,
            district: ubicacionesCR.provincias[provincia]
                .cantones[canton].distritos[distrito],
        };

        console.log("Datos del checkout:", checkoutData);
    };

    return (
        <div className="checkout-form">
            <h2>Información de contacto</h2>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="fullName">Nombre completo</label>
                    <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        autoComplete="name"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Correo electrónico</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        autoComplete="email"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="cedula">Cédula de identidad</label>
                    <input
                        type="text"
                        id="cedula"
                        name="cedula"
                        value={formData.cedula}
                        onChange={handleChange}
                        autoComplete="off"
                        inputMode="numeric"
                        pattern="[0-9]{9}"
                        maxLength={9}
                        placeholder="Ingrese los 9 dígitos de su cédula"
                        title="Ingrese los 9 dígitos de su cédula"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="phone">Teléfono</label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        autoComplete="tel"
                        required
                    />
                </div>

                <div className="form-group checkbox-group">
                    <label htmlFor="requiereFactura">
                        <input
                            type="checkbox"
                            id="requiereFactura"
                            name="requiereFactura"
                            checked={formData.requiereFactura}
                            onChange={handleChange}
                        />
                        Requiere factura electrónica
                    </label>
                </div>

                <h2>Dirección de entrega</h2>

                <div className="form-group">
                    <label htmlFor="province">Provincia</label>
                    <select
                        id="province"
                        name="province"
                        value={provincia}
                        onChange={(e) => {
                            setProvincia(e.target.value);
                            setCanton("");
                            setDistrito("");
                        }}
                        required
                    >
                        <option value="">Seleccione una provincia</option>
                        {provincias.map(([codigo, datos]) => (
                            <option key={codigo} value={codigo}>
                                {datos.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="canton">Cantón</label>
                    <select
                        id="canton"
                        name="canton"
                        value={canton}
                        onChange={(e) => {
                            setCanton(e.target.value);
                            setDistrito("");
                        }}
                        disabled={!provincia}
                        required
                    >
                        <option value="">Seleccione un cantón</option>
                        {cantones.map(([codigo, datos]) => (
                            <option key={codigo} value={codigo}>
                                {datos.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="district">Distrito</label>
                    <select
                        id="district"
                        name="district"
                        value={distrito}
                        onChange={(e) => setDistrito(e.target.value)}
                        disabled={!canton}
                        required
                    >
                        <option value="">Seleccione un distrito</option>
                        {distritos.map(([codigo, nombre]) => (
                            <option key={codigo} value={codigo}>
                                {nombre}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="address">Dirección exacta</label>
                    <textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        autoComplete="street-address"
                        placeholder="Señas para encontrar la dirección de entrega"
                        rows={3}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="recipients">
                        Persona(s) que recibirán el pedido (opcional)
                    </label>
                    <textarea
                        id="recipients"
                        name="recipients"
                        value={formData.recipients}
                        onChange={handleChange}
                        placeholder="Ejemplo: Juan Pérez - 8888-8888, María López - 8888-8888"
                        rows={2}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="notes">
                        Indicaciones adicionales (opcional)
                    </label>
                    <textarea
                        id="notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        placeholder="Referencias, horario preferido, etc."
                        rows={2}
                    />
                </div>

                <button
                    type="submit"
                    className="checkout-continue-button"
                >
                    Continuar al pago
                </button>
            </form>
        </div>
    );
}
