import React from 'react';
import { Award } from 'lucide-react';


export const Sponsors: React.FC = () => {
  const partners = [
    { name: 'Krupanidhi Group', role: 'Presenting Institution', badge: 'Title Host' },
    { name: 'State Bank of India', role: 'Official Banking & UPI Partner', badge: 'Payment Gateway' },
    { name: 'Kottayam Grand Caterers', role: 'Authentic 24-Item Onasadya', badge: 'Culinary Master' },
    { name: 'Red FM 93.5', role: 'Official Radio & Buzz Partner', badge: 'Broadcast' },
    { name: 'Kerala Tourism', role: 'Cultural Heritage Support', badge: 'Patron' },
    { name: 'PSR Conventions', role: 'Official Venue Host', badge: 'Venue Partner' },
  ];

  return (
    <section id="sponsors" className="py-20 bg-[#FAF5EB] border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0D472B]/10 text-[#0D472B] text-xs font-bold uppercase tracking-widest mb-3">
            <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
            Collaborators & Patrons
          </div>
          <h2 className="font-['Cinzel'] text-2xl sm:text-3xl font-bold text-[#0D472B] tracking-tight mb-2">
            Festival Partners & Sponsors
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            Powered by leading educational, culinary, and corporate partners across South India.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {partners.map((p, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-4 text-center border border-stone-200 shadow-xs hover:border-[#D4AF37] transition-all flex flex-col justify-between"
            >
              <div>
                <span className="text-[9px] font-mono uppercase tracking-widest text-[#8C6B08] font-bold block mb-1">
                  {p.badge}
                </span>
                <h4 className="font-serif font-bold text-sm text-[#0D472B] leading-tight">
                  {p.name}
                </h4>
              </div>
              <p className="text-[11px] text-stone-500 mt-2 pt-2 border-t border-stone-100">
                {p.role}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
