import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BookOpen, AlertCircle, CheckCircle, XCircle, Printer } from 'lucide-react';

const KHS = () => {
    const [nilaiList, setNilaiList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchNilai = async () => {
            try {
                const token = localStorage.getItem('token');
                // Memanggil rute API yang baru saja kita buat
                const res = await axios.get('http://localhost:5000/api/nilai/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setNilaiList(res.data);
            } catch (error) {
                console.error("Gagal menarik data KHS:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchNilai();
    }, []);

    // Fungsi untuk menghitung Nilai Akhir (NA)
    const hitungNilaiAkhir = (harian, uts, uas) => {
        const nHarian = harian || 0;
        const nUts = uts || 0;
        const nUas = uas || 0;
        // Rumus Bobot: 20% Harian, 30% UTS, 50% UAS
        return Math.round((nHarian * 0.2) + (nUts * 0.3) + (nUas * 0.5));
    };

    return (
        <div className="max-w-[90rem] mx-auto p-6 mt-4 animate-fade-in-up">
            
            {/* --- HEADER --- */}
            <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
                        <BookOpen size={32} className="text-blue-600" />
                        Kartu Hasil Studi (KHS)
                    </h1>
                    <p className="text-gray-500 mt-1">Transkrip nilai sementara untuk Semester Ganjil Tahun Ajaran 2023/2024.</p>
                </div>
                <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition shadow-sm">
                    <Printer size={18} /> Cetak KHS
                </button>
            </div>

            {/* --- TABEL NILAI --- */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-gray-500 text-sm font-semibold uppercase tracking-wider border-b border-gray-100">
                                <th className="px-6 py-4">Mata Pelajaran</th>
                                <th className="px-6 py-4 text-center">KKM</th>
                                <th className="px-6 py-4 text-center text-blue-600">Harian (20%)</th>
                                <th className="px-6 py-4 text-center text-indigo-600">UTS (30%)</th>
                                <th className="px-6 py-4 text-center text-purple-600">UAS (50%)</th>
                                <th className="px-6 py-4 text-center bg-gray-100">Nilai Akhir</th>
                                <th className="px-6 py-4 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-10 text-gray-500 font-medium">Memuat data nilai...</td>
                                </tr>
                            ) : nilaiList.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-16">
                                        <AlertCircle size={48} className="mx-auto text-gray-300 mb-3" />
                                        <p className="text-gray-500 text-lg">Belum ada nilai yang diinput oleh Guru.</p>
                                    </td>
                                </tr>
                            ) : (
                                nilaiList.map((item, index) => {
                                    const nilaiAkhir = hitungNilaiAkhir(item.nilai_harian, item.nilai_uts, item.nilai_uas);
                                    // Bandingkan dengan KKM
                                    const isTuntas = nilaiAkhir >= (item.kkm || 75);

                                    return (
                                        <tr key={index} className="hover:bg-gray-50/50 transition">
                                            <td className="px-6 py-4 font-bold text-gray-900">{item.nama_mapel}</td>
                                            <td className="px-6 py-4 text-center font-mono text-gray-500">{item.kkm || 75}</td>
                                            <td className="px-6 py-4 text-center font-medium">{item.nilai_harian || '-'}</td>
                                            <td className="px-6 py-4 text-center font-medium">{item.nilai_uts || '-'}</td>
                                            <td className="px-6 py-4 text-center font-medium">{item.nilai_uas || '-'}</td>
                                            
                                            {/* Kolom Nilai Akhir */}
                                            <td className="px-6 py-4 text-center bg-gray-50">
                                                <span className={`text-lg font-black ${isTuntas ? 'text-green-600' : 'text-red-600'}`}>
                                                    {nilaiAkhir}
                                                </span>
                                            </td>

                                            {/* Kolom Status (Tuntas / Tidak Tuntas) */}
                                            <td className="px-6 py-4 text-center">
                                                {isTuntas ? (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-lg text-sm font-bold border border-green-200">
                                                        <CheckCircle size={16} /> Tuntas
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-700 rounded-lg text-sm font-bold border border-red-200">
                                                        <XCircle size={16} /> Tidak Tuntas
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Keterangan Bobot */}
            <div className="mt-6 bg-blue-50 border border-blue-100 p-4 rounded-2xl flex items-start gap-3">
                <AlertCircle className="text-blue-600 shrink-0 mt-0.5" size={20} />
                <p className="text-sm text-blue-800 leading-relaxed">
                    <strong>Informasi Penilaian:</strong> Nilai Akhir (NA) dihitung secara otomatis oleh sistem berdasarkan persentase bobot yang ditetapkan oleh sekolah. Jika NA berada di bawah KKM, maka siswa diwajibkan mengikuti program remedial.
                </p>
            </div>

        </div>
    );
};

export default KHS;