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
                    <a href="#" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
                    <a href="#" aria-label="Facebook"><i class="fa-brands fa-facebook-f"></i></a>
                    <a href="#" aria-label="YouTube"><i class="fa-brands fa-youtube"></i></a>
                </div>
            </div>

            <div class="footer-column footer-logo">
                <div class="logo-circle">
                    <img src="img/icono.png" alt="Logo de Villa Talavera">
                </div>
            </div>

        </div>
`;

// Insertar el header al principio del body
document.body.after(footer);