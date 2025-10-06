import { addToCart } from './cart.js';

document.addEventListener('DOMContentLoaded', () => {
    const productDetailContainer = document.getElementById('product-detail-container');
    const relatedProductsContainer = document.getElementById('related-products-carousel');
    const relatedProductsSection = document.getElementById('related-products-section');

    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        productDetailContainer.innerHTML = '<p class="error-message">Producto no encontrado.</p>';
        return;
    }

    const fetchProductDetails = async () => {
        const { data: producto, error } = await supabase
            .from('productos')
            .select(`*, categorias_productos ( nombre ), imagenes_productos ( url_imagen )`)
            .eq('id_producto', productId)
            .single();

        if (error || !producto) {
            console.error('Error fetching product:', error);
            productDetailContainer.innerHTML = '<p class="error-message">No se pudo cargar el producto.</p>';
            return;
        }

        renderProductDetails(producto);
        if (producto.id_categoria) {
            fetchRelatedProducts(producto.id_categoria, producto.id_producto);
        }
    };

    const renderProductDetails = (producto) => {
        document.title = `${producto.nombre} - Villa Talavera`;

        productDetailContainer.innerHTML = `
            <div class="product-layout">
                <div class="product-gallery">
                    <div class="main-image-container">
                        <img id="main-product-image" src="${producto.imagenes_productos[0]?.url_imagen || 'https://via.placeholder.com/600'}" alt="${producto.nombre}">
                    </div>
                    <div id="thumbnail-container" class="thumbnail-container"></div>
                </div>
                <div class="product-info">
                    <h1>${producto.nombre}</h1>
                    <p class="price">$${producto.precio.toLocaleString('es-CO')}</p>
                    <p class="description">${producto.descripcion}</p>
                    <div class="quantity-selector">
                        <label for="quantity">Cantidad:</label>
                        <input type="number" id="quantity" value="1" min="1" max="${producto.stock}">
                    </div>
                    <button class="add-to-cart-btn">AGREGAR AL CARRITO</button>
                </div>
            </div>
        `;

        const thumbnailContainer = document.getElementById('thumbnail-container');
        const mainImage = document.getElementById('main-product-image');

        if (producto.imagenes_productos.length > 1) {
            producto.imagenes_productos.forEach((imagen, index) => {
                const thumb = document.createElement('img');
                thumb.src = imagen.url_imagen;
                thumb.alt = `Vista previa ${index + 1} de ${producto.nombre}`;
                if (index === 0) thumb.classList.add('active');
                
                thumb.addEventListener('click', () => {
                    mainImage.src = imagen.url_imagen;
                    thumbnailContainer.querySelector('.active')?.classList.remove('active');
                    thumb.classList.add('active');
                });
                thumbnailContainer.appendChild(thumb);
            });
        }
        
        // --- Lógica para añadir al carrito ---
        const addToCartButton = document.querySelector('.add-to-cart-btn');
        const quantityInput = document.getElementById('quantity');

        addToCartButton.addEventListener('click', () => {
            const quantity = parseInt(quantityInput.value);
            addToCart(producto, quantity);
            // Puedes mostrar una confirmación más elegante que un alert
            alert(`${quantity} x ${producto.nombre} se ha añadido al carrito.`);
        });
    };

    const fetchRelatedProducts = async (categoryId, currentProductId) => {
        const { data: productos, error } = await supabase
            .from('productos')
            .select(`id_producto, nombre, precio, imagenes_productos ( url_imagen )`)
            .eq('id_categoria', categoryId)
            .neq('id_producto', currentProductId)
            .limit(5);

        if (error || !productos || productos.length === 0) return;

        relatedProductsSection.classList.remove('hidden');
        relatedProductsContainer.innerHTML = '';

        productos.forEach(producto => {
            const imageUrl = producto.imagenes_productos[0]?.url_imagen || 'https://via.placeholder.com/300';
            const card = document.createElement('a');
            card.href = `producto.html?id=${producto.id_producto}`;
            card.className = 'featured-product-card';
            card.innerHTML = `
                <img src="${imageUrl}" alt="${producto.nombre}">
                <h3>${producto.nombre.toUpperCase()}</h3>
                <p>$${producto.precio.toLocaleString('es-CO')}</p>
                <div class="featured-product-overlay">
                    <span>Ver detalle</span>
                </div>
            `;
            relatedProductsContainer.appendChild(card);
        });
    };

    fetchProductDetails();
});

