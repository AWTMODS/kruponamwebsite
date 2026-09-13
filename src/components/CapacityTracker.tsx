import React from 'react';
import { Flame, CheckCircle, AlertTriangle, Users } from 'lucide-react';
import { useTickets } from '../context/TicketContext';

interface CapacityTrackerProps {
  compact?: boolean;
}

export const CapacityTracker: React.FC<CapacityTrackerProps> = ({ compact = false }) => {
  const { totalClaimedPasses, remainingPasses, capacityPercentage, isSoldOut, isSellingFast, settings } = useTickets();

  // Determine progress color gradient
  const getBarColor = () => {
    if (isSoldOut) return 'from-red-600 to-rose-700';
    if (isSellingFast) return 'from-amber-500 via-orange-500 to-rose-500';
    return 'from-[#D4AF37] via-[#10B981] to-[#0D472B]';
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border transition-all duration-300 ${
        isSoldOut
          ? 'bg-red-950/40 border-red-500/40 shadow-lg shadow-red-950/20'
          : isSellingFast
          ? 'bg-amber-950/30 border-amber-500/50 shadow-lg shadow-amber-950/20'
          : 'bg-[#072617]/70 border-[#D4AF37]/40 shadow-xl'
      } ${compact ? 'p-3 sm:p-4' : 'p-5 sm:p-7 backdrop-blur-md'}`}
    >
      {/* Urgency Badge Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          {isSoldOut ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-500/20 text-red-300 border border-red-500/40 animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
              Sold Out / Capacity Reached (750/750)
            </span>
          ) : isSellingFast ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide bg-gradient-to-r from-amber-500/20 to-red-500/20 text-amber-200 border border-amber-500/40 animate-pulse">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              🔥 Selling Fast! Only {remainingPasses} passes left!
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium tracking-wide bg-[#0D472B]/60 text-[#FDE68A] border border-[#D4AF37]/30">
              <Users className="w-3.5 h-3.5 text-[#D4AF37]" />
              🎟️ 750 Official Passes Available — First-to-pay, first-served
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-[#FAF5EB]/70">Strict Capacity:</span>
          <span className="font-bold text-[#FDE68A] bg-[#072617] px-2 py-0.5 rounded border border-[#D4AF37]/30">
            {settings.totalCapacity} Max Passes
          </span>
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="space-y-2">
        <div className="flex items-baseline justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-1.5 font-sans font-semibold text-white">
            <span>Passes Booked:</span>
            <span className="text-base sm:text-lg font-mono font-bold text-[#FDE68A]">
              {totalClaimedPasses}
            </span>
            <span className="text-white/60 text-xs sm:text-sm">/ {settings.totalCapacity}</span>
          </div>
          <div className="text-xs font-mono text-white/80 flex items-center gap-1">
            <span className="font-bold text-[#FDE68A]">{capacityPercentage}%</span>
            <span>Allocated</span>
          </div>
        </div>

        {/* The Track & Progress Bar */}
        <div className="relative w-full h-3 sm:h-3.5 bg-black/40 rounded-full overflow-hidden p-0.5 border border-white/10">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${getBarColor()} transition-all duration-700 ease-out shadow-sm`}
            style={{ width: `${Math.max(4, capacityPercentage)}%` }}
          />
        </div>

        {/* Footer Subtext */}
        <div className="flex items-center justify-between text-[11px] sm:text-xs text-[#FAF5EB]/60 pt-0.5 font-sans">
          <div className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-[#10B981]" />
            <span>Includes 24-dish authentic Onasadya feast</span>
          </div>
          <div className="font-mono font-medium text-[#FDE68A]">
            {isSoldOut ? (
              <span className="text-rose-400">Registrations Locked</span>
            ) : (
              <span>{remainingPasses} Available</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
