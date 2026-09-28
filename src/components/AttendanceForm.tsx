import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  User, 
  CheckCircle, 
  AlertTriangle, 
  HeartPulse, 
  BookOpen, 
  Send, 
  Smile, 
  Sparkles,
  Download,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  FileCheck
} from 'lucide-react';
import { Student, AttendanceRecord, AttendanceStatus, StudentMood } from '../types/attendance';
import { LiveCameraWithWatermark } from './LiveCameraWithWatermark';
import { playSuccessChime } from '../utils/audio';
import { getTodayDateString, getWitaTimeString, getWitaFullDateString } from '../data/initialData';

interface AttendanceFormProps {
  students: Student[];
  onAttendanceSubmitted: (record: AttendanceRecord) => void;
  onViewRecap: () => void;
}

export const AttendanceForm: React.FC<AttendanceFormProps> = ({
  students,
  onAttendanceSubmitted,
  onViewRecap
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [customStudentName, setCustomStudentName] = useState<string>('');
  const [status, setStatus] = useState<AttendanceStatus>('Hadir');
  const [keterangan, setKeterangan] = useState<string>('');
  const [mood, setMood] = useState<StudentMood>('semangat');
  const [photoBase64, setPhotoBase64] = useState<string>('');
  const [photoTimestamp, setPhotoTimestamp] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);
  const [submittedRecord, setSubmittedRecord] = useState<AttendanceRecord | null>(null);

  // Determine active student
  const activeStudent = students.find((s) => s.id === selectedStudentId);
  const activeStudentName = activeStudent ? activeStudent.nama : customStudentName;

  const handlePhotoCaptured = (photo: string, timestamp: string) => {
    setPhotoBase64(photo);
    setPhotoTimestamp(timestamp);
    setFormError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validation
    if (!selectedStudentId && !customStudentName.trim()) {
      setFormError('Silakan pilih nama siswa dari daftar kelas 6 atau ketik namamu.');
      return;
    }

    if (status === 'Hadir' && !photoBase64) {
      setFormError('Untuk status Hadir, wajib menyertakan foto diri melalui kamera dengan cap waktu!');
      return;
    }

    const now = new Date();
    const timeStr = getWitaTimeString(now);

    const newRecord: AttendanceRecord = {
      id: `att-${Date.now()}`,
      studentId: selectedStudentId || `custom-${Date.now()}`,
      studentName: activeStudentName.trim(),
      noAbsen: activeStudent ? activeStudent.noAbsen : 99,
      tanggal: getTodayDateString(),
      waktu: timeStr,
      zonaWaktu: 'WITA',
      status,
      keterangan: keterangan.trim() || (status === 'Hadir' ? 'Hadir dan siap mengikuti materi Bahasa Indonesia.' : '-'),
      fotoWatermarkUrl: photoBase64 || undefined,
      timestampFoto: photoTimestamp || (photoBase64 ? `${getWitaFullDateString(now)}, ${timeStr} WITA` : undefined),
      mood
    };

    // Save record
    onAttendanceSubmitted(newRecord);
    setSubmittedRecord(newRecord);

    // Celebration
    playSuccessChime();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleResetForNext = () => {
    setSubmittedRecord(null);
    setSelectedStudentId('');
    setCustomStudentName('');
    setStatus('Hadir');
    setKeterangan('');
    setPhotoBase64('');
    setPhotoTimestamp('');
    setFormError(null);
  };

  // Ticket / Success View after submission
  if (submittedRecord) {
    return (
      <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-xl border-2 border-emerald-300 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-6 text-white text-center">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-3 border border-white/30 shadow-inner">
            <CheckCircle2 className="w-9 h-9 text-emerald-200" />
          </div>
          <h3 className="text-2xl font-bold font-fun">Absensi Berhasil Dicatat!</h3>
          <p className="text-emerald-100 text-xs sm:text-sm mt-1">
            Terima kasih sudah tepat waktu mengisi daftar hadir PJJ Bahasa Indonesia hari ini.
          </p>
        </div>

        <div className="p-6 space-y-5">
          {/* Digital Attendance Pass */}
          <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-4 text-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="font-bold text-slate-700">KARTU BUKTI KEHADIRAN PJJ</span>
              <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                {submittedRecord.status.toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-slate-700">
              <div>
                <span className="text-slate-400 block text-[10px]">NAMA SISWA:</span>
                <strong className="text-sm text-slate-900">{submittedRecord.studentName}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">NO. ABSEN / KELAS:</span>
                <span className="font-semibold text-slate-900">No. {submittedRecord.noAbsen} · Kelas 6</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">WAKTU INPUT:</span>
                <span className="font-semibold text-slate-900">{submittedRecord.waktu} WITA</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">MATA PELAJARAN:</span>
                <span className="font-semibold text-slate-900">Bahasa Indonesia</span>
              </div>
            </div>

            {submittedRecord.keterangan && (
              <div className="border-t border-slate-200 pt-2">
                <span className="text-slate-400 block text-[10px]">KETERANGAN TAMBAHAN:</span>
                <p className="text-slate-800 italic mt-0.5">"{submittedRecord.keterangan}"</p>
              </div>
            )}

            {submittedRecord.fotoWatermarkUrl && (
              <div className="border-t border-slate-200 pt-2">
                <span className="text-slate-400 block text-[10px] mb-1.5">FOTO BUKTI KAMERA DENGAN TIMESTAMP:</span>
                <img
                  src={submittedRecord.fotoWatermarkUrl}
                  alt="Bukti Kehadiran"
                  className="rounded-xl border border-slate-300 w-full max-h-56 object-contain bg-slate-900"
                />
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              onClick={onViewRecap}
              className="w-full sm:flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow transition-all flex items-center justify-center gap-2"
            >
              <FileCheck className="w-4 h-4" />
              <span>Lihat Rekap Seluruh Kelas</span>
            </button>

            <button
              type="button"
              onClick={handleResetForNext}
              className="w-full sm:w-auto py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-all"
            >
              Isi untuk Siswa Lain
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl border border-amber-200/80 overflow-hidden">
      {/* Form Header */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 px-6 py-5 text-white">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 bg-amber-400/30 backdrop-blur-md px-3 py-0.5 rounded-full text-xs font-semibold text-amber-100 border border-white/20">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Mata Pelajaran: Bahasa Indonesia</span>
          </div>

          <div className="text-xs bg-slate-900/30 px-2.5 py-1 rounded-full text-amber-200 flex items-center gap-1 font-mono">
            <Clock className="w-3.5 h-3.5" />
            <span>Zona WITA</span>
          </div>
        </div>

        <h2 className="text-2xl font-bold font-fun mt-2 text-white">
          Formulir Kehadiran Siswa PJJ
        </h2>
        <p className="text-amber-100 text-xs sm:text-sm mt-0.5">
          SDN 001 Sangatta Selatan · Kelas 6 · Kutai Timur
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
        {formError && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl p-4 text-xs sm:text-sm flex items-start gap-2.5 animate-in fade-in">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Periksa Kembali Data:</p>
              <p>{formError}</p>
            </div>
          </div>
        )}

        {/* 1. Nama Siswa */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <User className="w-4 h-4 text-amber-600" />
            <span>Nama Lengkap Siswa</span>
            <span className="text-rose-500">*</span>
          </label>

          <div className="grid grid-cols-1 gap-2.5">
            <select
              value={selectedStudentId}
              onChange={(e) => {
                setSelectedStudentId(e.target.value);
                if (e.target.value) setCustomStudentName('');
              }}
              className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm bg-white text-slate-800 transition-all font-medium"
            >
              <option value="">-- Pilih Namamu dari Daftar Kelas 6 --</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  No. {String(student.noAbsen).padStart(2, '0')} - {student.nama} ({student.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'})
                </option>
              ))}
            </select>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="h-[1px] flex-1 bg-slate-200" />
              <span>atau jika namamu belum ada di daftar</span>
              <span className="h-[1px] flex-1 bg-slate-200" />
            </div>

            <input
              type="text"
              placeholder="Ketik nama lengkap siswa baru di sini..."
              value={customStudentName}
              onChange={(e) => {
                setCustomStudentName(e.target.value);
                if (e.target.value) setSelectedStudentId('');
              }}
              className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm text-slate-800 placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* 2. Status Kehadiran */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-800">
            Status Kehadiran Hari Ini <span className="text-rose-500">*</span>
          </label>

          <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
            {/* Hadir */}
            <button
              type="button"
              onClick={() => setStatus('Hadir')}
              className={`p-3.5 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-1.5 text-center ${
                status === 'Hadir'
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-sm scale-[1.02]'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              <CheckCircle className={`w-6 h-6 ${status === 'Hadir' ? 'text-emerald-600' : 'text-slate-400'}`} />
              <span className="font-bold text-sm">Hadir</span>
              <span className="text-[10px] text-slate-500">Siap Belajar</span>
            </button>

            {/* Izin */}
            <button
              type="button"
              onClick={() => setStatus('Izin')}
              className={`p-3.5 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-1.5 text-center ${
                status === 'Izin'
                  ? 'bg-amber-50 border-amber-500 text-amber-800 shadow-sm scale-[1.02]'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              <AlertTriangle className={`w-6 h-6 ${status === 'Izin' ? 'text-amber-500' : 'text-slate-400'}`} />
              <span className="font-bold text-sm">Izin</span>
              <span className="text-[10px] text-slate-500">Ada Keperluan</span>
            </button>

            {/* Sakit */}
            <button
              type="button"
              onClick={() => setStatus('Sakit')}
              className={`p-3.5 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-1.5 text-center ${
                status === 'Sakit'
                  ? 'bg-rose-50 border-rose-500 text-rose-800 shadow-sm scale-[1.02]'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              <HeartPulse className={`w-6 h-6 ${status === 'Sakit' ? 'text-rose-500' : 'text-slate-400'}`} />
              <span className="font-bold text-sm">Sakit</span>
              <span className="text-[10px] text-slate-500">Istirahat</span>
            </button>
          </div>
        </div>

        {/* 3. Mood / Suasana Hati Siswa (Kid-friendly feature) */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1.5">
            <Smile className="w-3.5 h-3.5 text-amber-600" />
            <span>Bagaimana Semangatmu Hari Ini?</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'semangat', label: '🔥 Sangat Semangat' },
              { id: 'ceria', label: '😊 Ceria Riang' },
              { id: 'siap_baca', label: '📖 Siap Membaca Cerita' },
              { id: 'penasaran', label: '💡 Penasaran Materi' },
              { id: 'butuh_dukungan', label: '🌱 Kurang Enak Badan' }
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMood(m.id as StudentMood)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  mood === m.id
                    ? 'bg-amber-500 text-white shadow-sm font-semibold'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Kolom Keterangan Tambahan */}
        <div className="space-y-1.5">
          <label className="block text-sm font-bold text-slate-800">
            Keterangan Tambahan
          </label>
          <textarea
            rows={2}
            value={keterangan}
            onChange={(e) => setKeterangan(e.target.value)}
            placeholder={
              status === 'Hadir'
                ? 'Contoh: Buku tema 6 sudah siap, atau tulis 2 baris pantun karyamu...'
                : status === 'Izin'
                ? 'Jelaskan alasan izin tidak bisa mengikuti sesi daring hari ini...'
                : 'Sebutkan sakit yang dirasakan agar bapak/ibu guru dapat mendoakan...'
            }
            className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm text-slate-800 placeholder:text-slate-400"
          />
          <p className="text-[11px] text-slate-500">
            Boleh diisi kalimat sapaan, pesan untuk guru, atau alasan jika izin/sakit.
          </p>
        </div>

        {/* 5. Upload Foto dengan Cap Waktu Real-Time (Camera Watermark) */}
        <LiveCameraWithWatermark
          onPhotoCaptured={handlePhotoCaptured}
          existingPhotoUrl={photoBase64}
          studentName={activeStudentName || 'Siswa Kelas 6'}
        />

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-base shadow-xl shadow-orange-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2.5"
          >
            <Send className="w-5 h-5 text-white" />
            <span>Kirim Absensi Sekarang! ✍️</span>
          </button>
          <p className="text-center text-xs text-slate-500 mt-2">
            Data kehadiran akan langsung terkirim ke rekap bapak/ibu guru SDN 001 Sangatta Selatan.
          </p>
        </div>
      </form>
    </div>
  );
};
