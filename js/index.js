// js/main.js

document.addEventListener('DOMContentLoaded', () => {

    const fetchAndDisplayCategories = async () => {
        const categoryListContainer = document.getElementById('categorias-galeria');
        if (!categoryListContainer) return;
        const { data: categorias, error } = await supabase
            .from('categorias_productos')
            .select('id_categoria, nombre, imagen_url, descripcion');
        if (error) {
            categoryListContainer.innerHTML = '<p class="text-red-500">Error al cargar categorías.</p>';
            return;
        }

        if (categorias.length === 0) {
            categoryListContainer.innerHTML = '<p>No hay categorías disponibles en este momento.</p>';
            return;
        }

        categoryListContainer.innerHTML = ''; // Limpiamos el contenedor antes de agregar las categorías

        categorias.forEach((cat, i) => {
            const categoryCard = document.createElement('div');
            categoryCard.className = "categoria-card";

            categoryCard.innerHTML = `
            <img src="${cat.imagen_url}" alt="${cat.nombre}">
            <div class="categoria-overlay">
                <div class="categoria-titulo">${cat.nombre}</div>
                <a href="productos.html?categoria=${cat.id_categoria}" class="categoria-btn">CLICK AQUÍ</a>
            </div>
        `;
            categoryListContainer.appendChild(categoryCard);
        });
    };


    // --- LÓGICA PARA EL SLIDESHOW DEL BANNER ---

    let allBanners = [];
    let currentBannerIndex = 0;
    let bannerInterval;
    const bannerContainer = document.getElementById('banner-principal');
    let slider;

    const initializeBannerSlideshow = async () => {
        if (!bannerContainer) return;
        const { data: banners, error } = await supabase
            .from('banners')
            .select('titulo, subtitulo, url_imagen, url_enlace, activo')
            .eq('activo', true)
            .order('orden', { ascending: true });

        if (error || !banners || banners.length === 0) {
            if (bannerContainer) bannerContainer.style.display = 'none';
            return;
        }

        allBanners = banners;

        if (!bannerContainer) return;

        bannerContainer.innerHTML = '';
        slider = document.createElement('div');
        slider.className = 'banner-slider';

        allBanners.forEach(banner => {
            const bannerElement = document.createElement('div');
            bannerElement.className = 'main-banner';
            bannerElement.style.backgroundImage = `url('${banner.url_imagen}')`;

            bannerElement.innerHTML = `
                <div class="main-banner-overlay">
                    <div class="main-banner-content">
                        <span class="main-banner-coleccion">${banner.subtitulo || 'Nueva Colección'}</span>
                        <h1 class="main-banner-title">${banner.titulo || ''}</h1>
                        <span class="main-banner-desc">Piezas hechas a mano</span>
                        <a href="${banner.url_enlace || '#'}" class="main-banner-btn">VITRINEA AQUÍ</a>
                    </div>
                </div>
            `;
            slider.appendChild(bannerElement);
        });

        bannerContainer.appendChild(slider);

        startBannerInterval();
    };

    const nextBanner = () => {
        currentBannerIndex++;
        if (currentBannerIndex >= allBanners.length) {
            currentBannerIndex = 0;
        }
        if (slider) slider.style.transform = `translateX(-${currentBannerIndex * 100}%)`;
    };

    const startBannerInterval = () => {
        if (bannerInterval) clearInterval(bannerInterval);
        bannerInterval = setInterval(nextBanner, 5000);
    };

    // --- LÓGICA PARA PRODUCTOS DESTACADOS ---
    const fetchAndDisplayFeaturedProducts = async () => {
        const carouselContainer = document.querySelector('.carousel-container');
        if (!carouselContainer) return;
        
        const carouselTrack = document.getElementById('featured-products-carousel');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');

        const { data: productos, error } = await supabase
            .from('productos')
            .select(`
                id_producto,
                nombre,
                precio,
                imagenes_productos ( url_imagen )
            `)
            .eq('destacado', true)
            .limit(10);

        if (error || !productos || productos.length === 0) {
            document.querySelector('.featured-products-section').style.display = 'none';
            return;
        }

        carouselTrack.innerHTML = ''; // Limpiar
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
            carouselTrack.appendChild(card);
        });
        
        // --- LÓGICA DEL CARRUSEL RESPONSIVO ---
        let currentIndex = 0;

        const updateCarousel = () => {
            const card = carouselTrack.querySelector('.featured-product-card');
            if (!card) return;

            const cardMargin = parseInt(window.getComputedStyle(card).marginRight) || 20; // 20 es el gap
            const cardWidth = card.offsetWidth;
            const containerWidth = carouselContainer.offsetWidth;
            const visibleCards = Math.floor(containerWidth / (cardWidth + cardMargin)) || 1;
            
            const maxIndex = productos.length - visibleCards;
            
            if (productos.length > visibleCards) {
                 prevBtn.classList.remove('hidden');
                 nextBtn.classList.remove('hidden');
            } else {
                 prevBtn.classList.add('hidden');
                 nextBtn.classList.add('hidden');
            }
            
            if (currentIndex > maxIndex) {
                currentIndex = maxIndex;
            }
             if (currentIndex < 0) {
                currentIndex = 0;
            }

            const offset = -currentIndex * (cardWidth + cardMargin);
            carouselTrack.style.transform = `translateX(${offset}px)`;
        };

        nextBtn.addEventListener('click', () => {
            currentIndex++;
            updateCarousel();
        });

        prevBtn.addEventListener('click', () => {
            currentIndex--;
            updateCarousel();
        });
        
        // Actualizar al cargar y al cambiar tamaño de la ventana
        window.addEventListener('resize', updateCarousel);
        updateCarousel();
    };


    // --- LLAMADAS A LAS FUNCIONES ---
    initializeBannerSlideshow();
    fetchAndDisplayCategories();
    fetchAndDisplayFeaturedProducts();

    // --- LÓGICA DEL MENÚ HAMBURGUESA ---
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const mainNav = document.querySelector('.main-nav');
    if (hamburgerBtn && mainNav) {
        hamburgerBtn.addEventListener('click', () => {
            mainNav.classList.toggle('open');
        });
    }

});