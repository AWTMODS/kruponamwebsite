import React, { useState } from 'react';
import { Utensils, Sparkles, X, Leaf } from 'lucide-react';
import { onasadyaDishes } from '../data/seedData';
import type { OnasadyaDish } from '../types';


export const OnasadyaShowcase: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeDish, setActiveDish] = useState<OnasadyaDish | null>(null);

  const categories = [
    'All',
    'Rice & Dal',
    'Curry & Gravy',
    'Crispy & Savory',
    'Pickle & Chutney',
    'Sweet Dessert (Payasam)',
  ];

  const filteredDishes = selectedCategory === 'All'
    ? onasadyaDishes
    : onasadyaDishes.filter((d) => d.category === selectedCategory);

  return (
    <section id="onasadya" className="py-24 bg-[#FAF5EB] relative overflow-hidden">
      {/* Decorative Kasavu Zari Accent Pattern */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#D4AF37]/20 text-[#8C6B08] text-xs font-bold uppercase tracking-widest mb-3 border border-[#D4AF37]/40">
            <Utensils className="w-3.5 h-3.5 text-[#D4AF37]" />
            Royal Gastronomy
          </div>
          <h2 className="font-['Cinzel'] text-3xl sm:text-5xl font-bold text-[#0D472B] tracking-tight mb-3">
            The Grand 24-Item Onasadya
          </h2>
          <p className="font-serif italic text-lg sm:text-xl text-[#881337] mb-4">
            “വാഴയിലയിൽ വിളമ്പിയ 24 വിഭവങ്ങളുടെ അമൃതേത്ത്”
          </p>
          <p className="text-sm sm:text-base text-stone-600 font-sans leading-relaxed">
            Prepared by master traditional chefs from Kottayam and Central Travancore. Served fresh on tender plantain leaves in accordance with ancient culinary customs.
          </p>

          {/* Plantain Leaf Banner */}
          <div className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#0D472B] text-[#FAF5EB] text-xs sm:text-sm font-medium shadow-md">
            <Leaf className="w-4 h-4 text-[#10B981]" />
            <span>Plantain leaf seating begins sharp at <strong>01:15 PM</strong> • Included with your Pass</span>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#0D472B] text-[#FDE68A] shadow-md scale-105'
                    : 'bg-white text-stone-700 hover:bg-[#F3EAD8] border border-stone-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 24-Dish Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {filteredDishes.map((dish) => (
            <div
              key={dish.id}
              onClick={() => setActiveDish(dish)}
              className="group bg-white rounded-2xl p-5 border border-stone-200 hover:border-[#D4AF37] hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden"
            >
              {/* Top Dish Badge & Number */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="w-6 h-6 rounded-full bg-[#FAF5EB] text-[#0D472B] font-mono font-bold text-xs flex items-center justify-center border border-[#D4AF37]/40">
                    {dish.id}
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-[#0D472B]/10 text-[#0D472B]">
                    {dish.category}
                  </span>
                </div>

                <h3 className="font-serif font-bold text-base text-[#0D472B] group-hover:text-[#B8860B] transition-colors leading-snug">
                  {dish.name}
                </h3>
                <p className="font-serif text-xs text-[#881337] italic mb-2">
                  {dish.malayalamName}
                </p>
                <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed mb-3">
                  {dish.description}
                </p>
              </div>

              {/* Bottom Placement & Taste Tag */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                <span className="truncate max-w-[170px] text-stone-500 italic">
                  📍 {dish.traditionalPlacement}
                </span>
                <span className="text-[#D4AF37] font-semibold shrink-0 group-hover:translate-x-0.5 transition-transform">
                  Details →
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Dish Detail Modal */}
        {activeDish && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-[#FFFDF7] rounded-3xl max-w-lg w-full p-6 sm:p-7 border-2 border-[#D4AF37] shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setActiveDish(null)}
                className="absolute top-4 right-4 p-2 rounded-full text-stone-500 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-1 text-xs font-mono text-[#0D472B] font-bold uppercase tracking-wider">
                <span className="w-6 h-6 rounded-full bg-[#0D472B] text-white flex items-center justify-center text-xs">
                  {activeDish.id}
                </span>
                <span>{activeDish.category}</span>
              </div>

              <h3 className="font-['Cinzel'] text-2xl font-bold text-[#0D472B] mt-2 mb-0.5">
                {activeDish.name}
              </h3>
              <p className="font-serif italic text-base text-[#881337] mb-4">
                {activeDish.malayalamName}
              </p>

              <div className="p-3.5 rounded-xl bg-[#FAF5EB] border border-[#D4AF37]/30 mb-4">
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-sans">
                  {activeDish.description}
                </p>
              </div>

              <div className="space-y-3 text-xs sm:text-sm mb-6">
                <div>
                  <h4 className="font-bold text-stone-900 mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                    Key Indigenous Ingredients:
                  </h4>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {activeDish.ingredients.map((ing, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-md bg-stone-100 text-stone-700 text-xs font-medium border border-stone-200"
                      >
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200">
                    <span className="text-[11px] uppercase tracking-wider text-stone-400 font-bold block">Taste Profile</span>
                    <span className="font-medium text-stone-800 text-xs">{activeDish.tasteProfile}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200">
                    <span className="text-[11px] uppercase tracking-wider text-stone-400 font-bold block">Leaf Position</span>
                    <span className="font-medium text-stone-800 text-xs">{activeDish.traditionalPlacement}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveDish(null)}
                className="w-full py-2.5 rounded-xl bg-[#0D472B] text-[#FDE68A] font-bold text-sm hover:bg-[#072617] transition-all"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
