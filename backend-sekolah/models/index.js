const User = require('./User');
const Admin = require('./Admin');
const Guru = require('./Guru');
const Siswa = require('./Siswa');
const Kepsek = require('./Kepsek');
const Kelas = require('./Kelas');
const MataPelajaran = require('./MataPelajaran');
const PenugasanGuru = require('./PenugasanGuru');
const Nilai = require('./Nilai');

// ==========================================
// 1. RELASI INTI: AUTENTIKASI KE PROFIL (One-to-One)
// ==========================================
User.hasOne(Admin, { foreignKey: 'userId', onDelete: 'CASCADE' });
Admin.belongsTo(User, { foreignKey: 'userId' });

User.hasOne(Guru, { foreignKey: 'userId', onDelete: 'CASCADE' });
Guru.belongsTo(User, { foreignKey: 'userId' });

User.hasOne(Siswa, { foreignKey: 'userId', onDelete: 'CASCADE' });
Siswa.belongsTo(User, { foreignKey: 'userId' });

User.hasOne(Kepsek, { foreignKey: 'userId', onDelete: 'CASCADE' });
Kepsek.belongsTo(User, { foreignKey: 'userId' });


// ==========================================
// 2. RELASI KELAS & SISWA (One-to-Many)
// ==========================================
// Satu kelas memiliki banyak siswa
Kelas.hasMany(Siswa, { foreignKey: 'id_kelas', as: 'DaftarSiswa' });
Siswa.belongsTo(Kelas, { foreignKey: 'id_kelas', as: 'Kelas' });


// ==========================================
// 3. RELASI KELAS & WALI KELAS (One-to-Many)
// ==========================================
// Satu guru bisa menjadi wali dari beberapa kelas (atau satu kelas)
Guru.hasMany(Kelas, { foreignKey: 'id_wali_kelas', as: 'KelasWali' });
Kelas.belongsTo(Guru, { foreignKey: 'id_wali_kelas', as: 'WaliKelas' });


// ==========================================
// 4. RELASI PENUGASAN GURU (Junction Table)
// ==========================================
PenugasanGuru.belongsTo(Kelas, { foreignKey: 'id_kelas' });
Kelas.hasMany(PenugasanGuru, { foreignKey: 'id_kelas', as: 'Penugasan' });

PenugasanGuru.belongsTo(Guru, { foreignKey: 'id_guru', as: 'Guru' });
Guru.hasMany(PenugasanGuru, { foreignKey: 'id_guru', as: 'Penugasan' });

PenugasanGuru.belongsTo(MataPelajaran, { foreignKey: 'id_mapel', as: 'MataPelajaran' });
MataPelajaran.hasMany(PenugasanGuru, { foreignKey: 'id_mapel' });


// ==========================================
// 5. RELASI NILAI
// ==========================================
Nilai.belongsTo(Siswa, { foreignKey: 'id_siswa', as: 'Siswa' });
Siswa.hasMany(Nilai, { foreignKey: 'id_siswa', as: 'DaftarNilai' });

Nilai.belongsTo(Kelas, { foreignKey: 'id_kelas', as: 'Kelas' });
Kelas.hasMany(Nilai, { foreignKey: 'id_kelas' });

Nilai.belongsTo(MataPelajaran, { foreignKey: 'id_mapel', as: 'MataPelajaran' });
MataPelajaran.hasMany(Nilai, { foreignKey: 'id_mapel' });


// ==========================================
// EXPORT SEMUA MODEL
// ==========================================
module.exports = {
  User,
  Admin,
  Guru,
  Siswa,
  Kepsek,
  Kelas,
  MataPelajaran,
  PenugasanGuru,
  Nilai
};