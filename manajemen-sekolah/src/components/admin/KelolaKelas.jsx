import React, { useState, useEffect } from 'react';
import { Users, Crown, BookOpen, Plus, Edit, Trash2, X, Save, RefreshCw } from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const KelolaKelas = () => {
    const [kelasList, setKelasList] = useState([]);
    const [guruList, setGuruList] = useState([]);
    const [mapelList, setMapelList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // State untuk Modal Edit Penugasan
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedKelas, setSelectedKelas] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    // --- BARU: State untuk Modal Tambah Kelas ---
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newClassName, setNewClassName] = useState("");
    const [isAdding, setIsAdding] = useState(false);

    const fetchAllData = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            const [resKelas, resMapel, resUsers] = await Promise.all([
                axios.get('http://localhost:5000/api/kelas', { headers }),
                axios.get('http://localhost:5000/api/mapel', { headers }),
                axios.get('http://localhost:5000/api/users', { headers })
            ]);

            setKelasList(resKelas.data);
            setMapelList(resMapel.data);
            setGuruList(resUsers.data.filter(u => u.role === 'guru'));
        } catch (error) {
            console.error("Gagal mengambil data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchAllData(); }, []);

    // --- Fungsi Modal Penugasan ---
    const openModal = (kelas) => {
        setSelectedKelas(JSON.parse(JSON.stringify(kelas))); 
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedKelas(null);
    };

    const handleAddMapel = () => {
        setSelectedKelas({
            ...selectedKelas,
            penugasan: [...selectedKelas.penugasan, { id_mapel: '', id_guru: '' }]
        });
    };

    const handleRemoveMapel = (index) => {
        const newPenugasan = selectedKelas.penugasan.filter((_, i) => i !== index);
        setSelectedKelas({ ...selectedKelas, penugasan: newPenugasan });
    };

    const handleSimpanPenugasan = async () => {
        setIsSaving(true);
        try {
            const token = localStorage.getItem('token');
            const penugasanValid = selectedKelas.penugasan.filter(p => p.id_mapel && p.id_guru);
            const payloadToSend = {
                wali_kelas_id: selectedKelas.id_wali_kelas,
                penugasan_mapel: penugasanValid
            };

            await axios.put(
                `http://localhost:5000/api/kelas/${selectedKelas.id}/penugasan`, 
                payloadToSend, 
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert(`Penugasan berhasil disimpan!`);
            closeModal();
            fetchAllData(); 
        } catch (error) {
            alert("Gagal menyimpan perubahan ke database.");
        } finally {
            setIsSaving(false);
        }
    };

    // --- BARU: Fungsi untuk Menyimpan Kelas Baru ---
    const handleTambahKelasBaru = async (e) => {
        e.preventDefault();
        if (!newClassName.trim()) return alert("Nama kelas tidak boleh kosong!");
        
        setIsAdding(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                'http://localhost:5000/api/kelas',
                { nama_kelas: newClassName },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            alert(`Kelas ${newClassName} berhasil dibuat!`);
            setNewClassName(""); // Kosongkan input
            setIsAddModalOpen(false); // Tutup modal
            fetchAllData(); // Refresh data otomatis
        } catch (error) {
            alert(error.response?.data?.message || "Gagal menambah kelas baru.");
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <div className="max-w-[90rem] mx-auto p-6 mt-4 animate-fade-in-up">
            
            <div className="mb-8 flex flex-col md:flex-row justify-between md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900">Manajemen Kelas & Penugasan</h1>
                    <p className="text-gray-500 mt-1">Atur Wali Kelas dan penugasan Guru Mata Pelajaran secara *real-time*.</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={fetchAllData} className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition flex items-center gap-2">
                        <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
                    </button>
                    {/* --- BARU: Event onClick untuk membuka Modal Tambah Kelas --- */}
                    <button 
                        onClick={() => setIsAddModalOpen(true)} 
                        className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-md"
                    >
                        <Plus size={20} /> Tambah Kelas
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 text-blue-600">
                    <RefreshCw size={40} className="animate-spin mb-4" />
                    <p className="font-semibold text-gray-500">Menarik data dari database...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {kelasList.length === 0 && (
                        <div className="col-span-3 text-center py-12 text-gray-500 bg-white rounded-3xl border border-dashed border-gray-300">
                            Belum ada kelas yang terdaftar. Silakan klik "Tambah Kelas".
                        </div>
                    )}
                    {kelasList.map((kelas) => (
                        <div key={kelas.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all group relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-[#03045E]"></div>
                            <div className="flex justify-between items-start mb-4 mt-2">
                                <h2 className="text-3xl font-black text-[#03045E]">{kelas.nama_kelas}</h2>
                                <div className="bg-blue-50 p-2 rounded-xl text-blue-600"><Users size={24} /></div>
                            </div>
                            <div className="space-y-4 mb-6">
                                <div className="bg-amber-50 border border-amber-100 p-3 rounded-xl flex items-center gap-3">
                                    <div className="bg-amber-200/50 p-1.5 rounded-lg text-amber-700"><Crown size={18} /></div>
                                    <div>
                                        <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Wali Kelas</p>
                                        <p className="text-sm font-semibold text-gray-900">{kelas.wali_kelas_nama || 'Belum Diatur'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 px-1">
                                    <BookOpen size={18} className="text-gray-400" />
                                    <p className="text-sm text-gray-600"><span className="font-bold text-gray-900">{kelas.penugasan.length}</span> Mata Pelajaran terisi</p>
                                </div>
                            </div>
                            <button onClick={() => openModal(kelas)} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-blue-100 text-blue-700 rounded-xl font-bold hover:bg-blue-50 hover:border-blue-300 transition-colors">
                                <Edit size={16} /> Atur Penugasan
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* ==================================================
                BARU: MODAL TAMBAH KELAS 
            ================================================== */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-3xl w-full max-w-md flex flex-col shadow-2xl overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="text-xl font-extrabold text-gray-900">Tambah Kelas Baru</h3>
                            <button onClick={() => setIsAddModalOpen(false)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleTambahKelasBaru}>
                            <div className="p-6">
                                <label className="block text-sm font-bold text-gray-800 mb-2">Nama Kelas <span className="text-red-500">*</span></label>
                                <input 
                                    type="text" 
                                    required
                                    placeholder="Contoh: Kelas 1A, Kelas 6B"
                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                                    value={newClassName}
                                    onChange={(e) => setNewClassName(e.target.value)}
                                />
                                <p className="text-xs text-gray-500 mt-2">Wali Kelas dan Penugasan Mapel dapat diatur setelah kelas dibuat.</p>
                            </div>
                            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-5 py-2.5 text-gray-600 font-bold hover:bg-gray-200 rounded-xl transition">
                                    Batal
                                </button>
                                <button type="submit" disabled={isAdding} className={`px-5 py-2.5 text-white font-bold rounded-xl flex items-center gap-2 shadow-md transition ${isAdding ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}>
                                    {isAdding ? 'Menyimpan...' : 'Buat Kelas'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL PENGATURAN PENUGASAN (Yang Sebelumnya) */}
            {isModalOpen && selectedKelas && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <div>
                                <h3 className="text-xl font-extrabold text-gray-900">Atur Penugasan: {selectedKelas.nama_kelas}</h3>
                            </div>
                            <button onClick={closeModal} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition"><X size={24} /></button>
                        </div>
                        <div className="p-6 overflow-y-auto flex-1 space-y-8">
                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-3 uppercase tracking-wider"><Crown size={18} className="text-amber-500" /> Wali Kelas Utama</label>
                                <select className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                                    value={selectedKelas.id_wali_kelas || ""} onChange={(e) => setSelectedKelas({...selectedKelas, id_wali_kelas: e.target.value})}>
                                    <option value="">-- Kosongkan Wali Kelas --</option>
                                    {guruList.map(guru => <option key={guru.id} value={guru.id}>{guru.name}</option>)}
                                </select>
                            </div>
                            <hr className="border-gray-100" />
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <label className="flex items-center gap-2 text-sm font-bold text-gray-800 uppercase tracking-wider"><BookOpen size={18} className="text-blue-500" /> Guru Mata Pelajaran</label>
                                    <button onClick={handleAddMapel} className="text-sm font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg flex items-center gap-1 transition"><Plus size={16} /> Tambah Mapel</button>
                                </div>
                                <div className="space-y-3">
                                    {selectedKelas.penugasan.length === 0 && <div className="text-center py-6 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-gray-500 text-sm">Belum ada mata pelajaran.</div>}
                                    {selectedKelas.penugasan.map((tugas, index) => (
                                        <div key={index} className="flex flex-col sm:flex-row gap-3 p-3 bg-gray-50 border border-gray-200 rounded-xl items-center animate-fade-in-up">
                                            <select className="w-full sm:w-1/3 px-3 py-2 bg-white border border-gray-300 rounded-lg outline-none text-sm" value={tugas.id_mapel || ""}
                                                onChange={(e) => { const newPenugasan = [...selectedKelas.penugasan]; newPenugasan[index].id_mapel = e.target.value; setSelectedKelas({...selectedKelas, penugasan: newPenugasan}); }}>
                                                <option value="" disabled>-- Pilih Pelajaran --</option>
                                                {mapelList.map(m => <option key={m.id} value={m.id}>{m.nama_mapel}</option>)}
                                            </select>
                                            <span className="hidden sm:block text-gray-400">diajar oleh</span>
                                            <select className="w-full sm:flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg outline-none text-sm font-medium" value={tugas.id_guru || ""}
                                                onChange={(e) => { const newPenugasan = [...selectedKelas.penugasan]; newPenugasan[index].id_guru = e.target.value; setSelectedKelas({...selectedKelas, penugasan: newPenugasan}); }}>
                                                <option value="" disabled>-- Pilih Guru --</option>
                                                {guruList.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                                            </select>
                                            <button onClick={() => handleRemoveMapel(index)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition" title="Hapus Mapel"><Trash2 size={18} /></button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                            <button onClick={closeModal} className="px-5 py-2.5 text-gray-600 font-bold hover:bg-gray-200 rounded-xl transition">Batal</button>
                            <button onClick={handleSimpanPenugasan} disabled={isSaving} className={`px-5 py-2.5 text-white font-bold rounded-xl flex items-center gap-2 shadow-md transition ${isSaving ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}>
                                <Save size={18} /> {isSaving ? 'Menyimpan...' : 'Simpan ke Database'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default KelolaKelas;