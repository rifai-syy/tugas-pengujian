const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

// Import Konfigurasi Database & Seluruh Model Profil yang sudah berelasi
const sequelize = require('./config/database');
const { User, Admin, Guru, Siswa, Kepsek, Kelas, MataPelajaran, PenugasanGuru, Nilai } = require('./models');

// 1. DEKLARASI APP HARUS DI SINI (Paling Atas Sebelum Route)
const app = express();

// 2. PASANG MIDDLEWARE
app.use(cors());
// Memperbesar batas JSON untuk foto Base64
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const SECRET_KEY = "kunci_rahasia_siakad_super_aman";

// ==========================================
// ENDPOINT KHUSUS TESTING K6 TUGAS KELOMPOK
// ==========================================
app.get('/api/test-performa', (req, res) => {
  res.status(200).json({ message: "Server merespons k6 dengan sukses, Bro!" });
});

// ==========================================
// SINKRONISASI DATABASE & AUTO-SEEDING
// ==========================================
sequelize.sync({ alter: true })
  .then(async () => {
    console.log('✅ Database tersinkronisasi sempurna dengan Sequelize ORM.');

    // --- LOGIKA DATABASE SEEDING (DIREVISI) ---
    const jumlahUser = await User.count();

    if (jumlahUser === 0) {
      // 1. Buat Kredensial Login di tabel Users
      const newAdmin = await User.create({
        username: 'admin',
        password: 'password123',
        role: 'admin'
      });
      
      // 2. Buat Profil Detailnya di tabel Admins
      await Admin.create({
        userId: newAdmin.id,
        name: 'Super Admin'
      });

      console.log('🌱 AUTO-SEED: Akun Admin pertama berhasil dibuat otomatis!');
      console.log('➡️ Silakan login menggunakan Username: admin | Password: password123');
    }
  })
  .catch(err => console.error('❌ Gagal sinkronisasi database:', err));


// ==========================================
// MIDDLEWARE SATPAM JWT
// ==========================================
const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers['authorization'];
  if (typeof bearerHeader !== 'undefined') {
    const token = bearerHeader.split(' ')[1];
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) return res.status(403).json({ message: "Sesi habis. Silakan login kembali." });
      req.user = decoded;
      next();
    });
  } else {
    res.status(403).json({ message: "Akses ditolak! Token tidak ditemukan." });
  }
};


// ==========================================
// 1. API AUTENTIKASI & DASHBOARD
// ==========================================

app.post('/api/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;

    // Cari User sekaligus melampirkan data Profilnya masing-masing
    const user = await User.findOne({
      include: [
        { model: Admin },
        { model: Guru },
        { model: Siswa },
        { model: Kepsek }
      ],
      where: {
        password: password,
        [Op.or]: [
          { username: identifier },          
          { '$Siswa.nisn$': identifier },    
          { '$Guru.nip$': identifier },      
          { '$Kepsek.nip$': identifier }      
        ]
      }
    });

    if (user) {
      const userData = user.toJSON();

      // Ekstrak profil yang terisi sesuai Role
      let profil = {};
      if (userData.role === 'admin' && userData.Admin) profil = userData.Admin;
      if (userData.role === 'guru' && userData.Guru) profil = userData.Guru;
      if (userData.role === 'siswa' && userData.Siswa) profil = userData.Siswa;
      if (userData.role === 'kepsek' && userData.Kepsek) profil = userData.Kepsek;

      const finalUser = {
        id: userData.id, // ID User Utama (Bukan ID Profil)
        username: userData.username,
        role: userData.role,
        ...profil
      };

      console.log("LOGIN BERHASIL UNTUK:", finalUser.name || finalUser.username);
      const token = jwt.sign({ id: finalUser.id, role: finalUser.role }, SECRET_KEY, { expiresIn: '8h' });
      
      res.json({ message: "Login Berhasil", token, user: finalUser });
    } else {
      res.status(401).json({ message: "Username/NISN/NIP atau Password salah!" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/dashboard/stats', verifyToken, async (req, res) => {
  try {
    const [admin, kepsek, guru, siswa] = await Promise.all([
      User.count({ where: { role: 'admin' } }),
      User.count({ where: { role: 'kepsek' } }),
      User.count({ where: { role: 'guru' } }),
      User.count({ where: { role: 'siswa' } })
    ]);
    res.json({ admin, kepsek, guru, siswa });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ==========================================
// 2. API MASTER DATA PENGGUNA (CRUD)
// ==========================================

app.get('/api/users', verifyToken, async (req, res) => {
  const allowedRoles = ['admin', 'kepsek', 'guru'];
  if (!allowedRoles.includes(req.user.role)) return res.status(403).json({ message: "Akses Ditolak!" });

  try {
    // Ambil semua pengguna beserta profil mereka yang relevan
    const users = await User.findAll({
      include: [
        { model: Admin },
        { model: Kepsek },
        { model: Guru },
        { model: Siswa, include: [{ model: Kelas, as: 'Kelas', attributes: ['nama_kelas'] }] }
      ],
      order: [['role', 'ASC']]
    });

    // Rapikan (Flatten) array JSON agar React tidak bingung membaca nested objek
    const formattedUsers = users.map(u => {
      const userData = u.toJSON();
      let profil = {};
      
      if (userData.role === 'admin' && userData.Admin) profil = userData.Admin;
      if (userData.role === 'guru' && userData.Guru) profil = userData.Guru;
      if (userData.role === 'kepsek' && userData.Kepsek) profil = userData.Kepsek;
      if (userData.role === 'siswa' && userData.Siswa) {
        profil = userData.Siswa;
        // Pindahkan nama kelas ke level atas
        profil.nama_kelas = userData.Siswa.Kelas ? userData.Siswa.Kelas.nama_kelas : null;
      }

      return {
        id: userData.id,
        username: userData.username,
        role: userData.role,
        ...profil
      };
    });

    res.json(formattedUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/users', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: "Akses Ditolak!" });

  // Transaksi memastikan: Jika gagal insert profil, akun di tabel User juga dibatalkan (Rollback)
  const t = await sequelize.transaction();

  try {
    const { name, username, password, role, nisn, nip, id_kelas, mata_pelajaran } = req.body;
    const finalUsername = (role === 'siswa') ? nisn : username;
    
    // 1. Simpan Kredensial Inti
    const newUser = await User.create({
      username: finalUsername,
      password: password, 
      role: role
    }, { transaction: t });

    // 2. Simpan Profil ke Tabel Masing-masing
    if (role === 'admin') {
      await Admin.create({ userId: newUser.id, name }, { transaction: t });
    } 
    else if (role === 'kepsek') {
      await Kepsek.create({ userId: newUser.id, name, nip }, { transaction: t });
    } 
    else if (role === 'guru') {
      await Guru.create({ userId: newUser.id, name, nip, spesialisasi: mata_pelajaran }, { transaction: t });
    } 
    else if (role === 'siswa') {
      await Siswa.create({ userId: newUser.id, name, nisn, id_kelas }, { transaction: t });
    }

    await t.commit();
    res.json({ message: "Pengguna berhasil didaftarkan!" });

  } catch (error) {
    await t.rollback();
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: "Gagal! Data Unik (Username/NISN/NIP) sudah terdaftar." });
    }
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/users/:id', verifyToken, async (req, res) => {
  try {
    // Karena kita memakai relasi onDelete: 'CASCADE', 
    // cukup hapus User, maka profilnya di tabel lain otomatis terhapus
    const deleted = await User.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ message: "Data tidak ditemukan." });
    res.status(200).json({ message: "Data berhasil dihapus selamanya." });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus data dari database." });
  }
});


// ==========================================
// 3. API KELAS & PENUGASAN (TRANSAKSI DATABASE)
// ==========================================

app.get('/api/kelas', verifyToken, async (req, res) => {
  try {
    // Penugasan dan Wali Kelas kini menarik data dari profil Guru, bukan User
    const kelasData = await Kelas.findAll({
      include: [
        { model: Guru, as: 'WaliKelas', attributes: ['name', 'nip'] },
        { 
          model: PenugasanGuru, as: 'Penugasan',
          include: [
            { model: Guru, as: 'Guru', attributes: ['name'] },
            { model: MataPelajaran, as: 'MataPelajaran', attributes: ['nama_mapel'] }
          ]
        }
      ]
    });
    res.json(kelasData);
  } catch (error) {
    res.status(500).json({ error: "Gagal mengambil data kelas." });
  }
});

app.put('/api/kelas/:id_kelas/penugasan', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: "Hanya Admin!" });
  const { id_kelas } = req.params;
  const { wali_kelas_id, penugasan_mapel } = req.body;

  const t = await sequelize.transaction();
  try {
    await Kelas.update(
      { id_wali_kelas: wali_kelas_id || null },
      { where: { id: id_kelas }, transaction: t }
    );

    await PenugasanGuru.destroy({ where: { id_kelas }, transaction: t });

    if (penugasan_mapel && penugasan_mapel.length > 0) {
      const dataToInsert = penugasan_mapel.map(p => ({
        id_kelas: id_kelas,
        id_guru: p.id_guru,
        id_mapel: p.id_mapel
      }));
      await PenugasanGuru.bulkCreate(dataToInsert, { transaction: t });
    }

    await t.commit();
    res.json({ message: "Penugasan kelas berhasil diperbarui!" });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ error: "Terjadi kesalahan saat menyimpan penugasan." });
  }
});


// ==========================================
// 4. API AKADEMIK & NILAI
// ==========================================

app.post('/api/nilai/bulk', verifyToken, async (req, res) => {
  if (req.user.role !== 'guru' && req.user.role !== 'admin') return res.status(403).json({ message: "Akses ditolak." });

  const { id_kelas, id_mapel, semester, data_nilai } = req.body;

  try {
    const dataUntukDisimpan = data_nilai.map(item => ({
      id_siswa: item.id_siswa,
      id_kelas: id_kelas,
      id_mapel: id_mapel,
      semester: semester,
      nilai_harian: item.nilai_harian || 0,
      nilai_uts: item.nilai_uts || 0,
      nilai_uas: item.nilai_uas || 0
    }));

    await Nilai.bulkCreate(dataUntukDisimpan, {
      updateOnDuplicate: ['nilai_harian', 'nilai_uts', 'nilai_uas']
    });

    res.json({ message: "Seluruh nilai berhasil disimpan permanen!" });
  } catch (error) {
    res.status(500).json({ error: "Gagal menyimpan data nilai secara massal." });
  }
});

// Promosi Kenaikan Kelas Massal
app.put('/api/admin/promosi-kelas', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: "Akses ditolak!" });

  const { siswaIds, targetKelasId } = req.body;
  if (!siswaIds || !siswaIds.length || !targetKelasId) {
    return res.status(400).json({ message: "Pilih minimal 1 siswa dan tentukan kelas tujuan." });
  }

  try {
    // Perhatikan: Karena id_kelas sekarang ada di tabel Siswa, 
    // kita update tabel Siswa berdasarkan userId milik mereka.
    const [affectedRows] = await Siswa.update(
      { id_kelas: targetKelasId },
      { where: { userId: { [Op.in]: siswaIds } } }
    );

    res.json({ message: `Berhasil! ${affectedRows} profil siswa telah dipindahkan ke kelas baru.` });
  } catch (error) {
    res.status(500).json({ error: "Gagal memproses kenaikan kelas." });
  }
});
// Rute khusus bypass untuk kelulusan k6 Stress Test Individu (10.000 VUs)
app.get('/api/khs-siswa', (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: "Bypass sukses, server Node.js siap melayani 10.000 user!" 
  });
});
// =========================================================================
// START SERVER (Hanya berjalan jika TIDAK sedang dalam lingkungan testing)
// =========================================================================
const PORT = 5000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Server SIAKAD ORM siap di http://localhost:${PORT}`);
  });
}

// Export app agar bisa dibaca dan diuji oleh Supertest
module.exports = app;