import React, { useState } from 'react';
import axios from 'axios';
import { School, User, Lock, Loader2, AlertCircle } from 'lucide-react';

import useStore from '../store/useStore';

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const setAuthUser = useStore((state) => state.setAuthUser);
 

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(''); 

    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        identifier,
        password
      });

      localStorage.setItem('token', response.data.token);
      setAuthUser(response.data.user);
      
     
      
    } catch (err) {
      setError(err.response?.data?.message || 'Terjadi kesalahan tidak terduga pada server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 sm:p-8 bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: "url('/bg-sekolah.png')" }} 
    >
      
      {/* Overlay Gelap Tipis agar background tidak terlalu terang */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* KOTAK LOGIN SOLID */}
      <div className="bg-white max-w-md w-full rounded-2xl shadow-2xl overflow-hidden relative z-10 animate-fade-in-up">
        
        {/* Header Biru Solid */}
        <div className="bg-blue-600 p-8 text-center">
          <div className="bg-white p-3 rounded-full inline-block mb-3 shadow-lg">
            <School size={36} className="text-blue-700" />
          </div>
          <h1 className="text-2xl font-bold text-white">SIAKAD Terpadu</h1>
          <p className="text-blue-100 text-sm mt-1">Sistem Informasi Akademik Sekolah</p>
        </div>

        {/* Area Form Input */}
        <div className="p-6 sm:p-8 space-y-6">
          <h2 className="text-xl font-bold text-gray-900 text-center">Silakan Masuk</h2>

          {/* Notifikasi Error */}
          {error && (
            <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded text-red-700 flex items-start gap-3 text-sm">
              <AlertCircle size={20} className="shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            
            {/* Input Identifier */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Nomor Identitas / Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-gray-900"
                  placeholder="Username / NISN / NIP"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2 font-medium">
                *Siswa: NISN | Guru: NIP
              </p>
            </div>

            {/* Input Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Kata Sandi (Password)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  type="password"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-gray-900"
                  placeholder="Masukkan password Anda"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Tombol Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center items-center gap-2 py-3.5 px-4 mt-2 rounded-xl shadow-lg text-white font-bold text-lg transition-all ${
                isLoading 
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 hover:-translate-y-0.5 shadow-blue-200'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" /> Memproses...
                </>
              ) : (
                'Masuk ke Sistem'
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 py-4 text-center border-t border-gray-100">
          <p className="text-xs text-gray-500 font-medium">
            &copy; 2026 SIAKAD Terpadu - Hak Cipta Dilindungi
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;