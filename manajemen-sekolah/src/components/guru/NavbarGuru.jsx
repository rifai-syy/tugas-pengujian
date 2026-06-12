import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GraduationCap, Home, Users, FileEdit, LogOut, Menu, X, ChevronDown } from 'lucide-react';
import axios from 'axios';
import useStore from '../../store/useStore';

const NavbarGuru = () => {
    const [isOpen, setIsOpen] = useState(false); // Mobile
    const [openDropdown, setOpenDropdown] = useState(null); // 'siswa' atau 'nilai'
    const [myClasses, setMyClasses] = useState([]);
    
    const authUser = useStore((state) => state.authUser);
    const logout = useStore((state) => state.logout);
    const location = useLocation();

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/guru/my-classes', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMyClasses(res.data);
            } catch (error) {
                console.error("Navbar gagal memuat kelas:", error);
            }
        };
        fetchClasses();
    }, []);

    const isActive = (path) => location.pathname.startsWith(path);

    return (
        <nav className="bg-[#03045E] text-white shadow-xl sticky top-0 z-50 border-b border-blue-900 font-sans">
            <div className="max-w-[90rem] mx-auto px-6 py-3 flex justify-between items-center">

                {/* Brand Logo */}
                <Link to="/guru/dashboard" className="flex items-center gap-3 hover:opacity-90 transition">
                    <div className="bg-white p-2 rounded-xl">
                        <GraduationCap size={24} className="text-[#03045E]" />
                    </div>
                    <span className="font-bold text-2xl tracking-tight">Siakad <span className="text-blue-300 font-light">Guru</span></span>
                </Link>

                {/* --- MENU NAVIGASI TENGAH --- */}
                <div className="hidden md:flex items-center gap-2 text-sm font-medium">
                    <Link to="/guru/dashboard" className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${location.pathname === '/guru/dashboard' ? 'bg-blue-900/80 text-white' : 'text-blue-200 hover:bg-blue-900/50 hover:text-white'}`}>
                        <Home size={18} /> Dashboard
                    </Link>

                    {/* DROPDOWN DATA SISWA */}
                    <div className="relative" onMouseEnter={() => setOpenDropdown('siswa')} onMouseLeave={() => setOpenDropdown(null)}>
                        <button className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${isActive('/guru/siswa') ? 'bg-blue-900/80 text-white' : 'text-blue-200 hover:bg-blue-900/50 hover:text-white'}`}>
                            <Users size={18} /> Data Siswa <ChevronDown size={14} className={`transition-transform ${openDropdown === 'siswa' ? 'rotate-180' : ''}`} />
                        </button>
                        {openDropdown === 'siswa' && (
                            <div className="absolute top-full left-0 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 animate-fade-in text-gray-800">
                                {myClasses.map((kelas) => (
                                    <Link key={kelas.id_kelas} to={`/guru/siswa/${kelas.id_kelas}`} className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-600 font-bold">Kelas {kelas.nama_kelas}</Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* DROPDOWN INPUT NILAI */}
                    <div className="relative" onMouseEnter={() => setOpenDropdown('nilai')} onMouseLeave={() => setOpenDropdown(null)}>
                        <button className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${isActive('/guru/input-nilai') ? 'bg-blue-900/80 text-white' : 'text-blue-200 hover:bg-blue-900/50 hover:text-white'}`}>
                            <FileEdit size={18} /> Input Nilai <ChevronDown size={14} className={`transition-transform ${openDropdown === 'nilai' ? 'rotate-180' : ''}`} />
                        </button>
                        {openDropdown === 'nilai' && (
                            <div className="absolute top-full left-0 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 animate-fade-in text-gray-800">
                                {myClasses.map((kelas) => (
                                    <Link key={kelas.id_kelas} to={`/guru/input-nilai/${kelas.id_kelas}`} className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-600 font-bold">Nilai Kelas {kelas.nama_kelas}</Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* --- PROFIL & LOGOUT --- */}
                <div className="flex items-center gap-4 border-l border-blue-800 pl-4">
                    
                    {/* Tombol Profil (Bisa Diklik & Desain Mirip Admin) */}
                    <Link to="/guru/profil" className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition group">
                        <div className="bg-blue-200 text-blue-900 font-bold rounded-full w-9 h-9 flex items-center justify-center uppercase group-hover:bg-white transition-colors">
                            {authUser?.name?.substring(0, 2) || 'GR'}
                        </div>
                        <div className="hidden lg:flex flex-col items-start mr-2">
                            <span className="text-[10px] text-blue-300 font-bold uppercase tracking-widest leading-none mb-1">Pendidik</span>
                            <span className="text-sm font-bold text-white leading-none">{authUser?.name || 'Guru'}</span>
                        </div>
                    </Link>

                    <button onClick={logout} className="p-2.5 rounded-xl bg-red-950/50 text-red-300 hover:bg-red-900 hover:text-white transition" title="Keluar">
                        <LogOut size={18} />
                    </button>
                    
                    <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 text-blue-200">
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default NavbarGuru;