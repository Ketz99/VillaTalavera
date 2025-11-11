// js/blog.js

document.addEventListener('DOMContentLoaded', () => {

    // Se asume que supabaseClient.js ya ha inicializado la variable 'supabase'
    if (typeof supabase === 'undefined') {
        console.error('Supabase no está inicializado. Asegúrate de incluir supabaseClient.js');
        return;
    }

    const fetchAndDisplayAllBlogPosts = async () => {
        const blogContainer = document.getElementById('full-blog-posts-container');
        if (!blogContainer) return; // Guardián

        // Consulta a Supabase para obtener todas las publicaciones
        const { data: posts, error } = await supabase
            .from('blog_posts')
            .select('id_post, titulo, imagen_destacada_url, slug, resumen, fecha_publicacion')
            .eq('estado', 'publicado') // Solo publicaciones activas
            .order('fecha_publicacion', { ascending: false }); // Ordenar por fecha

        if (error) {
            blogContainer.innerHTML = '<p class="text-red-500">Error al cargar las publicaciones del blog.</p>';
            console.error('Error fetching blog posts:', error);
            return;
        }

        if (posts.length === 0) {
            blogContainer.innerHTML = '<p class="text-center">Aún no hay publicaciones en el blog. ¡Vuelve pronto!</p>';
            return;
        }

        blogContainer.innerHTML = ''; // Limpiar contenedor
        
        posts.forEach(post => {
            const imageUrl = post.imagen_destacada_url || 'https://via.placeholder.com/400x300';
            const postDate = new Date(post.fecha_publicacion).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });

            const postCard = document.createElement('a');
            postCard.href = `post.html?slug=${post.slug}`;
            postCard.className = 'blog-post-card-full'; // Clase específica para el listado completo

            postCard.innerHTML = `
                <img src="${imageUrl}" alt="${post.titulo}">
                <div class="blog-post-content">
                    <h3>${post.titulo}</h3>
                    <p>${post.resumen || 'Sin resumen disponible.'}</p>
                    <span class="read-more">Leer más &rarr;</span>
                </div>
            `;
            blogContainer.appendChild(postCard);
        });
    };

    // Llamada a la función principal
    fetchAndDisplayAllBlogPosts();
});