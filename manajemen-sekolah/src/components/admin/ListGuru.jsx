import React, { useState, useEffect } from 'react';
import { Users, Plus, Edit, Trash2, X, Save, RefreshCw, Search, UserCircle } from 'lucide-react';
import axios from 'axios';

const KelolaGuru = () => {
    // --- STATE KHUSUS GURU ---
    const [guruList, setGuruList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // State Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [formData, setFormData] = useState({
        id: null,
        name: "",
        nip: "",
        jenis_kelamin: "Laki-laki",
        no_wa: "",
        password: "" // Wajib saat tambah, opsional saat edit
    });

    // --- FUNGSI TARIK DATA GURU ---
    const fetchData = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            const response = await axios.get('http://localhost:5000/api/users', { headers });
            
            // Filter HANYA data guru
            setGuruList(response.data.filter(u => u.role === 'guru'));
        } catch (error) {
            console.error("Gagal menarik data guru:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    // --- FUNGSI HANDLER MODAL ---
    const openAddModal = () => {
        setIsEditMode(false);
        setFormData({ id: null, name: "", nip: "", jenis_kelamin: "Laki-laki", no_wa: "", password: "" });
        setIsModalOpen(true);
    };

    const openEditModal = (guru) => {
        setIsEditMode(true);
        setFormData({
            id: guru.id,
            name: guru.name,
            nip: guru.nip || "",
            jenis_kelamin: guru.jenis_kelamin || "Laki-laki",
            no_wa: guru.no_wa || "",
            password: "" // Dikosongkan agar tidak menimpa password lama jika tidak diubah
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
                // Proses Edit menggunakan rute khusus guru
                await axios.put(`http://localhost:5000/api/admin/guru/${formData.id}`, formData, { headers });
                alert("Data guru berhasil diperbarui!");
            } else {
                // Proses Tambah Baru
                const payload = { ...formData, role: 'guru' };
                await axios.post('http://localhost:5000/api/users', payload, { headers });
                alert("Guru baru berhasil didaftarkan!");
            }

            closeModal();
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || "Gagal menyimpan data guru.");
        }
    };

    // --- FUNGSI HAPUS ---
    const handleDelete = async (id, nama) => {
        if (!window.confirm(`Yakin ingin menghapus guru ${nama}?`)) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/users/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            fetchData();
        } catch (error) {
            alert("Gagal menghapus data guru.");
        }
    };

    // Filter Pencarian
    const filteredGuru = guruList.filter(g => 
        g.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (g.nip && g.nip.includes(searchTerm))
    );

    return (
        <div className="max-w-[90rem] mx-auto p-6 mt-4 animate-fade-in-up">
            
            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row justify-between md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900">Manajemen Data Guru</h1>
                    <p className="text-gray-500 mt-1">Kelola profil tenaga pendidik, NIP, dan akses login.</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={fetchData} className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition">
                        <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
                    </button>
                    <button onClick={openAddModal} className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-900 transition shadow-md">
                        <Plus size={20} /> Daftarkan Guru
                    </button>
                </div>
            </div>

            {/* Area Tabel & Pencarian */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="relative w-full sm:w-96">
                        <Search size={18} className="absolute inset-y-0 left-4 top-3 text-gray-400" />
                        <input 
                            type="text" placeholder="Cari nama atau NIP..."
                            className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 text-gray-500 text-sm font-semibold uppercase tracking-wider border-b border-gray-100">
                                <th className="px-6 py-4">Nama Guru</th>
                                <th className="px-6 py-4">NIP</th>
                                <th className="px-6 py-4">L/P</th>
                                <th className="px-6 py-4">No. WhatsApp</th>
                                <th className="px-6 py-4 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                <tr><td colSpan="5" className="text-center py-10">Memuat data...</td></tr>
                            ) : filteredGuru.length === 0 ? (
                                <tr><td colSpan="5" className="text-center py-10 text-gray-400">Tidak ada data guru ditemukan.</td></tr>
                            ) : (
                                filteredGuru.map((guru) => (
                                    <tr key={guru.id} className="hover:bg-blue-50/30 transition">
                                        <td className="px-6 py-4 flex items-center gap-3">
                                            <UserCircle className="text-gray-400" size={32} />
                                            <span className="font-bold text-gray-900">{guru.name}</span>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-gray-600 font-bold">{guru.nip || '-'}</td>
                                        <td className="px-6 py-4 text-gray-700">{guru.jenis_kelamin === 'Laki-laki' ? 'L' : 'P'}</td>
                                        <td className="px-6 py-4 text-gray-700">{guru.no_wa || '-'}</td>
                                        
                                        <td className="px-6 py-4 flex justify-center gap-2">
                                            <button onClick={() => openEditModal(guru)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit size={18} /></button>
                                            <button onClick={() => handleDelete(guru.id, guru.name)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18} /></button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- MODAL FORM GURU (TAMBAH & EDIT) --- */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl">
                        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="text-xl font-extrabold text-gray-900">{isEditMode ? 'Edit Data Guru' : 'Daftarkan Guru Baru'}</h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-red-500"><X size={24} /></button>
                        </div>
                        
                        <form onSubmit={handleSimpan}>
                            <div className="p-6 space-y-5">
                                <div className="grid grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Nama Lengkap (Serta Gelar)</label>
                                        <input type="text" required className="w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                                            value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">NIP (Sbg. Username Login)</label>
                                        <input type="text" required className="w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                                            value={formData.nip} onChange={(e) => setFormData({...formData, nip: e.target.value})} disabled={isEditMode} />
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
                                        <label className="block text-sm font-bold text-gray-700 mb-2">No. WhatsApp</label>
                                        <input type="text" className="w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                                            value={formData.no_wa} onChange={(e) => setFormData({...formData, no_wa: e.target.value})} />
                                    </div>
                                </div>

                                {/* Bagian Password */}
                                {!isEditMode ? (
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Password Login</label>
                                        <input type="password" required className="w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                                            value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
                                    </div>
                                ) : (
                                    <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                                        <label className="block text-sm font-bold text-amber-800 mb-1">Reset Password</label>
                                        <p className="text-xs text-amber-600 mb-2">Kosongkan jika tidak ingin mengubah password guru ini.</p>
                                        <input type="text" placeholder="Ketik password baru..." className="w-full px-4 py-2.5 border border-amber-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500"
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

export default KelolaGuru;