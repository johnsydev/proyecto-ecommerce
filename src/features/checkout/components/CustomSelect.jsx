import { useState, useRef, useEffect } from "react";
import "../styles/CustomSelect.css";

export default function CustomSelect({
    id,
    name,
    value,
    onChange,
    options,
    placeholder = "Seleccione una opción",
    disabled = false,
    required = false,
    invalid = false,
    errorProps = {},
}) {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef(null);

    const selectedOption = options.find(
        ([codigo]) => codigo === value
    );

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                selectRef.current &&
                !selectRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        const handleEscape = (event) => {
            if (event.key === "Escape") {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, []);

    const handleSelect = (optionValue) => {
        onChange({
            target: {
                name,
                value: optionValue,
            },
        });

        setIsOpen(false);
    };

    return (
        <div
            className={`custom-select ${isOpen ? "is-open" : ""} ${
                invalid ? "has-error" : ""
            } ${disabled ? "is-disabled" : ""}`}
            ref={selectRef}
        >
            <button
                type="button"
                id={id}
                className="custom-select-trigger"
                onClick={() => {
                    if (!disabled) {
                        setIsOpen((prev) => !prev);
                    }
                }}
                disabled={disabled}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-invalid={invalid}
                aria-required={required}
                {...errorProps}
            >
                <span className={!selectedOption ? "placeholder" : ""}>
                    {selectedOption ? selectedOption[1] : placeholder}
                </span>

                <svg
                    className="custom-select-arrow"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                >
                    <path
                        d="m7 10 5 5 5-5"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </button>

            {isOpen && !disabled && (
                <ul
                    className="custom-select-options"
                    role="listbox"
                    aria-labelledby={id}
                >
                    {options.map(([codigo, texto]) => (
                        <li key={codigo} role="presentation">
                            <button
                                type="button"
                                className={`custom-select-option ${
                                    value === codigo ? "selected" : ""
                                }`}
                                role="option"
                                aria-selected={value === codigo}
                                onClick={() => handleSelect(codigo)}
                            >
                                <span>{texto}</span>

                                {value === codigo && (
                                    <span aria-hidden="true">✓</span>
                                )}
                            </button>
                        </li>
                    ))}

                    {options.length === 0 && (
                        <li className="custom-select-empty">
                            No hay opciones disponibles
                        </li>
                    )}
                </ul>
            )}
        </div>
    );
}