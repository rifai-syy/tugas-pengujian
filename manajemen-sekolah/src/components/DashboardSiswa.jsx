import React from 'react';
import useStore from '../store/useStore';
import { hitungRataRata, tentukanStatus } from '../utils/academic';

const DashboardSiswa = () => {
  const { authUser, studentsData } = useStore();
  const myData = studentsData.find(s => s.idSiswa === authUser?.id);
  
  if (!myData) return <div className="p-8 text-center text-gray-500 mt-10">Data rapor Anda belum tersedia. Hubungi Admin.</div>;

  const rataRata = hitungRataRata(myData.grades);
  const statusAkademik = tentukanStatus(myData.kelas, rataRata);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Rapor Digital Pribadi</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-5 rounded-lg shadow border-l-4 border-blue-500">
          <p className="text-gray-500 text-sm">Nama Lengkap</p>
          <p className="text-xl font-bold">{myData.name}</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow border-l-4 border-yellow-500">
          <p className="text-gray-500 text-sm">Kelas Saat Ini</p>
          <p className="text-xl font-bold">Kelas {myData.kelas}</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow border-l-4 border-indigo-500">
          <p className="text-gray-500 text-sm">Rata-rata Keseluruhan</p>
          <p className="text-2xl font-bold">{rataRata}</p>
        </div>
      </div>

      <div className={`p-4 rounded-lg shadow mb-6 text-white text-center font-bold text-xl ${statusAkademik.warna}`}>
        Status: {statusAkademik.pesan}
      </div>

      <div className="bg-white rounded-lg shadow-md border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-blue-600 text-white">
            <tr><th className="p-3">Mata Pelajaran</th><th className="p-3 text-center">Skor Nilai</th></tr>
          </thead>
          <tbody>
            {myData.grades.length === 0 ? (
              <tr><td colSpan="2" className="p-4 text-center text-gray-500">Belum ada nilai yang diinput guru.</td></tr>
            ) : (
              myData.grades.map(g => (
                <tr key={g.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{g.subject}</td>
                  <td className="p-3 text-center font-bold text-lg">{g.score}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardSiswa;