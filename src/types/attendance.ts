export type AttendanceStatus = 'Hadir' | 'Izin' | 'Sakit' | 'Alpa';

export type StudentMood = 'semangat' | 'ceria' | 'siap_baca' | 'penasaran' | 'butuh_dukungan';

export interface Student {
  id: string;
  noAbsen: number;
  nama: string;
  nisn: string;
  jenisKelamin: 'L' | 'P';
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  noAbsen: number;
  tanggal: string; // YYYY-MM-DD
  waktu: string; // HH:mm:ss
  zonaWaktu: string; // WITA
  status: AttendanceStatus;
  keterangan: string;
  fotoWatermarkUrl?: string; // Base64 data with timestamp and school overlay
  timestampFoto?: string; // Captured camera timestamp text
  mood?: StudentMood;
}

export interface PantunItem {
  id: number;
  judul: string;
  bait: [string, string, string, string];
  tema: string;
  makna: string;
}
