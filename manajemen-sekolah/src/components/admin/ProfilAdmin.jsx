import React, { useState, useRef, useEffect } from 'react';
import { 
    ArrowLeft, Camera, Save, ShieldCheck, User, Phone, 
    Calendar, Lock, Trash2 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import useStore from '../../store/useStore';
import axios from 'axios';

const ProfilAdmin = () => {
    const authUser = useStore((state) => state.authUser);
    const setAuthUser = useStore((state) => state.setAuthUser);
    const fileInputRef = useRef(null);

    const [isLoading, setIsLoading] = useState(false);
    const [fotoPreview, setFotoPreview] = useState(authUser?.foto || null);
    
    const [formData, setFormData] = useState({
        name: authUser?.name || '',
        username: authUser?.username || '',
        no_wa: authUser?.no_wa || '',
        jenis_kelamin: authUser?.jenis_kelamin || 'Laki-laki',
        tanggal_lahir: authUser?.tanggal_lahir || '',
        password: '', 
    });

    // --- SINKRONISASI DATA SAAT COMPONENT DIMUAT ---
    useEffect(() => {
        if (authUser) {
            setFormData({
                name: authUser.name || '',
                username: authUser.username || '',
                no_wa: authUser.no_wa || '',
                jenis_kelamin: authUser.jenis_kelamin || 'Laki-laki',
                tanggal_lahir: authUser.tanggal_lahir ? authUser.tanggal_lahir.split('T')[0] : '',
                password: '',
            });
            setFotoPreview(authUser.foto || null);
        }
    }, [authUser]);

    // --- FUNGSI FOTO ---
    const handleFotoClick = () => {
        fileInputRef.current.click();
    };

    const handleFotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFotoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Fungsi Baru: Menghapus foto dari preview
    const handleHapusFoto = () => {
        setFotoPreview(null);
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
                foto: fotoPreview // Akan mengirim null jika foto dihapus
            };
            
            await axios.put(`http://localhost:5000/api/users/profile/${authUser.id}`, payloadToSend, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            const updatedUserForState = { ...authUser, ...payloadToSend };
            delete updatedUserForState.password; 
            
            setAuthUser(updatedUserForState); 
            alert('Profil berhasil diperbarui!');
            setFormData(prev => ({ ...prev, password: '' }));

        } catch (error) {
            console.error("Detail Error:", error);
            alert(error.response?.data?.message || "Terjadi kesalahan sistem.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-6 mt-4 animate-fade-in-up">
            <div className="mb-8">
                <Link to="/" className="text-blue-600 hover:text-blue-800 flex items-center gap-2 mb-2 font-medium transition-colors w-fit">
                    <ArrowLeft size={18} /> Kembali ke Dashboard
                </Link>
                <h1 className="text-3xl font-extrabold text-gray-900">Pengaturan Profil & Akun</h1>
                <p className="text-gray-500 mt-1">Kelola informasi pribadi dan kredensial login Anda.</p>
            </div>

            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="flex flex-col md:flex-row">
                    
                    {/* KOLOM KIRI (FOTO PROFIL) */}
                    <div className="w-full md:w-1/3 bg-gray-50/50 p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-100">
                        <div className="relative group cursor-pointer" onClick={handleFotoClick}>
                            {fotoPreview ? (
                                <img src={fotoPreview} alt="Profil" className="w-40 h-40 rounded-full object-cover shadow-md border-4 border-white bg-white" />
                            ) : (
                                <div className="w-40 h-40 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-5xl uppercase shadow-md border-4 border-white">
                                    {authUser?.name?.substring(0, 2) || 'AD'}
                                </div>
                            )}
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

                        <div className="mt-6 text-center">
                            <h3 className="font-bold text-lg text-gray-900">{authUser?.name}</h3>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold mt-2 uppercase tracking-wider border border-yellow-200">
                                <ShieldCheck size={14} /> Admin IT
                            </span>
                        </div>
                    </div>

                    {/* KOLOM KANAN (FORM DATA) */}
                    <div className="w-full md:w-2/3 p-8">
                        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <User size={20} className="text-blue-600" /> Data Pribadi & Kredensial
                        </h2>

                        <form onSubmit={handleSave} className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Lengkap</label>
                                    <input 
                                        type="text" required
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Username Login</label>
                                    <input 
                                        type="text" required
                                        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono text-blue-700 font-bold"
                                        value={formData.username}
                                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5"><Phone size={16}/> No. WhatsApp</label>
                                    <input 
                                        type="text"
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                                        value={formData.no_wa}
                                        onChange={(e) => setFormData({...formData, no_wa: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Jenis Kelamin</label>
                                    <select 
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                                        value={formData.jenis_kelamin}
                                        onChange={(e) => setFormData({...formData, jenis_kelamin: e.target.value})}
                                    >
                                        <option value="Laki-laki">Laki-laki</option>
                                        <option value="Perempuan">Perempuan</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5"><Calendar size={16}/> Tanggal Lahir</label>
                                    <input 
                                        type="date"
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                                        value={formData.tanggal_lahir}
                                        onChange={(e) => setFormData({...formData, tanggal_lahir: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5"><Lock size={16}/> Password Baru</label>
                                    <input 
                                        type="password"
                                        placeholder="Kosongkan jika tidak diubah"
                                        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl outline-none"
                                        value={formData.password}
                                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="pt-6 border-t border-gray-100 flex justify-end">
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

export default ProfilAdmin;