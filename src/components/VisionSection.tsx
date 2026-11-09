import React from 'react';
import { ArrowRight } from 'lucide-react';

interface VisionSectionProps {
  onOpenRegister: () => void;
  onGoToDashboard: () => void;
}

export const VisionSection: React.FC<VisionSectionProps> = ({ onOpenRegister, onGoToDashboard }) => {
  return (
    <div className="space-y-16 py-6 pb-20">
      
      {/* Title Header */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-semibold text-emerald-400 uppercase tracking-widest">
          <span>Our Vision & Strategic Blueprint</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Achieving Complete Regional Food Security by 2030.
        </h1>
        <p className="text-base sm:text-lg text-neutral-300 leading-relaxed">
          At Farm Base Club, our vision extends far beyond transactional financing. We are constructing the continent's most resilient decentralized agricultural production backbone—one where farmers are permanently empowered, post-harvest losses are eliminated, and members harvest dependable yields.
        </p>
      </section>

      {/* 3 Core Strategic Pillars */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
        
        <div className="p-6 sm:p-7 md:p-8 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4">
          <h3 className="text-xl font-bold text-white">Quadrupling Crop Yields</h3>
          <p className="text-sm text-neutral-300 leading-relaxed">
            By shifting farmers from handheld machetes and hoes to mechanized harvesters, precision seed drills, and drip irrigation, average grain yields elevate from 1.5 tons to 6.8 tons per hectare.
          </p>
          <div className="pt-2 text-xs text-emerald-400 font-bold uppercase tracking-wider">
            Target: 500,000 Hectares by 2030
          </div>
        </div>

        <div className="p-8 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4">
          <h3 className="text-xl font-bold text-white">Zero Food Import Dependency</h3>
          <p className="text-sm text-neutral-300 leading-relaxed">
            Domestic production of rice, maize, soybeans, and cassava will replace multi-billion-Naira food import bills, insulating local communities against foreign exchange volatility and global supply shocks.
          </p>
          <div className="pt-2 text-xs text-emerald-400 font-bold uppercase tracking-wider">
            Target: 100% Domestic Grain Sovereignty
          </div>
        </div>

        <div className="p-8 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4">
          <h3 className="text-xl font-bold text-white">Democratic Wealth Creation</h3>
          <p className="text-sm text-neutral-300 leading-relaxed">
            Traditional commercial banks hoard agricultural profits in corporate towers. Farm Base Club redirects wealth directly back to the members who sponsor the land, delivering up to 20% dividend in a disciplined 20-day cycle.
          </p>
          <div className="pt-2 text-xs text-emerald-400 font-bold uppercase tracking-wider">
            Target: ₦100B+ Distributed to Members
          </div>
        </div>

      </section>

      {/* Vision Roadmap Timeline */}
      <section className="p-8 rounded-3xl bg-neutral-950 border border-neutral-800 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">
            The Roadmap to 2030
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Transforming Agriculture Phase by Phase
          </h2>
        </div>

        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-black border border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Phase 1 (2024 - 2026) · Current Milestone</span>
              <h4 className="text-lg font-bold text-white">Mechanization & Cooperative Integration</h4>
              <p className="text-xs text-neutral-400 max-w-2xl">
                Mobilized over 10,000 active members across 36 regional farming belts. Deployed 340+ heavy tractors, central pivot solar irrigation units, and guaranteed buyback grain silos.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 text-xs font-bold border border-emerald-800 shrink-0 self-start md:self-auto">
              Active Operation
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-black border border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Phase 2 (2027 - 2028)</span>
              <h4 className="text-lg font-bold text-white">Industrial Agro-Processing Zones</h4>
              <p className="text-xs text-neutral-400 max-w-2xl">
                Establishing automated tomato paste processing facilities, cassava ethanol distillers, and parboiled rice bagging mills right beside farming clusters to convert raw commodities into high-margin consumer products.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-neutral-900 text-neutral-400 text-xs font-medium border border-neutral-700 shrink-0 self-start md:self-auto">
              Initiating 2027
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-black border border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Phase 3 (2029 - 2030)</span>
              <h4 className="text-lg font-bold text-white">Continental Export Corridors</h4>
              <p className="text-xs text-neutral-400 max-w-2xl">
                Exporting premium packaged non-GMO grains, sesame, cashew, and cassava starch across ECOWAS, European, and Middle Eastern markets, multiplying dividends for Farm Base Club members.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-neutral-900 text-neutral-400 text-xs font-medium border border-neutral-700 shrink-0 self-start md:self-auto">
              Target 2030
            </span>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center p-8 rounded-3xl bg-neutral-950 border border-neutral-800 space-y-5">
        <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
          Be a Driver of Agricultural Sovereignty
        </h3>
        <p className="text-sm text-neutral-300 max-w-xl mx-auto">
          Every assistance directly fuels our 2030 Vision while growing your personal wealth in a tangible, asset-backed sector.
        </p>
        <button
          onClick={onOpenRegister}
          className="px-8 py-3.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition shadow-lg shadow-emerald-950/60 inline-flex items-center gap-2"
        >
          <span>Register</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>

    </div>
  );
};
