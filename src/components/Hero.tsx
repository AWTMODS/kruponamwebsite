import React from 'react';
import { Calendar, MapPin, Sparkles, Ticket, Bus, ArrowRight, ShieldCheck, Utensils, Music } from 'lucide-react';
import { useTickets } from '../context/TicketContext';
import { CapacityTracker } from './CapacityTracker';

interface HeroProps {
  onOpenRegister: () => void;
  onOpenCheckStatus: () => void;
  onOpenDriverModal: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenRegister,
  onOpenCheckStatus,
  onOpenDriverModal,
}) => {
  const { settings, isSoldOut } = useTickets();

  return (
    <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden">
      {/* Background Gradient & Cultural Patterns */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#051A10] via-[#0D472B] to-[#FAF5EB] -z-10" />
      
      {/* Pookalam Mandala Watermark */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] md:w-[900px] md:h-[900px] pointer-events-none opacity-10 -z-10">
        <svg viewBox="0 0 200 200" className="w-full h-full text-[#D4AF37] animate-[spin_120s_linear_infinite]">
          <circle cx="100" cy="100" r="95" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 2" />
          <circle cx="100" cy="100" r="75" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="100" cy="100" r="55" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="6 3" />
          {Array.from({ length: 12 }).map((_, i) => (
            <ellipse
              key={i}
              cx="100"
              cy="100"
              rx="18"
              ry="70"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.8"
              transform={`rotate(${i * 30} 100 100)`}
            />
          ))}
          <circle cx="100" cy="100" r="20" fill="currentColor" opacity="0.3" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Festival Announcement Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#072617]/80 border border-[#D4AF37]/50 text-xs sm:text-sm text-[#FDE68A] shadow-md backdrop-blur-md mb-6 animate-bounce-subtle">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#10B981]"></span>
            </span>
            <span className="font-medium tracking-wide">
              Krupanidhi Presents • Annual Grand Onam Mahotsavam
            </span>
            <span className="hidden sm:inline text-[#D4AF37] font-semibold">| 14 September 2026</span>
          </div>

          {/* Main Title Heading */}
          <h1 className="font-['Cinzel'] font-bold text-4xl sm:text-6xl lg:text-7xl text-white tracking-tight leading-[1.1] mb-4">
            KRUPONAM{' '}
            <span className="gold-gradient-text block sm:inline font-extrabold">
              2026
            </span>
          </h1>

          {/* Subtitle with traditional phrasing */}
          <p className="font-['Playfair_Display'] italic text-lg sm:text-2xl text-[#F3EAD8] max-w-2xl mx-auto mb-3 font-medium">
            “ഒരുമയുടെയും ആഹ്ളാദത്തിന്റെയും പൊന്നോണം”
          </p>
          <p className="text-sm sm:text-base text-[#FAF5EB]/80 max-w-2xl mx-auto mb-8 font-sans leading-relaxed">
            Bengaluru’s premier inter-college Onam cultural festival. Experience electrifying Shinkari Melam, 
            graceful Thiruvathirakali, royal Maveli arrival, live DJ night, and the legendary 
            <strong className="text-[#FDE68A] font-semibold"> 24-course traditional Onasadya feast</strong> served on fresh plantain leaves.
          </p>

          {/* Event Metadata Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 max-w-3xl mx-auto mb-8 text-left">
            {/* Date & Time */}
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#072617]/70 border border-[#D4AF37]/30 backdrop-blur-xs text-white">
              <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/15 flex items-center justify-center text-[#FDE68A] shrink-0">
                <Calendar className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-[#FDE68A]/70 font-semibold font-mono">Event Date</p>
                <p className="text-xs sm:text-sm font-bold text-white leading-tight">{settings.eventDate}</p>
                <p className="text-[11px] text-[#FAF5EB]/60">08:30 AM — 09:30 PM IST</p>
              </div>
            </div>

            {/* Venue & Maps */}
            <a
              href={settings.venueMapsUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 p-3.5 rounded-xl bg-[#072617]/70 border border-[#D4AF37]/30 backdrop-blur-xs text-white hover:border-[#D4AF37] hover:bg-[#072617] transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/15 flex items-center justify-center text-[#FDE68A] shrink-0 group-hover:scale-105 transition-transform">
                <MapPin className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] uppercase tracking-wider text-[#FDE68A]/70 font-semibold font-mono">Venue</p>
                  <span className="text-[10px] text-[#FDE68A] underline group-hover:text-white">Maps ↗</span>
                </div>
                <p className="text-xs sm:text-sm font-bold text-white leading-tight truncate">PSR Convention Centre</p>
                <p className="text-[11px] text-[#FAF5EB]/60 truncate">Near Krupanidhi Campus, Bengaluru</p>
              </div>
            </a>

            {/* Inclusions */}
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#072617]/70 border border-[#D4AF37]/30 backdrop-blur-xs text-white sm:col-span-2 md:col-span-1">
              <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/15 flex items-center justify-center text-[#FDE68A] shrink-0">
                <Utensils className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-[#FDE68A]/70 font-semibold font-mono">Pass Inclusions</p>
                <p className="text-xs sm:text-sm font-bold text-[#FDE68A] leading-tight">₹{settings.generalPassPrice} General Pass</p>
                <p className="text-[11px] text-[#FAF5EB]/60">Full Day + 24-Dish Sadya + DJ</p>
              </div>
            </div>
          </div>

          {/* Call to Actions (Hero CTAs) */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 mb-10">
            {/* Primary Book Ticket Button */}
            <button
              type="button"
              onClick={onOpenRegister}
              disabled={isSoldOut}
              className={`flex items-center gap-2 px-6 py-3.5 sm:px-8 sm:py-4 rounded-xl font-bold text-sm sm:text-base shadow-xl transition-all transform hover:-translate-y-0.5 ${
                isSoldOut
                  ? 'bg-neutral-600 text-neutral-300 cursor-not-allowed'
                  : 'gold-gradient-bg text-[#072617] hover:brightness-110 active:translate-y-0'
              }`}
            >
              <Sparkles className="w-5 h-5 text-[#072617]" />
              <span>{isSoldOut ? 'Capacity Reached (Sold Out)' : 'Get Your Tickets (₹700)'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Check Status */}
            <button
              type="button"
              onClick={onOpenCheckStatus}
              className="flex items-center gap-2 px-5 py-3.5 sm:px-6 sm:py-4 rounded-xl font-semibold text-sm sm:text-base text-white bg-[#072617]/90 hover:bg-[#072617] border border-[#D4AF37]/60 hover:border-[#D4AF37] transition-all shadow-md"
            >
              <Ticket className="w-5 h-5 text-[#D4AF37]" />
              <span>Check Ticket Status</span>
            </button>

            {/* Driver Registration Sub-Action */}
            <button
              type="button"
              onClick={onOpenDriverModal}
              className="flex items-center gap-2 px-4 py-3 sm:px-5 sm:py-3.5 rounded-xl text-xs sm:text-sm font-medium text-[#FDE68A] bg-black/30 hover:bg-black/50 border border-white/10 hover:border-[#D4AF37]/40 transition-all"
            >
              <Bus className="w-4 h-4 text-[#D4AF37]" />
              <span>Driver Registration</span>
            </button>
          </div>

          {/* Ticket Capacity Engine Card */}
          <div className="max-w-2xl mx-auto">
            <CapacityTracker />
          </div>

          {/* Trust Highlights Row */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 mt-8 text-xs text-[#0D472B]/80 font-medium">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#0D472B]" />
              <span>Strictly 750 Verified Passes</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Utensils className="w-4 h-4 text-[#0D472B]" />
              <span>Unlimited Authentic Sadya</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Music className="w-4 h-4 text-[#0D472B]" />
              <span>Shinkari Melam & Live DJ</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
