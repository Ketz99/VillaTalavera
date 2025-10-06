// js/productos.js

document.addEventListener('DOMContentLoaded', () => {
    // Referencias a los elementos del DOM (versión estructurada)
    const productGrid = document.getElementById('product-grid');
    const categoryFiltersContainer = document.getElementById('category-filters');
    const searchInput = document.getElementById('search-input');
    const pageTitle = document.getElementById('page-title');
    const loadingMessage = document.getElementById('loading-message');

    // --- INICIO DE LA CORRECCIÓN ---
    // Si los elementos principales de la página de productos no existen, detenemos la ejecución.
    if (!productGrid || !categoryFiltersContainer || !searchInput) {
        return;
    }
    // --- FIN DE LA CORRECCIÓN ---

    let allProducts = [];
    let allCategories = [];
    let currentFilters = {
        categoryId: null,
        searchTerm: ''
    };

    const fetchInitialData = async () => {
        if (loadingMessage) loadingMessage.style.display = 'block';

        const [categoriesRes, productsRes] = await Promise.all([
            supabase.from('categorias_productos').select('*').order('nombre'),
            supabase.from('productos').select('*, imagenes_productos(url_imagen)').eq('activo', true)
        ]);

        if (productsRes.error) {
            console.error('Error fetching products:', productsRes.error);
            productGrid.innerHTML = '<p>Error al cargar los productos.</p>';
            return;
        }
        allProducts = productsRes.data;

        if (categoriesRes.error) {
            console.error('Error fetching categories:', categoriesRes.error);
        } else {
            allCategories = categoriesRes.data;
        }

        // =================================================================================
        // --- INICIO DEL CAMBIO: Lógica para leer la categoría de la URL ANTES de renderizar los filtros ---
        // =================================================================================
        const urlParams = new URLSearchParams(window.location.search);
        const categoryIdFromUrl = urlParams.get('categoria');
        if (categoryIdFromUrl) {
            currentFilters.categoryId = parseInt(categoryIdFromUrl);
            const categoryName = allCategories.find(c => c.id_categoria == categoryIdFromUrl)?.nombre;
            if (categoryName && pageTitle) pageTitle.textContent = categoryName;
        }
        
        // Ahora que el filtro inicial está establecido, renderizamos el menú de categorías.
        // Esto asegura que la categoría correcta aparezca como 'activa'.
        renderCategoryFilters();
        // =================================================================================
        // --- FIN DEL CAMBIO ---
        // =================================================================================

        applyFilters();
        if (loadingMessage) loadingMessage.style.display = 'none';
    };

    const renderCategoryFilters = () => {
        categoryFiltersContainer.innerHTML = '';

        const allCategoriesButton = document.createElement('li');
        allCategoriesButton.textContent = 'Todas';
        allCategoriesButton.dataset.id = 'all';
        allCategoriesButton.classList.toggle('active', !currentFilters.categoryId);
        allCategoriesButton.addEventListener('click', () => setCategoryFilter(null));
        categoryFiltersContainer.appendChild(allCategoriesButton);

        allCategories.forEach(category => {
            const li = document.createElement('li');
            li.textContent = category.nombre;
            li.dataset.id = category.id_categoria;
            li.classList.toggle('active', currentFilters.categoryId === category.id_categoria);
            li.addEventListener('click', () => setCategoryFilter(category.id_categoria));
            categoryFiltersContainer.appendChild(li);
        });
    };

    const setCategoryFilter = (categoryId) => {
        currentFilters.categoryId = categoryId;
        const categoryName = allCategories.find(c => c.id_categoria == categoryId)?.nombre;
        if (pageTitle) pageTitle.textContent = categoryName || 'Todos los Productos';

        // Actualizar la clase activa
        const currentActive = categoryFiltersContainer.querySelector('.active');
        if (currentActive) currentActive.classList.remove('active');

        const newActive = categoryId ?
            categoryFiltersContainer.querySelector(`[data-id='${categoryId}']`) :
            categoryFiltersContainer.querySelector(`[data-id='all']`);
        if (newActive) newActive.classList.add('active');

        applyFilters();
    };

    const applyFilters = () => {
        let filteredProducts = [...allProducts];

        if (currentFilters.categoryId) {
            filteredProducts = filteredProducts.filter(p => p.id_categoria === currentFilters.categoryId);
        }

        if (currentFilters.searchTerm) {
            const searchTermLower = currentFilters.searchTerm.toLowerCase();
            filteredProducts = filteredProducts.filter(p => p.nombre.toLowerCase().includes(searchTermLower));
        }

        renderProducts(filteredProducts);
    };

    const renderProducts = (products) => {
        productGrid.innerHTML = '';

        if (products.length === 0) {
            productGrid.innerHTML = '<p class="no-products-message">No se encontraron productos con estos filtros.</p>';
            return;
        }

        products.forEach(producto => {
            const imageUrl = producto.imagenes_productos[0]?.url_imagen || 'https://via.placeholder.com/300';
            const card = document.createElement('a');
            card.href = `producto.html?id=${producto.id_producto}`;
            card.className = 'product-card';

            card.innerHTML = `
                <img src="${imageUrl}" alt="${producto.nombre}" class="product-card-image">
                <div class="product-card-info">
                    <h3>${producto.nombre.toUpperCase()}</h3>
                    <p>$${producto.precio.toLocaleString('es-CO')}</p>
                </div>
            `;
            productGrid.appendChild(card);
        });
    };

    searchInput.addEventListener('input', (e) => {
        currentFilters.searchTerm = e.target.value;
        applyFilters();
    });

    // Carga inicial
    fetchInitialData();
});

