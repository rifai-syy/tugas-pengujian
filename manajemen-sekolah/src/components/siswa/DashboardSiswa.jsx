import React, { useState, useEffect } from 'react';
import { BookOpen, ArrowRight, User, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import useStore from '../../store/useStore';
import axios from 'axios';

const DashboardSiswa = () => {
    const authUser = useStore((state) => state.authUser);
    const [namaKelas, setNamaKelas] = useState("Memuat...");

    useEffect(() => {
        const fetchKelas = async () => {
            if (authUser?.id_kelas) {
                try {
                    const token = localStorage.getItem('token');
                    const res = await axios.get('http://localhost:5000/api/kelas', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    const kelasKu = res.data.find(k => k.id === authUser.id_kelas);
                    setNamaKelas(kelasKu ? kelasKu.nama_kelas : "Belum Ada");
                } catch (error) {
                    setNamaKelas("Gagal memuat");
                }
            } else {
                setNamaKelas("Belum Ada");
            }
        };
        fetchKelas();
    }, [authUser]);

    return (
        <div className="max-w-[90rem] mx-auto p-6 mt-4 space-y-8 animate-fade-in-up">

            {/* Header Selamat Datang */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6 bg-gradient-to-r from-blue-50 to-white">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Selamat datang, {authUser?.name}! 👋</h1>
                    <p className="text-gray-600">Pusat Informasi Akademik Siswa. Pantau rekapitulasi nilai dan status ketuntasan belajarmu di sini.</p>
                </div>
                
                <div className="hidden md:flex gap-4">
                    <div className="bg-white px-5 py-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-xl"><Award size={20} className="text-blue-600"/></div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Kelas Aktif</p>
                            <p className="text-lg font-black text-gray-800">{namaKelas}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Dua Kartu Utama (Ubah grid jadi 2 kolom) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">

                {/* Kartu 1: KHS */}
                <div className="bg-white border-b-4 border-blue-600 rounded-3xl p-8 shadow-md hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 flex flex-col justify-between">
                    <div>
                        <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                            <BookOpen size={32} className="text-blue-600 group-hover:text-white" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2 text-gray-900">Kartu Hasil Studi</h3>
                        <p className="text-gray-500 mb-6 text-sm h-10">Lihat rekapitulasi nilai Harian, UTS, UAS, dan status ketuntasan belajar.</p>
                    </div>
                    <div className="flex justify-between items-end">
                        <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Status</p>
                            <p className="text-2xl font-black text-blue-600">{authUser?.status_siswa || 'Aktif'}</p>
                        </div>
                        <Link to="/siswa/khs" className="flex items-center gap-2 px-5 py-2.5 bg-blue-50 text-blue-700 rounded-xl font-bold hover:bg-blue-600 hover:text-white transition-colors">
                            Lihat KHS <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>

                {/* Kartu 2: Profil */}
                <div className="bg-white border-b-4 border-yellow-500 rounded-3xl p-8 shadow-md hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 flex flex-col justify-between">
                    <div>
                        <div className="bg-yellow-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-yellow-500 transition-colors">
                            <User size={32} className="text-yellow-600 group-hover:text-white" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2 text-gray-900">Profil Saya</h3>
                        <p className="text-gray-500 mb-6 text-sm h-10">Kelola informasi pribadi, ganti password, dan perbarui foto profil.</p>
                    </div>
                    <div className="flex justify-between items-end">
                        <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">NISN</p>
                            <p className="text-2xl font-black text-yellow-500">{authUser?.nisn || '-'}</p>
                        </div>
                        <Link to="/siswa/profil" className="flex items-center gap-2 px-5 py-2.5 bg-yellow-50 text-yellow-700 rounded-xl font-bold hover:bg-yellow-500 hover:text-white transition-colors">
                            Pengaturan <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default DashboardSiswa;