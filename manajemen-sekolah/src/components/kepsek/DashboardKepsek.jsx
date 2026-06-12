import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, GraduationCap, BookOpen, TrendingUp, Award, ArrowRight,ShieldCheck } from 'lucide-react';
import useStore from '../../store/useStore';
import { Link } from 'react-router-dom';

const DashboardKepsek = () => {
    const authUser = useStore((state) => state.authUser);
    const [stats, setStats] = useState({ siswaAktif: 0, totalGuru: 0, totalKelas: 0 });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStatistik = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = { Authorization: `Bearer ${token}` };

                // Tarik semua data secara paralel untuk dihitung
                const [resUsers, resKelas] = await Promise.all([
                    axios.get('http://localhost:5000/api/users', { headers }),
                    axios.get('http://localhost:5000/api/kelas', { headers })
                ]);

                const users = resUsers.data;
                
                setStats({
                    siswaAktif: users.filter(u => u.role === 'siswa' && u.status_siswa === 'Aktif').length,
                    totalGuru: users.filter(u => u.role === 'guru').length,
                    totalKelas: resKelas.data.length
                });

            } catch (error) {
                console.error("Gagal menarik statistik pimpinan", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStatistik();
    }, []);

    return (
        <div className="max-w-[90rem] mx-auto p-6 mt-4 space-y-8 animate-fade-in-up">
            
            {/* Header Selamat Datang */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6 bg-gradient-to-r from-amber-50 to-white">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Selamat datang, Bapak/Ibu {authUser?.name}!</h1>
                    <p className="text-gray-600">Ini adalah pusat pantauan eksekutif. Berikut adalah ringkasan data akademik sekolah saat ini.</p>
                </div>
                <div className="hidden md:flex gap-4">
                    <div className="bg-white px-5 py-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
                        <div className="bg-amber-100 p-2 rounded-xl"><Award size={20} className="text-amber-600"/></div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tahun Ajaran</p>
                            <p className="text-lg font-black text-gray-800">2023/2024</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Statistik Utama */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {/* Kartu Siswa */}
                <div className="bg-white border-b-4 border-green-500 rounded-3xl p-8 shadow-md flex items-center gap-6">
                    <div className="bg-green-50 w-20 h-20 rounded-2xl flex items-center justify-center shrink-0">
                        <GraduationCap size={40} className="text-green-600" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Total Siswa Aktif</p>
                        <h2 className="text-4xl font-black text-gray-900">
                            {isLoading ? '...' : stats.siswaAktif} <span className="text-sm font-semibold text-gray-500">Orang</span>
                        </h2>
                    </div>
                </div>

                {/* Kartu Guru */}
                <div className="bg-white border-b-4 border-blue-500 rounded-3xl p-8 shadow-md flex items-center gap-6">
                    <div className="bg-blue-50 w-20 h-20 rounded-2xl flex items-center justify-center shrink-0">
                        <Users size={40} className="text-blue-600" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Tenaga Pengajar</p>
                        <h2 className="text-4xl font-black text-gray-900">
                            {isLoading ? '...' : stats.totalGuru} <span className="text-sm font-semibold text-gray-500">Guru</span>
                        </h2>
                    </div>
                </div>

                {/* Kartu Kelas */}
                <div className="bg-white border-b-4 border-indigo-500 rounded-3xl p-8 shadow-md flex items-center gap-6">
                    <div className="bg-indigo-50 w-20 h-20 rounded-2xl flex items-center justify-center shrink-0">
                        <BookOpen size={40} className="text-indigo-600" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Rombongan Belajar</p>
                        <h2 className="text-4xl font-black text-gray-900">
                            {isLoading ? '...' : stats.totalKelas} <span className="text-sm font-semibold text-gray-500">Kelas</span>
                        </h2>
                    </div>
                </div>

            </div>

            {/* Area Informasi Tambahan (Opsional untuk masa depan) */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex items-start gap-4">
                <div className="bg-blue-50 text-blue-600 p-3 rounded-xl"><TrendingUp size={24}/></div>
                <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Laporan Mutu Pendidikan</h3>
                    <p className="text-gray-600 leading-relaxed">
                        Sistem sedang merekam aktivitas input nilai oleh guru. Fitur pelaporan grafik pencapaian KKM per kelas dan laporan kelulusan sedang disiapkan oleh Administrator.
                    </p>
                </div>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mt-10 mb-4 flex items-center gap-2">
                <Users size={24} className="text-blue-600" /> Direktori Warga Sekolah
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Menu Lihat Guru */}
                <Link to="/kepsek/guru" className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition group flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="bg-blue-50 p-3 rounded-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition">
                            <Users size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900">Daftar Guru</h4>
                            <p className="text-xs text-gray-500 font-medium">Lihat profil & NIP pengajar</p>
                        </div>
                    </div>
                    <ArrowRight size={20} className="text-gray-300 group-hover:text-blue-600 group-hover:translate-x-1 transition" />
                </Link>

                {/* Menu Lihat Siswa */}
                <Link to="/kepsek/siswa" className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition group flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="bg-green-50 p-3 rounded-2xl text-green-600 group-hover:bg-green-600 group-hover:text-white transition">
                            <GraduationCap size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900">Daftar Siswa</h4>
                            <p className="text-xs text-gray-500 font-medium">Pantau NISN & penempatan kelas</p>
                        </div>
                    </div>
                    <ArrowRight size={20} className="text-gray-300 group-hover:text-green-600 group-hover:translate-x-1 transition" />
                </Link>

                {/* Menu Lihat Admin */}
                <Link to="/kepsek/admin" className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition group flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="bg-amber-50 p-3 rounded-2xl text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition">
                            <ShieldCheck size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900">Staff Administrator</h4>
                            <p className="text-xs text-gray-500 font-medium">Daftar pengelola sistem IT</p>
                        </div>
                    </div>
                    <ArrowRight size={20} className="text-gray-300 group-hover:text-amber-600 group-hover:translate-x-1 transition" />
                </Link>
            </div>

        </div>
    );
};

export default DashboardKepsek;