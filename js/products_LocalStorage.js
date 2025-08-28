document.addEventListener('DOMContentLoaded', () => {
    // Datos de ejemplo para simular los productos
    const mockProducts = [
        { id: '1', nombre: 'Jarrón de Talavera Azul', descripcion: 'Elegante jarrón pintado a mano con motivos florales tradicionales de Puebla.', precio: 1250.00, imageUrl: 'https://www.talaveradelaluz.com/wp-content/uploads/2024/05/5-Jarron-nervadura-copia.jpg' },
        { id: '2', nombre: 'Plato Decorativo Colonial', descripcion: 'Plato de cerámica de Talavera, perfecto para decorar cualquier pared o mesa con estilo.', precio: 850.50, imageUrl: 'https://ranchomx.co/wp-content/uploads/108.jpg' },
        { id: '3', nombre: 'Maceta Grande "El Sol"', descripcion: 'Maceta de gran tamaño ideal para plantas de interior o exterior, con un diseño vibrante.', precio: 1800.00, imageUrl: 'https://www.talaveracasaisidroyrafaela.com/cdn/shop/files/img337.jpg?v=1704846409' },
        { id: '4', nombre: 'Juego de Tazas "Amanecer"', descripcion: 'Set de cuatro tazas para café o té, cada una con un diseño único y colorido para alegrar tus mañanas.', precio: 950.00, imageUrl: 'https://m.media-amazon.com/images/I/71+ubDy-F2L.jpg' }
    ];

    // Función para mostrar los productos en la página
    function renderProducts() {
        const productGrid = document.getElementById('product-grid');
        const loadingMessage = document.getElementById('loading-message');

        // Cargar productos desde Local Storage
        const products = JSON.parse(localStorage.getItem('productos')) || [];

        productGrid.innerHTML = ''; // Limpiar el grid antes de renderizar

        if (products.length === 0) {
            if (loadingMessage) {
                loadingMessage.innerText = 'Aún no hay productos en la tienda. ¡Vuelve pronto!';
            }
        } else {
            if (loadingMessage) loadingMessage.style.display = 'none'; // Ocultar mensaje de carga

            products.forEach(product => {
                const productCard = `
                            <div class="bg-white rounded-lg shadow-md overflow-hidden group">
                                <div class="h-64 overflow-hidden">
                                    <img src="${product.imageUrl}" alt="${product.nombre}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300">
                                </div>
                                <div class="p-6 flex flex-col h-64 justify-between">
                                    <div>
                                        <h3 class="text-xl font-bold font-lora text-blue-500">${product.nombre}</h3>
                                        <p class="text-gray-600 mt-2 h-20 overflow-hidden">${product.descripcion}</p>
                                    </div>
                                    <div class="mt-4 flex justify-between items-center">
                                        <p class="text-2xl font-bold text-gray-800">$${product.precio.toFixed(2)}</p>
                                        <button class="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300">
                                            Ver más
                                        </button>
                                    </div>
                                </div>
                            </div>
                        `;
                productGrid.innerHTML += productCard;
            });
        }
    }

    // Si no hay productos en Local Storage, guardar los de ejemplo
    if (!localStorage.getItem('productos')) {
        localStorage.setItem('productos', JSON.stringify(mockProducts));
    }

    // Llamar a la función para mostrar los productos
    renderProducts();
});