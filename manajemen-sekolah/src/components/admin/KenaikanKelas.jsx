import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, ArrowRight, Save, ShieldCheck, AlertCircle, CheckCircle, XCircle, Eye, X } from 'lucide-react';

const KenaikanKelas = () => {
    const [kelasList, setKelasList] = useState([]);
    const [siswaList, setSiswaList] = useState([]);
    
    const [kelasAsal, setKelasAsal] = useState('');
    const [kelasTujuan, setKelasTujuan] = useState('');
    const [selectedSiswa, setSelectedSiswa] = useState([]);
    
    // State untuk Modal Transkrip Detail
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeSiswa, setActiveSiswa] = useState(null);
    const [detailNilai, setDetailNilai] = useState([]);
    const [isLoadingDetail, setIsLoadingDetail] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const token = localStorage.getItem('token');

    // --- FUNGSI PINTAR: Mengekstrak angka dari nama kelas (Contoh: "Kelas 2A" -> 2)
    const getGradeLevel = (namaKelas) => {
        if (!namaKelas) return 0;
        const match = namaKelas.match(/\d+/);
        return match ? parseInt(match[0]) : 0;
    };

    // 1. Ambil Data Kelas
    useEffect(() => {
        const fetchKelas = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/kelas', { headers: { Authorization: `Bearer ${token}` } });
                setKelasList(res.data);
            } catch (error) { console.error("Gagal memuat kelas"); }
        };
        fetchKelas();
    }, [token]);

    // 2. Ambil Rekap Siswa Cerdas
    useEffect(() => {
        const fetchSiswaRekap = async () => {
            if (!kelasAsal) { setSiswaList([]); return; }
            setIsLoading(true);
            try {
                const res = await axios.get(`http://localhost:5000/api/admin/rekap-kelas/${kelasAsal}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const dataSiswa = res.data;
                setSiswaList(dataSiswa);
                
                // AUTO-CHECK: Layak Naik = Mapel Merah 0 dan Ada Nilai
                const layakNaikIds = dataSiswa.filter(s => s.mapel_merah === 0 && s.total_mapel > 0).map(s => s.id);
                setSelectedSiswa(layakNaikIds);
            } catch (error) { console.error("Gagal memuat rekap siswa"); } 
            finally { setIsLoading(false); }
        };
        fetchSiswaRekap();
    }, [kelasAsal, token]);

    // --- BUKA MODAL DETAIL NILAI ---
    const openDetailModal = async (siswa) => {
        setActiveSiswa(siswa);
        setIsModalOpen(true);
        setIsLoadingDetail(true);
        try {
            const res = await axios.get(`http://localhost:5000/api/admin/nilai-siswa/${siswa.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDetailNilai(res.data);
        } catch (error) {
            console.error("Gagal menarik detail nilai");
        } finally {
            setIsLoadingDetail(false);
        }
    };

    // 3. Handle Checkbox & Eksekusi Kenaikan
    const handleCheck = (id) => setSelectedSiswa(prev => prev.includes(id) ? prev.filter(sId => sId !== id) : [...prev, id]);
    const handleCheckAll = () => selectedSiswa.length === siswaList.length ? setSelectedSiswa([]) : setSelectedSiswa(siswaList.map(s => s.id));

    const handleProses = async () => {
        if (selectedSiswa.length === 0) return alert("Pilih minimal 1 siswa!");
        if (!kelasTujuan) return alert("Pilih kelas tujuan terlebih dahulu!");
        if (!window.confirm(`Yakin menaikkan ${selectedSiswa.length} siswa? (Yg tidak dicentang otomatis tinggal kelas).`)) return;

        setIsLoading(true); setMessage('');
        try {
            const res = await axios.put('http://localhost:5000/api/admin/promosi-kelas', 
                { siswaIds: selectedSiswa, targetKelasId: parseInt(kelasTujuan) },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage(res.data.message);
            setSiswaList(prev => prev.filter(s => !selectedSiswa.includes(s.id)));
            setSelectedSiswa([]); setKelasTujuan('');
        } catch (error) { setMessage(error.response?.data?.message || "Terjadi kesalahan."); } 
        finally { setIsLoading(false); }
    };

    // --- LOGIKA FILTER KELAS TUJUAN (Hanya boleh naik) ---
    const kelasAsalObj = kelasList.find(k => k.id === parseInt(kelasAsal));
    const levelAsal = getGradeLevel(kelasAsalObj?.nama_kelas);

    const opsiKelasTujuan = kelasList.filter(k => {
        const levelTujuan = getGradeLevel(k.nama_kelas);
        // Kelas tujuan HARUS lebih tinggi dari kelas asal
        return levelTujuan > levelAsal; 
    });

    return (
        <div className="max-w-[90rem] mx-auto p-6 mt-4 animate-fade-in-up">
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
                    <Users size={32} className="text-indigo-600" />
                    Proses Kenaikan Kelas
                </h1>
                <p className="text-gray-500 mt-1">Evaluasi akademik mendalam dan pindahkan siswa ke jenjang berikutnya.</p>
            </div>

            {message && <div className="bg-green-50 text-green-800 p-4 rounded-xl mb-6 font-bold flex items-center gap-2"><ShieldCheck size={20} /> {message}</div>}

            {/* Panel Kontrol */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="w-full md:w-1/3">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Pilih Kelas Saat Ini</label>
                    <select value={kelasAsal} onChange={(e) => { setKelasAsal(e.target.value); setKelasTujuan(''); }} className="w-full p-3 bg-gray-50 border rounded-xl font-semibold outline-none">
                        <option value="">-- Pilih Kelas --</option>
                        {kelasList.map(k => <option key={k.id} value={k.id}>{k.nama_kelas}</option>)}
                    </select>
                </div>

                <div className="hidden md:flex flex-col items-center justify-center text-gray-300 px-4">
                    <ArrowRight size={32} />
                    <span className="text-xs font-bold uppercase mt-1 tracking-widest">Dipindah Ke</span>
                </div>

                <div className="w-full md:w-1/3">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Pilih Jenjang Selanjutnya</label>
                    <select value={kelasTujuan} onChange={(e) => setKelasTujuan(e.target.value)} disabled={!kelasAsal} className="w-full p-3 bg-indigo-50 border-indigo-200 text-indigo-900 font-bold rounded-xl outline-none disabled:opacity-50">
                        <option value="">-- Tentukan Kelas --</option>
                        {opsiKelasTujuan.length === 0 && kelasAsal && <option disabled>Tingkat Tertinggi (Pilih Lulus)</option>}
                        {opsiKelasTujuan.map(k => <option key={k.id} value={k.id}>{k.nama_kelas}</option>)}
                    </select>
                </div>

                <div className="w-full md:w-1/4 flex items-end h-full">
                    <button onClick={handleProses} disabled={isLoading || selectedSiswa.length === 0 || !kelasTujuan} className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${isLoading || selectedSiswa.length === 0 || !kelasTujuan ? 'bg-gray-200 text-gray-400' : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:-translate-y-0.5'}`}>
                        <Save size={20} /> Naik Kelas
                    </button>
                </div>
            </div>

            {/* Tabel Daftar Siswa */}
            {kelasAsal && (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-gray-50 border-b p-4 flex justify-between items-center">
                        <h3 className="font-bold text-gray-800">Daftar Evaluasi Siswa</h3>
                        <span className="text-sm bg-indigo-100 text-indigo-800 px-4 py-2 rounded-xl font-bold">Terpilih: {selectedSiswa.length} / {siswaList.length}</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-white border-b text-sm text-gray-500 uppercase tracking-wider">
                                    <th className="px-6 py-4 w-16 text-center"><input type="checkbox" checked={siswaList.length > 0 && selectedSiswa.length === siswaList.length} onChange={handleCheckAll} className="w-5 h-5 text-indigo-600 rounded" /></th>
                                    <th className="px-6 py-4">Siswa</th>
                                    <th className="px-6 py-4 text-center">Rata-Rata</th>
                                    <th className="px-6 py-4 text-center">Status Mapel</th>
                                    <th className="px-6 py-4">Rekomendasi</th>
                                    <th className="px-6 py-4 text-center">Transkrip</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {siswaList.map(siswa => {
                                    const isLayak = siswa.mapel_merah === 0 && siswa.total_mapel > 0;
                                    return (
                                        <tr key={siswa.id} className={selectedSiswa.includes(siswa.id) ? 'bg-indigo-50/30' : 'hover:bg-gray-50'}>
                                            <td className="px-6 py-4 text-center"><input type="checkbox" checked={selectedSiswa.includes(siswa.id)} onChange={() => handleCheck(siswa.id)} className="w-5 h-5 text-indigo-600 rounded cursor-pointer"/></td>
                                            <td className="px-6 py-4">
                                                <p className="font-bold text-gray-900">{siswa.name}</p>
                                                <p className="font-mono text-xs text-gray-500">{siswa.nisn}</p>
                                            </td>
                                            {/* RATA-RATA */}
                                            <td className="px-6 py-4 text-center font-black text-lg text-gray-800">{siswa.rata_rata || '-'}</td>
                                            <td className="px-6 py-4 text-center">
                                                {siswa.total_mapel === 0 ? <span className="text-gray-400 text-xs">Kosong</span> : 
                                                 siswa.mapel_merah > 0 ? <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold border border-red-200">{siswa.mapel_merah} Merah</span> : 
                                                 <span className="text-green-600 text-xs font-bold">Semua Tuntas</span>}
                                            </td>
                                            <td className="px-6 py-4">
                                                {isLayak ? <span className="inline-flex items-center gap-1.5 text-green-700 font-bold text-sm"><CheckCircle size={16}/> Layak Naik</span> :
                                                 <span className="inline-flex items-center gap-1.5 text-yellow-700 font-bold text-sm"><AlertCircle size={16}/> Tinjau Ulang</span>}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <button onClick={() => openDetailModal(siswa)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition" title="Lihat Detail Transkrip">
                                                    <Eye size={20} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ================================================== */}
            {/* MODAL TRANSKRIP DETAIL NILAI SISWA                 */}
            {/* ================================================== */}
            {isModalOpen && activeSiswa && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/70 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                        {/* Header Modal */}
                        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
                            <div>
                                <h3 className="text-xl font-extrabold text-gray-900 flex items-center gap-2"><Users size={24} className="text-blue-600"/> Transkrip Nilai Siswa</h3>
                                <p className="text-sm font-bold text-gray-500 mt-1">{activeSiswa.name} ({activeSiswa.nisn})</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 bg-gray-200 text-gray-600 rounded-full hover:bg-red-500 hover:text-white transition"><X size={20} /></button>
                        </div>
                        
                        {/* Body Modal (Tabel Nilai) - Bisa Di-Scroll */}
                        <div className="p-6 overflow-y-auto bg-white">
                            {isLoadingDetail ? (
                                <p className="text-center py-10 text-gray-500 font-medium">Mengambil data dari server...</p>
                            ) : detailNilai.length === 0 ? (
                                <div className="text-center py-12">
                                    <AlertCircle size={48} className="mx-auto text-gray-300 mb-3" />
                                    <p className="text-gray-500">Belum ada nilai sama sekali untuk siswa ini.</p>
                                </div>
                            ) : (
                                <table className="w-full text-left border border-gray-100 rounded-lg overflow-hidden">
                                    <thead>
                                        <tr className="bg-blue-50 text-blue-800 text-sm font-bold uppercase">
                                            <th className="px-4 py-3">Mata Pelajaran</th>
                                            <th className="px-4 py-3 text-center">Semester</th>
                                            <th className="px-4 py-3 text-center">KKM</th>
                                            <th className="px-4 py-3 text-center">Nilai Akhir</th>
                                            <th className="px-4 py-3 text-center">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 text-sm">
                                        {detailNilai.map((item, index) => {
                                            const na = Math.round(((item.nilai_harian||0)*0.2) + ((item.nilai_uts||0)*0.3) + ((item.nilai_uas||0)*0.5));
                                            const isTuntas = na >= (item.kkm || 75);
                                            return (
                                                <tr key={index} className="hover:bg-gray-50">
                                                    <td className="px-4 py-3 font-bold text-gray-800">{item.nama_mapel}</td>
                                                    <td className="px-4 py-3 text-center text-gray-500">{item.semester || 'Ganjil'}</td>
                                                    <td className="px-4 py-3 text-center font-mono text-gray-400">{item.kkm || 75}</td>
                                                    <td className={`px-4 py-3 text-center font-black text-lg ${isTuntas ? 'text-green-600' : 'text-red-600'}`}>{na}</td>
                                                    <td className="px-4 py-3 text-center">
                                                        {isTuntas ? <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">TUNTAS</span> 
                                                                  : <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold">REMEDIAL</span>}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        {/* Footer Modal (Kesimpulan) */}
                        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center shrink-0">
                            <div>
                                <span className="block text-xs font-bold text-gray-400 uppercase">Rata-Rata Keseluruhan</span>
                                <span className="text-2xl font-black text-gray-900">{activeSiswa.rata_rata || '0.0'}</span>
                            </div>
                            <div className="flex gap-3">
                                {activeSiswa.mapel_merah > 0 && (
                                    <span className="flex items-center gap-2 text-sm font-bold text-red-600 bg-red-50 px-4 py-2 rounded-xl border border-red-200">
                                        <AlertCircle size={18}/> Perlu Pembinaan
                                    </span>
                                )}
                                <button onClick={() => setIsModalOpen(false)} className="px-6 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition">Tutup Detail</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default KenaikanKelas;