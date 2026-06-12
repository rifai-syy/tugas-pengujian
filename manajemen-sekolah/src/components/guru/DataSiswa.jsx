import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Users, Eye, GraduationCap, UserCircle, RefreshCw } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

const DataSiswa = () => {
    const { id_kelas } = useParams(); 
    const [siswaList, setSiswaList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [namaKelas, setNamaKelas] = useState('');

    const fetchSiswa = async () => {
        if (!id_kelas) return;
        
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            // Filter: Hanya ambil siswa yang id_kelas-nya cocok dengan URL
            const dataFiltered = res.data.filter(user => 
                user.role === 'siswa' && String(user.id_kelas) === String(id_kelas)
            );

            setSiswaList(dataFiltered);

            if (dataFiltered.length > 0) {
                setNamaKelas(dataFiltered[0].nama_kelas || `Kelas ID ${id_kelas}`);
            }
        } catch (error) {
            console.error("Gagal mengambil data siswa", error);
            if (error.response?.status === 403) {
                alert("Server menolak akses. Pastikan server.js sudah di-update & di-restart.");
            }
        } finally {
            // Loading PASTI berhenti di sini
            setIsLoading(false); 
        }
    };

    useEffect(() => {
        fetchSiswa();
    }, [id_kelas]);

    const filteredSiswa = siswaList.filter(siswa => 
        siswa.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        siswa.nisn?.includes(searchTerm)
    );

    return (
        <div className="max-w-[90rem] mx-auto p-6 mt-4 animate-fade-in-up">
            <div className="mb-8">
                <Link to="/guru/dashboard" className="text-blue-600 hover:text-blue-800 flex items-center gap-2 mb-2 font-medium w-fit">
                    <ArrowLeft size={18} /> Kembali ke Dashboard
                </Link>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
                            <Users className="text-blue-600" size={32} /> Data Siswa {namaKelas}
                        </h1>
                        <p className="text-gray-500 mt-1">Menampilkan daftar siswa yang terdaftar di kelas ini.</p>
                    </div>
                    <div className="bg-blue-50 border border-blue-100 px-5 py-3 rounded-xl flex items-center gap-4 text-blue-800 font-bold">
                        <GraduationCap size={24} /> {siswaList.length} Siswa Terdaftar
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                    <div className="relative w-96">
                        <Search size={18} className="absolute inset-y-0 left-4 top-3 text-gray-400" />
                        <input 
                            type="text" placeholder="Cari nama atau NISN..."
                            className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button onClick={fetchSiswa} className="p-2.5 text-gray-500 hover:text-blue-600">
                        <RefreshCw size={20} className={isLoading ? "animate-spin" : ""} />
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 text-gray-500 text-sm font-semibold uppercase tracking-wider border-b">
                                <th className="px-6 py-4">Nama Siswa</th>
                                <th className="px-6 py-4">NISN</th>
                                <th className="px-6 py-4 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="3" className="py-20 text-center">
                                        <RefreshCw size={40} className="animate-spin mx-auto text-blue-500 mb-4" />
                                        <p className="text-gray-500 font-medium">Sedang menyinkronkan data...</p>
                                    </td>
                                </tr>
                            ) : filteredSiswa.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="py-20 text-center text-gray-400 italic">
                                        Tidak ada siswa yang ditemukan untuk kelas ini.
                                    </td>
                                </tr>
                            ) : (
                                filteredSiswa.map((siswa) => (
                                    <tr key={siswa.id} className="hover:bg-blue-50/50 transition">
                                        <td className="px-6 py-4 flex items-center gap-3 font-bold text-gray-900">
                                            <UserCircle className="text-gray-300" size={32} /> {siswa.name}
                                        </td>
                                        <td className="px-6 py-4 font-mono text-sm">{siswa.nisn || '-'}</td>
                                        <td className="px-6 py-4 text-center">
                                            <button className="px-4 py-1.5 bg-white border border-gray-200 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg text-sm font-bold shadow-sm transition-all">
                                                <Eye size={16} className="inline mr-1" /> Detail
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DataSiswa;