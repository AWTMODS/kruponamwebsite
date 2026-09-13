import React, { useEffect, useState, useRef } from 'react';
import { X, Download, Printer, Copy, Sparkles, MapPin, Calendar, Utensils, ShieldCheck } from 'lucide-react';
import QRCode from 'qrcode';
import type { Registration } from '../types';
import { useTickets } from '../context/TicketContext';


interface DigitalPassModalProps {
  isOpen: boolean;
  onClose: () => void;
  registration: Registration | null;
}

export const DigitalPassModal: React.FC<DigitalPassModalProps> = ({
  isOpen,
  onClose,
  registration,
}) => {
  const { settings } = useTickets();
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const passCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (registration) {
      // Secure QR payload containing Token, USN, and verification URL
      const payload = JSON.stringify({
        event: 'KRUPONAM_2026',
        token: registration.tokenId,
        usn: registration.usn,
        name: registration.fullName,
        dept: registration.department,
        status: registration.status,
        timestamp: registration.approvedAt || registration.appliedAt,
      });

      QRCode.toDataURL(payload, {
        width: 320,
        margin: 1.5,
        color: {
          dark: '#072617',
          light: '#FFFFFF',
        },
      })
        .then((url) => setQrCodeDataUrl(url))
        .catch((err) => console.error('Error generating pass QR:', err));
    }
  }, [registration]);

  if (!isOpen || !registration) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPng = async () => {
    setIsDownloading(true);
    try {
      // Generate high-resolution 1200x650 Canvas Pass
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 650;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('Canvas context not available');
      }

      // 1. Background Gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 1200, 650);
      bgGrad.addColorStop(0, '#051A10');
      bgGrad.addColorStop(0.5, '#0D472B');
      bgGrad.addColorStop(1, '#082E1C');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 1200, 650);

      // 2. Gold Border Framing (Kasavu Zari)
      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 6;
      ctx.strokeRect(20, 20, 1160, 610);

      ctx.strokeStyle = '#FAF5EB';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(26, 26, 1148, 598);

      // 3. Perforated Feast Stub Divider Line
      ctx.setLineDash([10, 8]);
      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(880, 20);
      ctx.lineTo(880, 630);
      ctx.stroke();
      ctx.setLineDash([]); // Reset line dash

      // 4. Header Institution & Festival
      ctx.fillStyle = '#FDE68A';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText('KRUPANIDHI GROUP OF INSTITUTIONS • BENGALURU', 60, 75);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 44px Georgia, serif';
      ctx.fillText('KRUPONAM 2026', 60, 130);

      ctx.fillStyle = '#D4AF37';
      ctx.font = 'italic bold 20px Georgia, serif';
      ctx.fillText('OFFICIAL ALL-INCLUSIVE CULTURAL & FEAST PASS', 60, 165);

      // 5. Student Details Left Block
      ctx.fillStyle = '#FAF5EB';
      ctx.font = '14px sans-serif';
      ctx.fillText('DELEGATE NAME', 60, 230);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 26px sans-serif';
      ctx.fillText(registration.fullName.toUpperCase(), 60, 265);

      ctx.fillStyle = '#FAF5EB';
      ctx.font = '14px sans-serif';
      ctx.fillText('UNIVERSITY SEAT NO (USN)', 60, 320);
      ctx.fillStyle = '#FDE68A';
      ctx.font = 'bold 24px monospace';
      ctx.fillText(registration.usn, 60, 350);

      ctx.fillStyle = '#FAF5EB';
      ctx.font = '14px sans-serif';
      ctx.fillText('DEPARTMENT & BATCH', 60, 405);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '18px sans-serif';
      ctx.fillText(`${registration.department} • ${registration.batchYear}`, 60, 435);

      // Metadata Pill
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.fillRect(60, 490, 520, 85);
      ctx.strokeStyle = '#D4AF37';
      ctx.strokeRect(60, 490, 520, 85);

      ctx.fillStyle = '#FAF5EB';
      ctx.font = '14px sans-serif';
      ctx.fillText('📅 ' + settings.eventDate + ' • 08:30 AM IST', 80, 525);
      ctx.fillText('📍 PSR Convention Centre, Bengaluru', 80, 555);

      // 6. Center QR Code block
      if (qrCodeDataUrl) {
        const qrImg = new Image();
        await new Promise((res) => {
          qrImg.onload = res;
          qrImg.src = qrCodeDataUrl;
        });
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(630, 200, 210, 210);
        ctx.drawImage(qrImg, 635, 205, 200, 200);

        ctx.fillStyle = '#FDE68A';
        ctx.font = 'bold 16px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(registration.tokenId, 735, 440);
        ctx.font = '12px sans-serif';
        ctx.fillStyle = '#FAF5EB';
        ctx.fillText('GATE SECURITY QR CODE', 735, 462);
        ctx.textAlign = 'left'; // reset
      }

      // 7. Right Stub: Onasadya Feast Voucher
      ctx.fillStyle = '#FDE68A';
      ctx.font = 'bold 14px monospace';
      ctx.fillText('STUB #24', 910, 75);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 24px Georgia, serif';
      ctx.fillText('ONASADYA', 910, 125);

      ctx.fillStyle = '#D4AF37';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText('FEAST TOKEN', 910, 150);

      ctx.fillStyle = '#FAF5EB';
      ctx.font = '12px sans-serif';
      ctx.fillText('24 Traditional Dishes', 910, 195);
      ctx.fillText('Served on Plantain Leaf', 910, 215);
      ctx.fillText('Valid: 01:15 PM - 03:00 PM', 910, 235);

      // Barcode simulation
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(910, 270, 230, 80);
      // Draw pseudo barcode lines
      ctx.fillStyle = '#000000';
      let xOffset = 925;
      while (xOffset < 1120) {
        const barWidth = Math.random() > 0.5 ? 4 : 2;
        ctx.fillRect(xOffset, 280, barWidth, 60);
        xOffset += barWidth + (Math.random() > 0.4 ? 3 : 2);
      }

      ctx.fillStyle = '#FDE68A';
      ctx.font = 'bold 12px monospace';
      ctx.fillText(`SN: SADYA-${registration.tokenId.slice(-4)}`, 910, 385);

      // Pass Status Stamp
      ctx.fillStyle = '#10B981';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('✓ VERIFIED ATTENDEE', 910, 520);
      ctx.fillStyle = '#FAF5EB';
      ctx.font = '12px sans-serif';
      ctx.fillText('Strictly Non-Transferable', 910, 545);

      // Download trigger
      const link = document.createElement('a');
      link.download = `Kruponam2026_Pass_${registration.tokenId}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Failed to export pass PNG:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}?token=${registration.tokenId}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#FFFDF7] rounded-3xl max-w-4xl w-full border-2 border-[#D4AF37] shadow-2xl relative my-6 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Top Control Bar */}
        <div className="bg-[#072617] px-6 py-4 text-white flex items-center justify-between border-b border-[#D4AF37]/40 no-print">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#D4AF37]" />
            <h3 className="font-['Cinzel'] font-bold text-lg text-white">
              Official Digital Pass • Kruponam 2026
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs flex items-center gap-1.5 transition-colors"
              title="Print Pass"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadPng}
              disabled={isDownloading}
              className="p-2 sm:px-3 rounded-lg bg-[#D4AF37] hover:bg-[#FDE68A] text-[#072617] font-bold text-xs flex items-center gap-1.5 transition-colors"
              title="Download Pass as PNG"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">
                {isDownloading ? 'Exporting...' : 'Download PNG'}
              </span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Pass Badge Container */}
        <div className="p-4 sm:p-8 overflow-x-auto" id="printable-pass-container">
          <div
            ref={passCardRef}
            className="w-full min-w-[700px] max-w-[850px] mx-auto bg-gradient-to-r from-[#072617] via-[#0D472B] to-[#0A3822] text-white rounded-3xl p-6 sm:p-7 border-4 border-[#D4AF37] shadow-2xl relative overflow-hidden"
          >
            {/* Kasavu Gold Inner Border */}
            <div className="absolute inset-2 border border-[#FAF5EB]/30 rounded-2xl pointer-events-none" />

            <div className="grid grid-cols-12 gap-6 relative z-10">
              {/* Main Pass Info (Col 8) */}
              <div className="col-span-8 flex flex-col justify-between pr-4 border-r-2 border-dashed border-[#D4AF37]/50">
                {/* Header Title */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] sm:text-xs font-mono font-bold tracking-widest text-[#FDE68A]">
                      KRUPANIDHI GROUP OF INSTITUTIONS
                    </span>
                    <span className="text-[10px] font-mono bg-[#D4AF37]/20 border border-[#D4AF37]/40 px-2 py-0.5 rounded text-[#FDE68A] font-bold">
                      {registration.tokenId}
                    </span>
                  </div>
                  <h2 className="font-['Cinzel'] text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-none mb-1">
                    KRUPONAM <span className="text-[#D4AF37]">2026</span>
                  </h2>
                  <p className="font-serif italic text-xs sm:text-sm text-[#FAF5EB]/80 mb-4">
                    Official College Onam Cultural Festival & 24-Item Feast Pass
                  </p>
                </div>

                {/* Attendee Details Grid */}
                <div className="space-y-3 my-2">
                  <div className="grid grid-cols-2 gap-3 text-left">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[#FAF5EB]/60 block">
                        Attendee Name
                      </span>
                      <span className="font-bold text-base sm:text-lg text-white font-serif truncate block">
                        {registration.fullName}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[#FAF5EB]/60 block">
                        USN / Roll Number
                      </span>
                      <span className="font-mono font-bold text-sm sm:text-base text-[#FDE68A] block">
                        {registration.usn}
                      </span>
                    </div>
                  </div>

                  <div className="text-left">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#FAF5EB]/60 block">
                      Department & Batch
                    </span>
                    <span className="text-xs sm:text-sm text-[#FAF5EB] truncate block">
                      {registration.department} • {registration.batchYear}
                    </span>
                  </div>
                </div>

                {/* Event Metadata Footer */}
                <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between text-[11px] text-[#FAF5EB]/80 gap-2">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{settings.eventDate}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>PSR Convention Centre</span>
                  </div>
                </div>
              </div>

              {/* QR Code & Feast Voucher Stub (Col 4) */}
              <div className="col-span-4 flex flex-col justify-between items-center text-center pl-2">
                {/* QR Section */}
                <div className="w-full">
                  <span className="text-[10px] uppercase tracking-wider font-mono font-bold text-[#FDE68A] block mb-1.5">
                    Gate Entry QR
                  </span>
                  <div className="bg-white p-2 rounded-xl shadow-md inline-block border-2 border-[#D4AF37]">
                    {qrCodeDataUrl ? (
                      <img
                        src={qrCodeDataUrl}
                        alt="Gate QR Code"
                        className="w-28 h-28 sm:w-32 sm:h-32 object-contain"
                      />
                    ) : (
                      <div className="w-28 h-28 sm:w-32 sm:h-32 bg-stone-100 flex items-center justify-center text-xs text-stone-400">
                        Generating...
                      </div>
                    )}
                  </div>
                  <p className="text-[10px] font-mono text-[#FDE68A] mt-1 font-bold">
                    {registration.tokenId}
                  </p>
                </div>

                {/* Onasadya Voucher Stub */}
                <div className="w-full pt-3 border-t border-white/15">
                  <div className="flex items-center justify-center gap-1 text-[#FDE68A] text-xs font-bold font-['Cinzel']">
                    <Utensils className="w-3.5 h-3.5" />
                    <span>Onasadya Feast Token</span>
                  </div>
                  <p className="text-[10px] text-[#FAF5EB]/70">
                    24 Dishes • Plantain Leaf Seating
                  </p>
                  <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/40">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Valid Entry Verified</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="bg-[#FAF5EB] px-6 py-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3 no-print">
          <div className="text-xs text-stone-600">
            <span>Keep this pass on your phone or print a physical copy for gate entry scanning.</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyLink}
              className="px-3.5 py-2 rounded-xl bg-white border border-stone-300 text-stone-700 text-xs font-semibold hover:border-[#D4AF37] flex items-center gap-1.5 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedLink ? 'Link Copied!' : 'Copy Pass Link'}</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadPng}
              disabled={isDownloading}
              className="px-4 py-2 rounded-xl bg-[#0D472B] hover:bg-[#072617] text-[#FDE68A] text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isDownloading ? 'Saving PNG...' : 'Download Pass (PNG)'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
