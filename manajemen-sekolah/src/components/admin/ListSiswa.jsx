import React, { useState, useEffect } from 'react';
import { Users, Plus, Edit, Trash2, X, Save, RefreshCw, GraduationCap, Search, ArrowUpRight } from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // <-- Jangan lupa import Link ini

const KelolaSiswa = () => {
    // --- STATE ---
    const [siswaList, setSiswaList] = useState([]);
    const [kelasList, setKelasList] = useState([]); 
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // State Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [formData, setFormData] = useState({
        id: null,
        name: "",
        nisn: "",
        jenis_kelamin: "Laki-laki",
        id_kelas: "",
        status_siswa: "Aktif",
        password: "" // Wajib saat tambah, opsional saat edit
    });

    // --- FUNGSI TARIK DATA ---
    const fetchData = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            const [resUsers, resKelas] = await Promise.all([
                axios.get('http://localhost:5000/api/users', { headers }),
                axios.get('http://localhost:5000/api/kelas', { headers })
            ]);

            setSiswaList(resUsers.data.filter(u => u.role === 'siswa'));
            setKelasList(resKelas.data);
        } catch (error) {
            console.error("Gagal menarik data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    // --- FUNGSI HANDLER MODAL ---
    const openAddModal = () => {
        setIsEditMode(false);
        setFormData({ id: null, name: "", nisn: "", jenis_kelamin: "Laki-laki", id_kelas: "", status_siswa: "Aktif", password: "" });
        setIsModalOpen(true);
    };

    const openEditModal = (siswa) => {
        setIsEditMode(true);
        setFormData({
            id: siswa.id,
            name: siswa.name,
            nisn: siswa.nisn,
            jenis_kelamin: siswa.jenis_kelamin || "Laki-laki",
            id_kelas: siswa.id_kelas || "",
            status_siswa: siswa.status_siswa || "Aktif",
            password: "" // Dikosongkan agar password lama tidak tertimpa
        });
        setIsModalOpen(true);
    };

    const closeModal = () => setIsModalOpen(false);

    // --- FUNGSI SIMPAN (TAMBAH/EDIT) ---
    const handleSimpan = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            if (isEditMode) {
                // Proses Edit Pindah Kelas & Reset Password
                await axios.put(`http://localhost:5000/api/users/${formData.id}`, formData, { headers });
                alert("Data siswa berhasil diperbarui!");
            } else {
                // Proses Tambah Baru
                const payload = { ...formData, role: 'siswa' };
                await axios.post('http://localhost:5000/api/users', payload, { headers });
                alert("Siswa baru berhasil didaftarkan!");
            }

            closeModal();
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || "Gagal menyimpan data.");
        }
    };

    // --- FUNGSI HAPUS ---
    const handleDelete = async (id, nama) => {
        if (!window.confirm(`Yakin ingin menghapus ${nama}? Semua nilai anak ini akan hilang.`)) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/users/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            fetchData();
        } catch (error) {
            alert("Gagal menghapus data.");
        }
    };

    const filteredSiswa = siswaList.filter(s => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (s.nisn && s.nisn.includes(searchTerm))
    );

    return (
        <div className="max-w-[90rem] mx-auto p-6 mt-4 animate-fade-in-up">
            
            {/* Header */}
            <div className="mb-8 flex flex-col xl:flex-row justify-between xl:items-end gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900">Manajemen Data Siswa</h1>
                    <p className="text-gray-500 mt-1">Kelola biodata, penempatan kelas, dan password siswa.</p>
                </div>
                
                {/* --- AREA TOMBOL --- */}
                <div className="flex flex-wrap items-center gap-3">
                    <button onClick={fetchData} className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition" title="Refresh Data">
                        <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
                    </button>
                    
                    {/* TOMBOL BARU: Kenaikan Kelas */}
                    <Link to="/admin/kenaikan-kelas" className="flex items-center gap-2 px-5 py-2.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-xl font-bold hover:bg-indigo-600 hover:text-white transition shadow-sm">
                        <ArrowUpRight size={20} /> Kenaikan Kelas
                    </Link>

                    <button onClick={openAddModal} className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-900 transition shadow-md">
                        <Plus size={20} /> Daftarkan Siswa
                    </button>
                </div>
            </div>

            {/* Area Tabel & Pencarian */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="relative w-full sm:w-96">
                        <Search size={18} className="absolute inset-y-0 left-4 top-3 text-gray-400" />
                        <input 
                            type="text" placeholder="Cari nama atau NISN..."
                            className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 text-gray-500 text-sm font-semibold uppercase tracking-wider border-b border-gray-100">
                                <th className="px-6 py-4">Nama Siswa</th>
                                <th className="px-6 py-4">NISN</th>
                                <th className="px-6 py-4">L/P</th>
                                <th className="px-6 py-4">Kelas Aktif</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                <tr><td colSpan="6" className="text-center py-10">Memuat data...</td></tr>
                            ) : filteredSiswa.length === 0 ? (
                                <tr><td colSpan="6" className="text-center py-10 text-gray-400">Tidak ada data siswa ditemukan.</td></tr>
                            ) : (
                                filteredSiswa.map((siswa) => (
                                    <tr key={siswa.id} className="hover:bg-blue-50/30 transition">
                                        <td className="px-6 py-4 font-bold text-gray-900">{siswa.name}</td>
                                        <td className="px-6 py-4 font-mono text-gray-600">{siswa.nisn || '-'}</td>
                                        <td className="px-6 py-4 text-gray-700">{siswa.jenis_kelamin === 'Laki-laki' ? 'L' : 'P'}</td>
                                        
                                        <td className="px-6 py-4">
                                            {siswa.nama_kelas ? (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-bold border border-blue-100">
                                                    <GraduationCap size={16}/> {siswa.nama_kelas}
                                                </span>
                                            ) : (
                                                <span className="text-sm text-red-500 italic font-medium">Belum Ada Kelas</span>
                                            )}
                                        </td>
                                        
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${siswa.status_siswa === 'Aktif' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                                                {siswa.status_siswa || 'Aktif'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 flex justify-center gap-2">
                                            <button onClick={() => openEditModal(siswa)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={18} /></button>
                                            <button onClick={() => handleDelete(siswa.id, siswa.name)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- MODAL FORM SISWA --- */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl">
                        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="text-xl font-extrabold text-gray-900">{isEditMode ? 'Edit & Pindah Kelas Siswa' : 'Daftarkan Siswa Baru'}</h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-red-500"><X size={24} /></button>
                        </div>
                        
                        <form onSubmit={handleSimpan}>
                            <div className="p-6 space-y-5">
                                <div className="grid grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Nama Lengkap</label>
                                        <input type="text" required className="w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                                            value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">NISN (Sbg. Username Login)</label>
                                        <input type="text" required className="w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                                            value={formData.nisn} onChange={(e) => setFormData({...formData, nisn: e.target.value})} disabled={isEditMode} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Jenis Kelamin</label>
                                        <select className="w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                                            value={formData.jenis_kelamin} onChange={(e) => setFormData({...formData, jenis_kelamin: e.target.value})}>
                                            <option value="Laki-laki">Laki-laki</option>
                                            <option value="Perempuan">Perempuan</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-blue-700 mb-2 flex items-center gap-2"><GraduationCap size={16}/> Penempatan Kelas</label>
                                        <select className="w-full px-4 py-2.5 border border-blue-300 bg-blue-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-blue-800"
                                            value={formData.id_kelas} onChange={(e) => setFormData({...formData, id_kelas: e.target.value})}>
                                            <option value="">-- Belum Ada Kelas --</option>
                                            {kelasList.map(k => (
                                                <option key={k.id} value={k.id}>{k.nama_kelas}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* AREA PASSWORD UPDATE */}
                                {!isEditMode ? (
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Password Login</label>
                                        <input type="password" required className="w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                                            value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
                                    </div>
                                ) : (
                                    <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                                        <label className="block text-sm font-bold text-amber-800 mb-1">Reset Password</label>
                                        <p className="text-xs text-amber-600 mb-3">Isi hanya jika Anda ingin mengatur ulang password siswa ini. Kosongkan jika tidak.</p>
                                        <input type="text" placeholder="Ketik password baru untuk siswa..." className="w-full px-4 py-2.5 border border-amber-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500"
                                            value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
                                    </div>
                                )}
                            </div>

                            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                                <button type="button" onClick={closeModal} className="px-5 py-2.5 text-gray-600 font-bold hover:bg-gray-200 rounded-xl transition">Batal</button>
                                <button type="submit" className="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition flex items-center gap-2">
                                    <Save size={18} /> Simpan Data
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default KelolaSiswa;