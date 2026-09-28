import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { PantunWelcomeModal } from './components/PantunWelcomeModal';
import { AttendanceForm } from './components/AttendanceForm';
import { AttendanceRecapTable } from './components/AttendanceRecapTable';
import { StudentRosterView } from './components/StudentRosterView';
import { PjjInfoView } from './components/PjjInfoView';
import { Student, AttendanceRecord, AttendanceStatus } from './types/attendance';
import { 
  INITIAL_STUDENTS, 
  INITIAL_ATTENDANCE_RECORDS, 
  getTodayDateString, 
  getWitaTimeString, 
  getWitaFullDateString 
} from './data/initialData';
import { Sparkles, MapPin, School } from 'lucide-react';

const STORAGE_KEY_STUDENTS = 'pjj_sdn001_students_v1';
const STORAGE_KEY_ATTENDANCE = 'pjj_sdn001_attendance_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<'form' | 'rekap' | 'students' | 'info'>('form');
  const [isPantunOpen, setIsPantunOpen] = useState<boolean>(true); // Opens by default on first load as requested

  // Load students from localStorage or initial
  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STUDENTS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_STUDENTS;
  });

  // Load attendance records from localStorage or initial
  const [records, setRecords] = useState<AttendanceRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ATTENDANCE);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_ATTENDANCE_RECORDS;
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(students));
    } catch {
      // ignore
    }
  }, [students]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ATTENDANCE, JSON.stringify(records));
    } catch {
      // ignore
    }
  }, [records]);

  // Handle new attendance record submitted
  const handleAttendanceSubmitted = (newRecord: AttendanceRecord) => {
    setRecords((prev) => {
      // If student already has a record for today, update it; otherwise prepend
      const filtered = prev.filter(
        (r) =>
          !(
            (r.studentId === newRecord.studentId || r.studentName.toLowerCase() === newRecord.studentName.toLowerCase()) &&
            r.tanggal === newRecord.tanggal
          )
      );
      return [newRecord, ...filtered];
    });
  };

  // Delete attendance record
  const handleDeleteRecord = (id: string) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
  };

  // Teacher manual override status
  const handleUpdateStatusManually = (
    student: Student,
    status: AttendanceStatus,
    keterangan: string
  ) => {
    const today = getTodayDateString();
    const existing = records.find(
      (r) => (r.studentId === student.id || r.studentName.toLowerCase() === student.nama.toLowerCase()) && r.tanggal === today
    );

    const now = new Date();
    const timeStr = getWitaTimeString(now);

    if (existing) {
      setRecords((prev) =>
        prev.map((r) =>
          r.id === existing.id
            ? {
                ...r,
                status,
                keterangan: keterangan || r.keterangan,
                waktu: timeStr
              }
            : r
        )
      );
    } else {
      const newRec: AttendanceRecord = {
        id: `manual-${Date.now()}`,
        studentId: student.id,
        studentName: student.nama,
        noAbsen: student.noAbsen,
        tanggal: today,
        waktu: timeStr,
        zonaWaktu: 'WITA',
        status,
        keterangan: keterangan || `Diubah manual oleh guru (${status})`,
        mood: 'semangat'
      };
      setRecords((prev) => [newRec, ...prev]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-amber-50/50 via-white to-amber-50/30 text-slate-800">
      {/* 1. Welcoming Pantun Popup Modal (User requirement: awali kalimat pantun ketika membuka link) */}
      <PantunWelcomeModal
        isOpen={isPantunOpen}
        onClose={() => setIsPantunOpen(false)}
      />

      {/* 2. Header adhering to Top Bar Contract */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenPantun={() => setIsPantunOpen(true)}
      />

      {/* 3. Hero Sub-bar with Live Date & Location */}
      <div className="bg-amber-100/60 border-b border-amber-200/60 py-2 px-4 no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 text-xs text-amber-900 font-medium">
          <div className="flex items-center gap-2">
            <School className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              Selamat Datang di Portal Presensi PJJ Kelas 6 · SDN 001 Sangatta Selatan
            </span>
          </div>

          <div className="flex items-center gap-3 text-amber-800 text-[11px]">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              <span>Sangatta Selatan, Kutai Timur (WITA)</span>
            </span>
            <span>·</span>
            <span>{getWitaFullDateString()}</span>
          </div>
        </div>
      </div>

      {/* 4. Main Body Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'form' && (
          <div className="animate-in fade-in duration-200">
            <AttendanceForm
              students={students}
              onAttendanceSubmitted={handleAttendanceSubmitted}
              onViewRecap={() => setActiveTab('rekap')}
            />
          </div>
        )}

        {activeTab === 'rekap' && (
          <div className="animate-in fade-in duration-200">
            <AttendanceRecapTable
              students={students}
              records={records}
              onDeleteRecord={handleDeleteRecord}
              onUpdateStatusManually={handleUpdateStatusManually}
              onOpenAttendanceForm={() => setActiveTab('form')}
            />
          </div>
        )}

        {activeTab === 'students' && (
          <div className="animate-in fade-in duration-200">
            <StudentRosterView
              students={students}
              onUpdateStudents={setStudents}
            />
          </div>
        )}

        {activeTab === 'info' && (
          <div className="animate-in fade-in duration-200">
            <PjjInfoView />
          </div>
        )}
      </main>

      {/* 5. Quiet Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-6 px-4 border-t border-slate-800 no-print mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <p className="font-semibold text-slate-200">
              SDN 001 Sangatta Selatan · Dinas Pendidikan Kab. Kutai Timur
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Sistem Presensi Daring PJJ Mata Pelajaran Bahasa Indonesia Kelas 6
            </p>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <button
              type="button"
              onClick={() => setIsPantunOpen(true)}
              className="text-amber-400 hover:text-amber-300 font-medium"
            >
              Baca Pantun Pembuka
            </button>
            <span>·</span>
            <span>Waktu Indonesia Tengah (WITA UTC+8)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
