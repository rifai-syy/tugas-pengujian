import React, { useState } from 'react';
import { Trash2, Edit, Plus, Save, X } from 'lucide-react';

const CrudManajemenSekolah = () => {
  const [grades, setGrades] = useState([
    { id: 1, name: 'Budi Utomo', subject: 'Matematika', score: 85 },
    { id: 2, name: 'Siti Aminah', subject: 'IPA', score: 65 },
  ]);

  const [form, setForm] = useState({ name: '', subject: '', score: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      setGrades(grades.map(grade => 
        grade.id === editId ? { ...form, id: editId } : grade
      ));
      setIsEditing(false);
      setEditId(null);
    } else {
      const newGrade = { ...form, id: Date.now() };
      setGrades([...grades, newGrade]);
    }
    setForm({ name: '', subject: '', score: '' });
  };

  const handleEdit = (grade) => {
    setIsEditing(true);
    setEditId(grade.id);
    setForm({ name: grade.name, subject: grade.subject, score: grade.score });
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditId(null);
    setForm({ name: '', subject: '', score: '' });
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Apakah Anda yakin ingin menghapus data ini?");
    if (confirmDelete) {
      setGrades(grades.filter(grade => grade.id !== id));
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-lg border border-gray-100">
      <div className="mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">Sistem Manajemen Nilai Siswa</h2>
        <p className="text-gray-500 text-sm mt-1">Kelola data nilai dan status kelulusan dengan mudah</p>
      </div>
      
      {/* Form Input */}
      <form onSubmit={handleSubmit} className="mb-6 flex flex-wrap gap-3 items-center bg-gray-50 p-5 rounded-lg border border-gray-200 shadow-sm">
        <input 
          name="name"
          placeholder="Nama Siswa" 
          required
          className="border border-gray-300 p-2.5 rounded-md flex-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          value={form.name}
          onChange={handleChange}
        />
        <input 
          name="subject"
          placeholder="Mata Pelajaran" 
          required
          className="border border-gray-300 p-2.5 rounded-md flex-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          value={form.subject}
          onChange={handleChange}
        />
        <input 
          name="score"
          type="number" 
          placeholder="Nilai" 
          required
          className="border border-gray-300 p-2.5 rounded-md w-24 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          value={form.score}
          onChange={handleChange}
        />
        
        {isEditing ? (
          <div className="flex gap-2">
            <button type="submit" className="bg-green-600 text-white px-4 py-2.5 rounded-md flex items-center gap-1 hover:bg-green-700 transition">
              <Save size={18} /> Simpan
            </button>
            <button type="button" onClick={cancelEdit} className="bg-gray-500 text-white px-4 py-2.5 rounded-md flex items-center gap-1 hover:bg-gray-600 transition">
              <X size={18} /> Batal
            </button>
          </div>
        ) : (
          <button type="submit" className="bg-blue-600 text-white px-4 py-2.5 rounded-md flex items-center gap-1 hover:bg-blue-700 transition font-medium">
            <Plus size={18} /> Tambah Data
          </button>
        )}
      </form>

      {/* Tabel Data */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="p-3 text-left font-semibold">Nama Siswa</th>
              <th className="p-3 text-left font-semibold">Mata Pelajaran</th>
              <th className="p-3 text-center font-semibold">Nilai</th>
              <th className="p-3 text-center font-semibold">Status</th>
              <th className="p-3 text-center font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {grades.length > 0 ? (
              grades.map((grade) => (
                <tr key={grade.id} className="hover:bg-blue-50 transition-colors">
                  <td className="p-3">{grade.name}</td>
                  <td className="p-3">{grade.subject}</td>
                  <td className="p-3 text-center font-bold text-gray-700">{grade.score}</td>
                  <td className="p-3 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium text-white shadow-sm ${grade.score >= 75 ? 'bg-green-500' : 'bg-red-500'}`}>
                      {grade.score >= 75 ? 'Lulus' : 'Remedial'}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex justify-center gap-3">
                      <button onClick={() => handleEdit(grade)} className="text-yellow-600 hover:text-yellow-700 p-1 bg-yellow-100 rounded-md hover:bg-yellow-200 transition" title="Edit Data">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDelete(grade.id)} className="text-red-600 hover:text-red-700 p-1 bg-red-100 rounded-md hover:bg-red-200 transition" title="Hapus Data">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-500 bg-gray-50">
                  Belum ada data nilai siswa yang dimasukkan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CrudManajemenSekolah;