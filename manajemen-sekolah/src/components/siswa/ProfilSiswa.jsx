import React, { useState, useRef } from 'react';
import axios from 'axios';
import useStore from '../../store/useStore';
import { User, Lock, Phone, MapPin, Camera, Save, Trash2, Shield } from 'lucide-react';

const ProfilSiswa = () => {
    // Ambil data siswa saat ini
    const authUser = useStore((state) => state.authUser);

    // State untuk form (Isi otomatis dengan data yang sudah ada agar tidak hilang saat di-save)
    const [formData, setFormData] = useState({
        name: authUser?.name || "",
        username: authUser?.username || "",
        no_wa: authUser?.no_wa || "",
        jenis_kelamin: authUser?.jenis_kelamin || "",
        tanggal_lahir: authUser?.tanggal_lahir || "",
        alamat: authUser?.alamat || "",
        password: "", // Dikosongkan, hanya diisi jika ingin ganti password
    });

    const [fotoPreview, setFotoPreview] = useState(authUser?.foto || null);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const fileInputRef = useRef(null);

    // Fungsi handle ketikan pada input
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Fungsi mengubah gambar menjadi teks Base64
    const handleFotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // Batas 2MB
                setMessage({ type: 'error', text: 'Ukuran foto maksimal 2MB' });
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setFotoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Fungsi menghapus foto (Jurus Pamungkas = string kosong)
    const handleHapusFoto = () => {
        setFotoPreview("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    // Fungsi Simpan Perubahan
    const handleSave = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const token = localStorage.getItem('token');
            const dataToUpdate = {
                ...formData,
                foto: fotoPreview,
            };

            await axios.put(`http://localhost:5000/api/users/profile/${authUser.id}`, dataToUpdate, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setMessage({ type: 'success', text: 'Profil berhasil diperbarui! Silakan relogin jika foto tidak berubah di menu atas.' });

            // Kosongkan password setelah berhasil
            setFormData(prev => ({ ...prev, password: "" }));

        } catch (error) {
            const pesanError = error.response?.data?.message || "Terjadi kesalahan saat menyimpan data.";
            setMessage({ type: 'error', text: pesanError });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 mt-4 animate-fade-in-up">

            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
                    <User size={32} className="text-yellow-500" />
                    Pengaturan Profil
                </h1>
                <p className="text-gray-500 mt-1">Kelola informasi pribadi dan keamanan akunmu.</p>
            </div>

            {/* Pesan Notifikasi */}
            {message.text && (
                <div className={`p-4 mb-6 rounded-2xl flex items-start gap-3 border ${message.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                    {message.type === 'success' ? <Shield size={20} className="mt-0.5 text-green-600" /> : <Shield size={20} className="mt-0.5 text-red-600" />}
                    <p className="font-medium text-sm">{message.text}</p>
                </div>
            )}

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <form onSubmit={handleSave} className="p-8">

                    <div className="flex flex-col md:flex-row gap-10">

                        {/* --- KOLOM KIRI: FOTO PROFIL --- */}
                        <div className="flex flex-col items-center md:w-1/3">
                            <div className="w-48 h-48 rounded-full border-4 border-gray-100 shadow-md overflow-hidden bg-gray-50 flex items-center justify-center relative group mb-6">
                                {fotoPreview ? (
                                    <img src={fotoPreview} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-5xl font-black text-gray-300 uppercase">
                                        {authUser?.name?.substring(0, 2)}
                                    </span>
                                )}

                                {/* Overlay Ganti Foto saat Hover */}
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={() => fileInputRef.current.click()}>
                                    <Camera size={32} className="text-white" />
                                </div>
                            </div>

                            <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleFotoChange} />

                            <div className="flex flex-col gap-2 w-full">
                                <button type="button" onClick={() => fileInputRef.current.click()} className="w-full py-2.5 bg-blue-50 text-blue-700 font-bold rounded-xl hover:bg-blue-600 hover:text-white transition">
                                    Ganti Foto
                                </button>
                                {fotoPreview && (
                                    <button type="button" onClick={handleHapusFoto} className="w-full py-2.5 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-600 hover:text-white transition flex items-center justify-center gap-2">
                                        <Trash2 size={18} /> Hapus Foto
                                    </button>
                                )}
                            </div>
                            <p className="text-xs text-gray-400 text-center mt-4 px-4 leading-relaxed">
                                Format: JPG, PNG. Maksimal 2MB. Gunakan foto yang sopan dan berseragam.
                            </p>
                        </div>

                        {/* --- KOLOM KANAN: FORM DATA --- */}
                        <div className="md:w-2/3 space-y-6">

                            {/* Grup Read-Only (Hanya Info) */}
                            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 mb-6">
                                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4">Informasi Akademik</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-400 mb-1">Nama Lengkap</label>
                                        <p className="font-bold text-gray-800">{authUser?.name}</p>
                                    </div>
                                    <div>
                                        {/* Cari bagian ini di ProfilSiswa.jsx */}
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-400 mb-1">NISN</label>
                                            <p className="font-bold text-gray-800">{authUser?.nisn || "Data Tidak Ditemukan"}</p>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-xs text-yellow-600 mt-4 bg-yellow-50 p-2 rounded-lg inline-block border border-yellow-100">
                                    *Hubungi Admin sekolah jika ada kesalahan pada data akademik.
                                </p>
                            </div>

                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide border-b border-gray-100 pb-2">Informasi Pribadi</h3>

                            {/* No WA */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Nomor WhatsApp / HP</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Phone size={18} className="text-gray-400" />
                                    </div>
                                    <input
                                        type="text" name="no_wa" value={formData.no_wa} onChange={handleChange}
                                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none text-sm font-medium text-gray-700"
                                        placeholder="Contoh: 08123456789"
                                    />
                                </div>
                            </div>

                            {/* Alamat */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Alamat Lengkap</label>
                                <div className="relative">
                                    <div className="absolute top-3.5 left-4 pointer-events-none">
                                        <MapPin size={18} className="text-gray-400" />
                                    </div>
                                    <textarea
                                        name="alamat" rows="3" value={formData.alamat} onChange={handleChange}
                                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none text-sm font-medium text-gray-700 resize-none"
                                        placeholder="Masukkan alamat tempat tinggal..."
                                    ></textarea>
                                </div>
                            </div>

                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide border-b border-gray-100 pb-2 mt-8">Keamanan Akun</h3>

                            {/* Ganti Password */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Ganti Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock size={18} className="text-gray-400" />
                                    </div>
                                    <input
                                        type="password" name="password" value={formData.password} onChange={handleChange}
                                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none text-sm font-medium text-gray-700"
                                        placeholder="Biarkan kosong jika tidak ingin mengubah password"
                                    />
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Tombol Simpan */}
                    <div className="mt-10 pt-6 border-t border-gray-100 flex justify-end">
                        <button
                            type="submit" disabled={isLoading}
                            className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-blue-200'}`}
                        >
                            {isLoading ? 'Menyimpan...' : <><Save size={20} /> Simpan Perubahan</>}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default ProfilSiswa;