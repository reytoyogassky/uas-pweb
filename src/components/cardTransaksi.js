'use client'
import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase"; // pastikan db diimport dengan benar
import { ref, onValue } from "firebase/database"; // Menggunakan onValue untuk mendengarkan perubahan data
import { FaWarehouse } from "react-icons/fa";

const CardTransaksi = () => {
  const [lastId, setLastId] = useState(0); // Untuk menyimpan ID terakhir yang digunakan

  // Fungsi untuk mendengarkan perubahan data barang
  const fetchDataRealtime = () => {
    const itemsRef = ref(db, "barang");

    onValue(itemsRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        // Ambil ID terakhir dari data barang
        const ids = Object.keys(data); // Mendapatkan semua ID dari data barang
        const lastItemId = Math.max(...ids.map(id => parseInt(id))); // ID terakhir yang terurut
        setLastId(lastItemId); // Set ID terakhir
      }
    });
  };

  useEffect(() => {
    fetchDataRealtime(); // Panggil fetchDataRealtime saat komponen pertama kali dimuat
  }, []);

  return (
    <div className="flex justify-center mt-8">
      <div className="bg-white w-3/4 shadow-xl p-6 flex flex-col justify-center items-center rounded-xl">
        <FaWarehouse className="text-6xl text-secondary" />
        <h2 className="text-6xl font-bold my-4">{lastId}</h2> {/* Tampilkan ID terakhir sebagai total barang */}

        <div className="bg-third px-8 py-2 rounded-lg">
          <p className="font-bold text-lg">TOTAL BARANG</p>
        </div>
      </div>
    </div>
  );
};

export default CardTransaksi;
