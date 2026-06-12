import React from 'react';
import { Link, useLocation } from 'react-router-dom';
// Tambahkan ShieldCheck ke dalam list import lucide-react
import { GraduationCap, Home, Users, BookOpen, LogOut, ShieldCheck } from 'lucide-react';
import useStore from '../../store/useStore';

const NavbarAdmin = () => {
  const authUser = useStore((state) => state.authUser);
  const logout = useStore((state) => state.logout);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-[#03045E] text-white shadow-xl sticky top-0 z-40 border-b border-blue-900">
      <div className="max-w-[90rem] mx-auto px-6 py-3 flex justify-between items-center">

        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition">
          <div className="bg-white p-2 rounded-xl shadow-inner">
            <GraduationCap size={24} className="text-[#03045E]" />
          </div>
          <span className="font-bold text-2xl tracking-tight">Siakad <span className="text-blue-300 font-light">Admin</span></span>
        </Link>

        {/* --- MENU NAVIGASI TENGAH (UPDATE DI SINI) --- */}
        <div className="hidden md:flex items-center gap-2 text-sm font-medium">
          <Link to="/" className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${isActive('/') ? 'bg-blue-900/80 text-white' : 'text-blue-200 hover:bg-blue-900/50 hover:text-white'}`}>
            <Home size={18} /> Dashboard
          </Link>

          <Link to="/admin/siswa" className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${isActive('/admin/siswa') ? 'bg-blue-900/80 text-white' : 'text-blue-200 hover:bg-blue-900/50 hover:text-white'}`}>
            <Users size={18} /> Kelola Siswa
          </Link>

          <Link to="/admin/guru" className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${isActive('/admin/guru') ? 'bg-blue-900/80 text-white' : 'text-blue-200 hover:bg-blue-900/50 hover:text-white'}`}>
            <BookOpen size={18} /> Kelola Guru
          </Link>

          {/* MENU BARU: KELOLA ADMIN */}
          <Link to="/admin/kelola-admin" className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${isActive('/admin/kelola-admin') ? 'bg-blue-900/80 text-white' : 'text-blue-200 hover:bg-blue-900/50 hover:text-white'}`}>
            <ShieldCheck size={18} /> Kelola Admin
          </Link>
        </div>

        <Link to="/admin/kelas" className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${isActive('/admin/kelas') ? 'bg-blue-900/80 text-white' : 'text-blue-200 hover:bg-blue-900/50 hover:text-white'}`}>
          <BookOpen size={18} /> Kelola Kelas
        </Link>

        <Link to="/admin/mapel" className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${isActive('/admin/mapel') ? 'bg-blue-900/80 text-white' : 'text-blue-200 hover:bg-blue-900/50 hover:text-white'}`}>
          <BookOpen size={18} /> Kelola Mapel
        </Link>

        {/* Profil & Logout */}
        <div className="flex items-center gap-4 border-l border-blue-800 pl-4">
          <Link to="/admin/profil" className="flex items-center gap-2 text-sm cursor-pointer hover:text-blue-200 transition group">
            <div className="bg-blue-200 text-blue-900 font-bold rounded-full w-8 h-8 flex items-center justify-center uppercase group-hover:bg-white transition-colors">
              {authUser?.name?.substring(0, 2) || 'AD'}
            </div>
            <span className="font-medium text-gray-100 hidden sm:block">{authUser?.name || 'Administrator'}</span>
          </Link>

          <button onClick={logout} className="p-2.5 rounded-xl bg-red-950/50 text-red-300 hover:bg-red-900 hover:text-white transition" title="Keluar">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavbarAdmin;