'use client'
import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase"; // pastikan db diimport dengan benar dari firebase
import { ref, set, remove, get } from "firebase/database"; // Import set dan ref dari firebase/database

const DaftarStok = () => {
  const [stockData, setStockData] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    quantity: 0,
    unit: "",
    category: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentItemId, setCurrentItemId] = useState(null); // Untuk menyimpan ID barang yang sedang diedit

  // Fungsi untuk mengambil data barang
  const fetchData = async () => {
    try {
      const snapshot = await get(ref(db, "barang"));
      const data = snapshot.val();

      // Pastikan data tidak null atau undefined sebelum melakukan operasi
      if (data) {
        const formattedData = Object.keys(data).map(key => ({
          id: key,
          name: data[key].name,
          quantity: data[key].quantity,
          unit: data[key].unit,
          category: data[key].category
        }));
        setStockData(formattedData);
      } else {
        setStockData([]); // Jika tidak ada data, set stockData sebagai array kosong
      }
    } catch (error) {
      console.error("Gagal mengambil data barang:", error);
    }
  };

  useEffect(() => {
    fetchData(); // Panggil fetchData saat komponen pertama kali dimuat
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddItem = async () => {
    try {
      // Ambil data barang yang ada di Firebase untuk menentukan ID terakhir
      const snapshot = await get(ref(db, "barang"));
      const data = snapshot.val();
      let newId = 1;

      // Jika ada data, cari ID terakhir yang digunakan dan tambah 1
      if (data) {
        const lastId = Math.max(...Object.keys(data).map((id) => parseInt(id)), 0);
        newId = lastId + 1;
      }

      // Tambahkan barang baru dengan ID yang berurutan
      await set(ref(db, `barang/${newId}`), {
        name: formData.name,
        quantity: formData.quantity,
        unit: formData.unit,
        category: formData.category
      });

      setFormData({ name: "", quantity: 0, unit: "", category: "" }); // Reset form
   
      fetchData(); // Refresh data setelah menambah barang
      setIsEditing(false); // Kembali ke tampilan tabel
    } catch (error) {
      console.error("Gagal menambah barang:", error);
    }
  };

  const handleEditItem = async () => {
    if (currentItemId) {
      try {
        // Update data barang yang dipilih
        await set(ref(db, `barang/${currentItemId}`), {
          name: formData.name,
          quantity: formData.quantity,
          unit: formData.unit,
          category: formData.category
        });
        setFormData({ name: "", quantity: 0, unit: "", category: "" }); // Reset form

        fetchData(); // Refresh data setelah update barang
        setIsEditing(false); // Kembali ke tampilan tabel
      } catch (error) {
        console.error("Gagal memperbarui barang:", error);
      }
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await remove(ref(db, `barang/${id}`)); // Menghapus data barang dengan id tertentu
      
      fetchData(); // Refresh data setelah penghapusan
    } catch (error) {
      console.error("Gagal menghapus barang:", error);
    }
  };

  const handleEditForm = (item) => {
    setFormData({
      name: item.name,
      quantity: item.quantity,
      unit: item.unit,
      category: item.category
    });
    setCurrentItemId(item.id); // Set ID barang yang akan diedit
    setIsEditing(true); // Menampilkan form edit
  };

  return (
    <>
      <div className="bg-white shadow-lg w-vh h-max rounded-3xl border mx-8 mt-8">
        {isEditing ? (
          // Form untuk Tambah dan Edit
          <div className="p-6">
            <h1 className="font-semibold">{currentItemId ? "Edit Barang" : "Tambah Barang"}</h1>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                currentItemId ? handleEditItem() : handleAddItem();
              }}
            >
              <div className="my-4">
                <label className="block text-sm font-medium">Nama Barang</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="my-4">
                <label className="block text-sm font-medium">Jumlah</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="my-4">
                <label className="block text-sm font-medium">Satuan</label>
                <input
                  type="text"
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="my-4">
                <label className="block text-sm font-medium">Kategori</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="submit"
                  className="btn bg-primary hover:bg-primary/70 text-white"
                >
                  {currentItemId ? "Simpan Perubahan" : "Tambah Barang"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({ name: "", quantity: 0, unit: "", category: "" });
                  }}
                  className="btn bg-third hover:bg-third/70 border-0"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        ) : (
          // Tabel Daftar Stok
          <div className="p-6">
            <h1 className="font-semibold">Daftar Stok</h1>
            <table className="table-auto w-full border-collapse border border-gray-300 mt-4">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-4 py-2">#</th>
                  <th className="border border-gray-300 px-4 py-2">Nama Barang</th>
                  <th className="border border-gray-300 px-4 py-2">Jumlah</th>
                  <th className="border border-gray-300 px-4 py-2">Satuan</th>
                  <th className="border border-gray-300 px-4 py-2">Kategori</th>
                  <th className="border border-gray-300 px-4 py-2">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {stockData.length > 0 ? (
                  stockData.map((item, index) => (
                    <tr key={item.id} className={index % 2 === 0 ? "bg-gray-100" : ""}>
                      <td className="border border-gray-300 px-4 py-2 text-center">{item.id}</td>
                      <td className="border border-gray-300 px-4 py-2">{item.name}</td>
                      <td className="border border-gray-300 px-4 py-2 text-right">{item.quantity}</td>
                      <td className="border border-gray-300 px-4 py-2 text-center">{item.unit}</td>
                      <td className="border border-gray-300 px-4 py-2">{item.category}</td>
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        <button
                          onClick={() => handleEditForm(item)}
                          className="btn bg-primary hover:bg-primary/70 text-white"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="btn bg-third hover:bg-third/70 border-0 ml-2"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center p-4">Data tidak tersedia</td>
                  </tr>
                )}
              </tbody>
            </table>
            <button
              onClick={() => setIsEditing(true)}
              className="btn bg-secondary hover:bg-secondary/70 text-black border-0 mt-4"
            >
              Tambah Barang
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default DaftarStok;
