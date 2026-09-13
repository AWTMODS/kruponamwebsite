import { useState, useEffect } from 'react';
import { TicketProvider } from './context/TicketContext';
import { FloatingPetals } from './components/FloatingPetals';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PassesPricing } from './components/PassesPricing';
import { ScheduleTimeline } from './components/ScheduleTimeline';
import { OnasadyaShowcase } from './components/OnasadyaShowcase';
import { GuidelinesSection } from './components/GuidelinesSection';
import { GalleryMasonry } from './components/GalleryMasonry';
import { Sponsors } from './components/Sponsors';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';

// Modals
import { RegistrationModal } from './components/RegistrationModal';
import { CheckTicketStatusModal } from './components/CheckTicketStatusModal';
import { DigitalPassModal } from './components/DigitalPassModal';
import { DriverRegistrationModal } from './components/DriverRegistrationModal';
import { AdminPortal } from './components/AdminPortal';
import type { Registration } from './types';
import { Sparkles } from 'lucide-react';


export function AppContent() {
  // Modal Visibility States
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isCheckStatusOpen, setIsCheckStatusOpen] = useState(false);
  const [isDriverModalOpen, setIsDriverModalOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Digital Pass State
  const [selectedPass, setSelectedPass] = useState<Registration | null>(null);
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);

  // Initial Token if forwarded from registration
  const [statusInitialToken, setStatusInitialToken] = useState('');

  // Handle URL query param (e.g. ?token=KRUP-2026-1048 or ?admin=true)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenParam = params.get('token');
    const adminParam = params.get('admin');

    if (tokenParam) {
      setStatusInitialToken(tokenParam);
      setIsCheckStatusOpen(true);
    }
    if (adminParam === 'true') {
      setIsAdminOpen(true);
    }
  }, []);

  const handleOpenDigitalPass = (reg: Registration) => {
    setSelectedPass(reg);
    setIsPassModalOpen(true);
  };

  const handleViewStatusWithToken = (token: string) => {
    setIsRegisterOpen(false);
    setStatusInitialToken(token);
    setIsCheckStatusOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF5EB] text-[#1A2E20] relative selection:bg-[#D4AF37] selection:text-[#0D472B]">
      {/* Floating Kerala Marigold & Jasmine Petals */}
      <FloatingPetals />

      {/* Navigation Header */}
      <Navbar
        onOpenRegister={() => setIsRegisterOpen(true)}
        onOpenCheckStatus={() => {
          setStatusInitialToken('');
          setIsCheckStatusOpen(true);
        }}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Main Page Sections */}
      <main>
        {/* 1. Hero with Real-Time Ticket Capacity Engine (Strictly 750 Passes) */}
        <Hero
          onOpenRegister={() => setIsRegisterOpen(true)}
          onOpenCheckStatus={() => {
            setStatusInitialToken('');
            setIsCheckStatusOpen(true);
          }}
          onOpenDriverModal={() => setIsDriverModalOpen(true)}
        />

        {/* About / Heritage Section */}
        <section id="about" className="py-20 bg-[#FAF5EB] relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-6 space-y-4 text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0D472B]/10 text-[#0D472B] text-xs font-bold uppercase tracking-widest">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  College Heritage & Tradition
                </div>
                <h2 className="font-['Cinzel'] text-3xl sm:text-4xl font-bold text-[#0D472B] tracking-tight">
                  Welcome to the Golden Spirit of Kruponam 2026
                </h2>
                <p className="font-serif italic text-lg text-[#881337]">
                  “മാവേലി നാടുവാണീടും കാലം, മാനുഷരെല്ലാരും ഒന്നുപോലെ”
                </p>
                <p className="text-sm sm:text-base text-stone-600 font-sans leading-relaxed">
                  Kruponam represents the pinnacle of collegiate unity, culture, and joy. Every year, students, faculty, alumni, and distinguished guests assemble in traditional Kerala Kasavu attire to welcome King Mahabali with drumbeats, laughter, competitive sports, and unforgettable culinary feasts.
                </p>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
                    <span className="font-mono text-2xl font-bold text-[#0D472B]">750</span>
                    <span className="block text-xs text-stone-500 font-medium mt-0.5">Strict Total Passes</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
                    <span className="font-mono text-2xl font-bold text-[#881337]">24</span>
                    <span className="block text-xs text-stone-500 font-medium mt-0.5">Sadya Dishes on Leaf</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 relative">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-[#D4AF37] aspect-4/3">
                  <img
                    src="https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?w=900&auto=format&fit=crop&q=80"
                    alt="Kerala Festival Percussion"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6 text-left">
                    <span className="text-xs font-mono font-bold uppercase text-[#FDE68A]">
                      Live Onam Mahotsavam
                    </span>
                    <h3 className="font-serif font-bold text-xl text-white">
                      14 September 2026 • PSR Convention Centre
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Passes & Pricing (₹700 General Pass & Driver Pass) */}
        <PassesPricing
          onOpenRegister={() => setIsRegisterOpen(true)}
          onOpenDriverModal={() => setIsDriverModalOpen(true)}
        />

        {/* 3. Program Timeline & Cultural Schedule */}
        <ScheduleTimeline />

        {/* 4. Interactive 24-Item Traditional Onasadya Feast */}
        <OnasadyaShowcase />

        {/* 5. Guidelines & Safety Protocols */}
        <GuidelinesSection />

        {/* 6. Gallery Masonry */}
        <GalleryMasonry />

        {/* 7. Sponsors & Collaborators */}
        <Sponsors />

        {/* 8. Frequently Asked Questions */}
        <FAQSection />
      </main>

      {/* Footer */}
      <Footer
        onOpenCheckStatus={() => {
          setStatusInitialToken('');
          setIsCheckStatusOpen(true);
        }}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Modals Container */}

      {/* Two-Stage Student Registration Modal */}
      <RegistrationModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onViewStatusWithToken={handleViewStatusWithToken}
      />

      {/* Check Ticket Status & Payment Submission Modal */}
      <CheckTicketStatusModal
        isOpen={isCheckStatusOpen}
        onClose={() => setIsCheckStatusOpen(false)}
        initialToken={statusInitialToken}
        onOpenDigitalPass={handleOpenDigitalPass}
      />

      {/* High-Resolution Printable / Downloadable Digital Pass Modal */}
      <DigitalPassModal
        isOpen={isPassModalOpen}
        onClose={() => setIsPassModalOpen(false)}
        registration={selectedPass}
      />

      {/* Driver Registration Modal */}
      <DriverRegistrationModal
        isOpen={isDriverModalOpen}
        onClose={() => setIsDriverModalOpen(false)}
      />

      {/* Full Admin & Gate Scanner Management Portal */}
      <AdminPortal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onOpenDigitalPass={handleOpenDigitalPass}
      />
    </div>
  );
}

export default function App() {
  return (
    <TicketProvider>
      <AppContent />
    </TicketProvider>
  );
}
