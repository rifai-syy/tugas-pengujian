import React, { useState } from 'react';
import { User, ShieldCheck, Phone, MapPin, Save, Lock, Camera } from 'lucide-react';
import useStore from '../../store/useStore';
import axios from 'axios';

const ProfilKepsek = () => {
    const { authUser, setAuthUser } = useStore();
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [formData, setFormData] = useState({
        name: authUser?.name || '',
        no_wa: authUser?.no_wa || '',
        alamat: authUser?.alamat || '',
        password: '',
    });

    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const token = localStorage.getItem('token');
            const res = await axios.put(`http://localhost:5000/api/users/${authUser.id}`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Update data di state global (Zustand)
            setAuthUser({ ...authUser, ...formData });
            setMessage({ type: 'success', text: 'Profil pimpinan berhasil diperbarui!' });
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Gagal memperbarui profil.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 mt-4 animate-fade-in-up">
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
                    <User size={32} className="text-amber-500" /> Profil Pimpinan
                </h1>
                <p className="text-gray-500 mt-1">Kelola informasi akun dan keamanan akses Anda.</p>
            </div>

            {message.text && (
                <div className={`p-4 rounded-2xl mb-6 font-bold flex items-center gap-2 ${
                    message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                    <ShieldCheck size={20} /> {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Kartu Visual Profil */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center">
                        <div className="relative inline-block mb-4">
                            <div className="w-32 h-32 rounded-full bg-amber-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg mx-auto">
                                {authUser?.foto ? (
                                    <img src={authUser.foto} alt="Profil" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-4xl font-black text-amber-600">{authUser?.name?.substring(0, 2).toUpperCase()}</span>
                                )}
                            </div>
                        </div>
                        <h2 className="text-xl font-black text-gray-900">{authUser?.name}</h2>
                        <p className="text-amber-600 font-bold text-xs uppercase tracking-widest mt-1">Kepala Sekolah</p>
                        
                        <div className="mt-6 pt-6 border-t border-gray-50 space-y-4">
                            <div className="flex items-center gap-3 text-left">
                                <ShieldCheck size={18} className="text-gray-400" />
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase">Username / NIP</p>
                                    <p className="text-sm font-mono font-bold text-gray-700">{authUser?.username}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Edit Profil */}
                <div className="lg:col-span-2">
                    <form onSubmit={handleUpdate} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                    <User size={16} className="text-amber-500"/> Nama Lengkap
                                </label>
                                <input 
                                    type="text" required 
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                                    value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                    <Phone size={16} className="text-amber-500"/> No. WhatsApp
                                </label>
                                <input 
                                    type="text" 
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                                    value={formData.no_wa} onChange={(e) => setFormData({...formData, no_wa: e.target.value})}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                <MapPin size={16} className="text-amber-500"/> Alamat Kantor/Rumah
                            </label>
                            <textarea 
                                rows="3"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all resize-none"
                                value={formData.alamat} onChange={(e) => setFormData({...formData, alamat: e.target.value})}
                            ></textarea>
                        </div>

                        <div className="pt-6 border-t border-gray-50">
                            <label className="block text-sm font-bold text-red-600 mb-2 flex items-center gap-2">
                                <Lock size={16}/> Ganti Password Keamanan
                            </label>
                            <input 
                                type="password" 
                                placeholder="Isi jika ingin mengganti password..."
                                className="w-full px-4 py-3 bg-red-50/30 border border-red-100 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all"
                                value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})}
                            />
                            <p className="text-[10px] text-gray-400 mt-2 italic">*Kosongkan jika tidak ada perubahan password.</p>
                        </div>

                        <button 
                            type="submit" disabled={isLoading}
                            className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${
                                isLoading ? 'bg-gray-200 text-gray-400' : 'bg-amber-500 text-white hover:bg-amber-600 hover:-translate-y-1'
                            }`}
                        >
                            <Save size={20} /> {isLoading ? 'Menyimpan...' : 'Simpan Perubahan Profil'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfilKepsek;