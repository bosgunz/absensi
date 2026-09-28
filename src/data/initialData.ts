import { Student, PantunItem, AttendanceRecord } from '../types/attendance';

export const INITIAL_STUDENTS: Student[] = [
  { id: 'std-01', noAbsen: 1, nama: 'Ahmad Fauzan Al-Ghifari', nisn: '0123456781', jenisKelamin: 'L' },
  { id: 'std-02', noAbsen: 2, nama: 'Alifah Nuraini Az-Zahra', nisn: '0123456782', jenisKelamin: 'P' },
  { id: 'std-03', noAbsen: 3, nama: 'Bayu Aditya Pratama', nisn: '0123456783', jenisKelamin: 'L' },
  { id: 'std-04', noAbsen: 4, nama: 'Cantika Maharani Putri', nisn: '0123456784', jenisKelamin: 'P' },
  { id: 'std-05', noAbsen: 5, nama: 'Daffa Rizky Ramadhan', nisn: '0123456785', jenisKelamin: 'L' },
  { id: 'std-06', noAbsen: 6, nama: 'Dinda Kirana Salsabila', nisn: '0123456786', jenisKelamin: 'P' },
  { id: 'std-07', noAbsen: 7, nama: 'Fajar Eka Saputra', nisn: '0123456787', jenisKelamin: 'L' },
  { id: 'std-08', noAbsen: 8, nama: 'Ghaida Khalila Putri', nisn: '0123456788', jenisKelamin: 'P' },
  { id: 'std-09', noAbsen: 9, nama: 'Hafiz Maulana Malik', nisn: '0123456789', jenisKelamin: 'L' },
  { id: 'std-10', noAbsen: 10, nama: 'Indah Permata Sari', nisn: '0123456790', jenisKelamin: 'P' },
  { id: 'std-11', noAbsen: 11, nama: 'Jovan Alexander Hutapea', nisn: '0123456791', jenisKelamin: 'L' },
  { id: 'std-12', noAbsen: 12, nama: 'Keysha Zahira Shofa', nisn: '0123456792', jenisKelamin: 'P' },
  { id: 'std-13', noAbsen: 13, nama: 'Muhammad Arka Maulana', nisn: '0123456793', jenisKelamin: 'L' },
  { id: 'std-14', noAbsen: 14, nama: 'Nabila Syakira Anwar', nisn: '0123456794', jenisKelamin: 'P' },
  { id: 'std-15', noAbsen: 15, nama: 'Naufal Raihan Al-Farizi', nisn: '0123456795', jenisKelamin: 'L' },
  { id: 'std-16', noAbsen: 16, nama: 'Nurul Fatimah Azzahro', nisn: '0123456796', jenisKelamin: 'P' },
  { id: 'std-17', noAbsen: 17, nama: 'Prasetyo Budi Santoso', nisn: '0123456797', jenisKelamin: 'L' },
  { id: 'std-18', noAbsen: 18, nama: 'Qonita Rahma Dani', nisn: '0123456798', jenisKelamin: 'P' },
  { id: 'std-19', noAbsen: 19, nama: 'Raffa Zhafran Al-Fatih', nisn: '0123456799', jenisKelamin: 'L' },
  { id: 'std-20', noAbsen: 20, nama: 'Rania Putri Andini', nisn: '0123456800', jenisKelamin: 'P' },
  { id: 'std-21', noAbsen: 21, nama: 'Rizky Kurniawan Pratama', nisn: '0123456801', jenisKelamin: 'L' },
  { id: 'std-22', noAbsen: 22, nama: 'Siti Aminah Zahra', nisn: '0123456802', jenisKelamin: 'P' },
  { id: 'std-23', noAbsen: 23, nama: 'Taufiq Hidayatullah', nisn: '0123456803', jenisKelamin: 'L' },
  { id: 'std-24', noAbsen: 24, nama: 'Tiara Citra Lestari', nisn: '0123456804', jenisKelamin: 'P' },
  { id: 'std-25', noAbsen: 25, nama: 'Wahyu Tri Wibowo', nisn: '0123456805', jenisKelamin: 'L' },
  { id: 'std-26', noAbsen: 26, nama: 'Yasmin Aulia Rachman', nisn: '0123456806', jenisKelamin: 'P' },
  { id: 'std-27', noAbsen: 27, nama: 'Zaidan Akmal Nugroho', nisn: '0123456807', jenisKelamin: 'L' },
  { id: 'std-28', noAbsen: 28, nama: 'Zaskia Nur Hafizah', nisn: '0123456808', jenisKelamin: 'P' },
];

export const PANTUN_COLLECTION: PantunItem[] = [
  {
    id: 1,
    judul: 'Pantun Semangat Sangatta Selatan',
    bait: [
      'Pergi ke pasar membeli mangga,',
      'Jangan lupa membeli ketan.',
      'Selamat pagi siswa kelas enam yang berharga,',
      'Mari belajar ceria di SDN 001 Sangatta Selatan!'
    ],
    tema: 'Semangat Pagi',
    makna: 'Menyambut siswa kelas 6 dengan penuh kehangatan agar riang gembira belajar PJJ hari ini.'
  },
  {
    id: 2,
    judul: 'Pantun Bahasa Indonesia Hebat',
    bait: [
      'Burung gelatik terbang melayang,',
      'Hinggap sebentar di dahan cemara.',
      'Bahasa Indonesia kita junjung dan sayang,',
      'Ayo absen dulu dengan riang gembira!'
    ],
    tema: 'Cinta Bahasa',
    makna: 'Mengajak siswa mencintai Bahasa Indonesia dan mengisi absensi dengan riang.'
  },
  {
    id: 3,
    judul: 'Pantun Sungai Sangatta',
    bait: [
      'Air mengalir di Sungai Sangatta,',
      'Bunga merekah di tepi taman.',
      'Rajinlah membaca merangkai kata,',
      'Kelak sukses tercapai wahai teman!'
    ],
    tema: 'Kearifan Lokal',
    makna: 'Mengingatkan pentingnya literasi membaca untuk meraih cita-cita masa depan.'
  },
  {
    id: 4,
    judul: 'Pantun Kamera Kehadiran',
    bait: [
      'Bunga melati harum mewangi,',
      'Disiram embun di waktu pagi.',
      'Nyalakan kamera pasang senyum berseri,',
      'Bukti hadirmu terekam rapi!'
    ],
    tema: 'Kamera Hadir',
    makna: 'Dorongan ceria untuk berfoto selfie dengan kamera sebagai tanda kehadiran.'
  },
  {
    id: 5,
    judul: 'Pantun Pantang Menyerah PJJ',
    bait: [
      'Ke Teluk Lombok memandang laut,',
      'Melihat ombak putih berkejaran.',
      'Walau belajar jarak jauh terpaut,',
      'Semangat kita takkan padam oleh keadaan!'
    ],
    tema: 'Semangat PJJ',
    makna: 'Jarak bukan halangan untuk terus berprestasi dan saling menyapa.'
  }
];

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Format WITA time (UTC+8: Sangatta Selatan / Kutai Timur)
export function getWitaTimeString(date = new Date()): string {
  return new Intl.DateTimeFormat('id-ID', {
    timeZone: 'Asia/Makassar',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(date);
}

export function getWitaFullDateString(date = new Date()): string {
  return new Intl.DateTimeFormat('id-ID', {
    timeZone: 'Asia/Makassar',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
}

// Generate realistic SVG photo avatar placeholder with watermark
export function createMockWatermarkedPhoto(name: string, dateStr: string, timeStr: string): string {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map(p => p[0])
    .join('');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#38bdf8" />
        <stop offset="100%" stop-color="#0284c7" />
      </linearGradient>
    </defs>
    <rect width="400" height="400" fill="url(#bg)" />
    <!-- Child Avatar silhouette -->
    <circle cx="200" cy="150" r="65" fill="#fef08a" />
    <path d="M120 300 C120 225, 280 225, 280 300 Z" fill="#f8fafc" />
    <text x="200" y="162" font-family="Arial, sans-serif" font-size="44" font-weight="bold" fill="#854d0e" text-anchor="middle">${initials}</text>
    <text x="200" y="275" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#0f172a" text-anchor="middle">${name.slice(0, 24)}</text>
    
    <!-- Watermark Banner -->
    <rect x="0" y="325" width="400" height="75" fill="rgba(15, 23, 42, 0.88)" />
    <circle cx="25" cy="350" r="5" fill="#22c55e" />
    <text x="38" y="354" font-family="Courier, monospace" font-size="13" font-weight="bold" fill="#f8fafc">SDN 001 SANGATTA SELATAN - KELAS 6</text>
    <text x="20" y="374" font-family="Courier, monospace" font-size="12" fill="#38bdf8">BAHASA INDONESIA PJJ</text>
    <text x="20" y="390" font-family="Courier, monospace" font-size="11" fill="#fef08a">WAKTU FOTO: ${dateStr}, ${timeStr} WITA</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const INITIAL_ATTENDANCE_RECORDS: AttendanceRecord[] = [
  {
    id: 'att-01',
    studentId: 'std-01',
    studentName: 'Ahmad Fauzan Al-Ghifari',
    noAbsen: 1,
    tanggal: getTodayDateString(),
    waktu: '07:30:15',
    zonaWaktu: 'WITA',
    status: 'Hadir',
    keterangan: 'Siap menyimak materi membaca puisi hari ini! Bismillah.',
    fotoWatermarkUrl: createMockWatermarkedPhoto('Ahmad Fauzan Al-Ghifari', '28/09/2026', '07:30:15'),
    timestampFoto: '28/09/2026, 07:30:15 WITA',
    mood: 'semangat'
  },
  {
    id: 'att-02',
    studentId: 'std-02',
    studentName: 'Alifah Nuraini Az-Zahra',
    noAbsen: 2,
    tanggal: getTodayDateString(),
    waktu: '07:35:40',
    zonaWaktu: 'WITA',
    status: 'Hadir',
    keterangan: 'Buku catatan Bahasa Indonesia dan kamus sudah siap di meja.',
    fotoWatermarkUrl: createMockWatermarkedPhoto('Alifah Nuraini Az-Zahra', '28/09/2026', '07:35:40'),
    timestampFoto: '28/09/2026, 07:35:40 WITA',
    mood: 'ceria'
  },
  {
    id: 'att-03',
    studentId: 'std-04',
    studentName: 'Cantika Maharani Putri',
    noAbsen: 4,
    tanggal: getTodayDateString(),
    waktu: '07:42:10',
    zonaWaktu: 'WITA',
    status: 'Hadir',
    keterangan: 'Sudah selesai membaca dongeng Malin Kundang kemarin sore.',
    fotoWatermarkUrl: createMockWatermarkedPhoto('Cantika Maharani Putri', '28/09/2026', '07:42:10'),
    timestampFoto: '28/09/2026, 07:42:10 WITA',
    mood: 'siap_baca'
  },
  {
    id: 'att-04',
    studentId: 'std-05',
    studentName: 'Daffa Rizky Ramadhan',
    noAbsen: 5,
    tanggal: getTodayDateString(),
    waktu: '07:45:22',
    zonaWaktu: 'WITA',
    status: 'Izin',
    keterangan: 'Izin mendampingi orang tua kontrol kesehatan di RSUD Kudungga.',
    mood: 'butuh_dukungan'
  },
  {
    id: 'att-05',
    studentId: 'std-06',
    studentName: 'Dinda Kirana Salsabila',
    noAbsen: 6,
    tanggal: getTodayDateString(),
    waktu: '07:48:05',
    zonaWaktu: 'WITA',
    status: 'Sakit',
    keterangan: 'Sedang demam dan batuk sejak semalam, izin istirahat.',
    mood: 'butuh_dukungan'
  },
  {
    id: 'att-06',
    studentId: 'std-07',
    studentName: 'Fajar Eka Saputra',
    noAbsen: 7,
    tanggal: getTodayDateString(),
    waktu: '07:50:33',
    zonaWaktu: 'WITA',
    status: 'Hadir',
    keterangan: 'Sinyal lancar, siap latihan menulis pantun nasihat.',
    fotoWatermarkUrl: createMockWatermarkedPhoto('Fajar Eka Saputra', '28/09/2026', '07:50:33'),
    timestampFoto: '28/09/2026, 07:50:33 WITA',
    mood: 'semangat'
  },
  {
    id: 'att-07',
    studentId: 'std-13',
    studentName: 'Muhammad Arka Maulana',
    noAbsen: 13,
    tanggal: getTodayDateString(),
    waktu: '07:55:18',
    zonaWaktu: 'WITA',
    status: 'Hadir',
    keterangan: 'Hadir bu guru, sudah siap dengan buku tema 6!',
    fotoWatermarkUrl: createMockWatermarkedPhoto('Muhammad Arka Maulana', '28/09/2026', '07:55:18'),
    timestampFoto: '28/09/2026, 07:55:18 WITA',
    mood: 'penasaran'
  }
];
