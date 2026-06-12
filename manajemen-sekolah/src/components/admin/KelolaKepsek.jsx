import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Plus, Edit, Trash2, X, Save, RefreshCw, Search, ShieldCheck } from 'lucide-react';

const KelolaKepsek = () => {
    const [kepsekList, setKepsekList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [formData, setFormData] = useState({
        id: null,
        name: "",
        username: "", // NIP/Username
        no_wa: "",
        password: "" 
    });

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/users', { 
                headers: { Authorization: `Bearer ${token}` } 
            });
            // Filter hanya role kepsek
            setKepsekList(res.data.filter(u => u.role === 'kepsek'));
        } catch (error) {
            console.error("Gagal menarik data kepsek:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const openAddModal = () => {
        setIsEditMode(false);
        setFormData({ id: null, name: "", username: "", no_wa: "", password: "" });
        setIsModalOpen(true);
    };

    const openEditModal = (kepsek) => {
        setIsEditMode(true);
        setFormData({
            id: kepsek.id,
            name: kepsek.name,
            username: kepsek.username,
            no_wa: kepsek.no_wa || "",
            password: "" 
        });
        setIsModalOpen(true);
    };

    const handleSimpan = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            if (isEditMode) {
                await axios.put(`http://localhost:5000/api/users/${formData.id}`, formData, { headers });
                alert("Data Pimpinan berhasil diperbarui!");
            } else {
                const payload = { ...formData, role: 'kepsek' };
                await axios.post('http://localhost:5000/api/users', payload, { headers });
                alert("Akun Pimpinan baru berhasil ditambahkan!");
            }
            setIsModalOpen(false);
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || "Gagal menyimpan data.");
        }
    };

    const handleDelete = async (id, nama) => {
        if (!window.confirm(`Yakin ingin menghapus akun Kepala Sekolah: ${nama}?`)) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/users/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            fetchData();
        } catch (error) {
            alert("Gagal menghapus data.");
        }
    };

    const filteredKepsek = kepsekList.filter(k => 
        k.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        k.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-[90rem] mx-auto p-6 mt-4 animate-fade-in-up">
            <div className="mb-8 flex flex-col md:flex-row justify-between md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
                        <ShieldCheck size={32} className="text-amber-500" /> Manajemen Pimpinan
                    </h1>
                    <p className="text-gray-500 mt-1">Kelola akun akses untuk Kepala Sekolah atau Wakil Kepala Sekolah.</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={fetchData} className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition">
                        <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
                    </button>
                    <button onClick={openAddModal} className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 transition shadow-md">
                        <Plus size={20} /> Tambah Pimpinan
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                    <div className="relative w-full md:w-96">
                        <Search size={18} className="absolute inset-y-0 left-4 top-3 text-gray-400" />
                        <input type="text" placeholder="Cari nama atau NIP..." className="w-full pl-11 pr-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-amber-500" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 text-gray-500 text-sm font-semibold uppercase tracking-wider border-b">
                                <th className="px-6 py-4">Nama Lengkap</th>
                                <th className="px-6 py-4">NIP / Username</th>
                                <th className="px-6 py-4">No WhatsApp</th>
                                <th className="px-6 py-4 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? <tr><td colSpan="4" className="text-center py-10">Memuat...</td></tr> :
                             filteredKepsek.length === 0 ? <tr><td colSpan="4" className="text-center py-10 text-gray-400">Belum ada data pimpinan.</td></tr> :
                             filteredKepsek.map(k => (
                                <tr key={k.id} className="hover:bg-amber-50/30 transition">
                                    <td className="px-6 py-4 font-bold text-gray-900">{k.name}</td>
                                    <td className="px-6 py-4 font-mono text-gray-600">{k.username}</td>
                                    <td className="px-6 py-4 text-gray-600">{k.no_wa || '-'}</td>
                                    <td className="px-6 py-4 flex justify-center gap-2">
                                        <button onClick={() => openEditModal(k)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={18} /></button>
                                        <button onClick={() => handleDelete(k.id, k.name)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Form */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
                        <div className="px-6 py-5 border-b flex justify-between items-center bg-gray-50">
                            <h3 className="text-xl font-extrabold text-gray-900">{isEditMode ? 'Edit Akun Pimpinan' : 'Tambah Pimpinan Baru'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500"><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSimpan}>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Nama Lengkap (Beserta Gelar)</label>
                                    <input type="text" required className="w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-amber-500" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">NIP / Username Login</label>
                                    <input type="text" required disabled={isEditMode} className="w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-amber-500 disabled:bg-gray-100" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Nomor WhatsApp</label>
                                    <input type="text" className="w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-amber-500" value={formData.no_wa} onChange={(e) => setFormData({...formData, no_wa: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Password {isEditMode && <span className="text-amber-600 font-normal text-xs">(Kosongkan jika tidak ingin diubah)</span>}</label>
                                    <input type="password" required={!isEditMode} className="w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-amber-500" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
                                </div>
                            </div>
                            <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-gray-600 font-bold hover:bg-gray-200 rounded-xl">Batal</button>
                                <button type="submit" className="px-5 py-2.5 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 flex items-center gap-2"><Save size={18} /> Simpan Data</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default KelolaKepsek;