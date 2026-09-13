import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Search,
  CheckCircle2,
  Clock,
  Upload,
  AlertCircle,
  ExternalLink,
  Ticket,
  ArrowRight,
  Copy,
} from 'lucide-react';
import QRCode from 'qrcode';
import confetti from 'canvas-confetti';
import { useTickets } from '../context/TicketContext';
import { compressImage } from '../utils/imageCompression';
import type { Registration } from '../types';


interface CheckTicketStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialToken?: string;
  onOpenDigitalPass: (registration: Registration) => void;
}

export const CheckTicketStatusModal: React.FC<CheckTicketStatusModalProps> = ({
  isOpen,
  onClose,
  initialToken = '',
  onOpenDigitalPass,
}) => {
  const { registrations, submitPayment, settings } = useTickets();

  const [searchQuery, setSearchQuery] = useState(initialToken);
  const [selectedRecord, setSelectedRecord] = useState<Registration | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Payment Form States
  const [utrNumber, setUtrNumber] = useState('');
  const [paymentScreenshot, setPaymentScreenshot] = useState('');
  const [isCompressingPayment, setIsCompressingPayment] = useState(false);
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Dynamic UPI QR Data URL
  const [upiQrDataUrl, setUpiQrDataUrl] = useState<string>('');
  const [copiedUpi, setCopiedUpi] = useState(false);

  const paymentFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialToken) {
      setSearchQuery(initialToken);
      const found = registrations.find(
        (r) =>
          r.tokenId.toLowerCase() === initialToken.toLowerCase().trim() ||
          r.phone.replace(/\D/g, '').includes(initialToken.replace(/\D/g, ''))
      );
      if (found) {
        setSelectedRecord(found);
      }
    }
  }, [initialToken, registrations]);

  // Generate UPI QR Code whenever an ID-approved record is displayed
  useEffect(() => {
    if (selectedRecord && selectedRecord.status === 'ID_Approved_Payment_Pending') {
      const upiLink = `upi://pay?pa=${settings.upiId}&pn=${encodeURIComponent(
        settings.upiPayeeName
      )}&am=${settings.generalPassPrice}&cu=INR&tn=${encodeURIComponent(
        'KRUPONAM-' + selectedRecord.tokenId
      )}`;

      QRCode.toDataURL(upiLink, {
        width: 260,
        margin: 1.5,
        color: {
          dark: '#0D472B',
          light: '#FFFFFF',
        },
      })
        .then((url) => setUpiQrDataUrl(url))
        .catch((err) => console.error('Failed to generate UPI QR:', err));
    }
  }, [selectedRecord, settings]);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError(null);
    setSelectedRecord(null);
    setPaymentSuccess(false);

    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      setSearchError('Please enter your Token ID or WhatsApp phone number.');
      return;
    }

    const cleanDigits = query.replace(/\D/g, '');

    const match = registrations.find((r) => {
      const tokenMatch = r.tokenId.toLowerCase() === query;
      const usnMatch = r.usn.toLowerCase() === query;
      const phoneDigits = r.phone.replace(/\D/g, '');
      const phoneMatch = cleanDigits.length >= 6 && phoneDigits.includes(cleanDigits);
      return tokenMatch || usnMatch || phoneMatch;
    });

    if (match) {
      setSelectedRecord(match);
    } else {
      setSearchError(
        `No application found for "${searchQuery}". Please verify your Token ID (e.g. KRUP-2026-1048) or phone number.`
      );
    }
  };

  const handlePaymentScreenshotUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setPaymentError('Please upload a valid image screenshot (JPG, PNG).');
      return;
    }

    setPaymentError(null);
    setIsCompressingPayment(true);
    try {
      const compressed = await compressImage(file, 1200, 0.8);
      setPaymentScreenshot(compressed);
    } catch {
      setPaymentError('Failed to process image. Please try again.');
    } finally {
      setIsCompressingPayment(false);
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecord) return;
    setPaymentError(null);

    const cleanUtr = utrNumber.trim();
    if (!cleanUtr || cleanUtr.length < 8) {
      setPaymentError('Please enter a valid 12-digit Bank UTR / Transaction Reference number.');
      return;
    }

    if (!paymentScreenshot) {
      setPaymentError('Please upload your payment confirmation screenshot.');
      return;
    }

    setIsSubmittingPayment(true);
    try {
      const updated = await submitPayment(selectedRecord.tokenId, cleanUtr, paymentScreenshot);
      setSelectedRecord(updated);
      setPaymentSuccess(true);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#10B981'],
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to submit payment proof.';
      setPaymentError(msg);
    } finally {
      setIsSubmittingPayment(false);
    }
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(settings.upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#FFFDF7] rounded-3xl max-w-xl w-full border-2 border-[#D4AF37] shadow-2xl relative my-8 overflow-hidden animate-in zoom-in-95 duration-200 text-left">
        {/* Header */}
        <div className="bg-[#0D472B] px-6 py-4 text-white flex items-center justify-between border-b border-[#D4AF37]/40">
          <div className="flex items-center gap-2">
            <Ticket className="w-5 h-5 text-[#D4AF37]" />
            <div>
              <h3 className="font-['Cinzel'] font-bold text-lg text-white">
                Check Ticket & Payment Status
              </h3>
              <p className="text-[11px] text-[#F3EAD8]/80 font-sans">
                Kruponam 2026 Verification Portal
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-[#FAF5EB]/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 sm:p-7 max-h-[80vh] overflow-y-auto space-y-6">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="space-y-2">
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
              Enter Token ID or WhatsApp Phone Number:
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="e.g. KRUP-2026-1048 or 9845012345"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-hidden text-sm bg-white font-mono"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#0D472B] text-[#FDE68A] font-bold text-xs uppercase tracking-wider hover:bg-[#072617] transition-all flex items-center gap-1.5"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search</span>
              </button>
            </div>
            {searchError && (
              <p className="text-xs text-red-600 font-medium flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{searchError}</span>
              </p>
            )}
          </form>

          {/* Result Card */}
          {selectedRecord && (
            <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm space-y-5 animate-in fade-in duration-300">
              {/* Attendee Header */}
              <div className="flex items-start justify-between gap-3 border-b border-stone-100 pb-3">
                <div>
                  <h4 className="font-['Cinzel'] font-bold text-lg text-[#0D472B]">
                    {selectedRecord.fullName}
                  </h4>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 font-mono mt-0.5">
                    <span>USN: {selectedRecord.usn}</span>
                    <span>•</span>
                    <span className="text-[#8C6B08] font-bold">{selectedRecord.tokenId}</span>
                  </div>
                  <p className="text-[11px] text-stone-500">{selectedRecord.department}</p>
                </div>

                {/* Status Pill */}
                <div>
                  {selectedRecord.status === 'Approved' ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Pass Approved
                    </span>
                  ) : selectedRecord.status === 'ID_Approved_Payment_Pending' ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      Payment Unlocked
                    </span>
                  ) : selectedRecord.status === 'Pending_Payment_Verification' ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">
                      <Clock className="w-3.5 h-3.5 text-blue-600" />
                      Verifying UTR
                    </span>
                  ) : selectedRecord.status === 'Rejected' ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-300">
                      <AlertCircle className="w-3.5 h-3.5 text-red-600" />
                      Rejected
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-stone-100 text-stone-800 border border-stone-300">
                      <Clock className="w-3.5 h-3.5 text-stone-500" />
                      ID In Review
                    </span>
                  )}
                </div>
              </div>

              {/* Visual Workflow Stepper */}
              <div className="grid grid-cols-4 gap-1 text-center text-[10px] font-medium pt-1">
                <div className="space-y-1">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto text-xs">
                    ✓
                  </div>
                  <span className="text-stone-700">1. ID Submitted</span>
                </div>
                <div className="space-y-1">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center mx-auto text-xs ${
                      selectedRecord.status !== 'Pending_ID_Approval' && selectedRecord.status !== 'Rejected'
                        ? 'bg-emerald-600 text-white'
                        : selectedRecord.status === 'Pending_ID_Approval'
                        ? 'bg-amber-500 text-white animate-pulse'
                        : 'bg-stone-300 text-stone-600'
                    }`}
                  >
                    {selectedRecord.status !== 'Pending_ID_Approval' && selectedRecord.status !== 'Rejected' ? '✓' : '2'}
                  </div>
                  <span className="text-stone-700">2. ID Approved</span>
                </div>
                <div className="space-y-1">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center mx-auto text-xs ${
                      selectedRecord.status === 'Approved'
                        ? 'bg-emerald-600 text-white'
                        : selectedRecord.status === 'Pending_Payment_Verification'
                        ? 'bg-blue-600 text-white animate-pulse'
                        : selectedRecord.status === 'ID_Approved_Payment_Pending'
                        ? 'bg-amber-500 text-white ring-2 ring-amber-300'
                        : 'bg-stone-200 text-stone-500'
                    }`}
                  >
                    {selectedRecord.status === 'Approved' ? '✓' : '3'}
                  </div>
                  <span className="text-stone-700">3. Pay ₹{settings.generalPassPrice}</span>
                </div>
                <div className="space-y-1">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center mx-auto text-xs ${
                      selectedRecord.status === 'Approved'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-stone-200 text-stone-500'
                    }`}
                  >
                    {selectedRecord.status === 'Approved' ? '✓' : '4'}
                  </div>
                  <span className="text-stone-700">4. Pass Issued</span>
                </div>
              </div>

              {/* Status Specific Action Cards */}

              {/* CASE 1: ID Still Pending Review */}
              {selectedRecord.status === 'Pending_ID_Approval' && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-2">
                  <p className="font-bold flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                    Student ID Under Review
                  </p>
                  <p>
                    Your College ID card is being verified by the Kruponam festival committee. 
                    Once confirmed (usually within a few hours), this screen will unlock the official <strong>UPI QR code</strong> to complete your ₹{settings.generalPassPrice} payment.
                  </p>
                </div>
              )}

              {/* CASE 2: ID Approved -> Unlock Payment (Stage 2) */}
              {selectedRecord.status === 'ID_Approved_Payment_Pending' && (
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#FFFDF7] to-[#FAF5EB] border-2 border-[#D4AF37] space-y-4">
                  <div className="text-center">
                    <span className="inline-block text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#10B981]/20 text-[#0D472B] border border-[#10B981]/40 mb-1">
                      🎉 Student ID Verified & Approved!
                    </span>
                    <h5 className="font-['Cinzel'] font-bold text-lg text-[#0D472B]">
                      Stage 2: Complete Your ₹{settings.generalPassPrice} UPI Payment
                    </h5>
                    <p className="text-xs text-stone-600">
                      Scan the dynamic QR code below with any UPI App (GPay, PhonePe, Paytm, BHIM)
                    </p>
                  </div>

                  {/* QR Code and Payment Details */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-5 p-4 rounded-xl bg-white border border-stone-200">
                    {upiQrDataUrl ? (
                      <div className="p-2 bg-white rounded-xl shadow-xs border border-stone-200 text-center">
                        <img
                          src={upiQrDataUrl}
                          alt="Dynamic UPI Payment QR"
                          className="w-44 h-44 object-contain mx-auto"
                        />
                        <p className="text-[10px] font-mono text-stone-500 mt-1">
                          Amount: ₹{settings.generalPassPrice} • {selectedRecord.tokenId}
                        </p>
                      </div>
                    ) : (
                      <div className="w-44 h-44 bg-stone-100 rounded-xl flex items-center justify-center text-xs text-stone-400">
                        Generating QR...
                      </div>
                    )}

                    <div className="space-y-2.5 text-xs text-stone-700 text-left flex-1">
                      <div>
                        <span className="text-[11px] uppercase tracking-wider text-stone-400 font-bold block">
                          Official UPI ID
                        </span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="font-mono font-bold text-[#0D472B] text-sm">
                            {settings.upiId}
                          </span>
                          <button
                            type="button"
                            onClick={handleCopyUpi}
                            className="p-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-600 text-[10px] flex items-center gap-1"
                          >
                            <Copy className="w-3 h-3" />
                            {copiedUpi ? 'Copied' : 'Copy'}
                          </button>
                        </div>
                      </div>

                      <div>
                        <span className="text-[11px] uppercase tracking-wider text-stone-400 font-bold block">
                          Payee Name
                        </span>
                        <span className="font-medium text-stone-800">{settings.upiPayeeName}</span>
                      </div>

                      <div>
                        <span className="text-[11px] uppercase tracking-wider text-stone-400 font-bold block">
                          Exact Amount
                        </span>
                        <span className="font-bold text-[#881337] text-base">
                          ₹{settings.generalPassPrice}
                        </span>
                      </div>

                      <a
                        href={`upi://pay?pa=${settings.upiId}&pn=${encodeURIComponent(
                          settings.upiPayeeName
                        )}&am=${settings.generalPassPrice}&cu=INR&tn=${encodeURIComponent(
                          'KRUPONAM-' + selectedRecord.tokenId
                        )}`}
                        className="inline-flex items-center gap-1 text-xs text-[#0D472B] font-bold underline"
                      >
                        <span>Open directly in UPI App</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  {/* Submission Form: UTR & Screenshot */}
                  <form onSubmit={handlePaymentSubmit} className="space-y-3 pt-2 border-t border-stone-200">
                    <p className="text-xs font-bold text-stone-800">
                      Step 2: Submit Payment Confirmation Details
                    </p>

                    {paymentError && (
                      <div className="p-2.5 rounded-lg bg-red-50 text-red-700 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{paymentError}</span>
                      </div>
                    )}

                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 uppercase tracking-wider mb-1">
                        12-Digit Bank UTR / Transaction Reference Number *
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={18}
                        placeholder="e.g. 423190876123 (from GPay / PhonePe)"
                        value={utrNumber}
                        onChange={(e) => setUtrNumber(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-hidden text-sm bg-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 uppercase tracking-wider mb-1">
                        Payment Screenshot Proof *
                      </label>
                      <div
                        onClick={() => paymentFileInputRef.current?.click()}
                        className="border-2 border-dashed border-stone-300 rounded-xl p-3 text-center cursor-pointer hover:border-[#D4AF37] bg-white transition-colors"
                      >
                        <input
                          type="file"
                          ref={paymentFileInputRef}
                          accept="image/*"
                          onChange={handlePaymentScreenshotUpload}
                          className="hidden"
                        />
                        {isCompressingPayment ? (
                          <span className="text-xs text-stone-500">Compressing receipt image...</span>
                        ) : paymentScreenshot ? (
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-emerald-700 font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Receipt Attached
                            </span>
                            <span className="text-stone-400 underline">Change</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-2 text-xs text-stone-600">
                            <Upload className="w-4 h-4 text-stone-400" />
                            <span>Click to upload transaction screenshot</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmittingPayment || isCompressingPayment}
                      className="w-full py-3 rounded-xl bg-[#0D472B] hover:bg-[#072617] text-[#FDE68A] font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md"
                    >
                      {isSubmittingPayment ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-[#FDE68A] border-t-transparent rounded-full animate-spin" />
                          <span>Submitting Details...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit UTR Verification</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}

              {/* CASE 3: Payment Pending Verification */}
              {selectedRecord.status === 'Pending_Payment_Verification' && (
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 space-y-2">
                  {paymentSuccess && (
                    <div className="p-2 rounded-lg bg-emerald-100 text-emerald-900 font-bold flex items-center gap-1.5 mb-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>Payment confirmation details submitted successfully!</span>
                    </div>
                  )}
                  <p className="font-bold flex items-center gap-1.5 text-blue-950">
                    <Clock className="w-4 h-4 text-blue-700 shrink-0" />
                    Payment Verification in Progress
                  </p>
                  <p>
                    UTR Reference: <span className="font-mono font-bold">{selectedRecord.utrNumber}</span>
                  </p>

                  <p className="text-blue-800">
                    Our committee accounts team is reconciling this UTR with bank records. Your digital ticket pass will unlock automatically once confirmed.
                  </p>
                </div>
              )}

              {/* CASE 4: Pass Approved (Ready for Gate Entry) */}
              {selectedRecord.status === 'Approved' && (
                <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-900 to-[#0D472B] text-white space-y-4 shadow-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#FDE68A] bg-black/40 px-2.5 py-0.5 rounded-full border border-[#D4AF37]/30">
                        Official Ticket Issued
                      </span>
                      <h5 className="font-['Cinzel'] font-bold text-xl text-white mt-1">
                        Kruponam 2026 Pass Active
                      </h5>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 flex items-center justify-center text-[#FDE68A]">
                      <Ticket className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-black/20 p-3 rounded-xl">
                    <div>
                      <span className="text-white/60 block text-[10px]">Gate Entry:</span>
                      <span className="font-bold text-[#FDE68A]">
                        {selectedRecord.isGateScanned ? 'Checked In' : 'Valid for Entry'}
                      </span>
                    </div>
                    <div>
                      <span className="text-white/60 block text-[10px]">Onasadya Feast:</span>
                      <span className="font-bold text-[#FDE68A]">
                        {selectedRecord.isOnasadyaClaimed ? 'Redeemed' : 'Token Active'}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onOpenDigitalPass(selectedRecord)}
                    className="w-full py-3.5 rounded-xl gold-gradient-bg text-[#072617] font-bold text-sm hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Ticket className="w-4 h-4" />
                    <span>View & Download Official Digital Pass</span>
                  </button>
                </div>
              )}

              {/* CASE 5: Rejected */}
              {selectedRecord.status === 'Rejected' && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-900 space-y-1">
                  <p className="font-bold flex items-center gap-1.5 text-red-950">
                    <AlertCircle className="w-4 h-4 text-red-700 shrink-0" />
                    Registration Rejected
                  </p>
                  <p className="text-red-800">
                    Reason: {selectedRecord.rejectionReason || 'Verification check could not be completed.'}
                  </p>
                  <p className="text-red-700 pt-1">
                    Please visit the college cultural desk or submit a fresh application with valid ID documents.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
