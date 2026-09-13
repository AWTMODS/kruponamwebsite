import React, { useState, useRef } from 'react';
import { X, Upload, CheckCircle2, AlertCircle, Sparkles, Copy, ArrowRight, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useTickets } from '../context/TicketContext';
import { compressImage } from '../utils/imageCompression';
import type { Registration } from '../types';


interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewStatusWithToken: (token: string) => void;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  onViewStatusWithToken,
}) => {
  const { registerStudent, isSoldOut, settings } = useTickets();

  const [fullName, setFullName] = useState('');
  const [collegeEmail, setCollegeEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [usn, setUsn] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [batchYear, setBatchYear] = useState('3rd Year (2023-2027)');
  const [idCardPhoto, setIdCardPhoto] = useState<string>('');
  const [idCardFile, setIdCardFile] = useState<File | null>(null);

  const [isCompressing, setIsCompressing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdRegistration, setCreatedRegistration] = useState<Registration | null>(null);
  const [copiedToken, setCopiedToken] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const departments = [
    'Computer Science & Engineering',
    'Information Science & Engineering',
    'Artificial Intelligence & Machine Learning',
    'Electronics & Communication',
    'Mechanical Engineering',
    'Civil Engineering',
    'Pharmacy / Pharm.D',
    'Physiotherapy',
    'Management Studies (MBA/BBA)',
    'Nursing Sciences',
    'Basic Sciences & Humanities',
  ];

  const batches = [
    '1st Year (2025-2029)',
    '2nd Year (2024-2028)',
    '3rd Year (2023-2027)',
    '4th Year (2022-2026)',
    'Postgraduate / Alumni',
  ];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (JPG, PNG, WebP).');
      return;
    }

    setError(null);
    setIsCompressing(true);
    try {
      // Compress client-side < 800KB
      const compressedDataUrl = await compressImage(file, 1400, 0.82);
      setIdCardPhoto(compressedDataUrl);
      setIdCardFile(file);
    } catch {
      setError('Failed to process image. Please try another photo.');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || !collegeEmail.trim() || !phone.trim() || !usn.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    if (!idCardPhoto) {
      setError('Please upload a photo of your Student College ID card.');
      return;
    }

    setIsSubmitting(true);
    try {
      const reg = await registerStudent({
        fullName,
        collegeEmail,
        phone,
        usn,
        department,
        batchYear,
        idCardPhoto,
      });

      setCreatedRegistration(reg);

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#10B981', '#0D472B', '#FDE68A'],
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed. Please try again.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopy = () => {
    if (createdRegistration) {
      navigator.clipboard.writeText(createdRegistration.tokenId);
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#FFFDF7] rounded-3xl max-w-xl w-full border-2 border-[#D4AF37] shadow-2xl relative my-8 overflow-hidden animate-in zoom-in-95 duration-200 text-left">
        {/* Header Ribbon */}
        <div className="bg-[#0D472B] px-6 py-4 text-white flex items-center justify-between border-b border-[#D4AF37]/40">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 flex items-center justify-center text-[#FDE68A]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-['Cinzel'] font-bold text-lg text-white">
                Kruponam 2026 Pass Registration
              </h3>
              <p className="text-[11px] text-[#F3EAD8]/80 font-sans">
                Stage 1: Student Verification & ID Submission • ₹{settings.generalPassPrice}
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

        {/* Modal Body */}
        <div className="p-6 sm:p-7 max-h-[80vh] overflow-y-auto">
          {createdRegistration ? (
            // Success Screen
            <div className="text-center py-4 space-y-5">
              <div className="w-16 h-16 rounded-full bg-[#10B981]/15 text-[#10B981] flex items-center justify-center mx-auto ring-8 ring-[#10B981]/10">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <h4 className="font-['Cinzel'] text-2xl font-bold text-[#0D472B] mb-1">
                  Registration Submitted!
                </h4>
                <p className="text-xs sm:text-sm text-stone-600 font-sans max-w-md mx-auto">
                  Your application has been received and is currently under student committee review.
                </p>
              </div>

              {/* Unique Token ID Box */}
              <div className="p-4 rounded-2xl bg-[#FAF5EB] border-2 border-dashed border-[#D4AF37] max-w-sm mx-auto">
                <p className="text-[11px] font-mono uppercase tracking-widest text-[#8C6B08] font-bold mb-1">
                  Your Unique Verification Token
                </p>
                <div className="flex items-center justify-center gap-3">
                  <span className="font-mono text-2xl font-extrabold text-[#0D472B] tracking-wider">
                    {createdRegistration.tokenId}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="p-2 rounded-lg bg-white border border-stone-300 hover:border-[#D4AF37] text-stone-700 hover:text-[#0D472B] transition-colors"
                    title="Copy Token"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                {copiedToken && (
                  <p className="text-[11px] text-[#10B981] font-medium mt-1">Copied to clipboard!</p>
                )}
              </div>

              {/* Next Steps Card */}
              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-left text-xs text-blue-900 space-y-1.5 max-w-md mx-auto">
                <p className="font-bold flex items-center gap-1.5 text-blue-950">
                  <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0" />
                  What happens next? (Stage 2: Payment Unlocking)
                </p>
                <p className="text-blue-800">
                  1. The committee checks your Student ID proof to verify college enrollment.
                </p>
                <p className="text-blue-800">
                  2. Once approved, use your <strong>Token ID ({createdRegistration.tokenId})</strong> or phone number in <strong>"Check Ticket Status"</strong> to unlock the UPI payment screen.
                </p>
                <p className="text-blue-800">
                  3. Submit the 12-digit UTR payment transaction number to get your official Digital Pass.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => onViewStatusWithToken(createdRegistration.tokenId)}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#0D472B] text-[#FDE68A] font-bold text-sm hover:bg-[#072617] transition-all flex items-center justify-center gap-2"
                >
                  <span>Track Status Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-stone-100 text-stone-700 font-medium text-sm hover:bg-stone-200 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            // Registration Form
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Sold Out Notice */}
              {isSoldOut && (
                <div className="p-3 rounded-xl bg-red-100 text-red-800 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>Passes are fully sold out (750/750). New registrations are closed.</span>
                </div>
              )}

              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Full Name (As per College ID) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aditya Varma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-hidden text-sm bg-white"
                />
              </div>

              {/* Email & Phone Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                    College / Student Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="aditya@krupanidhi.edu.in"
                    value={collegeEmail}
                    onChange={(e) => setCollegeEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-hidden text-sm bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                    WhatsApp Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98450 12345"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-hidden text-sm bg-white"
                  />
                </div>
              </div>

              {/* USN / Student Roll Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                    USN / University Roll No. *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 1KI22CS012"
                    value={usn}
                    onChange={(e) => setUsn(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-hidden text-sm uppercase font-mono bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                    Batch / Academic Year *
                  </label>
                  <select
                    value={batchYear}
                    onChange={(e) => setBatchYear(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-hidden text-sm bg-white"
                  >
                    {batches.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Department */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Department / Branch *
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-hidden text-sm bg-white"
                >
                  {departments.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* Mandatory Student ID Card Upload with Canvas Compression */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Student ID Card Photo Proof (Auto-compressed &lt; 800 KB) *
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all ${
                    idCardPhoto
                      ? 'border-[#10B981] bg-emerald-50/40'
                      : 'border-stone-300 hover:border-[#D4AF37] bg-stone-50/70'
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {isCompressing ? (
                    <div className="py-3 text-xs text-stone-600 flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
                      <span>Compressing ID card photo...</span>
                    </div>
                  ) : idCardPhoto ? (
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={idCardPhoto}
                          alt="Student ID Preview"
                          className="w-14 h-14 object-cover rounded-lg border border-stone-300 shadow-xs"
                        />
                        <div className="text-left">
                          <p className="text-xs font-bold text-stone-800 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                            ID Card Attached
                          </p>
                          <p className="text-[11px] text-stone-500">
                            {idCardFile?.name || 'student_id.jpg'}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-[#0D472B] underline font-medium">
                        Change
                      </span>
                    </div>
                  ) : (
                    <div className="py-2">
                      <Upload className="w-8 h-8 text-stone-400 mx-auto mb-1.5" />
                      <p className="text-xs font-medium text-stone-700">
                        Click to upload your College Student ID card photo
                      </p>
                      <p className="text-[11px] text-stone-400 mt-0.5">
                        JPG, PNG, or WebP. Auto-compressed client-side.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isSubmitting || isCompressing || isSoldOut}
                  className={`w-full py-3.5 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
                    isSoldOut
                      ? 'bg-neutral-400 text-neutral-200 cursor-not-allowed'
                      : 'bg-[#0D472B] hover:bg-[#072617] text-[#FDE68A] hover:brightness-110 active:scale-[0.99]'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-[#FDE68A] border-t-transparent rounded-full animate-spin" />
                      <span>Generating Token ID...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                      <span>Submit Application (Stage 1)</span>
                    </>
                  )}
                </button>
                <p className="text-center text-[11px] text-stone-500 mt-2">
                  🔒 Your details are stored strictly for event verification and gate entry.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
