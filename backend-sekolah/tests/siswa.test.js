const request = require('supertest');
const app = require('../server'); 
const sequelize = require('../config/database');

describe('Regression Test Suite - CRUD Users/Siswa API', () => {
  let adminToken;
  let createdUserId;
  const testNisn = 'NISN-' + Math.floor(Math.random() * 10000000);

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ identifier: 'admin', password: 'password123' });
    adminToken = res.body.token;
  });

  afterAll(async () => {
    if (sequelize && typeof sequelize.close === 'function') {
      await sequelize.close();
    }
  });

  // Test 1: Happy Path - Berhasil mendaftarkan siswa baru
  it('POST /api/users -> harus berhasil menambahkan siswa baru jika data lengkap dan ber-token', async () => {
    const payload = { 
      name: 'Budi Utomo', 
      nisn: testNisn, 
      id_kelas: null, 
      role: 'siswa',
      password: 'passwordSiswa123'
    };
    const res = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(payload);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Pengguna berhasil didaftarkan!');
  });

  // Test 2: Edge Case - Menolak pendaftaran jika token JWT kosong
  it('POST /api/users -> harus menolak (403) jika request tidak melampirkan token authorization', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ name: 'Tanpa Token' });
    expect(res.statusCode).toBe(403);
  });

  // Test 3: Happy Path - Berhasil mengambil seluruh data pengguna
  it('GET /api/users -> harus mengembalikan array data pengguna dan status 200', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    const targetUser = res.body.find(u => u.username === testNisn);
    if (targetUser) createdUserId = targetUser.id;
  });

  // Test 4: Edge Case - Memastikan format header JSON
  it('GET /api/users -> harus memiliki content-type berformat JSON di dalam headernya', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.headers['content-type']).toMatch(/json/);
  });

  // Test 5: Edge Case - NISN duplikat
  it('POST /api/users -> harus memblokir (400) jika mendeteksi NISN duplikat di database', async () => {
    const payload = { name: 'Siswa Duplikat', nisn: testNisn, role: 'siswa', password: '123' };
    const res = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(payload);
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toContain('Gagal! Data Unik');
  });

  // Test 6: Edge Case - Password salah → 401
  it('POST /api/login -> harus me-return status 401 jika password user salah', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ identifier: 'admin', password: 'password_salah_bro' });
    expect(res.statusCode).toBe(401);
  });

  // Test 7: Edge Case - Dashboard tanpa token → 403
  it('GET /api/dashboard/stats -> harus menolak akses (403) jika token satpam kosong', async () => {
    const res = await request(app).get('/api/dashboard/stats');
    expect(res.statusCode).toBe(403);
  });

  // Test 8: Edge Case - Promosi kelas siswa kosong → 400
  it('PUT /api/admin/promosi-kelas -> harus me-return 400 jika array siswa kosong', async () => {
    const res = await request(app)
      .put('/api/admin/promosi-kelas')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ siswaIds: [], targetKelasId: 1 });
    expect(res.statusCode).toBe(400);
  });

  // Test 9: Edge Case - Nilai bulk tanpa token → 403
  it('POST /api/nilai/bulk -> harus me-return 403 jika diakses tanpa login', async () => {
    const res = await request(app).post('/api/nilai/bulk').send({});
    expect(res.statusCode).toBe(403);
  });

  // Test 10: Happy Path - Hapus user
  it('DELETE /api/users/:id -> harus sukses menghapus data user berdasarkan ID target', async () => {
    if (!createdUserId) {
      console.warn('SKIP: createdUserId tidak ditemukan.');
      return;
    }
    const res = await request(app)
      .delete(`/api/users/${createdUserId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Data berhasil dihapus selamanya.');
  });
});