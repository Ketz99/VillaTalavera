// Crear el elemento header
const header = document.createElement('header');
header.className = 'site-header';

// Insertar todo el contenido HTML
header.innerHTML = `
  <div class="top-bar">
    <div class="social-icons">
      <a href="https://www.instagram.com/villa.talavera/?hl=es" target="_blank" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
      <a href="https://www.facebook.com/villatalaveral/?locale=es_LA" target="_blank" aria-label="Facebook"><i class="fa-brands fa-facebook-f"></i></a>
      <a href="https://www.tiktok.com/@villatalavera" target="_blank" aria-label="Tiktok"><i class="fa-brands fa-tiktok"></i></a>
    </div>
  </div>

  <div class="main-header-container">
    <div class="header-icon-left">
      <a href="#" aria-label="Buscar"><i class="fa-solid fa-magnifying-glass"></i></a>
    </div>

    <div class="logo-container">
      <a href="index.html">
        <img src="img/logo-largo.jpg" alt="Logo de Villa Talavera" class="logo-image">
      </a>
    </div>

    <div class="header-icon-right">
      <a href="login.html" aria-label="Mi Cuenta"><i class="fa-regular fa-user"></i></a>
      <a href="carrito.html" aria-label="Carrito de compras">
        <i class="fa-solid fa-bag-shopping"></i>
        <span id="cart-item-count">0</span>
      </a>
    </div>

    <button class="hamburger-btn" aria-label="Abrir menú">
      <i class="fa-solid fa-bars"></i>
    </button>
  </div>

  <nav class="main-nav">
    <ul>
      <li><a href="index.html" data-target="site-header">Inicio</a></li>
      <li><a href="index.html#categories-section" data-target="categories-section">Artesanias</a></li>
      <li><a href="index.html#about-us-section" data-target="blog-section">Nosotros</a></li>
      <li><a href="#footer" data-target="banners-section">Contacto</a></li>
    </ul>
  </nav>
`;

// Insertar el header al principio del body
document.body.prepend(header);