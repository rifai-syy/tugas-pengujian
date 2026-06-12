import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  GraduationCap, 
  LayoutDashboard, 
  Users, 
  ShieldCheck, // Tambahkan icon ini
  LogOut, 
  Menu, 
  X,
  ChevronDown // Tambahkan icon ini
} from 'lucide-react';
import useStore from '../../store/useStore';

const NavbarKepsek = () => {
    const [isOpen, setIsOpen] = useState(false);
    const authUser = useStore((state) => state.authUser);
    const logout = useStore((state) => state.logout);
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="bg-[#03045E] text-white shadow-xl sticky top-0 z-50 border-b border-blue-900 font-sans">
            <div className="max-w-[90rem] mx-auto px-6 py-3 flex justify-between items-center">
                
                {/* Brand Logo */}
                <Link to="/kepsek/dashboard" className="flex items-center gap-3 hover:opacity-90 transition">
                    <div className="bg-amber-500 p-2 rounded-xl">
                        <GraduationCap size={24} className="text-white" />
                    </div>
                    <span className="font-bold text-2xl tracking-tight">Siakad <span className="text-amber-400 font-light">Pimpinan</span></span>
                </Link>

                {/* --- MENU NAVIGASI TENGAH (Desktop) --- */}
                <div className="hidden xl:flex items-center gap-1 text-sm font-medium">
                    <Link to="/kepsek/dashboard" className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${isActive('/kepsek/dashboard') ? 'bg-blue-900 text-white' : 'text-blue-200 hover:bg-blue-900/50 hover:text-white'}`}>
                        <LayoutDashboard size={18} /> Dashboard
                    </Link>

                    {/* Pembatas Visual */}
                    <div className="h-6 w-[1px] bg-blue-800 mx-2"></div>

                    <Link to="/kepsek/guru" className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${isActive('/kepsek/guru') ? 'bg-blue-900 text-white shadow-inner' : 'text-blue-200 hover:bg-blue-900/50 hover:text-white'}`}>
                        <Users size={18} /> Data Guru
                    </Link>

                    <Link to="/kepsek/siswa" className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${isActive('/kepsek/siswa') ? 'bg-blue-900 text-white shadow-inner' : 'text-blue-200 hover:bg-blue-900/50 hover:text-white'}`}>
                        <GraduationCap size={18} /> Data Siswa
                    </Link>

                    <Link to="/kepsek/admin" className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${isActive('/kepsek/admin') ? 'bg-blue-900 text-white shadow-inner' : 'text-blue-200 hover:bg-blue-900/50 hover:text-white'}`}>
                        <ShieldCheck size={18} /> Staff Admin
                    </Link>
                </div>

                {/* --- PROFIL & LOGOUT --- */}
                <Link to="/kepsek/profil" className="flex items-center gap-3 cursor-pointer group hover:opacity-80 transition">
                    <div className="bg-amber-100 text-amber-700 font-bold rounded-full w-9 h-9 flex items-center justify-center uppercase overflow-hidden border-2 border-amber-400 shadow-sm">
                        {authUser?.foto ? (
                            <img src={authUser.foto} alt="Profil" className="w-full h-full object-cover" />
                        ) : (
                            authUser?.name?.substring(0, 2) || 'KS'
                        )}
                    </div>
                    <div className="hidden lg:flex flex-col items-start">
                        <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest leading-none mb-1">Kepala Sekolah</span>
                        <span className="text-sm font-bold text-white leading-none">{authUser?.name || 'Pimpinan'}</span>
                    </div>
                </Link>
                    
                    <button onClick={logout} className="p-2.5 rounded-xl bg-red-950/50 text-red-300 hover:bg-red-600 hover:text-white transition shadow-sm" title="Keluar">
                        <LogOut size={18} />
                    </button>

                    {/* Tombol Mobile Menu */}
                    <button onClick={() => setIsOpen(!isOpen)} className="xl:hidden p-2 text-blue-200 hover:bg-blue-900 rounded-lg transition">
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            
            {/* --- MENU MOBILE --- */}
            {isOpen && (
                <div className="xl:hidden bg-[#020246] border-t border-blue-900 p-4 space-y-2 animate-fade-in">
                    <Link to="/kepsek/dashboard" onClick={() => setIsOpen(false)} className={`block px-4 py-3 rounded-xl font-bold ${isActive('/kepsek/dashboard') ? 'bg-blue-600 text-white' : 'text-blue-200 hover:bg-blue-900'}`}>
                        Dashboard Eksekutif
                    </Link>
                    <Link to="/kepsek/guru" onClick={() => setIsOpen(false)} className={`block px-4 py-3 rounded-xl font-bold ${isActive('/kepsek/guru') ? 'bg-blue-600 text-white' : 'text-blue-200 hover:bg-blue-900'}`}>
                        Data Guru
                    </Link>
                    <Link to="/kepsek/siswa" onClick={() => setIsOpen(false)} className={`block px-4 py-3 rounded-xl font-bold ${isActive('/kepsek/siswa') ? 'bg-blue-600 text-white' : 'text-blue-200 hover:bg-blue-900'}`}>
                        Data Siswa
                    </Link>
                    <Link to="/kepsek/admin" onClick={() => setIsOpen(false)} className={`block px-4 py-3 rounded-xl font-bold ${isActive('/kepsek/admin') ? 'bg-blue-600 text-white' : 'text-blue-200 hover:bg-blue-900'}`}>
                        Staff Administrator
                    </Link>
                </div>
            )}
        </nav>
    );
};

export default NavbarKepsek;