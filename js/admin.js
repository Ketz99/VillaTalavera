document.addEventListener('DOMContentLoaded', () => {
    // --- Referencias a elementos del DOM (Productos y Categorías) ---
    const productForm = document.getElementById('product-form');
    const imageManagementSection = document.getElementById('image-management-section');
    const currentImagesContainer = document.getElementById('current-images-container');
    const productImageInput = document.getElementById('product-image');
    const productTableBody = document.getElementById('inventory-table-body');
    const productFormTitle = document.getElementById('form-title');
    const productIdInput = document.getElementById('product-id');
    const productCategorySelect = document.getElementById('product-category');
    const productSaveButton = document.getElementById('save-button');
    const productCancelButton = document.getElementById('cancel-button');

    const categoryForm = document.getElementById('category-form');
    const categoryTableBody = document.getElementById('category-table-body');
    const categoryFormTitle = document.getElementById('category-form-title');
    const categoryIdInput = document.getElementById('category-id');
    const categoryNameInput = document.getElementById('category-name');
    const categoryDescriptionInput = document.getElementById('category-description');
    const categorySaveButton = document.getElementById('save-category-button');
    const categoryCancelButton = document.getElementById('cancel-category-button');
    const categoryImageInput = document.getElementById('category-image');
    const categoryImagePreviewContainer = document.getElementById('category-image-preview-container');
    const currentCategoryImage = document.getElementById('current-category-image');
    const deleteCategoryImageBtn = document.getElementById('delete-category-image-btn');

    // --- Referencias DOM para Blog ---
    const blogForm = document.getElementById('blog-form');
    const blogTableBody = document.getElementById('blog-table-body');
    const blogFormTitle = document.getElementById('blog-form-title');
    const postIdInput = document.getElementById('post-id');
    const postTitleInput = document.getElementById('post-title');
    const postSummaryInput = document.getElementById('post-summary');
    const postContentInput = document.getElementById('post-content');
    const postStatusSelect = document.getElementById('post-status');
    const postImageInput = document.getElementById('post-image');
    const postImagePreviewContainer = document.getElementById('post-image-preview-container');
    const currentPostImage = document.getElementById('current-post-image');
    const deletePostImageBtn = document.getElementById('delete-post-image-btn');
    const cancelPostButton = document.getElementById('cancel-post-button');

    // --- Referencias DOM para Banners ---
    const bannerForm = document.getElementById('banner-form');
    const bannerTableBody = document.getElementById('banner-table-body');
    const bannerFormTitle = document.getElementById('banner-form-title');
    const bannerIdInput = document.getElementById('banner-id');
    const bannerTitleInput = document.getElementById('banner-title');
    const bannerSubtitleInput = document.getElementById('banner-subtitle');
    const bannerLinkInput = document.getElementById('banner-link');
    const bannerOrderInput = document.getElementById('banner-order');
    const bannerActiveCheckbox = document.getElementById('banner-active');
    const bannerImageInput = document.getElementById('banner-image');
    const bannerImagePreviewContainer = document.getElementById('banner-image-preview-container');
    const currentBannerImage = document.getElementById('current-banner-image');
    const cancelBannerButton = document.getElementById('cancel-banner-button');

    // =================================================================
    // LÓGICA PARA IMÁGENES DE PRODUCTOS
    // =================================================================
    const uploadProductImage = async (file, productId) => {
        if (!file) return;
        const fileName = `${Date.now()}-${file.name}`;
        const filePath = `products/${productId}/${fileName}`;
        const { error: uploadError } = await supabase.storage.from('product-images').upload(filePath, file);
        if (uploadError) { console.error('Error uploading product image:', uploadError); return; }
        const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(filePath);
        await supabase.from('imagenes_productos').insert({ id_producto: productId, url_imagen: urlData.publicUrl });
    };

    const fetchAndDisplayProductImages = async (productId) => {
        imageManagementSection.classList.remove('hidden');
        currentImagesContainer.innerHTML = '<p>Cargando imágenes...</p>';
        const { data: images, error } = await supabase.from('imagenes_productos').select('*').eq('id_producto', productId);
        if (error || !images || images.length === 0) {
            currentImagesContainer.innerHTML = '<p>Este producto no tiene imágenes.</p>';
            return;
        }
        currentImagesContainer.innerHTML = '';
        images.forEach(image => {
            const imgContainer = document.createElement('div');
            imgContainer.classList.add('image-thumbnail');
            const imagePath = new URL(image.url_imagen).pathname.split('/product-images/')[1];
            imgContainer.innerHTML = `<img src="${image.url_imagen}" alt="Imagen de producto"><button class="delete-btn" data-type="image" data-id="${image.id_imagen}" data-path="${imagePath}">X</button>`;
            currentImagesContainer.appendChild(imgContainer);
        });
    };

    // =================================================================
    // LÓGICA PARA PRODUCTOS
    // =================================================================
    const renderProductsTable = (productos) => {
        productTableBody.innerHTML = '';
        productos.forEach(prod => {
            const row = document.createElement('tr');
            // MODIFICACIÓN: Se añade la celda para "destacado"
            const destacadoText = prod.destacado ? 'Sí' : 'No';
            row.innerHTML = `<td>${prod.id_producto}</td><td>${prod.nombre}</td><td>$${prod.precio}</td><td>${prod.stock}</td><td>${destacadoText}</td><td class="actions"><button class="edit-btn" data-type="product" data-id="${prod.id_producto}">Editar</button><button class="delete-btn" data-type="product" data-id="${prod.id_producto}">Eliminar</button></td>`;
            productTableBody.appendChild(row);
        });
    };

    const fetchProducts = async () => {
        const { data, error } = await supabase.from('productos').select('*').order('id_producto');
        if (error) console.error('Error fetching products:', error); else renderProductsTable(data);
    };

    const resetProductFormState = () => {
        productForm.reset();
        productIdInput.value = '';
        productFormTitle.textContent = 'Agregar/Editar Producto';
        productCancelButton.classList.add('hidden');
        imageManagementSection.classList.add('hidden');
    };

    productForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = productIdInput.value;
        const imageFile = productImageInput.files[0];

        // MODIFICACIÓN: Se captura el valor booleano del campo "destacado"
        const productData = {
            nombre: document.getElementById('nombre').value,
            descripcion: document.getElementById('descripcion').value,
            precio: parseFloat(document.getElementById('precio').value),
            stock: parseInt(document.getElementById('stock').value),
            id_categoria: parseInt(productCategorySelect.value),
            destacado: document.getElementById('destacado').value === 'true' // Convierte el string a booleano
        };

        let savedProduct;
        if (id) {
            const { data, error } = await supabase.from('productos').update(productData).eq('id_producto', id).select().single();
            if (error) { console.error('Error updating product:', error); return; }
            savedProduct = data;
        } else {
            const { data, error } = await supabase.from('productos').insert(productData).select().single();
            if (error) { console.error('Error creating product:', error); return; }
            savedProduct = data;
        }
        if (imageFile && savedProduct) await uploadProductImage(imageFile, savedProduct.id_producto);
        await fetchProducts();
        resetProductFormState();
    });

    productCancelButton.addEventListener('click', resetProductFormState);

    // =================================================================
    // LÓGICA PARA CATEGORÍAS
    // =================================================================
    const populateCategoryDropdown = (categorias) => {
        productCategorySelect.innerHTML = '<option value="" disabled selected>Selecciona una categoría</option>';
        categorias.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.id_categoria;
            option.textContent = cat.nombre;
            productCategorySelect.appendChild(option);
        });
    };

    const renderCategoriesTable = (categorias) => {
        categoryTableBody.innerHTML = '';
        categorias.forEach(cat => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${cat.id_categoria}</td><td>${cat.nombre}</td><td class="actions"><button class="edit-btn" data-type="category" data-id="${cat.id_categoria}">Editar</button><button class="delete-btn" data-type="category" data-id="${cat.id_categoria}">Eliminar</button></td>`;
            categoryTableBody.appendChild(row);
        });
    };

    const fetchCategories = async () => {
        const { data, error } = await supabase.from('categorias_productos').select('*').order('id_categoria');
        if (error) console.error('Error fetching categories:', error);
        else { renderCategoriesTable(data); populateCategoryDropdown(data); }
    };

    const resetCategoryFormState = () => {
        categoryForm.reset();
        categoryIdInput.value = '';
        categoryFormTitle.textContent = 'Agregar/Editar Categoría';
        categoryCancelButton.classList.add('hidden');
        categoryImagePreviewContainer.classList.add('hidden');
        deleteCategoryImageBtn.removeAttribute('data-id');
    };

    categoryForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = categoryIdInput.value;
        const imageFile = categoryImageInput.files[0];
        const categoryData = { nombre: categoryNameInput.value, descripcion: categoryDescriptionInput.value };
        let savedCategory;
        if (id) {
            const { data, error } = await supabase.from('categorias_productos').update(categoryData).eq('id_categoria', id).select().single();
            if (error) { console.error('Error updating category:', error); return; }
            savedCategory = data;
        } else {
            const { data, error } = await supabase.from('categorias_productos').insert(categoryData).select().single();
            if (error) { console.error('Error creating category:', error); return; }
            savedCategory = data;
        }
        if (imageFile && savedCategory) {
            const filePath = `categories/${savedCategory.id_categoria}/${Date.now()}-${imageFile.name}`;
            await supabase.storage.from('product-images').upload(filePath, imageFile, { upsert: true });
            const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(filePath);
            await supabase.from('categorias_productos').update({ imagen_url: urlData.publicUrl }).eq('id_categoria', savedCategory.id_categoria);
        }
        await fetchCategories();
        resetCategoryFormState();
    });

    categoryCancelButton.addEventListener('click', resetCategoryFormState);

    deleteCategoryImageBtn.addEventListener('click', async () => {
        const categoryId = deleteCategoryImageBtn.dataset.id;
        if (!categoryId || !confirm('¿Eliminar la imagen de esta categoría?')) return;
        const { data } = await supabase.from('categorias_productos').select('imagen_url').eq('id_categoria', categoryId).single();
        if (data && data.imagen_url) {
            const imagePath = new URL(data.imagen_url).pathname.split('/product-images/')[1];
            await supabase.storage.from('product-images').remove([imagePath]);
        }
        await supabase.from('categorias_productos').update({ imagen_url: null }).eq('id_categoria', categoryId);
        categoryImagePreviewContainer.classList.add('hidden');
        await fetchCategories();
    });

    // =================================================================
    // LÓGICA PARA BLOG
    // =================================================================
    const renderBlogTable = (posts) => {
        blogTableBody.innerHTML = '';
        posts.forEach(post => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${post.id_post}</td><td>${post.titulo}</td><td><span class="status-${post.estado}">${post.estado}</span></td><td class="actions"><button class="edit-btn" data-type="post" data-id="${post.id_post}">Editar</button><button class="delete-btn" data-type="post" data-id="${post.id_post}">Eliminar</button></td>`;
            blogTableBody.appendChild(row);
        });
    };

    const fetchBlogPosts = async () => {
        const { data, error } = await supabase.from('blog_posts').select('*').order('id_post', { ascending: false });
        if (error) console.error('Error fetching posts:', error); else renderBlogTable(data);
    };

    const resetBlogFormState = () => {
        blogForm.reset();
        postIdInput.value = '';
        blogFormTitle.textContent = 'Agregar/Editar Publicación';
        cancelPostButton.classList.add('hidden');
        postImagePreviewContainer.classList.add('hidden');
        deletePostImageBtn.removeAttribute('data-id');
    };

    blogForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = postIdInput.value;
        const imageFile = postImageInput.files[0];
        const slug = postTitleInput.value.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
        const postData = { titulo: postTitleInput.value, resumen: postSummaryInput.value, contenido: postContentInput.value, slug, estado: postStatusSelect.value };
        let savedPost;
        if (id) {
            const { data, error } = await supabase.from('blog_posts').update(postData).eq('id_post', id).select().single();
            if (error) { console.error('Error updating post:', error); return; }
            savedPost = data;
        } else {
            const { data, error } = await supabase.from('blog_posts').insert(postData).select().single();
            if (error) { console.error('Error creating post:', error); return; }
            savedPost = data;
        }
        if (imageFile && savedPost) {
            const filePath = `blog/${savedPost.id_post}/${Date.now()}-${imageFile.name}`;
            await supabase.storage.from('product-images').upload(filePath, imageFile, { upsert: true });
            const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(filePath);
            await supabase.from('blog_posts').update({ imagen_destacada_url: urlData.publicUrl }).eq('id_post', savedPost.id_post);
        }
        await fetchBlogPosts();
        resetBlogFormState();
    });

    cancelPostButton.addEventListener('click', resetBlogFormState);

    deletePostImageBtn.addEventListener('click', async () => {
        const postId = deletePostImageBtn.dataset.id;
        if (!postId || !confirm('¿Eliminar la imagen de esta publicación?')) return;
        const { data } = await supabase.from('blog_posts').select('imagen_destacada_url').eq('id_post', postId).single();
        if (data && data.imagen_destacada_url) {
            const imagePath = new URL(data.imagen_destacada_url).pathname.split('/product-images/')[1];
            await supabase.storage.from('product-images').remove([imagePath]);
        }
        await supabase.from('blog_posts').update({ imagen_destacada_url: null }).eq('id_post', postId);
        postImagePreviewContainer.classList.add('hidden');
        await fetchBlogPosts();
    });

    // =================================================================
    // LÓGICA PARA BANNERS
    // =================================================================
    const renderBannerTable = (banners) => {
        bannerTableBody.innerHTML = '';
        banners.forEach(banner => {
            const row = document.createElement('tr');
            row.innerHTML = `<td><div class="image-thumbnail"><img src="${banner.url_imagen || 'https://via.placeholder.com/80x40'}" alt="Banner" class="table-thumbnail"></div></td><td>${banner.titulo}</td><td>${banner.url_enlace || ''}</td><td><span class="status-${banner.activo}">${banner.activo ? 'Sí' : 'No'}</span></td><td>${banner.orden || ''}</td><td class="actions"><button class="edit-btn" data-type="banner" data-id="${banner.id_banner}">Editar</button><button class="delete-btn" data-type="banner" data-id="${banner.id_banner}">Eliminar</button></td>`;
            bannerTableBody.appendChild(row);
        });
    };

    const fetchBanners = async () => {
        const { data, error } = await supabase.from('banners').select('*').order('orden');
        if (error) console.error('Error fetching banners:', error); else renderBannerTable(data);
    };

    const resetBannerFormState = () => {
        bannerForm.reset();
        bannerIdInput.value = '';
        bannerFormTitle.textContent = 'Agregar/Editar Banner';
        cancelBannerButton.classList.add('hidden');
        bannerImagePreviewContainer.classList.add('hidden');
    };

    bannerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = bannerIdInput.value;
        const imageFile = bannerImageInput.files[0];
        if (!id && !imageFile) {
            alert('Por favor, selecciona una imagen para el nuevo banner.');
            return;
        }
        const bannerData = {
            titulo: bannerTitleInput.value,
            subtitulo: bannerSubtitleInput.value,
            url_enlace: bannerLinkInput.value,
            orden: parseInt(bannerOrderInput.value) || 0,
            activo: bannerActiveCheckbox.checked,
        };
        if (id) {
            const { data: savedBanner, error } = await supabase.from('banners').update(bannerData).eq('id_banner', id).select().single();
            if (error) { console.error('Error updating banner:', error); return; }
            if (imageFile) {
                const filePath = `banners/${savedBanner.id_banner}/${Date.now()}-${imageFile.name}`;
                await supabase.storage.from('product-images').upload(filePath, imageFile, { upsert: true });
                const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(filePath);
                await supabase.from('banners').update({ url_imagen: urlData.publicUrl }).eq('id_banner', savedBanner.id_banner);
            }
        } else {
            const filePath = `banners/${Date.now()}-${imageFile.name}`;
            const { error: uploadError } = await supabase.storage.from('product-images').upload(filePath, imageFile);
            if (uploadError) { console.error('Error uploading banner image:', uploadError); return; }
            const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(filePath);
            bannerData.url_imagen = urlData.publicUrl;
            const { error: insertError } = await supabase.from('banners').insert(bannerData);
            if (insertError) { console.error('Error creating banner:', insertError); }
        }
        await fetchBanners();
        resetBannerFormState();
    });

    cancelBannerButton.addEventListener('click', resetBannerFormState);

    // =================================================================
    // DELEGACIÓN DE EVENTOS PRINCIPAL
    // =================================================================
    document.querySelector('main.container').addEventListener('click', async (e) => {
        const target = e.target;
        const id = target.dataset.id;
        const type = target.dataset.type;
        if (!id || !type) return;

        if (target.classList.contains('delete-btn')) {
            let tableName, idColumn, callback;
            switch (type) {
                case 'product': tableName = 'productos'; idColumn = 'id_producto'; callback = fetchProducts; break;
                case 'category': tableName = 'categorias_productos'; idColumn = 'id_categoria'; callback = fetchCategories; break;
                case 'post': tableName = 'blog_posts'; idColumn = 'id_post'; callback = fetchBlogPosts; break;
                case 'banner': tableName = 'banners'; idColumn = 'id_banner'; callback = fetchBanners; break;
                case 'image':
                    if (!confirm('¿Seguro que quieres eliminar esta imagen?')) return;
                    const imagePath = target.dataset.path;
                    await supabase.storage.from('product-images').remove([imagePath]);
                    await supabase.from('imagenes_productos').delete().eq('id_imagen', id);
                    target.parentElement.remove();
                    return;
            }
            if (tableName && confirm(`¿Seguro que quieres eliminar este elemento?`)) {
                const { error } = await supabase.from(tableName).delete().eq(idColumn, id);
                if (error) console.error(`Error deleting ${type}:`, error); else await callback();
            }
        }

        if (target.classList.contains('edit-btn')) {
            // Oculta el menú de las cartas al editar
            menuGrid.classList.add('hidden');
            switch (type) {
                case 'product':
                    const { data: productData } = await supabase.from('productos').select('*').eq('id_producto', id).single();
                    if (productData) {
                        productIdInput.value = productData.id_producto;
                        document.getElementById('nombre').value = productData.nombre;
                        document.getElementById('descripcion').value = productData.descripcion;
                        document.getElementById('precio').value = productData.precio;
                        document.getElementById('stock').value = productData.stock;
                        productCategorySelect.value = productData.id_categoria;
                        // MODIFICACIÓN: Se asigna el valor de "destacado" al formulario
                        document.getElementById('destacado').value = productData.destacado;
                        productFormTitle.textContent = 'Editar Producto';
                        productCancelButton.classList.remove('hidden');
                        await fetchAndDisplayProductImages(productData.id_producto);
                    }
                    break;
                case 'category':
                    const { data: categoryData } = await supabase.from('categorias_productos').select('*').eq('id_categoria', id).single();
                    if (categoryData) {
                        categoryIdInput.value = categoryData.id_categoria;
                        categoryNameInput.value = categoryData.nombre;
                        categoryDescriptionInput.value = categoryData.descripcion;
                        categoryFormTitle.textContent = 'Editar Categoría';
                        categoryCancelButton.classList.remove('hidden');
                        if (categoryData.imagen_url) {
                            currentCategoryImage.src = categoryData.imagen_url;
                            deleteCategoryImageBtn.dataset.id = categoryData.id_categoria;
                            categoryImagePreviewContainer.classList.remove('hidden');
                        } else {
                            categoryImagePreviewContainer.classList.add('hidden');
                        }
                    }
                    break;
                case 'post':
                    const { data: postData } = await supabase.from('blog_posts').select('*').eq('id_post', id).single();
                    if (postData) {
                        postIdInput.value = postData.id_post;
                        postTitleInput.value = postData.titulo;
                        postSummaryInput.value = postData.resumen;
                        postContentInput.value = postData.contenido;
                        postStatusSelect.value = postData.estado;
                        blogFormTitle.textContent = 'Editar Publicación';
                        cancelPostButton.classList.remove('hidden');
                        if (postData.imagen_destacada_url) {
                            currentPostImage.src = postData.imagen_destacada_url;
                            deletePostImageBtn.dataset.id = postData.id_post;
                            postImagePreviewContainer.classList.remove('hidden');
                        } else {
                            postImagePreviewContainer.classList.add('hidden');
                        }
                    }
                    break;
                case 'banner':
                    const { data: bannerData } = await supabase.from('banners').select('*').eq('id_banner', id).single();
                    if (bannerData) {
                        bannerIdInput.value = bannerData.id_banner;
                        bannerTitleInput.value = bannerData.titulo;
                        bannerSubtitleInput.value = bannerData.subtitulo;
                        bannerLinkInput.value = bannerData.url_enlace;
                        bannerOrderInput.value = bannerData.orden;
                        bannerActiveCheckbox.checked = bannerData.activo;
                        bannerFormTitle.textContent = 'Editar Banner';
                        cancelBannerButton.classList.remove('hidden');
                        if (bannerData.url_imagen) {
                            currentBannerImage.src = bannerData.url_imagen;
                            bannerImagePreviewContainer.classList.remove('hidden');
                        } else {
                            bannerImagePreviewContainer.classList.add('hidden');
                        }
                    }
                    break;
            }
            window.scrollTo({ top: 500, behavior: 'smooth' });
        }
    });

    // --- CARGA INICIAL ---
    fetchProducts();
    fetchCategories();
    fetchBlogPosts();
    fetchBanners();

    // =================================================================
    // Estilos y animaciones Header
    // =================================================================

    // Seleccionamos los elementos con los que vamos a trabajar
    const navLinks = document.querySelectorAll('.main-nav a[data-target]');
    const adminSections = document.querySelectorAll('.admin-section');
    const backToMenuButtons = document.querySelectorAll('.back-to-menu-btn');
    const menuGrid = document.getElementById('admin-menu');
    const menuCards = document.querySelectorAll('.menu-card[data-target]');

    // Función para ocultar todas las secciones
    function hideAllSections() {
        adminSections.forEach(section => {
            section.classList.add('hidden');
        });
    }

    // Ocultamos todas las secciones al principio para empezar con una vista limpia
    hideAllSections();

    // Evento para los enlaces del nav
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const targetId = link.dataset.target;
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                hideAllSections();
                menuGrid.classList.add('hidden'); // -> LÍNEA AÑADIDA
                targetSection.classList.remove('hidden');
            }
        });
    });

    // Evento para las tarjetas del menú
    menuCards.forEach(card => {
        card.addEventListener('click', () => {
            const targetId = card.dataset.target;
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                hideAllSections();
                menuGrid.classList.add('hidden');
                targetSection.classList.remove('hidden');
            }
        });
    });

    // Evento para los botones "Volver al Menú"
    backToMenuButtons.forEach(button => {
        button.addEventListener('click', () => {
            menuGrid.classList.remove('hidden');
            hideAllSections();
        });
    });

    // =================================================================
    // LÓGICA PARA CERRAR SESIÓN
    // =================================================================
    const logoutButton = document.getElementById('logout-button');

    if (logoutButton) {
        logoutButton.addEventListener('click', async () => {
            const { error } = await supabase.auth.signOut();
            if (error) {
                console.error('Error al cerrar sesión:', error);
            } else {
                // Redirigir a la página de inicio de sesión
                window.location.href = 'login.html';
            }
        });
    }

    // Verificar sesión al cargar la página
    (async () => {
            // Revisa si hay una sesión activa con Supabase
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                // Si NO hay sesión, redirige inmediatamente a la página de login
                window.location.href = 'login.html';
            }
        })();

});

//botón hamburguesa
document.addEventListener('DOMContentLoaded', function () {
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const mainNav = document.querySelector('.main-nav');
    hamburgerBtn.addEventListener('click', function () {
        mainNav.classList.toggle('open');
    });
});

