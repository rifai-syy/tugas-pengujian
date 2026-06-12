import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Edit2, Trash2, Save, X, RefreshCw } from 'lucide-react';
import axios from 'axios';

const KelolaMapel = () => {
    const [mapelList, setMapelList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // State untuk form Input
    const [newMapel, setNewMapel] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // State untuk mode Edit inline
    const [editingId, setEditingId] = useState(null);
    const [editValue, setEditValue] = useState("");

    const fetchMapel = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/mapel', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMapelList(response.data);
        } catch (error) {
            console.error("Gagal menarik data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMapel();
    }, []);

    // --- HANDLER TAMBAH MAPEL ---
    const handleAddMapel = async (e) => {
        e.preventDefault();
        if (!newMapel.trim()) return;
        setIsSubmitting(true);
        
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                'http://localhost:5000/api/mapel', 
                { nama_mapel: newMapel },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setNewMapel(""); // Kosongkan form
            fetchMapel(); // Refresh tabel
        } catch (error) {
            alert("Gagal menambahkan mata pelajaran.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- HANDLER EDIT MAPEL ---
    const startEdit = (mapel) => {
        setEditingId(mapel.id);
        setEditValue(mapel.nama_mapel);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditValue("");
    };

    const handleSaveEdit = async (id) => {
        if (!editValue.trim()) return cancelEdit();
        
        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `http://localhost:5000/api/mapel/${id}`, 
                { nama_mapel: editValue },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setEditingId(null);
            fetchMapel();
        } catch (error) {
            alert("Gagal menyimpan perubahan.");
        }
    };

    // --- HANDLER HAPUS MAPEL ---
    const handleDelete = async (id, nama) => {
        const confirmDelete = window.confirm(`Apakah Anda yakin ingin menghapus "${nama}"?\nPERINGATAN: Semua penugasan guru yang menggunakan pelajaran ini juga akan ikut terhapus!`);
        if (!confirmDelete) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/mapel/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchMapel();
        } catch (error) {
            alert("Gagal menghapus data.");
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 mt-4 animate-fade-in-up">
            
            <div className="mb-8 flex flex-col md:flex-row justify-between md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900">Kurikulum & Pelajaran</h1>
                    <p className="text-gray-500 mt-1">Kelola daftar mata pelajaran resmi sekolah yang akan digunakan dalam jadwal.</p>
                </div>
                <button onClick={fetchMapel} className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition shadow-sm flex items-center gap-2">
                    <RefreshCw size={18} className={isLoading ? "animate-spin text-blue-500" : ""} /> Refresh
                </button>
            </div>

            {/* FORM TAMBAH MAPEL BARU */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-8 flex flex-col sm:flex-row gap-4 items-center">
                <div className="bg-blue-50 p-3 rounded-2xl text-blue-600 hidden sm:block">
                    <BookOpen size={24} />
                </div>
                <form onSubmit={handleAddMapel} className="flex-1 flex w-full gap-3">
                    <input 
                        type="text" 
                        placeholder="Contoh: Matematika, Pendidikan Agama..." 
                        className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition font-medium"
                        value={newMapel}
                        onChange={(e) => setNewMapel(e.target.value)}
                        disabled={isSubmitting}
                    />
                    <button type="submit" disabled={isSubmitting || !newMapel.trim()} className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:bg-blue-300 transition flex items-center gap-2">
                        <Plus size={20} /> Tambah
                    </button>
                </form>
            </div>

            {/* DAFTAR MAPEL */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                    <h3 className="font-bold text-gray-800">Daftar Mata Pelajaran ({mapelList.length})</h3>
                </div>
                
                {isLoading ? (
                    <div className="p-10 text-center text-gray-400">Memuat data...</div>
                ) : mapelList.length === 0 ? (
                    <div className="p-10 text-center text-gray-400">Belum ada mata pelajaran terdaftar.</div>
                ) : (
                    <ul className="divide-y divide-gray-100">
                        {mapelList.map((mapel) => (
                            <li key={mapel.id} className="p-4 hover:bg-blue-50/30 transition flex items-center justify-between group">
                                
                                {/* Area Kiri (Nama atau Form Edit) */}
                                <div className="flex-1 flex items-center gap-4">
                                    <div className="text-gray-300 group-hover:text-blue-300"><BookOpen size={20} /></div>
                                    
                                    {editingId === mapel.id ? (
                                        <div className="flex-1 flex gap-2">
                                            <input 
                                                type="text" autoFocus
                                                className="w-full max-w-sm px-3 py-1.5 border border-blue-400 rounded-lg outline-none font-medium"
                                                value={editValue} onChange={(e) => setEditValue(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(mapel.id)}
                                            />
                                            <button onClick={() => handleSaveEdit(mapel.id)} className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"><Save size={18} /></button>
                                            <button onClick={cancelEdit} className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"><X size={18} /></button>
                                        </div>
                                    ) : (
                                        <span className="font-semibold text-gray-800 text-lg">{mapel.nama_mapel}</span>
                                    )}
                                </div>

                                {/* Area Kanan (Tombol Aksi) */}
                                {editingId !== mapel.id && (
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => startEdit(mapel)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Edit Ejaan">
                                            <Edit2 size={18} />
                                        </button>
                                        <button onClick={() => handleDelete(mapel.id, mapel.nama_mapel)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition" title="Hapus Mapel">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            
        </div>
    );
};

export default KelolaMapel;