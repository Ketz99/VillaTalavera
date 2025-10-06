// js/carrito.js
import { getCart, removeFromCart, updateQuantity, updateCartIcon } from './cart.js';

document.addEventListener('DOMContentLoaded', () => {
    const cartContainer = document.getElementById('cart-container');

    const renderCart = () => {
        const cart = getCart();
        updateCartIcon(); // Asegurarse que el ícono del header esté sincronizado

        if (cart.length === 0) {
            cartContainer.innerHTML = '<div id="empty-cart-message"><h3>Tu carrito está vacío</h3><p>Añade algunas artesanías para verlas aquí.</p></div>';
            return;
        }

        let total = 0;
        const itemsHTML = cart.map(item => {
            total += item.price * item.quantity;
            return `
                <div class="cart-item" data-id="${item.id}">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <h3>${item.name}</h3>
                        <p>$${item.price.toLocaleString('es-CO')}</p>
                    </div>
                    <div class="cart-item-quantity">
                        <input type="number" value="${item.quantity}" min="1" class="quantity-input">
                    </div>
                    <p class="cart-item-total">$${(item.price * item.quantity).toLocaleString('es-CO')}</p>
                    <button class="cart-item-remove-btn">✖</button>
                </div>
            `;
        }).join('');

        cartContainer.innerHTML = `
            <div class="cart-items">
                ${itemsHTML}
            </div>
            <div class="cart-summary">
                <h2>Resumen de Compra</h2>
                <div class="summary-row">
                    <span>Subtotal:</span>
                    <span id="cart-subtotal">$${total.toLocaleString('es-CO')}</span>
                </div>
                 <div class="summary-row total">
                    <strong>Total:</strong>
                    <strong id="cart-total">$${total.toLocaleString('es-CO')}</strong>
                </div>
                <button class="checkout-btn">Finalizar Compra</button>
            </div>
        `;

        addEventListeners();
    };

    const addEventListeners = () => {
        document.querySelectorAll('.cart-item-remove-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.target.closest('.cart-item').dataset.id;
                removeFromCart(parseInt(productId));
                renderCart(); // Re-render para mostrar los cambios
            });
        });

        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const productId = e.target.closest('.cart-item').dataset.id;
                const newQuantity = parseInt(e.target.value);
                updateQuantity(parseInt(productId), newQuantity);
                renderCart(); // Re-render
            });
        });
    };

    renderCart();
});
