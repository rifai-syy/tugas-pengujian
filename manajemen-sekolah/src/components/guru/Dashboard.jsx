import React, { useState, useEffect } from 'react';
import { Users, FileEdit, BookOpen, ArrowRight, GraduationCap, RefreshCw, AlertCircle, ClipboardList, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import useStore from '../../store/useStore';

const TeacherDashboard = () => {
    const authUser = useStore((state) => state.authUser);
    const [myClasses, setMyClasses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchMyClasses = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/guru/my-classes', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMyClasses(res.data);
        } catch (error) {
            console.error("Gagal memuat kelas:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMyClasses();
    }, []);

    return (
        <div className="max-w-[90rem] mx-auto p-6 mt-4 space-y-8 animate-fade-in-up">

            {/* --- BAGIAN 1: WELCOME HEADER --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Dashboard Guru</h1>
                    <p className="text-gray-500 font-medium">Selamat datang kembali, {authUser?.name}.</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={fetchMyClasses} className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-500 hover:text-blue-600 transition-all shadow-sm">
                        <RefreshCw size={20} className={isLoading ? "animate-spin" : ""} />
                    </button>
                </div>
            </div>

            {/* --- BAGIAN 2: STATISTIK RINGKAS (3 KARTU KECIL) --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5">
                    <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
                        <Users size={28} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-400 font-bold uppercase tracking-wider">Total Kelas</p>
                        <p className="text-2xl font-black text-gray-900">{myClasses.length}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5">
                    <div className="bg-green-50 p-3 rounded-xl text-green-600">
                        <ClipboardList size={28} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-400 font-bold uppercase tracking-wider">Tahun Ajaran</p>
                        <p className="text-2xl font-black text-gray-900">2023/2024</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5">
                    <div className="bg-purple-50 p-3 rounded-xl text-purple-600">
                        <UserCheck size={28} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-400 font-bold uppercase tracking-wider">Status</p>
                        <p className="text-2xl font-black text-gray-900">Aktif</p>
                    </div>
                </div>
            </div>

            {/* --- BAGIAN 3: TABEL KELAS (LIST RINGKAS) --- */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <GraduationCap className="text-blue-600" /> Daftar Kelas Mengajar
                    </h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 text-gray-400 text-xs font-bold uppercase tracking-widest border-b border-gray-50">
                                <th className="px-8 py-4">No</th>
                                <th className="px-8 py-4">Nama Kelas</th>
                                <th className="px-8 py-4">Tahun Ajaran</th>
                                <th className="px-8 py-4 text-right">Aksi Kelola</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="4" className="py-20 text-center text-gray-400 italic">Mengambil jadwal...</td>
                                </tr>
                            ) : myClasses.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="py-20 text-center">
                                        <AlertCircle size={40} className="mx-auto text-amber-400 mb-2 opacity-40" />
                                        <p className="text-gray-500 font-medium">Belum ada penugasan kelas untuk Anda.</p>
                                    </td>
                                </tr>
                            ) : (
                                myClasses.map((kelas, index) => (
                                    <tr key={kelas.id_kelas} className="hover:bg-blue-50/30 transition-colors">
                                        <td className="px-8 py-5 text-gray-400 font-medium">{index + 1}</td>
                                        <td className="px-8 py-5 font-bold text-gray-900">{kelas.nama_kelas}</td>
                                        <td className="px-8 py-5 text-gray-500 text-sm">Ganjil 2023/2024</td>
                                        <td className="px-8 py-5">
                                            <div className="flex justify-end gap-3">
                                                <Link 
                                                    to={`/guru/siswa/${kelas.id_kelas}`} 
                                                    className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50 hover:text-blue-600 transition-all flex items-center gap-2"
                                                >
                                                    <Users size={16} /> Siswa
                                                </Link>
                                                <Link 
                                                    to={`/guru/input-nilai/${kelas.id_kelas}`} 
                                                    className="px-4 py-2 bg-[#03045E] text-white rounded-xl text-sm font-bold hover:bg-blue-800 transition-all shadow-md shadow-blue-100 flex items-center gap-2"
                                                >
                                                    <FileEdit size={16} /> Nilai
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- BAGIAN 4: MENU TAMBAHAN (PROFIL) --- */}
            <div className="flex flex-col md:flex-row gap-6">
                <Link to="/guru/profil" className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 p-6 rounded-3xl text-white hover:opacity-90 transition shadow-lg shadow-purple-100 flex items-center justify-between group">
                    <div>
                        <p className="text-purple-200 text-xs font-bold uppercase tracking-wider mb-1">Pengaturan Akun</p>
                        <h3 className="text-xl font-bold">Lengkapi Profil Saya</h3>
                    </div>
                    <div className="bg-white/20 p-3 rounded-2xl group-hover:translate-x-1 transition-transform">
                        <ArrowRight />
                    </div>
                </Link>
                
                <div className="flex-1 bg-white border border-gray-100 p-6 rounded-3xl flex items-center justify-between shadow-sm">
                    <div>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Bantuan</p>
                        <h3 className="text-xl font-bold text-gray-800">Butuh Bantuan?</h3>
                    </div>
                    <button className="text-blue-600 font-bold hover:underline">Hubungi Admin</button>
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;