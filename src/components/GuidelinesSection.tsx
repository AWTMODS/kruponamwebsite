import React from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';
import { guidelinesList } from '../data/seedData';


export const GuidelinesSection: React.FC = () => {
  return (
    <section id="guidelines" className="py-20 bg-[#FAF5EB] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#0D472B]/10 text-[#0D472B] text-xs font-bold uppercase tracking-widest mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
            Entry Regulations
          </div>
          <h2 className="font-['Cinzel'] text-3xl sm:text-4xl font-bold text-[#0D472B] tracking-tight mb-3">
            Guidelines & Festival Etiquette
          </h2>
          <p className="font-serif italic text-base text-[#881337] mb-3">
            “സമാധാനവും സന്തോഷവും നിറഞ്ഞ ഒരു ഉത്സവാനുഭവം”
          </p>
          <p className="text-xs sm:text-sm text-stone-600 font-sans leading-relaxed">
            Please review the following instructions to ensure smooth gate verification, feast seating, and personal safety.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {guidelinesList.map((g, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 border border-stone-200 hover:border-[#D4AF37] transition-all shadow-xs space-y-2.5 text-left flex flex-col justify-between"
            >
              <div>
                <div className="w-8 h-8 rounded-full bg-[#0D472B]/10 text-[#0D472B] font-mono font-bold text-xs flex items-center justify-center mb-3">
                  0{idx + 1}
                </div>
                <h3 className="font-serif font-bold text-base text-[#0D472B]">
                  {g.title}
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed font-sans mt-1.5">
                  {g.desc}
                </p>
              </div>

              <div className="pt-2 border-t border-stone-100 flex items-center gap-1.5 text-[11px] text-[#10B981] font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Strictly Enforced at Gate</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
