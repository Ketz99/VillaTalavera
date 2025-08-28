import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
        import { getFirestore, collection, addDoc, onSnapshot, deleteDoc, doc, updateDoc, query } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
        // Para subir imágenes, necesitarías Firebase Storage
        // import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-storage.js";

        const firebaseConfig = {
            apiKey: "TU_API_KEY",
            authDomain: "TU_AUTH_DOMAIN",
            projectId: "TU_PROJECT_ID",
            storageBucket: "TU_STORAGE_BUCKET",
            messagingSenderId: "TU_MESSAGING_SENDER_ID",
            appId: "TU_APP_ID"
        };

        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
        // const storage = getStorage(app);

        // El resto del script sería similar al de Local Storage, pero usando las funciones de Firebase:
        // - addDoc para crear
        // - onSnapshot para leer en tiempo real
        // - updateDoc para actualizar
        // - deleteDoc para eliminar
        // - Y las funciones de Storage para manejar las imágenes.