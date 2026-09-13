import React, { useState } from 'react';
import { Clock, MapPin, Sparkles, CheckCircle2 } from 'lucide-react';
import { festivalSchedule } from '../data/seedData';
import type { ProgramEvent } from '../types';


export const ScheduleTimeline: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeEvent, setActiveEvent] = useState<ProgramEvent | null>(festivalSchedule[1]);

  const categories = ['All', 'Ceremony', 'Music & Dance', 'Contest', 'Feast', 'Celebration'];

  const filteredEvents = selectedCategory === 'All'
    ? festivalSchedule
    : festivalSchedule.filter((e) => e.category === selectedCategory);

  return (
    <section id="programs" className="py-20 bg-[#FFFDF7] relative overflow-hidden">
      {/* Decorative Traditional Border Accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-50" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0D472B]/10 text-[#0D472B] text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            Cultural Extravaganza
          </div>
          <h2 className="font-['Cinzel'] text-3xl sm:text-4xl font-bold text-[#0D472B] tracking-tight mb-3">
            Festival Schedule & Timeline
          </h2>
          <p className="font-['Playfair_Display'] italic text-base sm:text-lg text-[#881337] mb-4">
            “ചെണ്ടമേളവും തിരുവാതിരയും വടംവലിയും — ഉത്സവമേളം ഉച്ചസ്ഥായിയിൽ”
          </p>
          <p className="text-sm text-stone-600 font-sans leading-relaxed">
            A continuous celebration of Kerala’s folklore, rhythm, athletic spirit, and culinary artistry from dawn till dusk.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#0D472B] text-[#FDE68A] shadow-xs'
                    : 'bg-[#FAF5EB] text-stone-700 hover:bg-[#F3EAD8] border border-stone-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Timeline List (Left) */}
          <div className="lg:col-span-7 space-y-4">
            {filteredEvents.map((event) => {
              const isSelected = activeEvent?.id === event.id;
              return (
                <div
                  key={event.id}
                  onClick={() => setActiveEvent(event)}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#FAF5EB] to-white border-[#D4AF37] shadow-md ring-1 ring-[#D4AF37]/30'
                      : 'bg-white hover:bg-[#FAF5EB]/50 border-stone-200 hover:border-[#D4AF37]/50 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#0D472B] bg-[#0D472B]/10 px-2.5 py-1 rounded-md">
                      <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>{event.time}</span>
                    </div>
                    <span className="text-[11px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
                      {event.category}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-base sm:text-lg text-[#0D472B] leading-snug">
                    {event.title}
                  </h3>
                  {event.malayalamTitle && (
                    <p className="text-xs text-[#881337] font-serif italic mb-1.5">
                      {event.malayalamTitle}
                    </p>
                  )}
                  <p className="text-xs text-stone-600 line-clamp-2 mb-3">
                    {event.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-100">
                    <div className="flex items-center gap-1.5 text-[#0D472B] font-medium">
                      <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>{event.location}</span>
                    </div>
                    <span className="text-[11px] text-[#D4AF37] font-semibold group-hover:underline">
                      View Details →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Highlight Card (Right) */}
          <div className="lg:col-span-5 sticky top-24">
            {activeEvent ? (
              <div className="bg-gradient-to-br from-[#072617] via-[#0D472B] to-[#145E3A] text-white rounded-3xl p-6 sm:p-7 border border-[#D4AF37]/40 shadow-2xl relative overflow-hidden">
                {/* Gold Arch Backdrop Accent */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#D4AF37]/10 rounded-full blur-2xl pointer-events-none" />

                <div className="relative z-10">
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="text-xs font-mono font-bold text-[#FDE68A] bg-black/40 px-3 py-1 rounded-full border border-[#D4AF37]/30">
                      {activeEvent.time}
                    </span>
                    <span className="text-xs text-[#FDE68A] uppercase font-bold tracking-wider">
                      {activeEvent.category}
                    </span>
                  </div>

                  <h3 className="font-['Cinzel'] text-xl sm:text-2xl font-bold text-white mb-1">
                    {activeEvent.title}
                  </h3>
                  {activeEvent.malayalamTitle && (
                    <p className="font-serif italic text-sm text-[#FDE68A] mb-4">
                      {activeEvent.malayalamTitle}
                    </p>
                  )}

                  <div className="flex items-center gap-2 text-xs text-[#FAF5EB]/90 bg-white/10 px-3 py-2 rounded-xl mb-5 backdrop-blur-xs">
                    <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0" />
                    <span className="font-medium">{activeEvent.location}</span>
                  </div>

                  <p className="text-xs sm:text-sm text-[#FAF5EB]/80 leading-relaxed mb-6 font-sans">
                    {activeEvent.description}
                  </p>

                  <div>
                    <h4 className="text-xs uppercase font-bold tracking-wider text-[#FDE68A] font-mono mb-2.5">
                      Event Highlights
                    </h4>
                    <div className="space-y-2">
                      {activeEvent.highlights.map((h, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-[#FAF5EB]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 pt-5 border-t border-white/10 flex items-center justify-between text-xs text-[#FAF5EB]/60">
                    <span>Entry: Kruponam Pass holders</span>
                    <span className="text-[#FDE68A] font-medium">Included in ₹700 Pass</span>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
};
