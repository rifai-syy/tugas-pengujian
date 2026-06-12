import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useStore from './store/useStore';
import Login from './components/Login';

// --- Import Komponen Admin ---
import NavbarAdmin from './components/admin/NavbarAdmin';
import DashboardAdmin from './components/admin/DashboardAdmin';
import ListSiswa from './components/admin/ListSiswa';
import ListGuru from './components/admin/ListGuru';
import ProfilAdmin from './components/admin/ProfilAdmin';
import KelolaAdmin from './components/admin/KelolaAdmin';
import KelolaKelas from './components/admin/KelolaKelas';
import KelolaMapel from './components/admin/KelolaMapel';
import KenaikanKelas from './components/admin/KenaikanKelas';
import KelolaKepsek from './components/admin/KelolaKepsek';

// --- Import Komponen Guru ---
import TeacherDashboard from './components/guru/Dashboard';
import NavbarGuru from './components/guru/NavbarGuru';
import ProfilGuru from './components/guru/ProfilGuru';
import DataSiswa from './components/guru/DataSiswa';
import InputNilai from './components/guru/InputNilai';

// --- Import Komponen Siswa ---
import DashboardSiswa from './components/siswa/DashboardSiswa';
import NavbarSiswa from './components/siswa/NavbarSiswa';
import KHS from './components/siswa/KHS';
import ProfilSiswa from './components/siswa/ProfilSiswa';

// --- Import Komponen Kepsek ---
import NavbarKepsek from './components/kepsek/NavbarKepsek';
import DashboardKepsek from './components/kepsek/DashboardKepsek';
import ViewData from './components/kepsek/ViewData';
import ProfilKepsek from './components/kepsek/ProfilKepsek';


function App() {
  const authUser = useStore((state) => state.authUser);

  // Jika belum login, selalu arahkan ke komponen Login
  if (!authUser) return <Login />;

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        
        {/* --- NAVBAR DINAMIS --- */}
        {authUser.role === 'admin' && <NavbarAdmin />}
        {authUser.role === 'guru' && <NavbarGuru />}
        {authUser.role === 'siswa' && <NavbarSiswa />}
        {authUser.role === 'kepsek' && <NavbarKepsek />}

        <main>
          <Routes>
            {/* =======================
                RUTE KHUSUS ADMIN 
            ======================= */}
            {authUser.role === 'admin' && (
              <>
                <Route path="/" element={<DashboardAdmin />} />
                <Route path="/admin/siswa" element={<ListSiswa />} />
                <Route path="/admin/guru" element={<ListGuru />} />
                <Route path="/admin/profil" element={<ProfilAdmin />} />
                <Route path="/admin/kelola-admin" element={<KelolaAdmin />} />
                <Route path="/admin/kelas" element={<KelolaKelas />} />
                <Route path="/admin/mapel" element={<KelolaMapel />} />
                <Route path="/admin/kenaikan-kelas" element={<KenaikanKelas />} />
                <Route path="/admin/kepsek" element={<KelolaKepsek />} />
              </>
            )}

            {/* =======================
                 RUTE KHUSUS GURU 
            ======================= */}
            {authUser.role === 'guru' && (
              <>
                <Route path="/" element={<Navigate to="/guru/dashboard" replace />} />
                <Route path="/guru/dashboard" element={<TeacherDashboard />} />
                <Route path="/guru/profil" element={<ProfilGuru />} />
                <Route path="/guru/siswa/:id_kelas" element={<DataSiswa />} />
                <Route path="/guru/input-nilai/:id_kelas" element={<InputNilai />} />
              </>
            )}

            {/* =======================
                 RUTE KHUSUS SISWA 
            ======================= */}
            {authUser.role === 'siswa' && (
              <>
                <Route path="/" element={<Navigate to="/siswa/dashboard" replace />} />
                <Route path="/siswa/dashboard" element={<DashboardSiswa />} />
                <Route path="/siswa/khs" element={<KHS />} />
                <Route path="/siswa/profil" element={<ProfilSiswa />} />
              </>
            )}

            {/* =======================
                 RUTE KHUSUS KEPSEK 
            ======================= */}
            {authUser.role === 'kepsek' && (
              <>
                <Route path="/" element={<Navigate to="/kepsek/dashboard" replace />} />
                <Route path="/kepsek/dashboard" element={<DashboardKepsek />} />
                <Route path="/kepsek/guru" element={<ViewData roleTitle="Guru" roleType="guru" />} />
                <Route path="/kepsek/siswa" element={<ViewData roleTitle="Siswa" roleType="siswa" />} />
                <Route path="/kepsek/admin" element={<ViewData roleTitle="Administrator" roleType="admin" />} />
                <Route path="/kepsek/profil" element={<ProfilKepsek />} />
              </>
            )}

            {/* FALLBACK: Jika rute tidak ditemukan atau role tidak sesuai */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;