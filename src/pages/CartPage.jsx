import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function CartPage() {
  const { cartItems } = useCart();
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>No items in cart.</p>
      ) : (
        <>
          <ul className="space-y-3">
            {cartItems.map((item, idx) => (
              <li key={idx} className="flex justify-between">
                <span>{item.product_name}</span>
                <span>{item.quantity} × {item.price}</span>
              </li>
            ))}
          </ul>
          <button
            onClick={() => navigate("/checkout")}
            className="mt-6 bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            Proceed to Checkout
          </button>
        </>
      )}
    </div>
  );
}
