import React from 'react';
import { BookOpen, Camera, Clock, CheckCircle, MapPin, Sparkles, Award, Phone } from 'lucide-react';

export const PjjInfoView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Hero Card */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 bg-amber-400/30 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3 border border-white/20">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Informasi Pembelajaran Jarak Jauh (PJJ)</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold font-fun text-white">
          Bahasa Indonesia Kelas 6
        </h2>
        <p className="text-amber-100 text-xs sm:text-sm mt-1 max-w-xl">
          SDN 001 Sangatta Selatan, Kabupaten Kutai Timur, Kalimantan Timur.
          Semangat belajar literasi dan kebanggaan berbahasa Indonesia dari rumah masing-masing!
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-5 border-t border-white/20 text-xs">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-200" />
            <span>Absensi Daring: 07.00 - 08.30 WITA</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-200" />
            <span>Zona Waktu: WITA (UTC+8)</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-200" />
            <span>Kurikulum Merdeka Kelas 6</span>
          </div>
        </div>
      </div>

      {/* Guide Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 font-bold flex items-center justify-center font-fun text-sm">
            1
          </div>
          <h3 className="font-bold text-sm text-slate-800">Pilih Nama & Status</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Pilih nomor absen dan namamu pada daftar siswa kelas 6. Tentukan status apakah <strong>Hadir</strong>, <strong>Izin</strong>, atau <strong>Sakit</strong>.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 font-bold flex items-center justify-center font-fun text-sm">
            2
          </div>
          <h3 className="font-bold text-sm text-slate-800">Jepret Foto Kamera</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Nyalakan kamera siswa dan berfoto selfie rapi dengan seragam/pakaian sopan. Sistem otomatis menyematkan tanggal dan jam tepat (WITA) di atas foto!
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 font-bold flex items-center justify-center font-fun text-sm">
            3
          </div>
          <h3 className="font-bold text-sm text-slate-800">Kirim & Dapat Tiket</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Tuliskan pesan atau pantun karyamu di kolom keterangan, lalu klik kirim! Kamu akan mendapatkan kartu bukti kehadiran digital.
          </p>
        </div>
      </div>

      {/* Materi Bahasa Indonesia Bulan Ini */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-amber-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <h3 className="font-bold text-lg text-slate-900 font-fun">
            Materi Pembelajaran Bahasa Indonesia Hari Ini
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
          <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/60 space-y-1.5">
            <span className="font-bold text-amber-900 block text-sm">
              1. Mengenal Ciri & Kaidah Pantun
            </span>
            <p>
              Pantun terdiri atas 4 baris: baris 1 dan 2 merupakan <em>sampiran</em>, sedangkan baris 3 dan 4 merupakan <em>isi</em>. Sajak akhir berima a-b-a-b.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/60 space-y-1.5">
            <span className="font-bold text-amber-900 block text-sm">
              2. Kosa Kata & Kearifan Lokal Kutai Timur
            </span>
            <p>
              Mempelajari ungkapan bahasa daerah dan cerita rakyat Sangatta Selatan untuk memperkaya wawasan kebahasaan dan rasa cinta tanah air.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
