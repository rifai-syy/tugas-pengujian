import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, BookOpen, Calendar, CheckCircle, RefreshCw, AlertCircle } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

const InputNilai = () => {
    // Mengambil ID Kelas dari URL (misal: /guru/input-nilai/1)
    const { id_kelas } = useParams();

    // --- STATE ---
    const [mapelList, setMapelList] = useState([]);
    const [selectedMapel, setSelectedMapel] = useState("");
    const [selectedSemester, setSelectedSemester] = useState("Ganjil");
    
    const [siswaList, setSiswaList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // 1. Ambil daftar Mata Pelajaran saat komponen pertama kali dimuat
    useEffect(() => {
        const fetchMapel = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/mapel', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMapelList(response.data);
            } catch (error) {
                console.error("Gagal mengambil data mapel", error);
            }
        };
        fetchMapel();
    }, []);

    // 2. Ambil data Siswa & Nilai setiap kali Mapel atau Semester diganti
    useEffect(() => {
        if (!selectedMapel) return; // Jangan tarik data jika mapel belum dipilih

        const fetchSiswaDanNilai = async () => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(
                    `http://localhost:5000/api/nilai/kelas/${id_kelas}/mapel/${selectedMapel}?semester=${selectedSemester}`, 
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setSiswaList(response.data);
            } catch (error) {
                console.error("Gagal mengambil data nilai:", error);
                alert("Gagal memuat data siswa.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchSiswaDanNilai();
    }, [id_kelas, selectedMapel, selectedSemester]);


    // --- FUNGSI HANDLER (SPREADSHEET LOGIC) ---
    
    // Fungsi ini mengubah angka di state secara real-time saat guru mengetik
    const handleGradeChange = (id_siswa, field, value) => {
        // Validasi agar nilai tidak lebih dari 100 dan tidak kurang dari 0
        let numValue = parseInt(value) || 0;
        if (numValue > 100) numValue = 100;
        if (numValue < 0) numValue = 0;

        const newData = siswaList.map(siswa => {
            if (siswa.id_siswa === id_siswa) {
                return { ...siswa, [field]: numValue };
            }
            return siswa;
        });
        setSiswaList(newData);
    };

    // Fungsi untuk melempar semua data sekaligus (Bulk Insert) ke Backend
    const handleSimpanMassal = async () => {
        if (siswaList.length === 0) return alert("Tidak ada data siswa untuk disimpan.");
        
        setIsSaving(true);
        try {
            const token = localStorage.getItem('token');
            const payload = {
                id_kelas: parseInt(id_kelas),
                id_mapel: parseInt(selectedMapel),
                semester: selectedSemester,
                data_nilai: siswaList // Kirim seluruh array ke backend
            };

            await axios.post('http://localhost:5000/api/nilai/bulk', payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert("Bagus! Seluruh nilai berhasil disimpan permanen ke database.");
            
        } catch (error) {
            console.error("Gagal menyimpan massal:", error);
            alert("Terjadi kesalahan saat menyimpan nilai.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-[90rem] mx-auto p-6 mt-4 animate-fade-in-up">
            
            {/* --- HEADER --- */}
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <Link to="/guru/dashboard" className="text-blue-600 hover:text-blue-800 flex items-center gap-2 mb-2 font-medium transition-colors w-fit">
                        <ArrowLeft size={18} /> Kembali ke Pilih Kelas
                    </Link>
                    <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
                        Lembar Penilaian Siswa
                    </h1>
                    <p className="text-gray-500 mt-1">Input nilai secara massal. Sistem akan otomatis memperbarui data jika nilai sudah ada.</p>
                </div>
                
                {/* Tombol Simpan Utama */}
                {selectedMapel && (
                    <button 
                        onClick={handleSimpanMassal} disabled={isSaving || isLoading}
                        className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-md transition-all text-white ${
                            isSaving ? 'bg-blue-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                        }`}
                    >
                        {isSaving ? <RefreshCw size={20} className="animate-spin" /> : <Save size={20} />}
                        {isSaving ? 'Menyimpan...' : 'Simpan Semua Nilai'}
                    </button>
                )}
            </div>

            {/* --- FILTER PELAJARAN & SEMESTER --- */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col sm:flex-row gap-4 items-center">
                <div className="flex-1 w-full flex flex-col sm:flex-row gap-4">
                    
                    <div className="flex-1">
                        <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2"><BookOpen size={16} className="text-blue-500" /> Mata Pelajaran</label>
                        <select 
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                            value={selectedMapel} onChange={(e) => setSelectedMapel(e.target.value)}
                        >
                            <option value="" disabled>-- Pilih Mata Pelajaran --</option>
                            {mapelList.map(m => <option key={m.id} value={m.id}>{m.nama_mapel}</option>)}
                        </select>
                    </div>

                    <div className="w-full sm:w-1/3">
                        <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2"><Calendar size={16} className="text-amber-500" /> Semester</label>
                        <select 
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                            value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)}
                        >
                            <option value="Ganjil">Semester Ganjil</option>
                            <option value="Genap">Semester Genap</option>
                        </select>
                    </div>

                </div>
            </div>

            {/* --- AREA TABEL SPREADSHEET --- */}
            {!selectedMapel ? (
                <div className="bg-white border-2 border-dashed border-blue-200 rounded-3xl p-16 flex flex-col items-center justify-center text-center">
                    <BookOpen size={64} className="text-blue-200 mb-4" />
                    <h3 className="text-xl font-bold text-gray-700">Pilih Mata Pelajaran</h3>
                    <p className="text-gray-500 mt-2">Silakan pilih mata pelajaran di atas untuk mulai mengisi nilai siswa.</p>
                </div>
            ) : isLoading ? (
                <div className="bg-white rounded-3xl p-16 flex flex-col items-center justify-center">
                    <RefreshCw size={40} className="animate-spin text-blue-500 mb-4" />
                    <p className="font-semibold text-gray-500">Mempersiapkan lembar nilai...</p>
                </div>
            ) : siswaList.length === 0 ? (
                <div className="bg-orange-50 border border-orange-200 rounded-3xl p-16 flex flex-col items-center justify-center text-center">
                    <AlertCircle size={48} className="text-orange-400 mb-4" />
                    <h3 className="text-xl font-bold text-orange-800">Kelas Masih Kosong</h3>
                    <p className="text-orange-600 mt-2">Belum ada siswa yang ditugaskan ke kelas ini oleh Admin.</p>
                </div>
            ) : (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#03045E] text-white text-sm font-semibold uppercase tracking-wider">
                                    <th className="px-6 py-4 rounded-tl-2xl">Nama Siswa</th>
                                    <th className="px-6 py-4">NISN / L-P</th>
                                    <th className="px-6 py-4 text-center border-l border-blue-800 bg-blue-900/30">Nilai Harian</th>
                                    <th className="px-6 py-4 text-center border-l border-blue-800 bg-blue-900/30">Nilai UTS</th>
                                    <th className="px-6 py-4 text-center border-l border-blue-800 bg-blue-900/30">Nilai UAS</th>
                                    <th className="px-6 py-4 text-center border-l border-blue-800 rounded-tr-2xl">Rata-Rata</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {siswaList.map((siswa, index) => {
                                    // Hitung rata-rata secara real-time
                                    const rataRata = Math.round((siswa.nilai_harian + siswa.nilai_uts + siswa.nilai_uas) / 3);
                                    
                                    return (
                                        <tr key={siswa.id_siswa} className="hover:bg-blue-50/30 transition-colors">
                                            
                                            <td className="px-6 py-4">
                                                <p className="font-bold text-gray-900">{siswa.nama_siswa}</p>
                                            </td>
                                            
                                            <td className="px-6 py-4 font-mono text-sm text-gray-500">
                                                {siswa.nisn} <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded ml-2 font-sans font-bold">{siswa.jenis_kelamin === 'Laki-laki' ? 'L' : 'P'}</span>
                                            </td>

                                            {/* INPUT NILAI HARIAN */}
                                            <td className="px-4 py-3 bg-gray-50/50 border-l border-gray-100">
                                                <input 
                                                    type="number" min="0" max="100"
                                                    className="w-full px-3 py-2 text-center bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-bold text-blue-700 transition"
                                                    value={siswa.nilai_harian === 0 ? "" : siswa.nilai_harian}
                                                    placeholder="0"
                                                    onChange={(e) => handleGradeChange(siswa.id_siswa, 'nilai_harian', e.target.value)}
                                                />
                                            </td>

                                            {/* INPUT NILAI UTS */}
                                            <td className="px-4 py-3 bg-gray-50/50 border-l border-gray-100">
                                                <input 
                                                    type="number" min="0" max="100"
                                                    className="w-full px-3 py-2 text-center bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-bold text-blue-700 transition"
                                                    value={siswa.nilai_uts === 0 ? "" : siswa.nilai_uts}
                                                    placeholder="0"
                                                    onChange={(e) => handleGradeChange(siswa.id_siswa, 'nilai_uts', e.target.value)}
                                                />
                                            </td>

                                            {/* INPUT NILAI UAS */}
                                            <td className="px-4 py-3 bg-gray-50/50 border-l border-gray-100">
                                                <input 
                                                    type="number" min="0" max="100"
                                                    className="w-full px-3 py-2 text-center bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-bold text-blue-700 transition"
                                                    value={siswa.nilai_uas === 0 ? "" : siswa.nilai_uas}
                                                    placeholder="0"
                                                    onChange={(e) => handleGradeChange(siswa.id_siswa, 'nilai_uas', e.target.value)}
                                                />
                                            </td>

                                            {/* HASIL RATA-RATA */}
                                            <td className="px-6 py-4 text-center border-l border-gray-100">
                                                <span className={`inline-flex items-center justify-center w-12 h-12 rounded-full font-black text-lg ${
                                                    rataRata >= 75 ? 'bg-green-100 text-green-700' : 
                                                    rataRata >= 50 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                    {rataRata}
                                                </span>
                                            </td>

                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

        </div>
    );
};

export default InputNilai;