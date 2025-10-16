// Crear el elemento header
const footer = document.createElement('footer');
footer.className = 'site-footer';
footer.id = 'footer';

// Insertar todo el contenido HTML
footer.innerHTML = `
        <div class="footer-container">

            <div class="footer-column footer-links">
                <h4>Información</h4>
                <ul>
                    <li><a href="/busqueda">Búsqueda</a></li>
                    <li><a href="/terminos">Términos y Condiciones</a></li>
                    <li><a href="/contacto">Contacto</a></li>
                </ul>
            </div>

            <div class="footer-column footer-subscribe">
                <h4>SUSCRÍBETE</h4>
                <p>Suscríbete e infórmate de nuestras ofertas y novedades.</p>

                <form class="subscribe-form">
                    <input type="email" placeholder="Suscríbete a nuestra lista de correo">
                    <button type="submit" aria-label="Suscribirse">
                        <i class="fa-regular fa-envelope"></i>
                    </button>
                </form>

                <div class="footer-social">
                    <a href="https://www.instagram.com/villa.talavera/?hl=es" target="_blank" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
                    <a href="https://www.facebook.com/villatalaveral/?locale=es_LA" target="_blank" aria-label="Facebook"><i class="fa-brands fa-facebook-f"></i></a>
                    <a href="https://www.tiktok.com/@villatalavera" target="_blank" aria-label="Tiktok"><i class="fa-brands fa-tiktok"></i></a>
                </div>
            </div>

            <div class="footer-column footer-logo">
                <a href="index.html">
                <div class="logo-circle">
                    <img src="img/logo-corto.png" alt="Logo de Villa Talavera">
                </div>
                </a>
            </div>

        </div>
`;

// Insertar el header al principio del body
document.body.after(footer);