import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, RefreshCw, Upload, CheckCircle2, AlertCircle, Clock, MapPin, Sparkles, SwitchCamera } from 'lucide-react';
import { playCameraClickSound } from '../utils/audio';
import { getWitaFullDateString, getWitaTimeString } from '../data/initialData';

interface LiveCameraWithWatermarkProps {
  onPhotoCaptured: (photoBase64: string, timestampText: string) => void;
  existingPhotoUrl?: string;
  studentName?: string;
}

export const LiveCameraWithWatermark: React.FC<LiveCameraWithWatermarkProps> = ({
  onPhotoCaptured,
  existingPhotoUrl,
  studentName = 'Siswa Kelas 6'
}) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(existingPhotoUrl || null);
  const [capturedTimestamp, setCapturedTimestamp] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Stop camera stream safely
  const stopStream = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  }, [stream]);

  // Start camera stream
  const startCamera = async (mode: 'user' | 'environment' = facingMode) => {
    stopStream();
    setCameraError(null);
    setIsCameraActive(true);

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: mode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.warn('Gagal membuka kamera langsung:', err);
      setCameraError('Kamera tidak dapat diakses secara langsung. Kamu dapat menggunakan tombol "Unggah / Pilih Foto" di bawah.');
      setIsCameraActive(false);
    }
  };

  useEffect(() => {
    return () => {
      stopStream();
    };
  }, [stopStream]);

  // Handle switching camera between front and rear
  const handleToggleFacingMode = () => {
    const nextMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(nextMode);
    startCamera(nextMode);
  };

  // Burn watermark on an image using HTML5 Canvas
  const burnWatermarkOntoCanvas = (
    imageSource: CanvasImageSource,
    sourceWidth: number,
    sourceHeight: number,
    exactDate: Date
  ): { dataUrl: string; timestampText: string } => {
    const canvas = document.createElement('canvas');
    // Target resolution 800x600 for sharp look and fast storage
    const targetWidth = 800;
    const targetHeight = Math.round((sourceHeight / sourceWidth) * targetWidth);
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas context not available');

    // Draw base image (if front camera, mirror horizontally for natural selfie feel)
    ctx.save();
    if (isCameraActive && facingMode === 'user') {
      ctx.translate(targetWidth, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(imageSource, 0, 0, targetWidth, targetHeight);
    ctx.restore();

    // Timestamp texts
    const dateFormatted = getWitaFullDateString(exactDate);
    const timeFormatted = getWitaTimeString(exactDate);
    const timestampSummary = `${dateFormatted} - ${timeFormatted} WITA`;

    // Watermark Overlay: Dark tinted glass gradient at the bottom
    const bannerHeight = 110;
    const bannerY = targetHeight - bannerHeight;

    const gradient = ctx.createLinearGradient(0, bannerY, 0, targetHeight);
    gradient.addColorStop(0, 'rgba(15, 23, 42, 0.05)');
    gradient.addColorStop(0.3, 'rgba(15, 23, 42, 0.88)');
    gradient.addColorStop(1, 'rgba(15, 23, 42, 0.98)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, bannerY, targetWidth, bannerHeight);

    // Accent line (amber/gold)
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(0, bannerY + 2, targetWidth, 3);

    // Badge "VERIFIKASI WAKTU KAMERA"
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.arc(28, bannerY + 28, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = 'bold 15px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('BUKTI HADIR KAMERA REAL-TIME (WITA)', 44, bannerY + 33);

    // School and student info
    ctx.font = '13px sans-serif';
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText(`SDN 001 Sangatta Selatan · Kelas 6 · Bahasa Indonesia`, 44, bannerY + 54);

    // Large high-contrast Timestamp (The exact user requirement)
    ctx.font = 'bold 18px monospace';
    ctx.fillStyle = '#fef08a'; // bright yellow for high legibility
    ctx.fillText(`🕒 WAKTU FOTO: ${dateFormatted}, ${timeFormatted} WITA`, 24, bannerY + 82);

    // Location & Student name tag
    ctx.font = '12px sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(`📍 Sangatta Selatan, Kutai Timur · ${studentName}`, 24, bannerY + 101);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    return { dataUrl, timestampText: timestampSummary };
  };

  // Capture from live video stream
  const handleSnapPhoto = () => {
    if (!videoRef.current) return;
    setIsCapturing(true);
    playCameraClickSound();

    try {
      const video = videoRef.current;
      const width = video.videoWidth || 640;
      const height = video.videoHeight || 480;
      const now = new Date();

      const { dataUrl, timestampText } = burnWatermarkOntoCanvas(video, width, height, now);

      setCapturedPhoto(dataUrl);
      setCapturedTimestamp(timestampText);
      stopStream();
      setIsCameraActive(false);

      onPhotoCaptured(dataUrl, timestampText);
    } catch (err) {
      console.error('Error snapping photo:', err);
      setCameraError('Gagal mengambil foto dari kamera. Coba lagi atau unggah foto manual.');
    } finally {
      setIsCapturing(false);
    }
  };

  // Handle manual file upload with auto watermark
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        playCameraClickSound();
        const now = new Date();
        const { dataUrl, timestampText } = burnWatermarkOntoCanvas(img, img.width, img.height, now);
        setCapturedPhoto(dataUrl);
        setCapturedTimestamp(timestampText);
        stopStream();
        setIsCameraActive(false);
        onPhotoCaptured(dataUrl, timestampText);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleRetake = () => {
    setCapturedPhoto(null);
    setCapturedTimestamp(null);
    startCamera();
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-bold text-slate-800 flex items-center gap-1.5">
          <Camera className="w-4 h-4 text-amber-600" />
          <span>Foto Bukti Kehadiran (Dengan Cap Waktu Real-Time)</span>
          <span className="text-rose-500">*</span>
        </label>
        <span className="text-xs text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full font-semibold">
          WITA (UTC+8)
        </span>
      </div>

      <div className="border-2 border-dashed border-amber-300 rounded-2xl bg-amber-50/50 p-4 transition-all">
        {/* Case 1: Photo already captured */}
        {capturedPhoto ? (
          <div className="space-y-3 animate-in fade-in zoom-in-95 duration-200">
            <div className="relative rounded-xl overflow-hidden shadow-md border-2 border-emerald-400 bg-slate-900 group">
              <img
                src={capturedPhoto}
                alt="Bukti Kehadiran Siswa dengan Watermark Waktu"
                className="w-full max-h-[340px] object-contain mx-auto bg-slate-950"
              />
              <div className="absolute top-3 left-3 bg-emerald-600/90 text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Foto Berhasil Diberi Cap Waktu</span>
              </div>
            </div>

            {capturedTimestamp && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 flex items-center gap-2 text-xs text-emerald-800">
                <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>Waktu Pengambilan:</strong> {capturedTimestamp}
                </span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRetake}
                className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold rounded-xl flex items-center justify-center gap-2 border border-slate-300 transition-colors"
              >
                <RefreshCw className="w-4 h-4 text-slate-500" />
                <span>Foto Ulang Kamera 🔄</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 border border-slate-300 transition-colors"
                title="Pilih file foto dari galeri/perangkat"
              >
                <Upload className="w-4 h-4 text-slate-500" />
                <span className="hidden sm:inline">Ganti dari File</span>
              </button>
            </div>
          </div>
        ) : isCameraActive ? (
          /* Case 2: Camera active stream */
          <div className="space-y-3">
            <div className="relative rounded-xl overflow-hidden shadow-lg bg-black border-2 border-amber-400">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full max-h-[340px] object-cover mx-auto ${
                  facingMode === 'user' ? '-scale-x-100' : ''
                }`}
              />

              {/* Live Overlay Indicators */}
              <div className="absolute top-3 left-3 bg-red-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm animate-pulse">
                <span className="w-2 h-2 rounded-full bg-white" />
                <span>KAMERA AKTIF</span>
              </div>

              <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
                <MapPin className="w-3 h-3 text-amber-400" />
                <span>Sangatta Sel.</span>
              </div>

              <div className="absolute bottom-3 left-3 right-3 bg-slate-950/80 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-lg border border-slate-700/60 flex items-center justify-between">
                <span className="text-amber-300 font-mono text-[11px]">
                  ⏰ Cap waktu akan dicetak otomatis
                </span>
                <button
                  type="button"
                  onClick={handleToggleFacingMode}
                  className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-200 px-2 py-0.5 rounded flex items-center gap-1"
                >
                  <SwitchCamera className="w-3 h-3" />
                  <span>Putar Kamera</span>
                </button>
              </div>
            </div>

            {/* Snap button */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSnapPhoto}
                disabled={isCapturing}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 active:scale-[0.99] text-white font-bold text-sm sm:text-base rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
              >
                <Camera className="w-5 h-5 text-white" />
                <span>Jepret Foto Sekarang! 📸</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  stopStream();
                  setIsCameraActive(false);
                }}
                className="py-3 px-4 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-xl"
              >
                Batal
              </button>
            </div>
          </div>
        ) : (
          /* Case 3: Initial idle state */
          <div className="text-center py-6 px-4 space-y-3">
            <div className="w-14 h-14 mx-auto bg-amber-100 text-amber-600 rounded-full flex items-center justify-center shadow-inner">
              <Camera className="w-7 h-7" />
            </div>

            <div>
              <h4 className="text-base font-bold text-slate-800">
                Ambil Foto Kehadiran dengan Kamera Siswa
              </h4>
              <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
                Sistem akan secara otomatis menyematkan tanggal dan jam tepat (WITA) saat kamu berfoto untuk keaslian absensi.
              </p>
            </div>

            {cameraError && (
              <div className="bg-amber-100 border border-amber-300 text-amber-900 rounded-xl p-3 text-xs flex items-start gap-2 text-left">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Info Akses Kamera:</p>
                  <p>{cameraError}</p>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => startCamera('user')}
                className="w-full sm:w-auto py-2.5 px-5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white text-xs sm:text-sm font-bold rounded-xl shadow flex items-center justify-center gap-2 transition-all"
              >
                <Camera className="w-4 h-4" />
                <span>Buka Kamera Langsung 📷</span>
              </button>

              <span className="text-xs text-slate-400 font-medium">atau</span>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full sm:w-auto py-2.5 px-4 bg-white hover:bg-slate-50 active:scale-95 text-slate-700 text-xs sm:text-sm font-semibold rounded-xl border border-slate-300 shadow-sm flex items-center justify-center gap-2 transition-all"
              >
                <Upload className="w-4 h-4 text-slate-500" />
                <span>Pilih Foto dari Galeri</span>
              </button>
            </div>
          </div>
        )}

        {/* Hidden Native File Input (accepts camera direct capture on mobile browsers) */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="user"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 pl-1">
        <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
        <span>Tips: Pasang senyum terbaik dan pastikan pencahayaan ruanganmu terang ya!</span>
      </div>
    </div>
  );
};
