import React from 'react';
import useStore from '../store/useStore';
import { hitungRataRata, tentukanStatus } from '../utils/academic';

const DashboardKepsek = () => {
  const { studentsData } = useStore();

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Rekapitulasi Akademik Sekolah</h2>
      <div className="bg-white rounded-lg shadow-md border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="p-3">Nama Siswa</th>
              <th className="p-3 text-center">Kelas</th>
              <th className="p-3 text-center">Rata-rata Nilai</th>
              <th className="p-3 text-center">Keputusan Akademik</th>
            </tr>
          </thead>
          <tbody>
            {studentsData.map(s => {
              const rata = hitungRataRata(s.grades);
              const status = tentukanStatus(s.kelas, rata);
              return (
                <tr key={s.idSiswa} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium">{s.name}</td>
                  <td className="p-3 text-center">{s.kelas}</td>
                  <td className="p-3 text-center font-bold text-lg">{rata}</td>
                  <td className="p-3 text-center">
                    <span className={`px-4 py-1.5 rounded-full text-white text-sm font-bold shadow-sm ${status.warna}`}>
                      {status.pesan}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardKepsek;