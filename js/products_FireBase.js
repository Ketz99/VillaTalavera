// Importa las funciones que necesitas de los SDKs
        import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
        import { getFirestore, collection, onSnapshot, query } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
        // TODO: Reemplaza lo siguiente con la configuración de tu proyecto de Firebase
        const firebaseConfig = {
            apiKey: "TU_API_KEY",
            authDomain: "TU_AUTH_DOMAIN",
            projectId: "TU_PROJECT_ID",
            storageBucket: "TU_STORAGE_BUCKET",
            messagingSenderId: "TU_MESSAGING_SENDER_ID",
            appId: "TU_APP_ID"
        };
        // Inicializa Firebase
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
        // Referencia a la colección de productos
        const productsCollection = collection(db, "productos");
        const q = query(productsCollection);
        // Escuchar cambios en tiempo real
        onSnapshot(q, (querySnapshot) => {
            const productGrid = document.getElementById('product-grid');
            const loadingMessage = document.getElementById('loading-message');
            productGrid.innerHTML = ''; // Limpiar el grid antes de agregar nuevos productos
            if (querySnapshot.empty) {
                loadingMessage.innerText = 'Aún no hay productos en la tienda. ¡Vuelve pronto!';
                productGrid.appendChild(loadingMessage);
            } else {
                querySnapshot.forEach((doc) => {
                    const product = doc.data();
                    const productId = doc.id;
                    const productCard = `
                        <div class="bg-white rounded-lg shadow-md overflow-hidden group">
                            <div class="h-64 overflow-hidden">
                                <img src="${product.imageUrl}" alt="${product.nombre}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300">
                            </div>
                            <div class="p-6">
                                <h3 class="text-xl font-bold font-lora text-amber-900">${product.nombre}</h3>
                                <p class="text-gray-600 mt-2 h-20 overflow-hidden">${product.descripcion}</p>
                                <div class="mt-4 flex justify-between items-center">
                                    <p class="text-2xl font-bold text-gray-800">$${product.precio}</p>
                                    <button class="bg-amber-800 text-white font-bold py-2 px-4 rounded-lg hover:bg-amber-900 transition duration-300">
                                        Ver más
                                    </button>
                                </div>
                            </div>
                        </div>
                    `;
                    productGrid.innerHTML += productCard;
                });
            }
        });