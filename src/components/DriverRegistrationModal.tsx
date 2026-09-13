import React, { useState } from 'react';
import { X, Bus, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useTickets } from '../context/TicketContext';
import type { DriverRegistration } from '../types';


interface DriverRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DriverRegistrationModal: React.FC<DriverRegistrationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { registerDriver } = useTickets();

  const [driverName, setDriverName] = useState('');
  const [phone, setPhone] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [busRoute, setBusRoute] = useState('Route 1: Krupanidhi Campus - Whitefield - PSR');
  const [collegeAffiliation, setCollegeAffiliation] = useState('Krupanidhi College Transport Dept');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdDriver, setCreatedDriver] = useState<DriverRegistration | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const routes = [
    'Route 1: Krupanidhi Campus - Whitefield - PSR Convention',
    'Route 2: Majestic / City Railway Station - PSR',
    'Route 3: Electronic City - Silk Board - HSR - PSR',
    'Route 4: Marathahalli - Bellandur - Sarjapur - PSR',
    'Route 5: Banashankari - Jayanagar - BTM - PSR',
    'Route 6: Hebbal - Kalyan Nagar - Tin Factory - PSR',
    'Custom / Contracted Chartered Bus',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!driverName.trim() || !phone.trim() || !vehicleNumber.trim()) {
      setError('Please fill in all driver & vehicle details.');
      return;
    }

    setIsSubmitting(true);
    try {
      const driver = await registerDriver({
        driverName,
        phone,
        vehicleNumber,
        busRoute,
        collegeAffiliation,
      });

      setCreatedDriver(driver);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#10B981'],
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Driver registration failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#FFFDF7] rounded-3xl max-w-lg w-full border-2 border-[#D4AF37] shadow-2xl relative my-8 overflow-hidden animate-in zoom-in-95 duration-200 text-left">
        {/* Header */}
        <div className="bg-[#0D472B] px-6 py-4 text-white flex items-center justify-between border-b border-[#D4AF37]/40">
          <div className="flex items-center gap-2">
            <Bus className="w-5 h-5 text-[#D4AF37]" />
            <div>
              <h3 className="font-['Cinzel'] font-bold text-lg text-white">
                Driver & Transit Registration
              </h3>
              <p className="text-[11px] text-[#F3EAD8]/80 font-sans">
                Kruponam 2026 Transport Crew Portal
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

        {/* Content */}
        <div className="p-6 sm:p-7 max-h-[80vh] overflow-y-auto">
          {createdDriver ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h4 className="font-['Cinzel'] text-xl font-bold text-[#0D472B]">
                  Driver Pass Registered!
                </h4>
                <p className="text-xs text-stone-600 mt-1">
                  Assigned Pass ID: <span className="font-mono font-bold text-emerald-800">{createdDriver.driverId}</span>
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF5EB] border border-stone-200 text-xs text-stone-700 space-y-1.5 text-left max-w-sm mx-auto">
                <p><strong>Driver:</strong> {createdDriver.driverName}</p>
                <p><strong>Vehicle No:</strong> {createdDriver.vehicleNumber}</p>
                <p><strong>Route:</strong> {createdDriver.busRoute}</p>
                <p><strong>Status:</strong> <span className="text-emerald-700 font-bold">Authorized for Transit</span></p>
              </div>

              <div className="p-3 rounded-xl bg-blue-50 text-blue-900 text-xs flex items-center gap-2 text-left">
                <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0" />
                <span>Driver pass includes complimentary lunch token for the 24-dish Onasadya.</span>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-[#0D472B] text-[#FDE68A] font-bold text-sm hover:bg-[#072617] transition-all"
              >
                Close & Return
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-2.5 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Driver Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Suresh Kumar"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-hidden text-sm bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Driver Mobile Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 94480 12345"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-hidden text-sm bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Bus / Vehicle Registration Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. KA-01-F-4589"
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-hidden text-sm uppercase font-mono bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Designated Transit Route *
                </label>
                <select
                  value={busRoute}
                  onChange={(e) => setBusRoute(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-hidden text-sm bg-white"
                >
                  {routes.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Transport Operator / Affiliation *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Krupanidhi College Transport Dept / Contractor"
                  value={collegeAffiliation}
                  onChange={(e) => setCollegeAffiliation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-hidden text-sm bg-white"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-[#0D472B] hover:bg-[#072617] text-[#FDE68A] font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-md"
                >
                  {isSubmitting ? (
                    <span>Registering...</span>
                  ) : (
                    <>
                      <span>Submit Driver Registration</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
