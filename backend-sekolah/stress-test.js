import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 50 },  // Fase 1: Naik pelan ke 50 User
    { duration: '1m', target: 200 },  // Fase 2: Puncak ekstrem ke 200 User!
    { duration: '30s', target: 0 },   // Fase 3: Turun kembali ke 0
  ],
};

export default function () {
  // Targetnya sama seperti load test tadi yang sudah terbukti sukses
  http.get('http://localhost:5000/api/Khs-siswa');
  sleep(1);
}