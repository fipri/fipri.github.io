// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getDatabase, ref, set, onValue, get, runTransaction } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-database.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-analytics.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAr3eT9kBnnb-LHtOTB5tVhR-FvQfNoIMs",
  authDomain: "fipri-get.firebaseapp.com",
  databaseURL: "https://fipri-get-default-rtdb.firebaseio.com",
  projectId: "fipri-get",
  storageBucket: "fipri-get.firebasestorage.app",
  messagingSenderId: "372542094414",
  appId: "1:372542094414:web:4a04dab2c971699277971f",
  measurementId: "G-M8H3WC6Q4N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);

// Referência para o contador de usuários online
const onlineRef = ref(database, 'users/online');
const manuRef = ref(database, 'manu');  // Referência para o rótulo 'manu'

// Função para aumentar a contagem de usuários online de forma segura
function aumentarUsuariosOnline() {
  runTransaction(onlineRef, (currentValue) => {
    return (currentValue || 0) + 1;
  });
}

// Função para diminuir a contagem de usuários online de forma segura
function diminuirUsuariosOnline() {
  runTransaction(onlineRef, (currentValue) => {
    return (currentValue || 0) - 1;
  });
}

// Função para verificar o valor de 'manu' e redirecionar
async function verificarManu() {
  onValue(manuRef, (snapshot) => {
    const manu = snapshot.val();
    if (manu === true) {
      window.location.href = "manu.html"; // Redireciona se 'manu' for true
    }
  });
}

// Detectar quando o usuário se conecta
window.addEventListener('load', async () => {
  aumentarUsuariosOnline();
  await verificarManu();  // Verifica o valor de 'manu' assim que a página carregar
});

// Detectar quando o usuário sai (fecha a página ou navega)
window.addEventListener('beforeunload', diminuirUsuariosOnline);
