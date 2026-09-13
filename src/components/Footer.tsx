import React from 'react';
import { MapPin, Phone, Mail, Shield, Heart } from 'lucide-react';
import { useTickets } from '../context/TicketContext';


interface FooterProps {
  onOpenCheckStatus: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenCheckStatus, onOpenAdmin }) => {
  const { settings } = useTickets();

  return (
    <footer className="bg-[#051A10] text-white pt-16 pb-12 border-t border-[#D4AF37]/30 relative overflow-hidden">
      {/* Kasavu Gold Decorative Top Bar */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#D4AF37] via-[#FAF5EB] to-[#D4AF37]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10 text-left">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FDE68A] to-[#D4AF37] p-[2px]">
                <div className="w-full h-full rounded-full bg-[#0D472B] flex items-center justify-center font-['Cinzel'] font-bold text-[#FDE68A] text-sm">
                  KO
                </div>
              </div>
              <div>
                <span className="font-['Cinzel'] font-bold text-lg text-white block leading-tight">
                  KRUPONAM 2026
                </span>
                <span className="text-[10px] text-[#FDE68A] font-mono tracking-wider">
                  ANNUAL ONAM MAHOTSAVAM
                </span>
              </div>
            </div>

            <p className="text-xs text-[#FAF5EB]/70 leading-relaxed font-sans">
              Organized by the Student Cultural Affairs Committee at Krupanidhi Group of Institutions. 
              Celebrating the golden heritage, unity, and festive spirit of Kerala.
            </p>

            <div className="text-[11px] font-mono text-[#FDE68A]">
              Strictly limited to 750 verified delegates.
            </div>
          </div>

          {/* Event Venue & Date */}
          <div className="space-y-3 text-xs text-[#FAF5EB]/80">
            <h4 className="font-['Cinzel'] font-bold text-sm text-[#FDE68A] uppercase tracking-wider">
              Festival Venue
            </h4>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white">PSR Convention Centre</p>
                <p className="text-[11px] text-[#FAF5EB]/60">Chikka Bellandur, Off Sarjapur Road, Bengaluru, Karnataka 560035</p>
                <a
                  href={settings.venueMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-[#FDE68A] underline mt-1 inline-block"
                >
                  Open in Google Maps ↗
                </a>
              </div>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-3 text-xs text-[#FAF5EB]/80">
            <h4 className="font-['Cinzel'] font-bold text-sm text-[#FDE68A] uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#about" className="hover:text-[#FDE68A] transition-colors">
                  Festival Overview
                </a>
              </li>
              <li>
                <a href="#passes" className="hover:text-[#FDE68A] transition-colors">
                  Pass Inclusions & Pricing (₹700)
                </a>
              </li>
              <li>
                <a href="#onasadya" className="hover:text-[#FDE68A] transition-colors">
                  24-Dish Authentic Onasadya Menu
                </a>
              </li>
              <li>
                <a href="#programs" className="hover:text-[#FDE68A] transition-colors">
                  Program Timeline & DJ Night
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenCheckStatus}
                  className="hover:text-[#FDE68A] transition-colors font-medium text-[#FDE68A] underline"
                >
                  Check Pass & UTR Status
                </button>
              </li>
            </ul>
          </div>

          {/* Helplines & Admin */}
          <div className="space-y-3 text-xs text-[#FAF5EB]/80">
            <h4 className="font-['Cinzel'] font-bold text-sm text-[#FDE68A] uppercase tracking-wider">
              Support & Inquiries
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>+91 98450 12026 (Cultural Desk)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>kruponam@krupanidhi.edu.in</span>
              </div>
              <div className="pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={onOpenAdmin}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/15 text-[11px] text-[#FDE68A] transition-colors"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin & Gate Security Login</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#FAF5EB]/60">
          <p>© 2026 Krupanidhi Group of Institutions. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3 h-3 text-[#881337] fill-current" />
            <span>for Kruponam 2026</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
