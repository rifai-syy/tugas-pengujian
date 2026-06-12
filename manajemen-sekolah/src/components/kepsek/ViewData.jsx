import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, RefreshCw, User, Phone, MapPin, GraduationCap, Eye, X, BookOpen, AlertCircle } from 'lucide-react';

const ViewData = ({ roleTitle, roleType }) => {
    const [dataList, setDataList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // State untuk Modal Transkrip (Khusus Siswa)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeSiswa, setActiveSiswa] = useState(null);
    const [detailNilai, setDetailNilai] = useState([]);
    const [isLoadingDetail, setIsLoadingDetail] = useState(false);

    const token = localStorage.getItem('token');

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get('http://localhost:5000/api/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDataList(res.data.filter(u => u.role === roleType));
        } catch (error) {
            console.error("Gagal menarik data");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, [roleType]);

    // Fungsi Ambil Detail Nilai
    const openDetailModal = async (siswa) => {
        setActiveSiswa(siswa);
        setIsModalOpen(true);
        setIsLoadingDetail(true);
        try {
            // Kita gunakan API yang sama dengan yang digunakan Admin
            const res = await axios.get(`http://localhost:5000/api/admin/nilai-siswa/${siswa.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDetailNilai(res.data);
        } catch (error) {
            console.error("Gagal menarik detail nilai");
        } finally {
            setIsLoadingDetail(false);
        }
    };

    const filteredData = dataList.filter(d => 
        d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (d.username && d.username.includes(searchTerm)) ||
        (d.nisn && d.nisn.includes(searchTerm))
    );

    // Fungsi Hitung Rata-rata untuk Footer Modal
    const hitungRerata = (data) => {
        if (data.length === 0) return 0;
        const total = data.reduce((acc, item) => {
            const na = Math.round(((item.nilai_harian||0)*0.2) + ((item.nilai_uts||0)*0.3) + ((item.nilai_uas||0)*0.5));
            return acc + na;
        }, 0);
        return (total / data.length).toFixed(1);
    };

    return (
        <div className="max-w-[90rem] mx-auto p-6 mt-4 animate-fade-in-up">
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
                        {roleType === 'siswa' && <GraduationCap size={32} className="text-green-600" />}
                        Direktori {roleTitle}
                    </h1>
                    <p className="text-gray-500 mt-1">Data resmi seluruh {roleTitle.toLowerCase()} sekolah.</p>
                </div>
                <button onClick={fetchData} className="p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition shadow-sm">
                    <RefreshCw size={20} className={isLoading ? "animate-spin" : ""} />
                </button>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b bg-gray-50/50 flex justify-between items-center">
                    <div className="relative w-full md:w-96">
                        <Search size={18} className="absolute inset-y-0 left-4 top-3 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder={`Cari nama atau identitas...`} 
                            className="w-full pl-11 pr-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" 
                            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} 
                        />
                    </div>
                    {roleType === 'siswa' && (
                        <span className="hidden md:block text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
                            Mode Pantauan Akademik Aktif
                        </span>
                    )}
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 text-gray-400 text-xs font-bold uppercase tracking-widest border-b">
                                <th className="px-6 py-4">Informasi {roleTitle}</th>
                                <th className="px-6 py-4">{roleType === 'siswa' ? 'NISN' : 'ID / Identitas'}</th>
                                <th className="px-6 py-4">Kontak</th>
                                {roleType === 'siswa' ? (
                                    <th className="px-6 py-4 text-center">Aksi</th>
                                ) : (
                                    <th className="px-6 py-4">Alamat</th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                <tr><td colSpan="4" className="text-center py-20 font-medium text-gray-400">Menyinkronkan data...</td></tr>
                            ) : filteredData.map(d => (
                                <tr key={d.id} className="hover:bg-blue-50/20 transition">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                                                {d.foto ? <img src={d.foto} className="w-full h-full object-cover" alt="" /> : <User size={20} className="text-gray-400"/>}
                                            </div>
                                            <span className="font-bold text-gray-900">{d.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="font-mono text-gray-700 font-semibold">
                                            {roleType === 'siswa' ? (d.nisn || d.username) : d.username}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-600 font-medium">{d.no_wa || '-'}</span>
                                    </td>
                                    
                                    {/* Logika Kolom Terakhir: Jika siswa tampilkan tombol mata, jika bukan tampilkan alamat */}
                                    <td className="px-6 py-4">
                                        {roleType === 'siswa' ? (
                                            <div className="flex justify-center">
                                                <button 
                                                    onClick={() => openDetailModal(d)}
                                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition shadow-sm"
                                                >
                                                    <Eye size={14} /> Lihat Transkrip
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="text-sm text-gray-500 truncate block max-w-[200px]">{d.alamat || '-'}</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ==========================================
                MODAL DETAIL NILAI (SAMA SEPERTI ADMIN)
            ========================================== */}
            {isModalOpen && activeSiswa && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/70 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                        {/* Header Modal */}
                        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <div>
                                <h3 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
                                    <BookOpen size={24} className="text-blue-600"/> Laporan Hasil Belajar
                                </h3>
                                <p className="text-sm font-bold text-gray-500 mt-1">{activeSiswa.name} ({activeSiswa.nisn || activeSiswa.username})</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 bg-gray-200 text-gray-600 rounded-full hover:bg-red-500 hover:text-white transition">
                                <X size={20} />
                            </button>
                        </div>
                        
                        {/* Body Modal */}
                        <div className="p-6 overflow-y-auto">
                            {isLoadingDetail ? (
                                <p className="text-center py-10 font-medium text-gray-500">Menganalisis data nilai...</p>
                            ) : detailNilai.length === 0 ? (
                                <div className="text-center py-12">
                                    <AlertCircle size={48} className="mx-auto text-gray-300 mb-3" />
                                    <p className="text-gray-500 italic">Belum ada catatan nilai untuk siswa ini di sistem.</p>
                                </div>
                            ) : (
                                <table className="w-full text-left border border-gray-100 rounded-xl overflow-hidden">
                                    <thead>
                                        <tr className="bg-blue-50 text-blue-800 text-xs font-bold uppercase tracking-widest">
                                            <th className="px-4 py-3">Mata Pelajaran</th>
                                            <th className="px-4 py-3 text-center">Semester</th>
                                            <th className="px-4 py-3 text-center">Harian</th>
                                            <th className="px-4 py-3 text-center">UTS</th>
                                            <th className="px-4 py-3 text-center">UAS</th>
                                            <th className="px-4 py-3 text-center bg-blue-100">Nilai Akhir</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 text-sm">
                                        {detailNilai.map((item, index) => {
                                            const na = Math.round(((item.nilai_harian||0)*0.2) + ((item.nilai_uts||0)*0.3) + ((item.nilai_uas||0)*0.5));
                                            const isTuntas = na >= (item.kkm || 75);
                                            return (
                                                <tr key={index} className="hover:bg-gray-50">
                                                    <td className="px-4 py-3 font-bold text-gray-800">{item.nama_mapel}</td>
                                                    <td className="px-4 py-3 text-center">{item.semester}</td>
                                                    <td className="px-4 py-3 text-center">{item.nilai_harian || 0}</td>
                                                    <td className="px-4 py-3 text-center">{item.nilai_uts || 0}</td>
                                                    <td className="px-4 py-3 text-center">{item.nilai_uas || 0}</td>
                                                    <td className={`px-4 py-3 text-center font-black text-lg ${isTuntas ? 'text-green-600' : 'text-red-600'}`}>{na}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        {/* Footer Modal */}
                        <div className="px-6 py-5 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
                            <div className="flex gap-8">
                                <div>
                                    <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Rata-Rata Nilai</span>
                                    <span className="text-3xl font-black text-gray-900">{hitungRerata(detailNilai)}</span>
                                </div>
                                <div>
                                    <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Mata Pelajaran</span>
                                    <span className="text-3xl font-black text-gray-900">{detailNilai.length}</span>
                                </div>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="px-8 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-lg">
                                Selesai Meninjau
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViewData;