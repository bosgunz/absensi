import React, { useState } from 'react';
import { 
  Search, 
  Download, 
  Printer, 
  Eye, 
  CheckCircle2, 
  AlertTriangle, 
  HeartPulse, 
  HelpCircle, 
  X, 
  Trash2, 
  Calendar,
  Filter,
  Users,
  Clock,
  Sparkles
} from 'lucide-react';
import { Student, AttendanceRecord, AttendanceStatus } from '../types/attendance';
import { getTodayDateString, getWitaFullDateString } from '../data/initialData';

interface AttendanceRecapTableProps {
  students: Student[];
  records: AttendanceRecord[];
  onDeleteRecord: (id: string) => void;
  onUpdateStatusManually: (student: Student, status: AttendanceStatus, keterangan: string) => void;
  onOpenAttendanceForm: () => void;
}

export const AttendanceRecapTable: React.FC<AttendanceRecapTableProps> = ({
  students,
  records,
  onDeleteRecord,
  onUpdateStatusManually,
  onOpenAttendanceForm
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedPhoto, setSelectedPhoto] = useState<{ url: string; name: string; timestamp?: string } | null>(null);
  const [manualModalStudent, setManualModalStudent] = useState<Student | null>(null);
  const [manualStatus, setManualStatus] = useState<AttendanceStatus>('Hadir');
  const [manualKeterangan, setManualKeterangan] = useState<string>('');

  const todayStr = getTodayDateString();

  // Combine student master list with attendance records
  const studentRows = students.map((student) => {
    const record = records.find(
      (r) => (r.studentId === student.id || r.studentName.toLowerCase() === student.nama.toLowerCase()) && r.tanggal === todayStr
    );
    return {
      student,
      record
    };
  });

  // Calculate statistics
  const totalStudents = students.length;
  const hadirCount = studentRows.filter((r) => r.record?.status === 'Hadir').length;
  const izinCount = studentRows.filter((r) => r.record?.status === 'Izin').length;
  const sakitCount = studentRows.filter((r) => r.record?.status === 'Sakit').length;
  const belumAbsenCount = studentRows.filter((r) => !r.record).length;
  const attendanceRate = totalStudents > 0 ? Math.round((hadirCount / totalStudents) * 100) : 0;

  // Filter rows
  const filteredRows = studentRows.filter(({ student, record }) => {
    const matchesSearch =
      student.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(student.noAbsen).includes(searchTerm) ||
      (record?.keterangan || '').toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === 'all') return true;
    if (statusFilter === 'belum_absen') return !record;
    return record?.status === statusFilter;
  });

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['No Absen', 'NISN', 'Nama Siswa', 'JK', 'Status Kehadiran', 'Waktu Input (WITA)', 'Waktu Foto Kamera', 'Keterangan Tambahan'];
    const rows = studentRows.map(({ student, record }) => [
      student.noAbsen,
      student.nisn,
      `"${student.nama}"`,
      student.jenisKelamin,
      record ? record.status : 'Belum Absen',
      record ? `${record.waktu} WITA` : '-',
      record?.timestampFoto ? `"${record.timestampFoto}"` : (record?.fotoWatermarkUrl ? 'Ada Bukti Foto' : '-'),
      record ? `"${record.keterangan}"` : '-'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Daftar_Hadir_PJJ_Kelas6_SDN001_SangattaSelatan_${todayStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSaveManualStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualModalStudent) return;
    onUpdateStatusManually(manualModalStudent, manualStatus, manualKeterangan);
    setManualModalStudent(null);
    setManualKeterangan('');
  };

  return (
    <div className="space-y-6">
      {/* Print-Only Official Header */}
      <div className="hidden print-only text-center pb-4 border-b-2 border-black mb-6">
        <h2 className="text-xl font-bold uppercase">Pemerintah Kabupaten Kutai Timur - Dinas Pendidikan</h2>
        <h1 className="text-2xl font-bold uppercase">SDN 001 Sangatta Selatan</h1>
        <p className="text-sm">Alamat: Sangatta Selatan, Kabupaten Kutai Timur, Kalimantan Timur</p>
        <p className="text-base font-bold mt-2">
          REKAP DAFTAR HADIR PEMBELAJARAN JARAK JAUH (PJJ) · KELAS 6
        </p>
        <p className="text-sm">
          Mata Pelajaran: Bahasa Indonesia · Hari/Tanggal: {getWitaFullDateString()} (Zona WITA)
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 no-print">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            Total Siswa
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-slate-900">{totalStudents}</span>
            <span className="text-[11px] text-slate-400">Kelas 6</span>
          </div>
        </div>

        <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 shadow-sm flex flex-col justify-between">
          <span className="text-xs text-emerald-800 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Hadir
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-emerald-700">{hadirCount}</span>
            <span className="text-[11px] text-emerald-600 font-medium">{attendanceRate}%</span>
          </div>
        </div>

        <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 shadow-sm flex flex-col justify-between">
          <span className="text-xs text-amber-800 font-semibold flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            Izin
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-amber-700">{izinCount}</span>
            <span className="text-[11px] text-amber-600">Siswa</span>
          </div>
        </div>

        <div className="bg-rose-50/70 p-4 rounded-2xl border border-rose-200 shadow-sm flex flex-col justify-between">
          <span className="text-xs text-rose-800 font-semibold flex items-center gap-1">
            <HeartPulse className="w-3.5 h-3.5 text-rose-600" />
            Sakit
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-rose-700">{sakitCount}</span>
            <span className="text-[11px] text-rose-600">Siswa</span>
          </div>
        </div>

        <div className="bg-slate-100 p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <span className="text-xs text-slate-700 font-semibold flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
            Belum Absen
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-slate-800">{belumAbsenCount}</span>
            <span className="text-[11px] text-slate-500">Siswa</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-orange-500 p-4 rounded-2xl text-white shadow-sm flex flex-col justify-between">
          <span className="text-xs text-amber-100 font-semibold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            Persentase
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono">{attendanceRate}%</span>
            <span className="text-[11px] text-amber-100 font-medium">Kehadiran</span>
          </div>
        </div>
      </div>

      {/* Control Bar: Search, Filters, and Export Buttons */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3 no-print">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari nama siswa, nomor absen, atau keterangan..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportCSV}
              className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-200"
              title="Unduh format tabel CSV / Excel"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span>Ekspor Excel/CSV</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-200"
              title="Cetak format laporan rekap kehadiran PJJ"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span>Cetak Laporan</span>
            </button>

            <button
              type="button"
              onClick={onOpenAttendanceForm}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold flex items-center gap-1.5 shadow transition-colors"
            >
              <span>+ Absen Siswa</span>
            </button>
          </div>
        </div>

        {/* Status filter tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 font-medium shrink-0 flex items-center gap-1 pr-1">
            <Filter className="w-3 h-3" /> Filter:
          </span>
          {[
            { id: 'all', label: `Semua (${totalStudents})` },
            { id: 'Hadir', label: `Hadir (${hadirCount})` },
            { id: 'Izin', label: `Izin (${izinCount})` },
            { id: 'Sakit', label: `Sakit (${sakitCount})` },
            { id: 'belum_absen', label: `Belum Absen (${belumAbsenCount})` }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all ${
                statusFilter === tab.id
                  ? 'bg-amber-500 text-white font-bold shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-slate-700">
            <thead className="bg-slate-100 text-slate-600 font-semibold uppercase text-[11px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4 w-12 text-center">No</th>
                <th className="py-3.5 px-4">Nama Siswa</th>
                <th className="py-3.5 px-3 text-center">Status</th>
                <th className="py-3.5 px-3">Waktu (WITA)</th>
                <th className="py-3.5 px-4">Keterangan Tambahan</th>
                <th className="py-3.5 px-4 text-center">Foto Kamera & Timestamp</th>
                <th className="py-3.5 px-3 text-center no-print">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400">
                    Tidak ditemukan data siswa dengan kriteria pencarian ini.
                  </td>
                </tr>
              ) : (
                filteredRows.map(({ student, record }) => {
                  const isHadir = record?.status === 'Hadir';
                  const isIzin = record?.status === 'Izin';
                  const isSakit = record?.status === 'Sakit';
                  const isBelum = !record;

                  return (
                    <tr
                      key={student.id}
                      className="hover:bg-amber-50/30 transition-colors group"
                    >
                      {/* No Absen */}
                      <td className="py-3 px-4 font-mono font-bold text-center text-slate-500">
                        {String(student.noAbsen).padStart(2, '0')}
                      </td>

                      {/* Nama Siswa */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{student.nama}</div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <span>NISN: {student.nisn}</span>
                          <span>·</span>
                          <span>{student.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</span>
                        </div>
                      </td>

                      {/* Status Kehadiran */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        {isHadir && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Hadir</span>
                          </span>
                        )}
                        {isIzin && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold border border-amber-200">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                            <span>Izin</span>
                          </span>
                        )}
                        {isSakit && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold border border-rose-200">
                            <HeartPulse className="w-3.5 h-3.5 text-rose-600" />
                            <span>Sakit</span>
                          </span>
                        )}
                        {isBelum && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-medium border border-slate-200">
                            <HelpCircle className="w-3.5 h-3.5" />
                            <span>Belum Absen</span>
                          </span>
                        )}
                      </td>

                      {/* Waktu Input */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        {record ? (
                          <div className="flex items-center gap-1 text-slate-700 font-mono text-xs">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>{record.waktu} WITA</span>
                          </div>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>

                      {/* Keterangan */}
                      <td className="py-3 px-4 max-w-xs">
                        {record?.keterangan ? (
                          <p className="text-xs text-slate-700 line-clamp-2 italic">
                            "{record.keterangan}"
                          </p>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>

                      {/* Foto Bukti Selfie Kamera */}
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        {record?.fotoWatermarkUrl ? (
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedPhoto({
                                url: record.fotoWatermarkUrl!,
                                name: student.nama,
                                timestamp: record.timestampFoto
                              })
                            }
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-amber-100 text-slate-700 text-xs font-medium border border-slate-300 group/btn transition-all"
                            title="Klik untuk melihat foto dan cap waktu kamera"
                          >
                            <img
                              src={record.fotoWatermarkUrl}
                              alt={student.nama}
                              className="w-7 h-7 rounded-lg object-cover border border-slate-300 group-hover/btn:scale-105 transition-transform"
                            />
                            <Eye className="w-3.5 h-3.5 text-amber-600" />
                            <span className="hidden sm:inline">Lihat Cap Waktu</span>
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400 italic">Tanpa Foto</span>
                        )}
                      </td>

                      {/* Aksi Guru */}
                      <td className="py-3 px-3 text-center no-print whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setManualModalStudent(student);
                              setManualStatus(record?.status || 'Hadir');
                              setManualKeterangan(record?.keterangan || '');
                            }}
                            className="p-1.5 text-xs text-amber-700 hover:bg-amber-100 rounded-lg transition-colors"
                            title="Edit atau Ubah Status Kehadiran"
                          >
                            Ubah
                          </button>

                          {record && (
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`Hapus catatan kehadiran untuk ${student.nama}?`)) {
                                  onDeleteRecord(record.id);
                                }
                              }}
                              className="p-1.5 text-xs text-rose-500 hover:bg-rose-100 rounded-lg transition-colors"
                              title="Hapus Catatan"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="bg-slate-50 px-4 py-3 border-t border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Menampilkan <strong>{filteredRows.length}</strong> dari <strong>{students.length}</strong> siswa kelas 6
          </span>
          <span className="font-mono text-slate-400">
            Zona Waktu: Asia/Makassar (WITA UTC+8)
          </span>
        </div>
      </div>

      {/* Photo Watermark Modal Preview */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative max-w-2xl w-full bg-slate-900 text-white rounded-3xl overflow-hidden shadow-2xl border border-slate-700">
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold">{selectedPhoto.name}</h3>
                <p className="text-xs text-amber-400 font-mono">
                  {selectedPhoto.timestamp || 'Foto Kehadiran dengan Cap Waktu Kamera'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-slate-950 flex items-center justify-center">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.name}
                className="max-h-[75vh] w-auto object-contain rounded-xl border border-slate-800 shadow-lg"
              />
            </div>

            <div className="p-4 bg-slate-900 border-t border-slate-800 text-center text-xs text-slate-400">
              Watermark dicetak langsung oleh sistem saat kamera siswa aktif untuk memastikan keaslian waktu absen.
            </div>
          </div>
        </div>
      )}

      {/* Manual Status Modal (For Teacher) */}
      {manualModalStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-amber-200 text-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-slate-100">
              <div>
                <h3 className="font-bold text-lg">Ubah Status Siswa</h3>
                <p className="text-xs text-slate-500">{manualModalStudent.nama} (No. {manualModalStudent.noAbsen})</p>
              </div>
              <button
                type="button"
                onClick={() => setManualModalStudent(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveManualStatus} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Pilih Status
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Hadir', 'Izin', 'Sakit'] as AttendanceStatus[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setManualStatus(st)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                        manualStatus === st
                          ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                          : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Keterangan Guru / Catatan
                </label>
                <textarea
                  rows={2}
                  value={manualKeterangan}
                  onChange={(e) => setManualKeterangan(e.target.value)}
                  placeholder="Catatan dari guru atau perbaikan keterangan..."
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow transition-colors"
                >
                  Simpan Perubahan
                </button>
                <button
                  type="button"
                  onClick={() => setManualModalStudent(null)}
                  className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold rounded-xl"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
