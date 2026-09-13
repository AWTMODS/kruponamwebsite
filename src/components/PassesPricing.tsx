import React from 'react';
import { Check, Sparkles, Bus, ArrowRight } from 'lucide-react';
import { useTickets } from '../context/TicketContext';

interface PassesPricingProps {
  onOpenRegister: () => void;
  onOpenDriverModal: () => void;
}

export const PassesPricing: React.FC<PassesPricingProps> = ({
  onOpenRegister,
  onOpenDriverModal,
}) => {
  const { settings, remainingPasses, isSoldOut } = useTickets();


  return (
    <section id="passes" className="py-24 bg-[#FFFDF7] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#0D472B]/10 text-[#0D472B] text-xs font-bold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            Official Event Access
          </div>
          <h2 className="font-['Cinzel'] text-3xl sm:text-5xl font-bold text-[#0D472B] tracking-tight mb-3">
            Passes & Pricing
          </h2>
          <p className="font-serif italic text-lg text-[#881337] mb-4">
            “ഒരു ടിക്കറ്റ് — അളവറ്റ ആഹ്ളാദം, വിഭവസമൃദ്ധമായ സദ്യ”
          </p>
          <p className="text-sm sm:text-base text-stone-600 font-sans leading-relaxed">
            Strictly limited to <strong>750 official passes</strong> to guarantee exceptional safety, seamless banana-leaf dining, and prime viewing.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-5xl mx-auto">
          {/* Main General Student Pass (Col 8) */}
          <div className="lg:col-span-8 bg-gradient-to-b from-[#072617] via-[#0D472B] to-[#0B3D25] text-white rounded-3xl p-7 sm:p-10 border-2 border-[#D4AF37] shadow-2xl relative overflow-hidden flex flex-col justify-between">
            {/* Gold Ribbon / Best Value Badge */}
            <div className="absolute top-6 right-6">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#FDE68A] to-[#D4AF37] text-[#072617] shadow-md">
                <Sparkles className="w-3.5 h-3.5" />
                All-Inclusive Pass
              </span>
            </div>

            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-[#FDE68A] font-semibold mb-1">
                Kruponam 2026 Official Pass
              </p>
              <h3 className="font-['Cinzel'] text-2xl sm:text-3xl font-bold text-white mb-4">
                General Cultural & Feast Pass
              </h3>

              {/* Price Display */}
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl sm:text-6xl font-bold font-['Cinzel'] text-white">
                  ₹{settings.generalPassPrice}
                </span>
                <span className="text-sm sm:text-base text-[#F3EAD8]/70 font-sans">
                  / Full Day Admission
                </span>
              </div>

              {/* Live Inventory Status */}
              <div className="p-3.5 rounded-xl bg-black/30 border border-[#D4AF37]/30 mb-8 flex items-center justify-between">
                <span className="text-xs text-[#FAF5EB]/80 font-sans">Remaining Inventory:</span>
                <span className="text-xs font-mono font-bold text-[#FDE68A]">
                  {isSoldOut ? 'Sold Out (750/750)' : `${remainingPasses} of 750 Passes Left`}
                </span>
              </div>

              {/* Inclusions List */}
              <div className="space-y-3.5 mb-8">
                <h4 className="text-xs font-mono uppercase tracking-wider text-[#D4AF37] font-bold">
                  What’s Included in Your ₹{settings.generalPassPrice} Pass:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-[#FAF5EB]">
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                    <span>Full-day access to all 8 festival programs</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                    <span>Unlimited 24-course traditional Onasadya feast</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                    <span>Front-stage entry for Shinkari Melam</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                    <span>Celebrity DJ Night & Neon Fusion access</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                    <span>High-resolution printable Digital Pass with QR</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                    <span>Free college shuttle bus transit</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div>
              <button
                type="button"
                onClick={onOpenRegister}
                disabled={isSoldOut}
                className={`w-full py-4 rounded-xl font-bold text-base shadow-xl flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 ${
                  isSoldOut
                    ? 'bg-neutral-600 text-neutral-300 cursor-not-allowed'
                    : 'gold-gradient-bg text-[#072617] hover:brightness-110 active:translate-y-0'
                }`}
              >
                <span>{isSoldOut ? 'Capacity Reached (Sold Out)' : 'Apply for General Pass (₹700)'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-center text-[11px] text-[#FAF5EB]/60 mt-2.5">
                Stage 1: Submit Student ID & USN • Stage 2: Pay via UPI upon Approval
              </p>
            </div>
          </div>

          {/* Driver & Transit Pass (Col 4) */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-7 border border-stone-200 shadow-md flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#0D472B]/10 text-[#0D472B] flex items-center justify-center mb-4">
                <Bus className="w-6 h-6 text-[#0D472B]" />
              </div>
              <p className="text-xs font-mono uppercase tracking-widest text-[#8C6B08] font-bold mb-1">
                Transport Crew
              </p>
              <h3 className="font-['Cinzel'] text-xl font-bold text-[#0D472B] mb-2">
                Driver & Vehicle Pass
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed mb-6">
                Dedicated pass for college bus drivers, contracted van operators, and transit coordinators ensuring smooth student transport.
              </p>

              <div className="p-3.5 rounded-xl bg-[#FAF5EB] border border-stone-200 mb-6 space-y-2 text-xs text-stone-700">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#0D472B]" />
                  <span>Complimentary Onasadya Feast token</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#0D472B]" />
                  <span>Authorized campus parking sticker</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#0D472B]" />
                  <span>Transport dispatch coordination badge</span>
                </div>
              </div>
            </div>

            <div>
              <button
                type="button"
                onClick={onOpenDriverModal}
                className="w-full py-3 rounded-xl font-bold text-sm bg-[#0D472B] hover:bg-[#072617] text-[#FAF5EB] transition-all flex items-center justify-center gap-2"
              >
                <span>Register as Driver</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <p className="text-center text-[11px] text-stone-400 mt-2">
                No registration fee for certified drivers
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
