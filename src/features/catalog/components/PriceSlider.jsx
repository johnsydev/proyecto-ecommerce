import { useRange } from "react-instantsearch";
import { useState, useEffect } from "react";
import "../styles/PriceSlider.css";

/*
 * Objetivo:
 * Permitir al usuario filtrar los productos según un rango de precios,
 * utilizando controles deslizantes y campos numéricos para establecer
 * un precio mínimo y máximo.
 *
 * Entrada:
 * - Recibe mediante props el atributo numérico de Algolia que se desea filtrar.
 * - Obtiene desde useRange el rango disponible de precios, el rango seleccionado
 *   actualmente y la función refine para aplicar el filtro.
 * - Recibe los valores ingresados por el usuario en los campos de precio
 *   mínimo y máximo.
 *
 * Salida:
 * - Muestra dos campos numéricos para establecer el precio mínimo y máximo.
 * - Muestra dos controles deslizantes para modificar visualmente el rango de precios.
 * - Actualiza los resultados del catálogo cuando el usuario modifica el rango.
 * - Muestra los valores mínimo y máximo disponibles con formato de moneda.
 * - No muestra el componente si Algolia no devuelve un rango de precios válido.
 *
 * Restricciones:
 * - El componente debe utilizarse dentro de InstantSearch.
 * - El atributo recibido mediante props debe ser numérico y permitir filtros por rango.
 * - El precio mínimo seleccionado no puede ser mayor que el precio máximo.
 * - El precio máximo seleccionado no puede ser menor que el precio mínimo.
 * - Los valores ingresados fuera del rango permitido se ajustan automáticamente
 *   al mínimo o máximo disponible.
 * - Si el usuario ingresa un valor no válido, se utiliza un valor válido
 *   dentro del rango permitido.
 */

export default function PriceSlider(props) {
  const { range, refine, start } = useRange(props);
  const { min, max } = range;

  const absMin = min ?? 0;
  const absMax = max ?? 100000;

  const currentMin =
    start[0] !== -Infinity && start[0] !== Infinity && !isNaN(start[0])
      ? start[0]
      : absMin;
  const currentMax =
    start[1] !== -Infinity && start[1] !== Infinity && !isNaN(start[1])
      ? start[1]
      : absMax;

  // Estados locales para los inputs de texto (permite escribir libremente sin romper el formato)
  const [minValueInput, setMinValueInput] = useState(currentMin);
  const [maxValueInput, setMaxValueInput] = useState(currentMax);

  // Sincronizar si cambia desde afuera
  useEffect(() => {
    setMinValueInput(currentMin);
    setMaxValueInput(currentMax);
  }, [currentMin, currentMax]);

  const handleSliderMinChange = (e) => {
    const value = Number(e.target.value);
    if (value <= currentMax) {
      refine([value, currentMax]);
    }
  };

  const handleSliderMaxChange = (e) => {
    const value = Number(e.target.value);
    if (value >= currentMin) {
      refine([currentMin, value]);
    }
  };

  // Cuando el usuario escribe en el input de texto "Min"
  const handleMinInputChange = (e) => {
    setMinValueInput(e.target.value);
  };

  const handleMinInputBlur = () => {
    let value = Number(minValueInput);
    if (isNaN(value) || value < absMin) value = absMin;
    if (value > currentMax) value = currentMax;
    setMinValueInput(value);
    refine([value, currentMax]);
  };

  // Cuando el usuario escribe en el input de texto "Max"
  const handleMaxInputChange = (e) => {
    setMaxValueInput(e.target.value);
  };

  const handleMaxInputBlur = () => {
    let value = Number(maxValueInput);
    if (isNaN(value) || value > absMax) value = absMax;
    if (value < currentMin) value = currentMin;
    setMaxValueInput(value);
    refine([currentMin, value]);
  };

  if (min === null || max === null) {
    return null;
  }

  return (
    <div className="price-slider-container">
      {/* Inputs de texto sincronizados arriba */}
      <div className="price-inputs-grid">
        <div className="price-input-group">
          <label htmlFor="price-min">Min</label>
          <input
            id="price-min"
            type="number"
            value={minValueInput}
            onChange={handleMinInputChange}
            onBlur={handleMinInputBlur}
            onKeyDown={(e) => e.key === "Enter" && handleMinInputBlur()}
            min={absMin}
            max={absMax}
          />
        </div>
        <span className="price-dash">-</span>
        <div className="price-input-group">
          <label>Max</label>
          <input
            type="number"
            value={maxValueInput}
            onChange={handleMaxInputChange}
            onBlur={handleMaxInputBlur}
            onKeyDown={(e) => e.key === "Enter" && handleMaxInputBlur()}
            min={absMin}
            max={absMax}
          />
        </div>
      </div>

      {/* Double Slider visual */}
      <div className="dual-slider">
        <input
          type="range"
          min={absMin}
          max={absMax}
          value={currentMin}
          onChange={handleSliderMinChange}
          className="thumb thumb-min"
        />
        <input
          type="range"
          min={absMin}
          max={absMax}
          value={currentMax}
          onChange={handleSliderMaxChange}
          className="thumb thumb-max"
        />
        <div className="slider-track"></div>
      </div>

      <div className="price-limits">
        <span>₡{Number(absMin).toLocaleString("en-US")}</span>
        <span>₡{Number(absMax).toLocaleString("en-US")}</span>
      </div>
    </div>
  );
}
