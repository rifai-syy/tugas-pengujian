import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, GraduationCap, ShieldCheck, BookOpen, ArrowRight, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import useStore from '../../store/useStore';

const DashboardAdmin = () => {
  const authUser = useStore((state) => state.authUser);
  const [stats, setStats] = useState({ siswa: 0, guru: 0, admin: 0, kepsek: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/users', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const data = res.data;
        setStats({
          siswa: data.filter(u => u.role === 'siswa' && u.status_siswa === 'Aktif').length,
          guru: data.filter(u => u.role === 'guru').length,
          admin: data.filter(u => u.role === 'admin').length,
          kepsek: data.filter(u => u.role === 'kepsek').length, // Tambahkan hitungan Kepsek
        });
      } catch (error) {
        console.error("Gagal mengambil statistik", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="max-w-[90rem] mx-auto p-6 mt-4 space-y-8 animate-fade-in-up">

      {/* Header Selamat Datang */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6 bg-gradient-to-r from-blue-50 to-white">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Selamat datang, {authUser?.name}! 👋</h1>
          <p className="text-gray-600">Pusat Kendali SIAKAD EduSmart. Pilih menu di bawah untuk mengelola data akademik sekolah.</p>
        </div>
      </div>

      {/* Grid Menu Utama (Ubah ke grid-cols-4 untuk layar besar) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* Kartu Kelola Guru */}
        <div className="bg-white border-b-4 border-blue-600 rounded-3xl p-6 shadow-md hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 flex flex-col justify-between">
          <div>
            <div className="bg-blue-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
              <BookOpen size={28} className="text-blue-600 group-hover:text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-900">Data Guru</h3>
            <p className="text-gray-500 mb-6 text-xs h-8">Kelola identitas pengajar dan alokasi Mapel.</p>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Total Guru</p>
              <p className="text-2xl font-black text-blue-600">{stats.guru}</p>
            </div>
            <Link to="/admin/guru" className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-sm font-bold hover:bg-blue-600 hover:text-white transition-colors">
              Kelola <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Kartu Kelola Siswa */}
        <div className="bg-white border-b-4 border-green-500 rounded-3xl p-6 shadow-md hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 flex flex-col justify-between">
          <div>
            <div className="bg-green-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-500 transition-colors">
              <GraduationCap size={28} className="text-green-600 group-hover:text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-900">Data Siswa</h3>
            <p className="text-gray-500 mb-6 text-xs h-8">Pendaftaran NISN dan update kenaikan kelas.</p>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Siswa Aktif</p>
              <p className="text-2xl font-black text-green-600">{stats.siswa}</p>
            </div>
            <Link to="/admin/siswa" className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-xl text-sm font-bold hover:bg-green-600 hover:text-white transition-colors">
              Kelola <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Kartu Kelola Kepsek (BARU) */}
        <div className="bg-white border-b-4 border-amber-500 rounded-3xl p-6 shadow-md hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 flex flex-col justify-between">
          <div>
            <div className="bg-amber-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-amber-500 transition-colors">
              <ShieldAlert size={28} className="text-amber-600 group-hover:text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-900">Pimpinan</h3>
            <p className="text-gray-500 mb-6 text-xs h-8">Kelola akun Kepala Sekolah & Pimpinan.</p>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Total Pimpinan</p>
              <p className="text-2xl font-black text-amber-600">{stats.kepsek}</p>
            </div>
            <Link to="/admin/kepsek" className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-xl text-sm font-bold hover:bg-amber-500 hover:text-white transition-colors">
              Kelola <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Kartu Sistem IT */}
        <div className="bg-white border-b-4 border-yellow-500 rounded-3xl p-6 shadow-md hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 flex flex-col justify-between">
          <div>
            <div className="bg-yellow-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-yellow-500 transition-colors">
              <ShieldCheck size={28} className="text-yellow-600 group-hover:text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-900">Sistem IT</h3>
            <p className="text-gray-500 mb-6 text-xs h-8">Manajemen staff administrator & keamanan.</p>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Staff Admin</p>
              <p className="text-2xl font-black text-yellow-500">{stats.admin}</p>
            </div>
            <Link to="/admin/kelola-admin" className="flex items-center gap-2 px-4 py-2 bg-yellow-50 text-yellow-700 rounded-xl text-sm font-bold hover:bg-yellow-500 hover:text-white transition-colors">
              Kelola <ArrowRight size={16} />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardAdmin;