import React, { useState, useRef, useEffect } from 'react';
import { 
    ArrowLeft, Camera, Save, BookOpen, User, Phone, 
    Calendar, Lock, Briefcase, MapPin, GraduationCap, Trash2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import useStore from '../../store/useStore';
import axios from 'axios';

const ProfilGuru = () => {
    const authUser = useStore((state) => state.authUser);
    const setAuthUser = useStore((state) => state.setAuthUser);
    const fileInputRef = useRef(null);

    const [isLoading, setIsLoading] = useState(false);
    const [fotoPreview, setFotoPreview] = useState(authUser?.foto || null);
    
    // State untuk mengatur Tab yang aktif ('akun' atau 'akademik')
    const [activeTab, setActiveTab] = useState('akun');
    
    // State form (Sudah mencakup semua field)
    const [formData, setFormData] = useState({
        name: authUser?.name || '',
        username: authUser?.username || '',
        no_wa: authUser?.no_wa || '',
        jenis_kelamin: authUser?.jenis_kelamin || 'Laki-laki',
        tanggal_lahir: authUser?.tanggal_lahir || '',
        password: '', 
        nuptk: authUser?.nuptk || '',
        nip: authUser?.nip || '',
        pendidikan: authUser?.pendidikan || 'S1 Pendidikan',
        spesialisasi: authUser?.spesialisasi || '',
        alamat: authUser?.alamat || '',
        kontak_darurat: authUser?.kontak_darurat || '',
    });

    useEffect(() => {
        if (authUser) {
            setFormData({
                name: authUser.name || '',
                username: authUser.username || '',
                no_wa: authUser.no_wa || '',
                jenis_kelamin: authUser.jenis_kelamin || 'Laki-laki',
                tanggal_lahir: authUser.tanggal_lahir ? authUser.tanggal_lahir.split('T')[0] : '',
                password: '',
                nuptk: authUser.nuptk || '',
                nip: authUser.nip || '',
                pendidikan: authUser.pendidikan || 'S1 Pendidikan',
                spesialisasi: authUser.spesialisasi || '',
                alamat: authUser.alamat || '',
                kontak_darurat: authUser.kontak_darurat || '',
            });
            setFotoPreview(authUser.foto || null);
        }
    }, [authUser]);

    // --- FUNGSI FOTO ---
    const handleFotoClick = () => fileInputRef.current.click();

    const handleFotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setFotoPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleHapusFoto = () => {
       setFotoPreview(null); // Menghapus dari tampilan dan menyiapkan null untuk disave
    };

    // --- FUNGSI SIMPAN ---
    const handleSave = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const token = localStorage.getItem('token');
            let finalTanggalLahir = formData.tanggal_lahir;
            if (finalTanggalLahir && finalTanggalLahir.includes("T")) {
                finalTanggalLahir = finalTanggalLahir.split("T")[0]; 
            }

            const payloadToSend = {
                ...formData,
                tanggal_lahir: finalTanggalLahir,
                foto: fotoPreview // Jika foto dihapus, ini akan bernilai null
            };
            
            await axios.put(`http://localhost:5000/api/users/profile/${authUser.id}`, payloadToSend, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            const updatedUserForState = { ...authUser, ...payloadToSend };
            delete updatedUserForState.password; 
            
            setAuthUser(updatedUserForState); 
            alert('Profil Guru berhasil diperbarui!');
            setFormData(prev => ({ ...prev, password: '' }));

        } catch (error) {
            console.error("Detail Error:", error);
            alert(error.response?.data?.message || "Terjadi kesalahan sistem.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6 mt-4 animate-fade-in-up">
            
            {/* Header */}
            <div className="mb-8">
                <Link to="/guru/dashboard" className="text-blue-600 hover:text-blue-800 flex items-center gap-2 mb-2 font-medium transition-colors w-fit">
                    <ArrowLeft size={18} /> Kembali ke Dashboard
                </Link>
                <h1 className="text-3xl font-extrabold text-gray-900">Pengaturan Profil Guru</h1>
                <p className="text-gray-500 mt-1">Kelola identitas pribadi, kredensial login, dan informasi akademik Anda.</p>
            </div>

            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="flex flex-col md:flex-row">
                    
                    {/* --- KOLOM KIRI (FOTO & IDENTITAS STATIS) --- */}
                    <div className="w-full md:w-1/3 bg-gray-50/50 p-8 flex flex-col items-center justify-start border-b md:border-b-0 md:border-r border-gray-100">
                        
                        {/* Area Klik Foto */}
                        <div className="relative group cursor-pointer mt-4" onClick={handleFotoClick}>
                            {fotoPreview ? (
                                <img src={fotoPreview} alt="Profil" className="w-40 h-40 rounded-full object-cover shadow-md border-4 border-white bg-white" />
                            ) : (
                                <div className="w-40 h-40 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-5xl uppercase shadow-md border-4 border-white">
                                    {authUser?.name?.substring(0, 2).toUpperCase() || 'GR'}
                                </div>
                            )}
                            
                            {/* Overlay Hitam saat di hover */}
                            <div className="absolute inset-0 bg-black/40 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <Camera size={32} className="text-white mb-1" />
                                <span className="text-white text-xs font-semibold">Ubah Foto</span>
                            </div>
                            <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFotoChange} />
                        </div>

                        {/* TOMBOL HAPUS FOTO */}
                        {fotoPreview && (
                            <button 
                                onClick={handleHapusFoto} 
                                className="mt-4 px-4 py-2 bg-red-50 text-red-600 text-sm font-bold rounded-xl hover:bg-red-600 hover:text-white transition-colors flex items-center gap-2 border border-red-100"
                            >
                                <Trash2 size={16} /> Hapus Foto
                            </button>
                        )}

                        {/* Ringkasan Profil */}
                        <div className="mt-6 text-center w-full">
                            <h3 className="font-bold text-xl text-gray-900">{formData.name || 'Nama Belum Diisi'}</h3>
                            <p className="text-sm text-gray-500 font-mono mt-1">{formData.nuptk || 'NUPTK: -'}</p>
                            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold mt-4 uppercase tracking-wider border border-emerald-200">
                                <BookOpen size={14} /> Tenaga Pendidik
                            </span>
                        </div>
                    </div>

                    {/* --- KOLOM KANAN (FORM DENGAN TAB) --- */}
                    <div className="w-full md:w-2/3 flex flex-col">
                        
                        {/* NAVIGASI TAB */}
                        <div className="flex border-b border-gray-200 px-8 pt-6">
                            <button 
                                onClick={() => setActiveTab('akun')}
                                className={`flex items-center gap-2 pb-4 px-4 font-semibold transition-colors border-b-2 ${
                                    activeTab === 'akun' ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-500 hover:text-blue-600'
                                }`}
                            >
                                <User size={18} /> Akun & Kontak
                            </button>
                            <button 
                                onClick={() => setActiveTab('akademik')}
                                className={`flex items-center gap-2 pb-4 px-4 font-semibold transition-colors border-b-2 ${
                                    activeTab === 'akademik' ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-500 hover:text-blue-600'
                                }`}
                            >
                                <Briefcase size={18} /> Data Akademik
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="p-8 flex-1 flex flex-col justify-between">
                            
                            {/* KONTEN TAB 1: AKUN & KONTAK */}
                            {activeTab === 'akun' && (
                                <div className="space-y-6 animate-fade-in-up">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Lengkap</label>
                                            <input type="text" required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                                value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Username Login</label>
                                            <input type="text" required className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono text-blue-700 font-bold"
                                                value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5"><Phone size={16}/> No. WhatsApp</label>
                                            <input type="text" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                                                value={formData.no_wa} onChange={(e) => setFormData({...formData, no_wa: e.target.value})} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5"><Lock size={16}/> Password Baru</label>
                                            <input type="password" placeholder="Kosongkan jika tidak diubah" className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                                                value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5"><Calendar size={16}/> Tanggal Lahir</label>
                                            <input type="date" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                                                value={formData.tanggal_lahir} onChange={(e) => setFormData({...formData, tanggal_lahir: e.target.value})} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Jenis Kelamin</label>
                                            <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                                                value={formData.jenis_kelamin} onChange={(e) => setFormData({...formData, jenis_kelamin: e.target.value})}>
                                                <option value="Laki-laki">Laki-laki</option>
                                                <option value="Perempuan">Perempuan</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* KONTEN TAB 2: DATA AKADEMIK */}
                            {activeTab === 'akademik' && (
                                <div className="space-y-6 animate-fade-in-up">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">NUPTK (Nomor Unik Pendidik)</label>
                                            <input type="text" placeholder="16 Digit NUPTK" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                                                value={formData.nuptk} onChange={(e) => setFormData({...formData, nuptk: e.target.value})} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">NIP / NIY</label>
                                            <input type="text" placeholder="Kosongkan jika tidak ada" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                                                value={formData.nip} onChange={(e) => setFormData({...formData, nip: e.target.value})} />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5"><GraduationCap size={16}/> Pendidikan Terakhir</label>
                                            <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                                                value={formData.pendidikan} onChange={(e) => setFormData({...formData, pendidikan: e.target.value})}>
                                                <option value="D3">Diploma 3 (D3)</option>
                                                <option value="S1 Pendidikan">S1 Pendidikan</option>
                                                <option value="S1 Non-Kependidikan">S1 Non-Kependidikan</option>
                                                <option value="S2">Magister (S2)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Spesialisasi / Keahlian</label>
                                            <input type="text" placeholder="Contoh: Guru Kelas, Matematika" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                                                value={formData.spesialisasi} onChange={(e) => setFormData({...formData, spesialisasi: e.target.value})} />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5"><MapPin size={16}/> Alamat Domisili Sekarang</label>
                                            <textarea rows="2" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" placeholder="Alamat lengkap tempat tinggal saat ini"
                                                value={formData.alamat} onChange={(e) => setFormData({...formData, alamat: e.target.value})}></textarea>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TOMBOL SIMPAN (Global untuk semua tab) */}
                            <div className="pt-6 mt-6 border-t border-gray-100 flex justify-end">
                                <button 
                                    type="submit" disabled={isLoading}
                                    className={`px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-md transition-all ${
                                        isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700 text-white'
                                    }`}
                                >
                                    <Save size={20} />
                                    {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilGuru;