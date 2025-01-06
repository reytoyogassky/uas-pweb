import CardTransaksi from "@/components/cardTransaksi";
import DaftarTransaksi from "@/components/DaftarStok";
import NavBar from "@/components/NavBar";

export default function HomePage() {
  return (
    <>
      <div className="text-white flex justify-center mt-10">
        <h1 className="text-2xl ">GUDANG<span className="font-bold text-secondary text-3xl">KU</span></h1>
      </div>
      <NavBar />
      <CardTransaksi />
      <DaftarTransaksi />
    </>
  );
}
