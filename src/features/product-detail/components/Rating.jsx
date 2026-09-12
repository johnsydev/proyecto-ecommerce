import { Star } from "lucide-react";
import "../styles/Rating.css";

/*
 * Objetivo:
 * Mostrar visualmente la calificación de un producto mediante un sistema
 * de cinco estrellas, incluyendo estrellas completas o parcialmente llenas.
 *
 * Entrada:
 * - Recibe mediante la propiedad rating el valor numérico de la calificación
 *   del producto.
 *
 * Salida:
 * - Muestra cinco estrellas que representan la calificación recibida.
 * - Cada estrella puede mostrarse completamente llena, parcialmente llena
 *   o vacía según el valor de rating.
 * - Muestra también el valor numérico de la calificación junto a las estrellas.
 *
 * Restricciones:
 * - El valor de rating debe ser numérico.
 * - La representación visual está diseñada para una escala de 0 a 5 estrellas.
 * - El porcentaje de llenado de cada estrella se limita entre 0% y 100%.
 * - El componente Star de lucide-react y el archivo Rating.css deben estar
 *   correctamente importados.
 */

export default function Rating({ rating }) {
  return (
    <div className="rating">
      {[1, 2, 3, 4, 5].map((star) => {
        let porcentajeLlenar = (rating - star + 1) * 100;
        if (porcentajeLlenar > 100) {
          porcentajeLlenar = 100;
        }
        if (porcentajeLlenar < 0) {
          porcentajeLlenar = 0;
        }

        return (
          <div className="star" key={star}>
            <Star size={20} className="star-empty" />

            <div
              className="star-fill"
              style={{ width: `${porcentajeLlenar}%` }}
            >
              <Star size={20} className="star-full" />
            </div>
          </div>
        );
      })}

      <span>{rating}</span>
    </div>
  );
}
