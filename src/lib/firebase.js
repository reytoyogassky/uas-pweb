import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, onValue, child, push, update } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCYSHx1Vb81UpbdkuLLSLECiEyHr3_Ws9o",
  authDomain: "database-kas.firebaseapp.com",
  databaseURL: "https://database-kas-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "database-kas",
  storageBucket: "database-kas.firebasestorage.app",
  messagingSenderId: "321224331324",
  appId: "1:321224331324:web:8bfcb6966294a1e504f339",
  measurementId: "G-SMTKHPZX0Q"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Menambahkan barang baru dengan ID berurut
const tambahBarang = async (namaBarang, stok) => {
  const barangRef = ref(db, 'barang');
  
  // Ambil ID barang terakhir yang ada
  const snapshot = await get(barangRef);
  let lastId = 0;
  
  if (snapshot.exists()) {
    const data = snapshot.val();
    lastId = Math.max(...Object.keys(data).map(id => parseInt(id))) || 0;
  }

  // ID barang baru adalah ID terakhir + 1
  const newId = lastId + 1;
  const newBarangRef = ref(db, `barang/${newId}`);

  // Menyimpan data barang baru dengan ID yang berurut
  await set(newBarangRef, {
    nama: namaBarang,
    stok: stok
  });
};

// Mengambil data barang secara real-time
const getBarangRealtime = (callback) => {
  const barangRef = ref(db, 'barang');
  onValue(barangRef, (snapshot) => {
    const data = snapshot.val();
    callback(data);
  });
};

export { db, tambahBarang, getBarangRealtime };
