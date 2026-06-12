import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, FileEdit, Crown, BookOpen, ChevronRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const DaftarKelas = () => {
    const location = useLocation();
    
    // Mengecek dari menu mana guru ini datang (apakah mau lihat siswa atau mau input nilai)
    const actionType = location.pathname.includes('nilai') ? 'nilai' : 'siswa';

    // Simulasi data dari backend (Nantinya diganti dengan axios)
    const [penugasan, setPenugasan] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulasi fetching data penugasan guru
        setTimeout(() => {
            setPenugasan([
                {
                    id_kelas: 1,
                    nama_kelas: "Kelas 5A",
                    is_wali_kelas: true,
                    mapel: "Semua Mata Pelajaran",
                    jumlah_siswa: 32
                },
                {
                    id_kelas: 2,
                    nama_kelas: "Kelas 4A",
                    is_wali_kelas: false,
                    mapel: "Matematika",
                    jumlah_siswa: 28
                },
                {
                    id_kelas: 3,
                    nama_kelas: "Kelas 4B",
                    is_wali_kelas: false,
                    mapel: "Matematika",
                    jumlah_siswa: 30
                }
            ]);
            setIsLoading(false);
        }, 500);
    }, []);

    return (
        <div className="max-w-[90rem] mx-auto p-6 mt-4 animate-fade-in-up">
            
            {/* Header */}
            <div className="mb-8">
                <Link to="/guru/dashboard" className="text-blue-600 hover:text-blue-800 flex items-center gap-2 mb-2 font-medium transition-colors w-fit">
                    <ArrowLeft size={18} /> Kembali ke Dashboard
                </Link>
                <h1 className="text-3xl font-extrabold text-gray-900">
                    Pilih Kelas ({actionType === 'nilai' ? 'Input Nilai' : 'Data Siswa'})
                </h1>
                <p className="text-gray-500 mt-1">
                    Silakan pilih kelas sesuai dengan penugasan mengajar Anda untuk melanjutkan.
                </p>
            </div>

            {/* Grid Kartu Kelas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    <p className="text-gray-500">Memuat data penugasan...</p>
                ) : (
                    penugasan.map((item, index) => (
                        <div key={index} className={`bg-white rounded-3xl p-6 shadow-sm border-2 transition-all duration-300 hover:shadow-lg group ${
                            item.is_wali_kelas ? 'border-amber-400/50 hover:border-amber-400' : 'border-gray-100 hover:border-blue-400'
                        }`}>
                            
                            {/* Header Kartu (Nama Kelas & Badge) */}
                            <div className="flex justify-between items-start mb-4">
                                <h2 className="text-3xl font-black text-gray-900">{item.nama_kelas}</h2>
                                {item.is_wali_kelas ? (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-amber-800 rounded-xl text-xs font-bold uppercase tracking-wider border border-amber-200 shadow-sm">
                                        <Crown size={14} className="text-amber-600" /> Wali Kelas
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-xl text-xs font-bold uppercase tracking-wider border border-blue-100">
                                        <BookOpen size={14} /> Guru Mapel
                                    </span>
                                )}
                            </div>

                            {/* Info Detail */}
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Mata Pelajaran</span>
                                    <span className="font-semibold text-gray-800">{item.mapel}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Jumlah Siswa</span>
                                    <span className="font-semibold text-gray-800">{item.jumlah_siswa} Anak</span>
                                </div>
                            </div>

                            {/* Tombol Aksi (Dinamic Routing) */}
                            <div className="pt-4 border-t border-gray-100">
                                <Link 
                                    // Melempar ID Kelas melalui URL agar halaman DataSiswa tahu kelas mana yang dibuka
                                    to={`/guru/${actionType === 'nilai' ? 'input-nilai' : 'daftar-siswa'}/${item.id_kelas}`} 
                                    className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold transition-colors ${
                                        item.is_wali_kelas 
                                        ? 'bg-amber-50 text-amber-700 hover:bg-amber-500 hover:text-white' 
                                        : 'bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white'
                                    }`}
                                >
                                    {actionType === 'nilai' ? (
                                        <><FileEdit size={18} /> Mulai Input Nilai</>
                                    ) : (
                                        <><Users size={18} /> Lihat Daftar Siswa</>
                                    )}
                                    <ChevronRight size={18} />
                                </Link>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default DaftarKelas;