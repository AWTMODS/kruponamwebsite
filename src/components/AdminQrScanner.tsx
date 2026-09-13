import React, { useState, useEffect, useRef } from 'react';
import {
  Camera,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Volume2,
  VolumeX,
  ShieldCheck,
} from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import { useTickets } from '../context/TicketContext';
import { soundManager } from '../utils/audio';
import type { Registration } from '../types';


interface ScanResult {
  code: 'VALID' | 'DUPLICATE' | 'INVALID';
  message: string;
  registration?: Registration;
  timestamp: string;
}

export const AdminQrScanner: React.FC = () => {
  const { scanPass, registrations } = useTickets();

  const [isScanning, setIsScanning] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [manualToken, setManualToken] = useState('');
  const [latestResult, setLatestResult] = useState<ScanResult | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([]);

  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const scannerContainerId = 'kruponam-reader-box';

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
        html5QrCodeRef.current.stop().catch(() => {});
      }
    };
  }, []);

  const handleProcessCode = (decodedText: string) => {
    const res = scanPass(decodedText);
    const resultObj: ScanResult = {
      code: res.code,
      message: res.message,
      registration: res.registration,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };

    setLatestResult(resultObj);
    setScanHistory((prev) => [resultObj, ...prev.slice(0, 19)]);

    if (audioEnabled) {
      if (res.code === 'VALID') {
        soundManager.playSuccess();
      } else if (res.code === 'DUPLICATE') {
        soundManager.playWarning();
      } else {
        soundManager.playError();
      }
    }
  };

  const startCamera = async () => {
    setCameraError(null);
    try {
      const qrScanner = new Html5Qrcode(scannerContainerId);
      html5QrCodeRef.current = qrScanner;

      await qrScanner.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          handleProcessCode(decodedText);
          // Pause briefly to prevent rapid duplicate triggers
          qrScanner.pause(true);
          setTimeout(() => {
            try {
              qrScanner.resume();
            } catch {}
          }, 2200);
        },
        () => {
          // Frame parse failure, ignore
        }
      );

      setIsScanning(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to access device camera';
      setCameraError(`${msg}. Please grant camera permissions or use the manual Token ID lookup below.`);
      setIsScanning(false);
    }
  };

  const stopCamera = async () => {
    if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
      try {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current.clear();
      } catch (err) {
        console.error('Error stopping QR scanner:', err);
      }
    }
    setIsScanning(false);
  };

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualToken.trim()) return;
    handleProcessCode(manualToken.trim());
    setManualToken('');
  };

  return (
    <div className="space-y-6">
      {/* Scanner Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-[#0D472B] text-white border border-[#D4AF37]/30 shadow-md">
        <div className="flex items-center gap-2">
          <Camera className="w-5 h-5 text-[#D4AF37]" />
          <div>
            <h4 className="font-['Cinzel'] font-bold text-base text-white">
              Gate Entry QR Scanner & Security Verification
            </h4>
            <p className="text-[11px] text-[#FAF5EB]/70">
              Live Camera Stream • Audio Alerts • Duplicate Prevention
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setAudioEnabled(!audioEnabled)}
            className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              audioEnabled ? 'bg-[#10B981]/20 text-[#FDE68A]' : 'bg-white/10 text-white/50'
            }`}
            title="Toggle Audio Feedback"
          >
            {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">{audioEnabled ? 'Sound On' : 'Muted'}</span>
          </button>

          {!isScanning ? (
            <button
              type="button"
              onClick={startCamera}
              className="px-4 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#FDE68A] text-[#072617] font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Camera className="w-4 h-4" />
              <span>Start Camera</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={stopCamera}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <span>Stop Camera</span>
            </button>
          )}
        </div>
      </div>

      {/* Camera Viewport & Manual Fallback Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Camera / Viewfinder Box (Col 7) */}
        <div className="lg:col-span-7 bg-black rounded-3xl overflow-hidden border-2 border-stone-300 relative min-h-[320px] flex flex-col items-center justify-center p-3">
          <div id={scannerContainerId} className="w-full h-full max-w-[420px]" />

          {!isScanning && (
            <div className="text-center p-6 space-y-3">
              <div className="w-16 h-16 rounded-full bg-white/10 text-[#D4AF37] flex items-center justify-center mx-auto">
                <Camera className="w-8 h-8" />
              </div>
              <p className="text-sm text-stone-300 font-medium">
                Camera is currently inactive.
              </p>
              <button
                type="button"
                onClick={startCamera}
                className="px-4 py-2 rounded-xl bg-[#0D472B] text-[#FDE68A] text-xs font-bold hover:bg-[#145E3A] transition-all"
              >
                Activate Device Camera
              </button>
            </div>
          )}

          {cameraError && (
            <div className="absolute inset-x-4 bottom-4 p-3 bg-red-900/90 text-white text-xs rounded-xl border border-red-500/40">
              {cameraError}
            </div>
          )}
        </div>

        {/* Manual Lookup & Quick Test Fallback (Col 5) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Manual Input Form */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs">
            <h5 className="text-xs uppercase tracking-wider font-bold text-stone-700 font-mono mb-2">
              Manual Token / USN Entry
            </h5>
            <form onSubmit={handleManualSearch} className="flex gap-2">
              <input
                type="text"
                placeholder="KRUP-2026-XXXX or 1KI22CS..."
                value={manualToken}
                onChange={(e) => setManualToken(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-[#D4AF37] text-xs font-mono uppercase bg-stone-50"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#0D472B] text-[#FDE68A] font-bold text-xs shrink-0 hover:bg-[#072617]"
              >
                Scan
              </button>
            </form>

            {/* Quick Test Demo Chips */}
            <div className="mt-3 pt-3 border-t border-stone-100">
              <span className="text-[10px] text-stone-400 block mb-1.5 uppercase font-bold">
                Quick Test Gate Passes:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {registrations.slice(0, 4).map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => handleProcessCode(r.tokenId)}
                    className="px-2 py-1 rounded bg-stone-100 hover:bg-[#D4AF37]/20 text-[10px] font-mono text-stone-700 border border-stone-200"
                    title={`Test scan for ${r.fullName}`}
                  >
                    {r.tokenId} ({r.status === 'Approved' ? 'Valid' : 'Pending'})
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Active Result Visual Feedback Banner */}
          {latestResult ? (
            <div
              className={`p-5 rounded-2xl border-2 shadow-lg transition-all animate-in zoom-in-95 duration-200 ${
                latestResult.code === 'VALID'
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-950'
                  : latestResult.code === 'DUPLICATE'
                  ? 'bg-amber-50 border-amber-500 text-amber-950'
                  : 'bg-red-50 border-red-500 text-red-950'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="shrink-0 mt-0.5">
                  {latestResult.code === 'VALID' ? (
                    <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                  ) : latestResult.code === 'DUPLICATE' ? (
                    <AlertTriangle className="w-7 h-7 text-amber-600 animate-bounce" />
                  ) : (
                    <XCircle className="w-7 h-7 text-red-600" />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        latestResult.code === 'VALID'
                          ? 'bg-emerald-200 text-emerald-900'
                          : latestResult.code === 'DUPLICATE'
                          ? 'bg-amber-200 text-amber-900'
                          : 'bg-red-200 text-red-900'
                      }`}
                    >
                      {latestResult.code}
                    </span>
                    <span className="text-xs text-stone-500 font-mono">
                      {latestResult.timestamp}
                    </span>
                  </div>

                  <p className="text-sm font-bold leading-tight">
                    {latestResult.message}
                  </p>

                  {latestResult.registration && (
                    <div className="pt-2 mt-2 border-t border-black/10 text-xs space-y-0.5">
                      <p><strong>Name:</strong> {latestResult.registration.fullName}</p>
                      <p><strong>USN:</strong> <span className="font-mono">{latestResult.registration.usn}</span></p>
                      <p><strong>Token:</strong> <span className="font-mono">{latestResult.registration.tokenId}</span></p>
                      <p><strong>Dept:</strong> {latestResult.registration.department}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 text-center text-stone-500 text-xs">
              <ShieldCheck className="w-8 h-8 text-stone-300 mx-auto mb-2" />
              <span>Awaiting gate scan. Point camera at student pass QR or enter Token ID above.</span>
            </div>
          )}
        </div>
      </div>

      {/* Gate Entry History Table */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <h5 className="font-['Cinzel'] font-bold text-sm text-[#0D472B]">
            Recent Gate Entry Scan Log
          </h5>
          <span className="text-xs text-stone-400">
            {scanHistory.length} Scans recorded this session
          </span>
        </div>

        {scanHistory.length === 0 ? (
          <p className="text-xs text-stone-400 py-3 text-center">No scans recorded yet.</p>
        ) : (
          <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
            {scanHistory.map((h, i) => (
              <div
                key={i}
                className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-stone-50 border border-stone-100"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      h.code === 'VALID'
                        ? 'bg-emerald-500'
                        : h.code === 'DUPLICATE'
                        ? 'bg-amber-500'
                        : 'bg-red-500'
                    }`}
                  />
                  <span className="font-mono font-bold text-stone-800">
                    {h.registration?.tokenId || 'UNKNOWN'}
                  </span>
                  <span className="text-stone-600 truncate max-w-[140px] sm:max-w-none">
                    {h.registration?.fullName || h.message}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      h.code === 'VALID'
                        ? 'bg-emerald-100 text-emerald-800'
                        : h.code === 'DUPLICATE'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {h.code}
                  </span>
                  <span className="text-[11px] text-stone-400 font-mono">{h.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
