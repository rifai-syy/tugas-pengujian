import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GraduationCap, Home, BookOpen, LogOut, Menu, X } from 'lucide-react';
import useStore from '../../store/useStore';

const NavbarSiswa = () => {
    const [isOpen, setIsOpen] = useState(false);
    const authUser = useStore((state) => state.authUser);
    const logout = useStore((state) => state.logout);
    const location = useLocation();

    const isActive = (path) => location.pathname.startsWith(path);

    return (
        <nav className="bg-[#03045E] text-white shadow-xl sticky top-0 z-50 border-b border-blue-900 font-sans">
            <div className="max-w-[90rem] mx-auto px-6 py-3 flex justify-between items-center">

                {/* Brand Logo */}
                <Link to="/siswa/dashboard" className="flex items-center gap-3 hover:opacity-90 transition">
                    <div className="bg-white p-2 rounded-xl">
                        <GraduationCap size={24} className="text-[#03045E]" />
                    </div>
                    <span className="font-bold text-2xl tracking-tight">Siakad <span className="text-blue-300 font-light">Siswa</span></span>
                </Link>

                {/* --- MENU NAVIGASI TENGAH --- */}
                <div className="hidden md:flex items-center gap-2 text-sm font-medium">
                    <Link to="/siswa/dashboard" className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${location.pathname === '/siswa/dashboard' ? 'bg-blue-900/80 text-white' : 'text-blue-200 hover:bg-blue-900/50 hover:text-white'}`}>
                        <Home size={18} /> Dashboard
                    </Link>

                    <Link to="/siswa/khs" className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${isActive('/siswa/khs') ? 'bg-blue-900/80 text-white' : 'text-blue-200 hover:bg-blue-900/50 hover:text-white'}`}>
                        <BookOpen size={18} /> Nilai (KHS)
                    </Link>
                </div>

                {/* --- PROFIL & LOGOUT --- */}
                <div className="flex items-center gap-4 border-l border-blue-800 pl-4">
                    <Link to="/siswa/profil" className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition group">
                        <div className="bg-blue-200 text-blue-900 font-bold rounded-full w-9 h-9 flex items-center justify-center uppercase group-hover:bg-white transition-colors overflow-hidden">
                            {authUser?.foto ? (
                                <img src={authUser.foto} alt="Profil" className="w-full h-full object-cover" />
                            ) : (
                                authUser?.name?.substring(0, 2) || 'SW'
                            )}
                        </div>
                        <div className="hidden lg:flex flex-col items-start mr-2">
                            <span className="text-[10px] text-blue-300 font-bold uppercase tracking-widest leading-none mb-1">Peserta Didik</span>
                            <span className="text-sm font-bold text-white leading-none">{authUser?.name || 'Siswa'}</span>
                        </div>
                    </Link>

                    <button onClick={logout} className="p-2.5 rounded-xl bg-red-950/50 text-red-300 hover:bg-red-900 hover:text-white transition" title="Keluar">
                        <LogOut size={18} />
                    </button>
                    
                    <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 text-blue-200 hover:bg-blue-900 rounded-lg">
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* --- MENU MOBILE --- */}
            {isOpen && (
                <div className="md:hidden bg-blue-900/95 border-t border-blue-800 px-4 py-4 space-y-2 animate-fade-in">
                    <Link to="/siswa/dashboard" onClick={() => setIsOpen(false)} className={`block px-4 py-3 rounded-xl font-bold ${location.pathname === '/siswa/dashboard' ? 'bg-blue-800 text-white' : 'text-blue-200 hover:bg-blue-800'}`}>Dashboard</Link>
                    <Link to="/siswa/khs" onClick={() => setIsOpen(false)} className={`block px-4 py-3 rounded-xl font-bold ${isActive('/siswa/khs') ? 'bg-blue-800 text-white' : 'text-blue-200 hover:bg-blue-800'}`}>Nilai (KHS)</Link>
                    <Link to="/siswa/profil" onClick={() => setIsOpen(false)} className={`block px-4 py-3 rounded-xl font-bold ${isActive('/siswa/profil') ? 'bg-blue-800 text-white' : 'text-blue-200 hover:bg-blue-800'}`}>Pengaturan Profil</Link>
                </div>
            )}
        </nav>
    );
};

export default NavbarSiswa;