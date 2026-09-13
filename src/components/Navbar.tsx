import React, { useState, useEffect } from 'react';
import { Ticket, Shield, Menu, X, Sparkles, MapPin } from 'lucide-react';
import { useTickets } from '../context/TicketContext';

interface NavbarProps {
  onOpenRegister: () => void;
  onOpenCheckStatus: () => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenRegister,
  onOpenCheckStatus,
  onOpenAdmin,
}) => {
  const { remainingPasses, isSoldOut } = useTickets();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0D472B]/95 backdrop-blur-md shadow-lg border-b border-[#D4AF37]/30 py-3'
          : 'bg-gradient-to-b from-[#072617]/90 via-[#0D472B]/80 to-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo & Title */}
        <a href="#" className="flex items-center gap-3 group text-left">
          <div className="relative w-11 h-11 rounded-full bg-gradient-to-br from-[#FDE68A] via-[#D4AF37] to-[#B8860B] p-[2px] shadow-md transition-transform duration-300 group-hover:scale-105">
            <div className="w-full h-full rounded-full bg-[#0D472B] flex items-center justify-center overflow-hidden">
              {/* Traditional Floral Pookalam Emblem */}
              <svg viewBox="0 0 100 100" className="w-8 h-8 text-[#D4AF37]">
                <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="3 3" />
                <path d="M50 8 C35 30 35 70 50 92 C65 70 65 30 50 8" fill="#FDE68A" opacity="0.9" />
                <path d="M8 50 C30 35 70 35 92 50 C70 65 30 65 8 50" fill="#FDE68A" opacity="0.9" />
                <circle cx="50" cy="50" r="16" fill="#881337" />
                <circle cx="50" cy="50" r="7" fill="#FDE68A" />
              </svg>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-['Cinzel'] tracking-wider font-bold text-white text-lg sm:text-xl drop-shadow-xs">
                KRUPONAM
              </span>
              <span className="text-[#FDE68A] font-extrabold text-xs px-1.5 py-0.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 font-mono">
                2026
              </span>
            </div>
            <p className="text-[11px] text-[#F3EAD8]/80 font-sans hidden sm:block tracking-wide">
              Krupanidhi College Onam Festival • Bengaluru
            </p>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-[#FAF5EB]/90">
          <a href="#about" className="hover:text-[#FDE68A] transition-colors">
            About
          </a>
          <a href="#passes" className="hover:text-[#FDE68A] transition-colors">
            Passes & Pricing
          </a>
          <a href="#programs" className="hover:text-[#FDE68A] transition-colors">
            Programs
          </a>
          <a href="#onasadya" className="hover:text-[#FDE68A] transition-colors flex items-center gap-1">
            <span>24-Item Onasadya</span>
            <span className="text-[10px] bg-[#D4AF37] text-[#0D472B] px-1.5 py-0.2 rounded font-bold">Feast</span>
          </a>
          <a href="#guidelines" className="hover:text-[#FDE68A] transition-colors">
            Guidelines
          </a>
          <a href="#sponsors" className="hover:text-[#FDE68A] transition-colors">
            Partners
          </a>
          <a href="#faq" className="hover:text-[#FDE68A] transition-colors">
            FAQ
          </a>
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Check Status Button */}
          <button
            type="button"
            onClick={onOpenCheckStatus}
            className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm font-medium text-[#FDE68A] bg-[#072617]/80 hover:bg-[#072617] border border-[#D4AF37]/50 rounded-lg transition-all shadow-xs hover:border-[#D4AF37]"
            title="Check verification or payment status"
          >
            <Ticket className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D4AF37]" />
            <span className="hidden xs:inline">Check Pass</span>
            <span className="xs:hidden">Status</span>
          </button>

          {/* Book Ticket CTA */}
          <button
            type="button"
            onClick={onOpenRegister}
            disabled={isSoldOut}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-bold rounded-lg transition-all shadow-md transform hover:-translate-y-0.5 ${
              isSoldOut
                ? 'bg-neutral-600 text-neutral-300 cursor-not-allowed opacity-80'
                : 'bg-gradient-to-r from-[#FDE68A] via-[#D4AF37] to-[#B8860B] text-[#072617] hover:brightness-110 active:translate-y-0'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#072617]" />
            <span>{isSoldOut ? 'Sold Out' : 'Register Pass'}</span>
          </button>

          {/* Admin Login Gateway */}
          <button
            type="button"
            onClick={onOpenAdmin}
            aria-label="Admin Portal"
            className="p-1.5 sm:p-2 rounded-lg text-[#FDE68A]/70 hover:text-[#FDE68A] hover:bg-[#072617]/50 border border-transparent hover:border-[#D4AF37]/30 transition-all"
            title="Admin & Gate Security Portal"
          >
            <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 text-white hover:text-[#FDE68A]"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#072617]/98 border-b border-[#D4AF37]/30 px-5 py-4 space-y-3 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col space-y-3 text-sm font-medium text-[#FAF5EB]">
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 border-b border-white/5 hover:text-[#FDE68A]"
            >
              About Festival
            </a>
            <a
              href="#passes"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 border-b border-white/5 hover:text-[#FDE68A]"
            >
              Passes & Pricing (₹700)
            </a>
            <a
              href="#programs"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 border-b border-white/5 hover:text-[#FDE68A]"
            >
              Programs Timeline
            </a>
            <a
              href="#onasadya"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 border-b border-white/5 hover:text-[#FDE68A] flex items-center justify-between"
            >
              <span>24-Item Onasadya Feast</span>
              <span className="text-[10px] bg-[#D4AF37] text-[#0D472B] px-2 py-0.5 rounded font-bold">24 Dishes</span>
            </a>
            <a
              href="#guidelines"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 border-b border-white/5 hover:text-[#FDE68A]"
            >
              Guidelines & Rules
            </a>
            <a
              href="#sponsors"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 border-b border-white/5 hover:text-[#FDE68A]"
            >
              Partners & Sponsors
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#FDE68A]"
            >
              Frequently Asked Questions
            </a>
          </div>

          <div className="pt-2 border-t border-[#D4AF37]/20 flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs text-[#FDE68A]/80 py-1">
              <span>Passes Remaining:</span>
              <span className="font-mono font-bold text-[#FDE68A]">{remainingPasses} / 750</span>
            </div>
            <a
              href="https://maps.google.com/?q=PSR+Convention+Centre+Bengaluru"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-xs text-[#F3EAD8]/70 hover:text-white"
            >
              <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>PSR Convention Centre, Bengaluru</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
