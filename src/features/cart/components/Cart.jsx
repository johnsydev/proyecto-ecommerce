import "../styles/Cart.css";

import { useNavigate } from "react-router-dom";

export default function Cart() {

  const navigate = useNavigate();

  return (
    <div className="cart-page">
        <h1>Carrito de compras</h1>
    </div>
  );
}