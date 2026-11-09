import React, { useState } from 'react';
import heroBanner from '../assets/images/farm_hero_banner_1792792455809.jpg';
import { Logo } from './Logo';
import { LiveAssistanceActivity } from '../types';
import {
  ArrowRight,
  LogIn,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface HomeSectionProps {
  activities?: LiveAssistanceActivity[];
  onOpenRegister: () => void;
  onOpenLogin: () => void;
  onGoToDashboard: () => void;
  onOpenRenderAssistance?: () => void;
  onOpenGetAssistance?: () => void;
}

export const HomeSection: React.FC<HomeSectionProps> = ({
  onOpenRegister,
  onOpenLogin,
}) => {
  const [openFaqs, setOpenFaqs] = useState<number[]>([0, 1]);

  const toggleFaq = (index: number) => {
    setOpenFaqs((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="space-y-16 py-6 pb-20">
      
      {/* Hero Section (Mixture of Light Dark and Red) */}
      <section className="relative overflow-hidden rounded-3xl border border-red-900/60 bg-gradient-to-b from-[#25090e] via-[#150407] to-[#0c0204] shadow-2xl shadow-red-950/50">
        {/* Backdrop image and light dark & red ambient lighting */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src={heroBanner}
            alt="Mechanized Farming Harvest"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-25 mix-blend-luminosity"
          />
          {/* Layered light dark and rich red gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0204] via-[#1a0508]/85 to-[#2c0b11]/75" />
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[650px] h-[350px] bg-red-600/25 blur-[120px] rounded-full" />
          <div className="absolute top-1/2 -left-20 w-72 h-72 bg-rose-600/15 blur-[100px] rounded-full" />
          <div className="absolute bottom-0 -right-20 w-72 h-72 bg-red-800/20 blur-[100px] rounded-full" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-16 sm:py-24 text-center space-y-8">
          
          {/* Large 3D Emblem showcase */}
          <div className="flex justify-center">
            <Logo size="xl" showText={false} theme="red" className="scale-110" />
          </div>

          <div className="space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#351017]/90 border border-red-700/60 text-xs font-semibold text-rose-300 uppercase tracking-widest shadow-md">
              <span>Official Agricultural Peer-Assistance Platform</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight text-balance">
              Sponsoring Farmers Financially To Improve Production.
            </h1>

            <p className="text-base sm:text-xl text-neutral-200 leading-relaxed font-normal">
              Farm Base Club connects visionary members directly with agricultural cooperatives. By rendering financial assistance to purchase seeds, fertilizer, and tractors, you harvest up to 20% dividend in a disciplined 20-day cycle.
            </p>
          </div>

          {/* Action CTAs: Register & Login Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={onOpenRegister}
              className="w-full sm:w-auto px-8 py-4 text-base font-bold text-white bg-red-600 hover:bg-red-500 rounded-xl transition shadow-xl shadow-red-950/80 flex items-center justify-center gap-2.5 group cursor-pointer"
            >
              <span>Register</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onOpenLogin}
              className="w-full sm:w-auto px-8 py-4 text-base font-bold text-neutral-100 hover:text-white bg-[#2b0c12]/80 hover:bg-[#3d111a] border border-red-800/70 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <LogIn className="w-5 h-5 text-red-400" />
              <span>Login</span>
            </button>
          </div>

          {/* Key Trust Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-red-900/50 text-left">
            <div className="p-4 rounded-xl bg-[#22080d]/80 border border-red-900/50 backdrop-blur-sm shadow-md">
              <span className="text-xs text-neutral-400 uppercase tracking-wider block font-semibold">Active Farmland</span>
              <span className="text-2xl font-black text-white font-mono-nums block mt-1">48,500+</span>
              <span className="text-[11px] text-rose-400">Acres Mechanized</span>
            </div>

            <div className="p-4 rounded-xl bg-[#22080d]/80 border border-red-900/50 backdrop-blur-sm shadow-md">
              <span className="text-xs text-neutral-400 uppercase tracking-wider block font-semibold">Total Assisted</span>
              <span className="text-2xl font-black text-white font-mono-nums block mt-1">₦14.2B+</span>
              <span className="text-[11px] text-rose-400">Capital Deployed</span>
            </div>

            <div className="p-4 rounded-xl bg-[#22080d]/80 border border-red-900/50 backdrop-blur-sm shadow-md">
              <span className="text-xs text-neutral-400 uppercase tracking-wider block font-semibold">Cyclical Yield</span>
              <span className="text-2xl font-black text-white font-mono-nums block mt-1">Up to 20%</span>
              <span className="text-[11px] text-rose-400">20-Day Commitment</span>
            </div>

            <div className="p-4 rounded-xl bg-[#22080d]/80 border border-red-900/50 backdrop-blur-sm shadow-md">
              <span className="text-xs text-neutral-400 uppercase tracking-wider block font-semibold">Fulfillment Rate</span>
              <span className="text-2xl font-black text-white font-mono-nums block mt-1">100%</span>
              <span className="text-[11px] text-rose-400">P2P Assistance Matched</span>
            </div>
          </div>

        </div>
      </section>

      {/* Frequently Asked Questions (FAQ) */}
      {/* Mutual Peer-Assistance Mechanism */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">
            Core Operating Actions
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
            Mutual Peer-Assistance Mechanism
          </h2>
          <p className="text-sm text-neutral-400">
            Direct member-to-member liquidity matching supervised by central farm operations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Pillar 1: Render Assistance Action */}
          <div className="p-6 sm:p-8 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-5 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                Render Assistance
              </h3>
              <span className="text-xs font-semibold text-emerald-400 px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 inline-block mt-1">
                Offering To Pay
              </span>
            </div>

            <button
              type="button"
              disabled
              aria-disabled="true"
              className="w-full py-3.5 text-sm font-bold text-white bg-emerald-600 rounded-xl shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 opacity-95 cursor-default select-none pointer-events-none"
            >
              <span>Offer to Render Assistance</span>
            </button>
          </div>

          {/* Pillar 2: Get Assistance Action */}
          <div className="p-6 sm:p-8 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-5 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                Get Assistance
              </h3>
              <span className="text-xs font-semibold text-neutral-300 px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 inline-block mt-1">
                Demanding Payment
              </span>
            </div>

            <button
              type="button"
              disabled
              aria-disabled="true"
              className="w-full py-3.5 text-sm font-bold text-white bg-emerald-600 rounded-xl shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 opacity-95 cursor-default select-none pointer-events-none"
            >
              <span>Demand Payment (Get Assistance)</span>
            </button>
          </div>

        </div>
      </section>

      {/* Frequently Asked Questions (FAQ) */}
      <section id="faq" className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-semibold text-emerald-400 uppercase tracking-widest">
            <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Frequently Asked Questions (FAQ)</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
            Operational Terminologies & Guidelines
          </h2>
          <p className="text-sm text-neutral-400">
            Clear, transparent answers regarding our mutual peer-assistance model, payment cycles, and dividend rules.
          </p>
        </div>

        <div className="space-y-4 max-w-4xl mx-auto">
          
          {/* FAQ 1: Render Assistance (Offering To Pay) */}
          <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4 transition">
            <div
              className="flex items-center justify-between cursor-pointer select-none"
              onClick={() => toggleFaq(0)}
            >
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  What is Render Assistance (Offering To Pay)?
                </h3>
                <span className="text-[11px] font-semibold text-emerald-400">
                  Peer Sponsorship Phase
                </span>
              </div>
              <button
                type="button"
                className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white"
              >
                {openFaqs.includes(0) ? <ChevronUp className="w-4 h-4 text-emerald-400" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>

            {openFaqs.includes(0) && (
              <div className="pt-3 border-t border-neutral-800 space-y-4 text-sm text-neutral-300 animate-in fade-in duration-200">
                <p className="leading-relaxed text-sm text-neutral-200">
                  The terminology used when a member offers financial assistance to sponsor farmer inputs (seeds, fertilizer, combines, tractors) or to settle a fellow member's matured dividend payout.
                </p>
                <ul className="text-xs text-neutral-300 space-y-2 bg-black/70 p-4 rounded-xl border border-neutral-800">
                  <li className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    <span>Pledge assistance starting from ₦10,000 up to ₦40,000,000 per slot.</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    <span>Direct peer-to-peer bank transfer to assigned recipient.</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    <span>Activates your 20-day dividend commitment cycle (up to 20%).</span>
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* FAQ 2: Get Assistance (Demanding Payment) */}
          <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4 transition">
            <div
              className="flex items-center justify-between cursor-pointer select-none"
              onClick={() => toggleFaq(1)}
            >
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  What is Get Assistance (Demanding Payment)?
                </h3>
                <span className="text-[11px] font-semibold text-neutral-400">
                  Harvest Yield Payout Phase
                </span>
              </div>
              <button
                type="button"
                className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white"
              >
                {openFaqs.includes(1) ? <ChevronUp className="w-4 h-4 text-emerald-400" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>

            {openFaqs.includes(1) && (
              <div className="pt-3 border-t border-neutral-800 space-y-4 text-sm text-neutral-300 animate-in fade-in duration-200">
                <p className="leading-relaxed text-sm text-neutral-200">
                  The terminology used by a member to request withdrawal of their capital plus dividend via the request withdrawal button (GA) after 20 days maturity.
                </p>
                <ul className="text-xs text-neutral-300 space-y-2 bg-black/70 p-4 rounded-xl border border-neutral-800">
                  <li className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    <span>Matures on scheduled 20-day cycle with up to 20% dividend.</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    <span>Direct payout into your registered bank account details (no 3rd party).</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    <span>Matched peers must pay within 24 hours.</span>
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* FAQ 3: How does the 20-Day Dividend Cycle work? */}
          <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4 transition">
            <div
              className="flex items-center justify-between cursor-pointer select-none"
              onClick={() => toggleFaq(2)}
            >
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  How does the 20-day dividend cycle work?
                </h3>
                <span className="text-[11px] font-semibold text-neutral-400">
                  Harvest Growth & Yield Schedule
                </span>
              </div>
              <button
                type="button"
                className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white"
              >
                {openFaqs.includes(2) ? <ChevronUp className="w-4 h-4 text-emerald-400" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>

            {openFaqs.includes(2) && (
              <div className="pt-3 border-t border-neutral-800 space-y-2 text-sm text-neutral-300 leading-relaxed animate-in fade-in duration-200">
                <p>
                  When you render assistance, your funds are allocated to an active farm cycle for 20 days. After 20 days, you are eligible for up to 20% dividend. Once you click on Get Assistance, another farmer or farmers will pay you your capital plus interest of up to 20%.
                </p>
              </div>
            )}
          </div>

          {/* FAQ 4: How are peer matches and payments verified? */}
          <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4 transition">
            <div
              className="flex items-center justify-between cursor-pointer select-none"
              onClick={() => toggleFaq(3)}
            >
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  How are payments and bank details verified to ensure zero defaults?
                </h3>
                <span className="text-[11px] font-semibold text-neutral-400">
                  Central Operations Dispatch
                </span>
              </div>
              <button
                type="button"
                className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white"
              >
                {openFaqs.includes(3) ? <ChevronUp className="w-4 h-4 text-emerald-400" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>

            {openFaqs.includes(3) && (
              <div className="pt-3 border-t border-neutral-800 space-y-2 text-sm text-neutral-300 leading-relaxed animate-in fade-in duration-200">
                <p>
                  Every Render Assistance and Get Assistance order is paired through the central matchmaker. Direct bank transfers require proof of payment reference submission, which is confirmed by the receiving party and audited by central admin dispatch before orders are marked settled.
                </p>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* Supported Farm Production Sectors */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">
            Active Farm Sectors
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
            Where Member Capital Improves Yields
          </h2>
          <p className="text-sm text-neutral-400">
            Every Naira pledged directly finances verified agricultural inputs across Nigeria and West Africa's breadbaskets.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3 hover:border-emerald-600 transition">
            <h4 className="font-bold text-white text-base">Hybrid Grain & Maize</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Mechanized planters and drought-resistant seeds yield 6 metric tons per hectare across Niger and Kaduna basins.
            </p>
            <div className="pt-2 border-t border-neutral-900 text-xs text-emerald-400 font-semibold">
              Up to 20% 20-Day Cycle
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3 hover:border-emerald-600 transition">
            <h4 className="font-bold text-white text-base">Commercial Rice Hubs</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Solar-powered irrigation and precision de-stoning mills in Kebbi and Kano produce export-quality parboiled rice.
            </p>
            <div className="pt-2 border-t border-neutral-900 text-xs text-emerald-400 font-semibold">
              Up to 20% 20-Day Cycle
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3 hover:border-emerald-600 transition">
            <h4 className="font-bold text-white text-base">Cassava Starch Value Chain</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              High-yield tubers processed into industrial pharmaceutical starch, guaranteeing year-round off-taker buybacks.
            </p>
            <div className="pt-2 border-t border-neutral-900 text-xs text-emerald-400 font-semibold">
              Up to 20% 20-Day Cycle
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3 hover:border-emerald-600 transition">
            <h4 className="font-bold text-white text-base">Poultry & Feed Automation</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Automated climate-controlled brooders with integrated feed milling for sustainable egg and meat supply.
            </p>
            <div className="pt-2 border-t border-neutral-900 text-xs text-emerald-400 font-semibold">
              Up to 20% 20-Day Cycle
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
