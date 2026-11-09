import React, { useState, useRef, useEffect } from 'react';
import {
  LiveAssistanceActivity
} from '../types';
import {
  ArrowUpRight,
  ArrowDownLeft,
  HandCoins,
  CheckCircle2,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Zap,
  Building2,
  Clock,
  MapPin,
  X,
  CreditCard,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';

interface LiveAssistanceTickerProps {
  activities: LiveAssistanceActivity[];
  onOpenRenderAssistance?: () => void;
  onOpenGetAssistance?: () => void;
  variant?: 'banner' | 'embedded';
  showControls?: boolean;
}

export const LiveAssistanceTicker: React.FC<LiveAssistanceTickerProps> = ({
  activities,
  onOpenRenderAssistance,
  onOpenGetAssistance,
  variant = 'banner',
  showControls = true,
}) => {
  const [filter, setFilter] = useState<'ALL' | 'RENDERED' | 'GOT'>('ALL');
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState<'normal' | 'fast' | 'slow'>('slow');
  const [selectedActivity, setSelectedActivity] = useState<LiveAssistanceActivity | null>(null);

  // Manual drag to scroll state
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  // Filter items
  const filteredActivities = activities.filter((act) => {
    if (filter === 'RENDERED') return act.type === 'RENDERED';
    if (filter === 'GOT') return act.type === 'GOT';
    return true;
  });

  const renderedCount = activities.filter((a) => a.type === 'RENDERED').length;
  const gotCount = activities.filter((a) => a.type === 'GOT').length;

  // Duplicate list twice to guarantee seamless, uninterrupted infinite loop at 50% keyframe
  const displayItems = filteredActivities.length > 0
    ? [...filteredActivities, ...filteredActivities]
    : [];

  const handleManualScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeftState(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollContainerRef.current.scrollLeft = scrollLeftState - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  // Touch event handlers for tablets & mobile phones
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeftState(scrollContainerRef.current.scrollLeft);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    const x = e.touches[0].pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollContainerRef.current.scrollLeft = scrollLeftState - walk;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const speedClass = speed === 'fast' ? 'speed-fast' : speed === 'slow' ? 'speed-slow' : 'speed-normal';

  return (
    <div
      className={`relative w-full overflow-hidden transition-all duration-300 ${
        variant === 'banner'
          ? 'bg-[#050505] border-y border-neutral-850 shadow-2xl'
          : 'bg-[#080808] border border-neutral-800 rounded-3xl p-4 sm:p-5 shadow-2xl'
      }`}
    >
      {/* Top Bar: Live Activity Beacon, Filters & Movement Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-col sm:flex-row flex-wrap lg:flex-nowrap items-center justify-between gap-2.5 border-b border-neutral-850 text-xs">
        
        {/* Left: Live Pulse Tag */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 font-bold uppercase tracking-wider text-[11px] shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-extrabold text-[10px] sm:text-[11px]">LIVE PEER-TO-PEER ASSISTANCE FEED</span>
          </div>

          <span className="hidden lg:inline text-neutral-400 text-[11px]">
            Live movable stream of newly rendered assistance & received payouts
          </span>
        </div>

        {/* Center: Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black border border-neutral-800 shrink-0">
          <button
            type="button"
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer flex items-center gap-1.5 ${
              filter === 'ALL'
                ? 'bg-neutral-800 text-white shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <span>All Live Activity</span>
            <span className="px-1.5 py-0.2 rounded-md bg-neutral-900 text-[10px] text-neutral-400 border border-neutral-750 font-mono">
              {activities.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setFilter('RENDERED')}
            className={`px-3 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer flex items-center gap-1.5 ${
              filter === 'RENDERED'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-neutral-400 hover:text-emerald-400'
            }`}
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Newly Rendered</span>
            <span className="px-1.5 py-0.2 rounded-md bg-neutral-900 text-[10px] text-emerald-400 border border-neutral-750 font-mono">
              {renderedCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setFilter('GOT')}
            className={`px-3 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer flex items-center gap-1.5 ${
              filter === 'GOT'
                ? 'bg-amber-600 text-white shadow'
                : 'text-neutral-400 hover:text-amber-400'
            }`}
          >
            <ArrowDownLeft className="w-3.5 h-3.5" />
            <span>Got Assistance</span>
            <span className="px-1.5 py-0.2 rounded-md bg-neutral-900 text-[10px] text-amber-400 border border-neutral-750 font-mono">
              {gotCount}
            </span>
          </button>
        </div>

        {/* Right: Movement Controls (Pause/Play, Speed, Scroll Arrows) */}
        {showControls && (
          <div className="flex items-center gap-2 shrink-0">
            {/* Speed Selector */}
            <div className="hidden sm:flex items-center gap-1 bg-black p-0.5 rounded-lg border border-neutral-800 text-[10px]">
              <button
                type="button"
                onClick={() => setSpeed('slow')}
                className={`px-2 py-0.5 rounded font-medium transition cursor-pointer ${
                  speed === 'slow' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
                }`}
                title="Barest minimum slow glide"
              >
                Minimum
              </button>
              <button
                type="button"
                onClick={() => setSpeed('normal')}
                className={`px-2 py-0.5 rounded font-medium transition cursor-pointer ${
                  speed === 'normal' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Normal
              </button>
              <button
                type="button"
                onClick={() => setSpeed('fast')}
                className={`px-2 py-0.5 rounded font-medium transition cursor-pointer ${
                  speed === 'fast' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Fast
              </button>
            </div>

            {/* Play/Pause Button */}
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className={`p-1.5 rounded-lg border transition cursor-pointer flex items-center gap-1 text-[11px] font-semibold ${
                isPlaying
                  ? 'bg-neutral-900 border-neutral-700 text-neutral-300 hover:text-white'
                  : 'bg-emerald-950/80 border-emerald-600 text-emerald-300'
              }`}
              title={isPlaying ? 'Pause horizontal movement' : 'Resume horizontal movement'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span className="hidden md:inline">{isPlaying ? 'Pause' : 'Play'}</span>
            </button>

            {/* Manual Slide Arrows */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleManualScroll('left')}
                className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white transition cursor-pointer"
                title="Scroll Left"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleManualScroll('right')}
                className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white transition cursor-pointer"
                title="Scroll Right"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Movable Horizontal Track */}
      <div
        ref={scrollContainerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`relative w-full py-3.5 px-4 overflow-x-auto no-scrollbar cursor-grab active:cursor-grabbing select-none ${
          isDragging ? 'cursor-grabbing' : ''
        }`}
      >
        <div
          className={`flex items-center gap-4.5 w-max ${
            isPlaying && !isDragging ? `animate-marquee-smooth ${speedClass}` : 'pause-animation'
          }`}
        >
          {displayItems.map((item, index) => {
            const isRendered = item.type === 'RENDERED';

            return (
              <div
                key={`${item.id}-${index}`}
                onClick={() => setSelectedActivity(item)}
                className={`flex items-center gap-3.5 px-4 py-2.5 rounded-2xl border transition-all duration-200 cursor-pointer shadow-lg group hover:scale-[1.03] ${
                  isRendered
                    ? 'bg-gradient-to-r from-[#07130b] via-[#091a0e] to-[#06120a] border-emerald-800/80 hover:border-emerald-500 hover:shadow-emerald-950/60'
                    : 'bg-gradient-to-r from-[#170e04] via-[#1f1305] to-[#120a02] border-amber-800/80 hover:border-amber-500 hover:shadow-amber-950/60'
                }`}
              >
                {/* Status Icon Pillar */}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition shadow-inner ${
                    isRendered
                      ? 'bg-emerald-950/90 border-emerald-600/70 text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white'
                      : 'bg-amber-950/90 border-amber-600/70 text-amber-400 group-hover:bg-amber-600 group-hover:text-white'
                  }`}
                >
                  {isRendered ? (
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover:scale-110" />
                  ) : (
                    <ArrowDownLeft className="w-4 h-4 transition-transform group-hover:scale-110" />
                  )}
                </div>

                {/* Details Content */}
                <div className="flex flex-col text-left min-w-[210px] sm:min-w-[240px]">
                  {/* Top Tag & Time */}
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                        isRendered
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-700/60'
                          : 'bg-amber-950 text-amber-300 border-amber-700/60'
                      }`}
                    >
                      {isRendered ? 'RENDERED ASSISTANCE' : 'GOT ASSISTANCE'}
                    </span>

                    <span className="text-[10px] text-neutral-400 flex items-center gap-1 font-mono">
                      <Clock className="w-2.5 h-2.5 text-neutral-500" />
                      {item.timeAgo}
                    </span>
                  </div>

                  {/* Name of Person */}
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-xs sm:text-sm font-black text-white group-hover:text-neutral-100 truncate max-w-[170px] sm:max-w-[210px]">
                      {item.personName}
                    </span>
                    {item.location && (
                      <span className="text-[10px] text-neutral-400 flex items-center gap-0.5 shrink-0">
                        <MapPin className="w-2.5 h-2.5 text-neutral-500" />
                        {item.location.split(' ')[0]}
                      </span>
                    )}
                  </div>

                  {/* Amount and Purpose Note */}
                  <div className="flex items-center justify-between gap-2 mt-1">
                    <div className="flex items-baseline gap-1">
                      <span
                        className={`text-sm sm:text-base font-black font-mono tracking-tight ${
                          isRendered ? 'text-emerald-400' : 'text-amber-400'
                        }`}
                      >
                        ₦{item.amount.toLocaleString()}
                      </span>
                      {!isRendered && (
                        <span className="text-[9px] font-bold text-amber-300/80 bg-amber-950/60 px-1 py-0.2 rounded">
                          +20% Div
                        </span>
                      )}
                    </div>

                    <span className="text-[10px] text-neutral-400 truncate max-w-[110px] sm:max-w-[140px] text-right font-medium">
                      {item.sectorOrCoop || item.bankName || 'Verified P2P'}
                    </span>
                  </div>
                </div>

                {/* Subtle vertical separator bullet */}
                <div className="h-8 w-[1px] bg-neutral-800 ml-1 shrink-0" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Detail Modal when a moving card is clicked */}
      {selectedActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md rounded-3xl bg-[#0c0c0c] border border-neutral-700 shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                {selectedActivity.type === 'RENDERED' ? (
                  <ArrowUpRight className="w-5 h-5 text-emerald-400" />
                ) : (
                  <ArrowDownLeft className="w-5 h-5 text-amber-400" />
                )}
                <span>
                  {selectedActivity.type === 'RENDERED'
                    ? 'Rendered Assistance Record'
                    : 'Assistance Payout Confirmation'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedActivity(null)}
                className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-black border border-neutral-800 space-y-3.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Activity Type:</span>
                <span
                  className={`px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px] ${
                    selectedActivity.type === 'RENDERED'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                      : 'bg-amber-950 text-amber-300 border border-amber-700'
                  }`}
                >
                  {selectedActivity.type === 'RENDERED'
                    ? 'Newly Rendered Assistance'
                    : 'Got Assistance (Payout)'}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Member Name:</span>
                <span className="font-bold text-white text-sm">
                  {selectedActivity.personName}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Assistance Amount:</span>
                <span
                  className={`font-mono text-xl font-black ${
                    selectedActivity.type === 'RENDERED' ? 'text-emerald-400' : 'text-amber-400'
                  }`}
                >
                  ₦{selectedActivity.amount.toLocaleString()}
                </span>
              </div>

              {selectedActivity.sectorOrCoop && (
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400">Agricultural Sector:</span>
                  <span className="text-white font-semibold text-right">
                    {selectedActivity.sectorOrCoop}
                  </span>
                </div>
              )}

              {selectedActivity.location && (
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400">Region / State:</span>
                  <span className="text-neutral-200">{selectedActivity.location}</span>
                </div>
              )}

              {selectedActivity.bankName && (
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400">Settlement Bank:</span>
                  <span className="text-emerald-400 font-bold">{selectedActivity.bankName}</span>
                </div>
              )}

              {selectedActivity.note && (
                <div className="pt-2 border-t border-neutral-850">
                  <span className="text-[10px] text-neutral-400 block uppercase tracking-wider">
                    Purpose / Verification Note:
                  </span>
                  <p className="text-neutral-200 mt-0.5 leading-relaxed">
                    {selectedActivity.note}
                  </p>
                </div>
              )}

              <div className="pt-2 border-t border-neutral-850 flex justify-between items-center text-[11px]">
                <span className="text-neutral-400">Timestamp:</span>
                <span className="text-neutral-300 font-mono">{selectedActivity.timeAgo}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setSelectedActivity(null)}
                className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-xs text-neutral-300 font-semibold transition"
              >
                Close
              </button>
              {selectedActivity.type === 'RENDERED' && onOpenRenderAssistance ? (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedActivity(null);
                    onOpenRenderAssistance();
                  }}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-md"
                >
                  Render Assistance Now
                </button>
              ) : selectedActivity.type === 'GOT' && onOpenGetAssistance ? (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedActivity(null);
                    onOpenGetAssistance();
                  }}
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition shadow-md"
                >
                  Get Assistance Now
                </button>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
