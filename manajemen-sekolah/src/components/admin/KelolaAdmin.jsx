import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UserPlus, Trash2, ShieldCheck, Mail, Phone, Loader2 } from 'lucide-react';

const KelolaAdmin = () => {
    const [admins, setAdmins] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState({ name: '', username: '', password: '', no_wa: '' });

    // 1. Ambil Data Admin dari Server
    const fetchAdmins = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/admins', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAdmins(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchAdmins(); }, []);

    // 2. Fungsi Tambah Admin
    const handleAddAdmin = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/admins', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Admin Berhasil Ditambahkan!");
            setFormData({ name: '', username: '', password: '', no_wa: '' });
            fetchAdmins();
        } catch (err) {
            alert(err.response?.data?.message || "Gagal menambah admin");
        }
    };

    // 3. Fungsi Hapus Admin
    const handleDelete = async (id) => {
        if (window.confirm("Yakin ingin menghapus akses admin ini?")) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:5000/api/users/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchAdmins();
            } catch (err) {
                alert("Gagal menghapus admin");
            }
        }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto animate-fade-in">
            <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <ShieldCheck className="text-blue-600" /> Sistem Kelola Administrator
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Tambah Admin */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
                    <h2 className="font-bold mb-4 flex items-center gap-2"><UserPlus size={18}/> Tambah Staff Admin</h2>
                    <form onSubmit={handleAddAdmin} className="space-y-4">
                        <input type="text" placeholder="Nama Lengkap" className="w-full p-2.5 bg-gray-50 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" 
                            value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                        
                        <input type="text" placeholder="Username" className="w-full p-2.5 bg-gray-50 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" 
                            value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} required />
                        
                        <input type="password" placeholder="Password" className="w-full p-2.5 bg-gray-50 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" 
                            value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required />
                        
                        <input type="text" placeholder="No. WhatsApp" className="w-full p-2.5 bg-gray-50 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" 
                            value={formData.no_wa} onChange={(e) => setFormData({...formData, no_wa: e.target.value})} />
                        
                        <button type="submit" className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-bold hover:bg-blue-700 transition">Simpan Admin</button>
                    </form>
                </div>

                {/* Tabel Daftar Admin */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-sm font-bold text-gray-600">Administrator</th>
                                <th className="px-6 py-4 text-sm font-bold text-gray-600">Username</th>
                                <th className="px-6 py-4 text-sm font-bold text-gray-600 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan="3" className="text-center py-10"><Loader2 className="animate-spin mx-auto text-blue-600" /></td></tr>
                            ) : (
                                admins.map((admin) => (
                                    <tr key={admin.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-900">{admin.NAME}</div>
                                            <div className="text-xs text-gray-500 flex items-center gap-1"><Phone size={12}/> {admin.no_wa || '-'}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-mono text-blue-600">{admin.username}</td>
                                        <td className="px-6 py-4 text-center">
                                            <button onClick={() => handleDelete(admin.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition">
                                                <Trash2 size={18} />
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

export default KelolaAdmin;