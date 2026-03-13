import { updateCartIcon } from './js/cart.js';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Borramos el historial del carrito en el navegador
    localStorage.removeItem('villaTalaveraCart');

    // 2. Actualizamos el número del carrito a "0" en el header
    updateCartIcon();
});