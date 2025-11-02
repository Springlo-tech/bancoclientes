// Importando Firebase via CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAQaVmj1MBbIoOCod-vRZvG1Z4DGxo3ZO4",
  authDomain: "cartao-ar-clientes.firebaseapp.com",
  projectId: "cartao-ar-clientes",
};

// Inicializando Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Função para buscar o vídeo do cliente
export async function buscarVideoCliente(nomeCliente) {
  const q = query(collection(db, "clientes"), where("nome", "==", nomeCliente));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    throw new Error("Cliente não encontrado!");
  }

  return snapshot.docs[0].data();
}
