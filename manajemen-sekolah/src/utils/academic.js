export const hitungRataRata = (grades) => {
  if (!grades || grades.length === 0) return 0;
  const total = grades.reduce((sum, item) => sum + item.score, 0);
  return (total / grades.length).toFixed(1);
};

export const tentukanStatus = (kelas, rataRata) => {
  if (rataRata == 0) return { pesan: "Belum ada nilai lengkap", warna: "bg-gray-500" };
  
  if (kelas < 6) {
    return rataRata >= 75 
      ? { pesan: `Naik ke Kelas ${kelas + 1}`, warna: "bg-green-500" } 
      : { pesan: `Tinggal di Kelas ${kelas}`, warna: "bg-red-500" };
  } else {
    return rataRata >= 75 
      ? { pesan: "Lulus Sekolah", warna: "bg-blue-500" } 
      : { pesan: "Tidak Lulus (Mengulang)", warna: "bg-red-500" };
  }
};