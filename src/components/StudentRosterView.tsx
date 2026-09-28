import React, { useState } from 'react';
import { Users, Plus, Trash2, Edit2, RotateCcw, Check, X, GraduationCap } from 'lucide-react';
import { Student } from '../types/attendance';
import { INITIAL_STUDENTS } from '../data/initialData';

interface StudentRosterViewProps {
  students: Student[];
  onUpdateStudents: (newStudents: Student[]) => void;
}

export const StudentRosterView: React.FC<StudentRosterViewProps> = ({
  students,
  onUpdateStudents
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newNama, setNewNama] = useState('');
  const [newNisn, setNewNisn] = useState('');
  const [newJk, setNewJk] = useState<'L' | 'P'>('L');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNama, setEditNama] = useState('');

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNama.trim()) return;

    const nextNoAbsen = students.length > 0 ? Math.max(...students.map((s) => s.noAbsen)) + 1 : 1;
    const newStudent: Student = {
      id: `std-${Date.now()}`,
      noAbsen: nextNoAbsen,
      nama: newNama.trim(),
      nisn: newNisn.trim() || `012345${Math.floor(1000 + Math.random() * 9000)}`,
      jenisKelamin: newJk
    };

    onUpdateStudents([...students, newStudent]);
    setNewNama('');
    setNewNisn('');
    setIsAdding(false);
  };

  const handleDelete = (id: string, nama: string) => {
    if (confirm(`Hapus ${nama} dari daftar kelas 6?`)) {
      onUpdateStudents(students.filter((s) => s.id !== id));
    }
  };

  const handleStartEdit = (student: Student) => {
    setEditingId(student.id);
    setEditNama(student.nama);
  };

  const handleSaveEdit = (id: string) => {
    onUpdateStudents(
      students.map((s) => (s.id === id ? { ...s, nama: editNama.trim() || s.nama } : s))
    );
    setEditingId(null);
  };

  const handleResetToDefault = () => {
    if (confirm('Kembalikan daftar ke 28 siswa asli kelas 6 SDN 001 Sangatta Selatan?')) {
      onUpdateStudents(INITIAL_STUDENTS);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 text-xs font-semibold px-3 py-1 rounded-full mb-2">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Tahun Ajaran Aktif</span>
          </div>
          <h2 className="text-2xl font-bold font-fun text-slate-900">
            Daftar Siswa Kelas 6
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            SDN 001 Sangatta Selatan · Total <strong>{students.length}</strong> Siswa Terdaftar
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setIsAdding(!isAdding)}
            className="flex-1 sm:flex-initial py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Siswa</span>
          </button>

          <button
            type="button"
            onClick={handleResetToDefault}
            className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 flex items-center gap-1.5 transition-colors"
            title="Reset ke daftar 28 siswa bawaan"
          >
            <RotateCcw className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Reset Default</span>
          </button>
        </div>
      </div>

      {/* Add Student Form */}
      {isAdding && (
        <form
          onSubmit={handleAddStudent}
          className="bg-amber-50/80 border-2 border-dashed border-amber-300 rounded-2xl p-5 space-y-4 animate-in fade-in"
        >
          <h3 className="font-bold text-sm text-amber-900 flex items-center gap-2">
            <Plus className="w-4 h-4 text-amber-600" />
            <span>Tambah Siswa Baru ke Kelas 6</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Lengkap Siswa *
              </label>
              <input
                type="text"
                required
                value={newNama}
                onChange={(e) => setNewNama(e.target.value)}
                placeholder="Contoh: Muhammad Bintang Pratama"
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Jenis Kelamin
              </label>
              <select
                value={newJk}
                onChange={(e) => setNewJk(e.target.value as 'L' | 'P')}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 font-medium"
              >
                <option value="L">Laki-laki (L)</option>
                <option value="P">Perempuan (P)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="py-2 px-4 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs"
            >
              Simpan Siswa
            </button>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="py-2 px-3 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs rounded-xl"
            >
              Batal
            </button>
          </div>
        </form>
      )}

      {/* Grid of Students */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {students.map((student) => (
          <div
            key={student.id}
            className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-300 transition-all flex items-center justify-between gap-3 group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 font-mono font-bold text-sm flex items-center justify-center shrink-0">
                {String(student.noAbsen).padStart(2, '0')}
              </div>

              <div className="min-w-0">
                {editingId === student.id ? (
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={editNama}
                      onChange={(e) => setEditNama(e.target.value)}
                      className="p-1 text-xs border border-amber-400 rounded-lg w-full"
                    />
                    <button
                      type="button"
                      onClick={() => handleSaveEdit(student.id)}
                      className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="p-1 text-slate-400 hover:bg-slate-50 rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                      {student.nama}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      NISN: {student.nisn} · {student.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                    </p>
                  </>
                )}
              </div>
            </div>

            {editingId !== student.id && (
              <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => handleStartEdit(student)}
                  className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                  title="Ubah Nama"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(student.id, student.nama)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Hapus Siswa"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
