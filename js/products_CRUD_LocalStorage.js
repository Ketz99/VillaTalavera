
document.addEventListener('DOMContentLoaded', () => {
    const productForm = document.getElementById('product-form');
    const productListDiv = document.getElementById('admin-product-list');
    const formTitle = document.getElementById('form-title');
    const submitButton = document.getElementById('submit-button');
    const cancelEditButton = document.getElementById('cancel-edit');
    const feedbackDiv = document.getElementById('feedback-message');

    // Campos del formulario
    const productIdInput = document.getElementById('productId');
    const nombreInput = document.getElementById('nombre');
    const descripcionInput = document.getElementById('descripcion');
    const precioInput = document.getElementById('precio');
    const imageUrlInput = document.getElementById('imageUrl');

    // Cargar productos o usar mock data si está vacío
    let products = JSON.parse(localStorage.getItem('productos')) || [
        { id: '1', nombre: 'Jarrón de Talavera Azul', descripcion: 'Elegante jarrón pintado a mano con motivos florales tradicionales de Puebla.', precio: 1250.00, imageUrl: 'https://placehold.co/600x400/3B82F6/FFFFFF?text=Talavera+1' },
        { id: '2', nombre: 'Plato Decorativo Colonial', descripcion: 'Plato de cerámica de Talavera, perfecto para decorar cualquier pared o mesa con estilo.', precio: 850.50, imageUrl: 'https://placehold.co/600x400/3B82F6/FFFFFF?text=Talavera+2' }
    ];

    function saveProducts() {
        localStorage.setItem('productos', JSON.stringify(products));
    }

    function showFeedback(message, isError = false) {
        feedbackDiv.textContent = message;
        feedbackDiv.className = `mt-4 text-center p-3 rounded-md ${isError ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`;
        feedbackDiv.classList.remove('opacity-0');
        setTimeout(() => { feedbackDiv.classList.add('opacity-0'); }, 3000);
    }

    function renderProducts() {
        productListDiv.innerHTML = '';
        if (products.length === 0) {
            productListDiv.innerHTML = '<p class="text-gray-500 text-center">No hay productos para mostrar.</p>';
            return;
        }
        products.forEach(product => {
            const productEl = document.createElement('div');
            // **CORRECCIÓN RESPONSIVA APLICADA AQUÍ**
            // Se cambia a flex-col en pantallas pequeñas (sm) y flex-row en medianas (md) y superiores.
            productEl.className = 'flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-4 rounded-lg shadow-sm border';
            productEl.innerHTML = `
                        <div class="flex items-center gap-4 w-full md:w-auto flex-grow">
                            <img src="${product.imageUrl}" alt="${product.nombre}" class="w-16 h-16 object-cover rounded-md flex-shrink-0">
                            <div class="min-w-0">
                                <p class="font-bold text-gray-800 truncate">${product.nombre}</p>
                                <p class="text-sm text-gray-500">$${product.precio.toFixed(2)}</p>
                            </div>
                        </div>
                        <div class="flex flex-row sm:flex-col md:flex-row gap-2 w-full md:w-auto flex-shrink-0">
                            <button data-id="${product.id}" class="edit-btn flex-1 md:flex-none bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition text-sm">Editar</button>
                            <button data-id="${product.id}" class="delete-btn flex-1 md:flex-none bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition text-sm">Eliminar</button>
                        </div>
                    `;
            productListDiv.appendChild(productEl);
        });
    }

    function resetForm() {
        productForm.reset();
        productIdInput.value = '';
        formTitle.textContent = 'Agregar Nuevo Producto';
        submitButton.textContent = 'Agregar Producto';
        cancelEditButton.classList.add('hidden');
    }

    // CREATE / UPDATE
    productForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = productIdInput.value;
        const productData = {
            nombre: nombreInput.value,
            descripcion: descripcionInput.value,
            precio: parseFloat(precioInput.value),
            imageUrl: imageUrlInput.value
        };

        if (id) { // Actualizar
            const index = products.findIndex(p => p.id === id);
            if (index !== -1) {
                products[index] = { ...products[index], ...productData };
                showFeedback('Producto actualizado con éxito.');
            }
        } else { // Crear
            productData.id = Date.now().toString();
            products.push(productData);
            showFeedback('Producto agregado con éxito.');
        }
        saveProducts();
        renderProducts();
        resetForm();
    });

    // READ (al cargar) y delegación de eventos para EDIT / DELETE
    productListDiv.addEventListener('click', (e) => {
        const button = e.target.closest('button');
        if (!button) return;

        const id = button.dataset.id;

        // DELETE
        if (button.classList.contains('delete-btn')) {
            if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
                products = products.filter(p => p.id !== id);
                saveProducts();
                renderProducts();
                showFeedback('Producto eliminado.');
            }
        }

        // EDIT
        if (button.classList.contains('edit-btn')) {
            const productToEdit = products.find(p => p.id === id);
            if (productToEdit) {
                productIdInput.value = productToEdit.id;
                nombreInput.value = productToEdit.nombre;
                descripcionInput.value = productToEdit.descripcion;
                precioInput.value = productToEdit.precio;
                imageUrlInput.value = productToEdit.imageUrl;

                formTitle.textContent = 'Editando Producto';
                submitButton.textContent = 'Actualizar Producto';
                cancelEditButton.classList.remove('hidden');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
    });

    cancelEditButton.addEventListener('click', resetForm);

    // Render inicial
    renderProducts();
});