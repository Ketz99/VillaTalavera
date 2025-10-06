// js/auth.js

document.addEventListener('DOMContentLoaded', async () => {
    const loginForm = document.getElementById('login-form');
    const messageDiv = document.getElementById('auth-message');

    // Comprobar si ya hay una sesión activa
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
        // Si hay sesión, redirigir al panel de administración
        window.location.href = 'admin.html';
        return; // Detener la ejecución del resto del script
    }

    // Función para mostrar mensajes
    const showMessage = (message, type = 'error') => {
        messageDiv.textContent = message;
        messageDiv.className = `auth-message ${type}`;
    };

    // Evento para el formulario de inicio de sesión
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            showMessage('Correo o contraseña incorrectos.');
            console.error('Login Error:', error.message);
        } else {
            // Redirigir al panel de administración si el login es exitoso
            window.location.href = 'admin.html';
        }
    });
});

