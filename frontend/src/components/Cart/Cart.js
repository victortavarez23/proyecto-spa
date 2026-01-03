// src/components/Cart/Cart.js
import React from 'react';
import useCart from '../../hooks/useCart';
// Ajusta esta ruta si tu botón está en otra parte, pero parece correcta:
import Button from '../ui/Button'; 
import './Cart.css';

const Cart = () => {
  const { items, removeItem, updateQuantity, clearCart, totalItems, totalPrice } = useCart();

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity === 0) {
      removeItem(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  // Estado vacío
  if (items.length === 0) {
    return (
      <div className="cart cart--empty">
        <p>Tu carrito está vacío 🛒</p>
        <Button variant="outline" onClick={() => window.location.href = '/#servicios'}>
            Ir a comprar
        </Button>
      </div>
    );
  }

  return (
    <div className="cart">
      {/* Encabezado del Carrito */}
      <div className="cart__header">
        <h3>Carrito de compras ({totalItems} items)</h3>
        <Button variant="text" onClick={clearCart}>
          Limpiar carrito
        </Button>
      </div>

      {/* Lista de Items */}
      <div className="cart__items">
        {items.map(item => (
          <div key={item.id} className="cart-item">
            {/* Imagen */}
            <img src={item.image} alt={item.name} className="cart-item__image" />
            
            {/* Info */}
            <div className="cart-item__info">
              <h4 className="cart-item__name">{item.name}</h4>
              <p className="cart-item__price">${item.price}</p>
            </div>

            {/* Controles de Cantidad */}
            <div className="cart-item__quantity">
              <Button
                variant="outline"
                size="small"
                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
              >
                -
              </Button>
              <span className="quantity-display">{item.quantity}</span>
              <Button
                variant="outline"
                size="small"
                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
              >
                +
              </Button>
            </div>

            {/* Total por Item */}
            <div className="cart-item__total">
              ${(item.price * item.quantity).toFixed(2)}
            </div>

            {/* Botón Eliminar */}
            <Button
              variant="text"
              className="cart-item__remove"
              onClick={() => removeItem(item.id)}
            >
              x
            </Button>
          </div>
        ))}
      </div>

      {/* Footer con Total y Pago */}
      <div className="cart__footer">
        <div className="cart__total">
          <strong>Total: ${totalPrice.toFixed(2)}</strong>
        </div>
        <Button variant="primary" size="large" onClick={() => alert("Ir al checkout...")}>
          Proceder al pago
        </Button>
      </div>
    </div>
  );
};

export default Cart;