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
                
                <div id="contenedor-bold" style="margin-top: 15px; text-align: center;"></div>
            </div>
        `;

        // Añadir eventos a los botones recién creados en el DOM
        addEventListeners();
    };

    const addEventListeners = () => {
        // Eventos para eliminar items
        document.querySelectorAll('.cart-item-remove-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.target.closest('.cart-item').dataset.id;
                removeFromCart(parseInt(productId));
                renderCart(); // Re-render para mostrar los cambios
            });
        });

        // Eventos para cambiar cantidades
        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const productId = e.target.closest('.cart-item').dataset.id;
                const newQuantity = parseInt(e.target.value);
                updateQuantity(parseInt(productId), newQuantity);
                renderCart(); // Re-render
            });
        });

        // NUEVO: Evento para el botón de "Finalizar Compra" asignado AQUÍ
        const checkoutBtn = document.querySelector('.checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', procesarPago);
        }
    };

    async function procesarPago() {
        const carrito = getCart();
        if (carrito.length === 0) return;

        // 1. Preparamos los datos
        const totalVenta = carrito.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        const orderId = `VT-${Date.now()}`;
        const contenedorBoton = document.getElementById('contenedor-bold');
        const checkoutBtn = document.querySelector('.checkout-btn');

        // Mostrar un mensaje de carga y ocultar el botón original
        checkoutBtn.style.display = 'none';
        contenedorBoton.innerHTML = '<p><i class="fas fa-spinner fa-spin"></i> Conectando con pasarela segura...</p>';

        try {
            // 2. Llamamos a nuestra Edge Function en Supabase
            const { data, error } = await supabase.functions.invoke('bold-hash', {
                body: {
                    orderId: orderId,
                    amount: totalVenta,
                    currency: 'COP'
                }
            });

            if (error) throw error;

            const hashDeIntegridad = data.hash;

            // 3. Inyectamos el botón de Bold
            contenedorBoton.innerHTML = ''; // Limpiamos el texto de carga

            const scriptBold = document.createElement('script');
            scriptBold.src = 'https://checkout.bold.co/library/boldPaymentButton.js';
            scriptBold.setAttribute('data-bold-button', 'bold-payment-button');
            scriptBold.setAttribute('data-api-key', 'pub_test_VrcMMs5yN0fo0MZmEWwlU_cbeIOQpjdg3Txb-nrn90Q'); // Tu llave pública
            scriptBold.setAttribute('data-amount', totalVenta);
            scriptBold.setAttribute('data-currency', 'COP');
            scriptBold.setAttribute('data-order-id', orderId);
            scriptBold.setAttribute('data-integrity-signature', hashDeIntegridad);
            scriptBold.setAttribute('data-redirection-url', 'https://ketz99.github.io/VillaTalavera/confirmacion.html');

            contenedorBoton.appendChild(scriptBold);

        } catch (err) {
            console.error("Error al generar seguridad del pago:", err);
            contenedorBoton.innerHTML = '<p style="color: red;">Error al cargar la pasarela. Intenta de nuevo.</p>';
            checkoutBtn.style.display = 'block'; // Volver a mostrar el botón si hay error
        }
    }

    // Inicializar el carrito al cargar la página
    renderCart();
});