document.addEventListener('DOMContentLoaded', () => {
    // --- Referencias DOM ---
    const productGrid = document.getElementById('product-grid');
    const categoryFiltersContainer = document.getElementById('category-filters');
    const countryFiltersContainer = document.getElementById('country-filters'); // ✅ NUEVA REFERENCIA
    const searchInput = document.getElementById('search-input');
    const pageTitle = document.getElementById('page-title');
    const loadingMessage = document.getElementById('loading-message');

    // ID de México (Constante basada en tu DB para la lógica "Internacional")
    const MEXICO_ID = '6b0bc545-b0b6-4f06-aa7b-c62ec5db9c54';

    if (!productGrid || !categoryFiltersContainer || !countryFiltersContainer || !searchInput) {
        return;
    }

    let allProducts = [];
    let allCategories = [];
    let allCountries = []; // ✅ Almacén de países

    // ✅ Estado de filtros actualizado
    let currentFilters = {
        categoryId: null,
        countryId: null,      // Para filtrar por un país específico
        isInternational: false, // Para filtrar "Todo excepto México"
        searchTerm: ''
    };

    const fetchInitialData = async () => {
        if (loadingMessage) loadingMessage.style.display = 'block';

        // ✅ Ahora traemos Categorías, Productos y Países
        const [categoriesRes, productsRes, countriesRes] = await Promise.all([
            supabase.from('categorias_productos').select('*').order('nombre'),
            supabase.from('productos').select('*, imagenes_productos(url_imagen)').eq('activo', true),
            supabase.from('paises').select('*').order('nombre') // Nueva consulta
        ]);

        if (productsRes.error) {
            console.error('Error fetching products:', productsRes.error);
            productGrid.innerHTML = '<p>Error al cargar los productos.</p>';
            return;
        }
        allProducts = productsRes.data;

        if (categoriesRes.error) console.error('Error fetching categories:', categoriesRes.error);
        else allCategories = categoriesRes.data;

        if (countriesRes.error) console.error('Error fetching countries:', countriesRes.error);
        else allCountries = countriesRes.data;

        // --- LECTURA DE URL (Lógica mejorada) ---
        const urlParams = new URLSearchParams(window.location.search);
        
        // 1. Filtro por Categoría
        const categoryIdFromUrl = urlParams.get('categoria');
        if (categoryIdFromUrl) {
            currentFilters.categoryId = parseInt(categoryIdFromUrl);
        }

        // 2. Filtro por País Específico (?pais=ID)
        const countryIdFromUrl = urlParams.get('pais');
        if (countryIdFromUrl) {
            currentFilters.countryId = countryIdFromUrl;
        }

        // 3. Filtro Internacional (?origen=internacional)
        const origenFromUrl = urlParams.get('origen');
        if (origenFromUrl === 'internacional') {
            currentFilters.isInternational = true;
            // Si es internacional, nos aseguramos que countryId esté null para no crear conflicto
            currentFilters.countryId = null; 
        }

        // --- Renderizado de filtros y título ---
        updatePageTitle();
        renderCategoryFilters();
        renderCountryFilters(); // ✅ Renderizar botones de países
        applyFilters();

        if (loadingMessage) loadingMessage.style.display = 'none';
    };

    // Función auxiliar para el título
    const updatePageTitle = () => {
        if (!pageTitle) return;

        if (currentFilters.searchTerm) {
            pageTitle.textContent = `Resultados para: "${currentFilters.searchTerm}"`;
            return;
        }

        if (currentFilters.isInternational) {
            pageTitle.textContent = "Artesanías del Mundo";
        } else if (currentFilters.countryId) {
            const country = allCountries.find(c => c.id === currentFilters.countryId);
            pageTitle.textContent = country ? `Artesanías de ${country.nombre}` : 'Productos';
        } else if (currentFilters.categoryId) {
            const category = allCategories.find(c => c.id_categoria == currentFilters.categoryId);
            pageTitle.textContent = category ? category.nombre : 'Productos';
        } else {
            pageTitle.textContent = 'Todos los Productos';
        }
    };

    const renderCategoryFilters = () => {
        categoryFiltersContainer.innerHTML = '';

        // Botón "Todas las categorías"
        const allBtn = createFilterButton('Todas', 'all', !currentFilters.categoryId, () => {
            currentFilters.categoryId = null;
            renderCategoryFilters(); // Re-render para actualizar clases active
            updatePageTitle();
            applyFilters();
        });
        categoryFiltersContainer.appendChild(allBtn);

        allCategories.forEach(cat => {
            const isActive = currentFilters.categoryId === cat.id_categoria;
            const btn = createFilterButton(cat.nombre, cat.id_categoria, isActive, () => {
                currentFilters.categoryId = cat.id_categoria;
                renderCategoryFilters();
                updatePageTitle();
                applyFilters();
            });
            categoryFiltersContainer.appendChild(btn);
        });
    };

    // ✅ NUEVA FUNCIÓN: Renderizar filtros de países
    const renderCountryFilters = () => {
        countryFiltersContainer.innerHTML = '';

        // Botón "Todos" (Resetea países y modo internacional)
        const isAllActive = !currentFilters.countryId && !currentFilters.isInternational;
        const allBtn = createFilterButton('Todos', 'all-countries', isAllActive, () => {
            currentFilters.countryId = null;
            currentFilters.isInternational = false;
            renderCountryFilters();
            updatePageTitle();
            applyFilters();
        });
        countryFiltersContainer.appendChild(allBtn);

        // Botón "Internacional" (Todo menos México)
        const worldBtn = createFilterButton('Resto del Mundo (No MX)', 'int', currentFilters.isInternational, () => {
            currentFilters.isInternational = true;
            currentFilters.countryId = null;
            renderCountryFilters();
            updatePageTitle();
            applyFilters();
        });
        countryFiltersContainer.appendChild(worldBtn);

        // Botones individuales por país
        allCountries.forEach(country => {
            const isActive = currentFilters.countryId === country.id;
            const btn = createFilterButton(country.nombre, country.id, isActive, () => {
                currentFilters.countryId = country.id;
                currentFilters.isInternational = false; // Desactivar modo internacional si elijo un país específico
                renderCountryFilters();
                updatePageTitle();
                applyFilters();
            });
            countryFiltersContainer.appendChild(btn);
        });
    };

    // Helper para crear elementos LI de filtro
    const createFilterButton = (text, dataId, isActive, onClick) => {
        const li = document.createElement('li');
        li.textContent = text;
        li.dataset.id = dataId;
        if (isActive) li.classList.add('active');
        li.addEventListener('click', onClick);
        return li;
    };

    // ✅ LÓGICA DE FILTRADO ACTUALIZADA
    const applyFilters = () => {
        let filteredProducts = [...allProducts];

        // 1. Filtro por Categoría
        if (currentFilters.categoryId) {
            filteredProducts = filteredProducts.filter(p => p.id_categoria === currentFilters.categoryId);
        }

        // 2. Filtro por País
        if (currentFilters.countryId) {
            // Caso: País específico seleccionado
            filteredProducts = filteredProducts.filter(p => p.id_pais === currentFilters.countryId);
        } else if (currentFilters.isInternational) {
            // Caso: ?origen=internacional (Todo excepto México)
            filteredProducts = filteredProducts.filter(p => p.id_pais !== MEXICO_ID);
        }

        // 3. Filtro por Buscador
        if (currentFilters.searchTerm) {
            const term = currentFilters.searchTerm.toLowerCase();
            filteredProducts = filteredProducts.filter(p => p.nombre.toLowerCase().includes(term));
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
        updatePageTitle(); // Para que el título diga "Resultados para..."
        applyFilters();
    });

    fetchInitialData();
});