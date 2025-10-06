// js/cart.js

// --- FUNCIONES BÁSICAS DEL CARRITO ---

export function getCart() {
    return JSON.parse(localStorage.getItem('villaTalaveraCart')) || [];
}

export function saveCart(cart) {
    localStorage.setItem('villaTalaveraCart', JSON.stringify(cart));
    updateCartIcon();
}

export function addToCart(product, quantity) {
    const cart = getCart();
    const existingProductIndex = cart.findIndex(item => item.id === product.id_producto);

    if (existingProductIndex > -1) {
        // Si el producto ya existe, actualiza la cantidad
        cart[existingProductIndex].quantity += quantity;
    } else {
        // Si es un producto nuevo, lo agrega al carrito
        cart.push({
            id: product.id_producto,
            name: product.nombre,
            price: product.precio,
            image: product.imagenes_productos[0]?.url_imagen || 'https://via.placeholder.com/150',
            quantity: quantity
        });
    }
    saveCart(cart);
}

export function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
}

export function updateQuantity(productId, quantity) {
    let cart = getCart();
    const productIndex = cart.findIndex(item => item.id === productId);
    if (productIndex > -1) {
        if (quantity > 0) {
            cart[productIndex].quantity = quantity;
        } else {
            // Si la cantidad es 0 o menos, elimina el producto
            cart = cart.filter(item => item.id !== productId);
        }
    }
    saveCart(cart);
}


// --- ACTUALIZACIÓN DEL ÍCONO DEL HEADER ---

function getCartItemCount() {
    return getCart().reduce((total, item) => total + item.quantity, 0);
}

export function updateCartIcon() {
    const cartIcon = document.getElementById('cart-item-count');
    if (cartIcon) {
        const count = getCartItemCount();
        cartIcon.textContent = count;
        cartIcon.style.display = count > 0 ? 'flex' : 'none';
    }
}

// Llama a esta función en todas las páginas para asegurar que el ícono esté actualizado
document.addEventListener('DOMContentLoaded', updateCartIcon);
