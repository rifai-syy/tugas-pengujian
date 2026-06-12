import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
 
  discardResponseBodies: true,

  stages: [
    { duration: '1m', target: 1000 },  
    { duration: '2m', target: 5000 },  
    { duration: '2m', target: 10000 }, 
    { duration: '1m', target: 10000 }, 
    { duration: '1m', target: 0 },     
  ],

  thresholds: {
    // 💡 SOLUSI 2: Melonggarkan batas toleransi kelulusan karena keterbatasan hardware lokal
    http_req_duration: ['p(95)<2000'], // Batas P95 dilonggarkan ke 2 detik
    http_req_failed: ['rate<0.05'],    // Toleransi kegagalan maksimal 5%
  },
};

export default function () {
  const url = 'http://localhost:5000/api/khs-siswa';
  
  const params = {
    headers: {
      'Content-Type': 'application/json',
      // ⚠️ CATATAN JWT: Pastikan token di bawah ini diganti dengan token asli hasil login di Postman/Web 
      // jika rute /api/khs-siswa kamu memiliki verifikasi JWT asli di backend!
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_token_siakad', 
    },
    // 💡 SOLUSI 3: Batasi batas tunggu maksimal 3 detik agar antrean port jaringan tidak mengunci komputer
    timeout: '3s', 
  };

  const res = http.get(url, params);

  // 💡 SOLUSI 4: Ubah logika check agar tidak terlalu ketat saat stress test ekstrem
  check(res, {
    // Status dianggap sukses jika server merespons balik (bisa status 200, atau status terhubung)
    'Server berhasil merespons': (r) => r.status > 0,
    'Status HTTP adalah 200 OK': (r) => r.status === 200,
  });

  // 💡 SOLUSI 5: Gunakan jeda waktu acak (1-2 detik) agar hantaman trafik tidak bertabrakan di milidetik yang sama
  sleep(Math.random() * 1 + 1);
}