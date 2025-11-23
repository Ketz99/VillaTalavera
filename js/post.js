// js/post.js

document.addEventListener('DOMContentLoaded', () => {

    // Se asume que supabaseClient.js ya ha inicializado la variable 'supabase'
    if (typeof supabase === 'undefined') {
        console.error('Supabase no está inicializado.');
        return;
    }

    const loadSinglePost = async () => {
        const postContainer = document.getElementById('single-post-container');
        const urlParams = new URLSearchParams(window.location.search);
        // 1. Obtener el 'slug' de la URL: post.html?slug=mi-titulo-de-post
        const postSlug = urlParams.get('slug'); 
        
        if (!postSlug) {
            postContainer.innerHTML = `
                <div class="post-not-found" style="text-align:center; padding: 50px;">
                    <h2 class="section-title">¡Oops! Publicación no encontrada</h2>
                    <p style="font-size: 1.1rem; margin-bottom: 20px;">No se ha especificado una publicación para mostrar.</p>
                    <a href="blog.html" class="section-btn back-btn-detail">← Volver al Blog</a>
                </div>
            `;
            document.getElementById('post-title').innerText = 'Publicación no encontrada';
            return;
        }

        // 2. Consultar Supabase usando el 'slug'
        const { data: post, error } = await supabase
            .from('blog_posts')
            .select('*') // Selecciona toda la información (título, contenido, etc.)
            .eq('slug', postSlug) // Filtra por el slug
            .single(); // Espera un único resultado

        if (error || !post) {
            postContainer.innerHTML = `
                <div class="post-not-found" style="text-align:center; padding: 50px;">
                    <h2 class="section-title">Publicación no encontrada</h2>
                    <p style="font-size: 1.1rem; margin-bottom: 20px;">La publicación "${postSlug}" no existe o ha sido eliminada.</p>
                    <a href="blog.html" class="section-btn back-btn-detail">← Volver al Blog</a>
                </div>
            `;
            document.getElementById('post-title').innerText = 'Publicación no encontrada';
            console.error('Error fetching single post:', error);
            return;
        }

        // 3. Inyectar el contenido en el DOM
        document.getElementById('post-title').innerText = `${post.titulo} | Blog Villa Talavera`;
        
        const imageUrl = post.imagen_destacada_url || 'https://via.placeholder.com/1200x500';
        const postDate = new Date(post.fecha_publicacion).toLocaleDateString('es-ES', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });

        postContainer.innerHTML = `
            <header class="post-header">
                <h1 class="post-title-detail">${post.titulo}</h1>
                <p class="post-meta">Publicado el ${postDate} por ${post.autor || 'Villa Talavera'}</p>
            </header>
            <figure class="post-featured-image">
                <img src="${imageUrl}" alt="${post.titulo}">
                <figcaption>${post.caption || ''}</figcaption>
            </figure>
            <div class="post-content-body">
                ${post.contenido} 
            </div>
            <div class="post-share-section">
                <span>Compartir en:</span>
                <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}" class="share-icon" target="_blank" aria-label="Compartir en Facebook"><i class="fab fa-facebook-f"></i></a>
                <a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.titulo)}" class="share-icon" target="_blank" aria-label="Compartir en Twitter"><i class="fab fa-twitter"></i></a>
                <a href="https://api.whatsapp.com/send?text=${encodeURIComponent(post.titulo + ' ' + window.location.href)}" class="share-icon" target="_blank" aria-label="Compartir en WhatsApp"><i class="fab fa-whatsapp"></i></a>
            </div>
        `;
    };

    loadSinglePost();
});