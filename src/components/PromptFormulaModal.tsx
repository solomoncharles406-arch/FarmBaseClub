import React, { useState } from 'react';
import { Copy, Check, Sparkles, X, FileText } from 'lucide-react';

interface PromptFormulaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FORMULA_PROMPT_TEXT = `### EFFECTIVE PROMPT FORMULA: FARM BASE CLUB AGRICULTURAL ASSISTANCE WEBSITE

#### 1. ROLE
You are a Principal Full-Stack FinTech & Agro-Tech Software Architect specializing in peer-to-peer (P2P) agricultural mutual assistance networks, investor yield management platforms, and high-security administrative consoles.

#### 2. AUDIENCE
- **Agricultural Investors**: Everyday individuals and institutional partners who seek safe, high-yield, transparent agricultural assistance opportunities by directly sponsoring smallholder and commercial farmers to improve their crop yields and mechanized production.
- **Farmers & Cooperative Leads**: Farming clusters receiving seed funding, fertilizer, tractors, and irrigation via investor pledges.
- **Platform Administrators**: Super-administrators managing assistance matching, dividend cycles, fraud prevention, and user communications.

#### 3. GOAL
Design and engineer a simple, non-ambiguous, highly reliable 3-page Agricultural Assistance Web Application for **FARM BASE CLUB**. The platform enables investors to register with their complete identity and bank details, track their assistance dividend progress on a visual percentage commitment bar, offer funding through "Render Assistance", demand returns through "Get Assistance", and receive direct dashboard communications from an Admin Console protected by authorized administrative credentials.

#### 4. STYLE & OUTPUT SPECIFICATIONS
- **Visual Design Identity**:
  * **Background Color**: Deep pure black (#000000 / #050505).
  * **Demarcation / Border Color**: Crisp vibrant crimson red (#ef4444 / #dc2626) defining borders, separators, card outlines, and dividers.
  * **Text Color**: High-contrast pure white (#ffffff) for crisp legibility, paired with soft slate-gray (#94a3b8) for secondary tabular metadata.
  * **Button Color**: Emerald green (#16a34a / #22c55e) with dark emerald hover states (#15803d) and white typography.
  * **Logo Branding**: 3D high-graphic embossed metallic emblem featuring agricultural wheat stalks, a green sprout, a modern tractor crest, and gold/emerald trim.
  * **Design Tone**: Clean, direct, institutional, authoritative, anti-ambiguous, zero generic clutter.

#### 5. CORE FEATURES & PAGE ARCHITECTURE

##### A. Page 1: Public Web Experience (Home, About Us, Vision 2030, Contact Desk)
- **Home**:
  * High-impact hero section showcasing the 3D logo, farmland visuals, core value proposition: "Sponsoring Farmers Financially in Order for Them to Improve in Production", with primary actions "Register" and "Login".
  * Clear explanation of the P2P assistance cycle: "Render Assistance" (offering to sponsor/pay) vs. "Get Assistance" (demanding payment/returns).
  * Live stats: Total hectares under mechanization, active investors, assistance completed, average dividend yield rate.
  * Quick Assistance & Dividend Calculator with commitment cycle breakdown in Naira (₦).
- **About Us**:
  * Detailed mission statement: bridging the agricultural capital deficit by connecting liquidity providers with verified rural farmers.
  * Explanation of how funding purchases certified hybrid seeds, drip irrigation, pest defense, and harvesting equipment to eliminate post-harvest losses.
- **Vision 2030**:
  * Long-term roadmap: Achieving regional food sovereignty, mechanized cooperatives, zero-hunger goals, and guaranteed 20% dividend in a disciplined 20 day cycle.
- **Contact Desk**:
  * Official WhatsApp direct desk (09131376638), interactive inquiry submission form with instant feedback.

##### B. Page 2: Investor Registration & Portal
- **Registration Flow**:
  * Input fields: Full Name, Email Address, Phone Number, and Account Details (Bank Name, Account Number, Account Name, routing/payment notes).
- **Investor Dashboard**:
  * **Investor's Name**: Prominent personalized greeting.
  * **Referral Link**: Unique affiliate link with one-click copy and tracking stats.
  * **Commitment Bar in Percent (%)**: Real-time progress bar tracking the 20-day dividend cycle (e.g. 74% completed), with countdown to harvest maturity.
  * **Date of Assistance & Withdrawal Date**: Clear timeline cards showing deposit date and exact allowable payout date.
  * **Assistance History Table**: Tabular history listing date, farm sector, assistance amount, yield earned, and status.
  * **"Render Assistance" Action**: Button and modal allowing the investor to offer to pay a farmer/peer, choose sponsorship tier, view recipient bank details, and submit payment proof.
  * **"Get Assistance" Action**: Button and modal allowing the investor to demand dividend/principal assistance payout once matured (unless paused by admin).
  * **Admin Direct Message Banner**: Prominently displayed broadcast or personalized alert dropped by management.
  * **Admin Restriction Indicators**: Status notices if dividend progress is paused or if withdrawals are temporarily locked.

##### C. Page 3: Admin Dashboard (Protected by Authorized Admin Authentication)
- **Access Protocol**:
  * Reached via an Admin Dashboard icon button in the header.
  * Secure modal requiring authorized credentials to access management tools.
- **Supervisory Controls**:
  1. **Pause / Resume Dividend Progress**: Global and per-investor toggle switch to pause or resume dividend accumulation percentage.
  2. **Stop User from Withdrawing / Unlock Withdrawals**: Lock switch preventing investors from initiating "Get Assistance" claims with custom system reason.
  3. **Direct Dashboard Message Engine**: Form allowing admin to compose and send targeted or broadcast messages that display directly on user dashboards.
  4. **Assistance Matchmaker ("Render Assistance" & "Get Assistance")**:
     * Queue of users offering to pay ("Render Assistance") matched with users demanding payout ("Get Assistance").
     * One-click matching mechanism with bank account routing, payment verification, and manual confirmation.
  5. **Investor Accounts Manager**: Full searchable directory of all registered investors, contact details, bank accounts, active capital, and account actions.`;

export const PromptFormulaModal: React.FC<PromptFormulaModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(FORMULA_PROMPT_TEXT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-neutral-950 border border-neutral-800 rounded-xl shadow-2xl flex flex-col overflow-hidden text-white">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-neutral-900 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-600/20 border border-emerald-600/40 text-emerald-400">
              <Sparkles className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
                Effective Prompt Formula Specification
              </h2>
              <p className="text-xs text-neutral-400">
                ROLE · AUDIENCE · GOAL · STYLE & OUTPUT · FEATURES
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition shadow-md"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Prompt Formula</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm leading-relaxed text-neutral-200">
          <div className="p-4 rounded-lg bg-black border border-neutral-800">
            <p className="text-xs text-emerald-400 font-semibold uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <FileText className="w-4 h-4" /> AI Engineering Brief
            </p>
            <p className="text-neutral-300 text-xs">
              This prompt is formulated using the structured prompt engineering standard requested. It can be fed into AI Studio or any LLM to generate or replicate this exact architecture.
            </p>
          </div>

          <div className="space-y-4">
            <section className="p-4 rounded-lg bg-neutral-900/60 border border-neutral-800">
              <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">1. ROLE</span>
              <p className="mt-1 text-neutral-200">
                Principal Full-Stack FinTech & Agro-Tech Software Architect specializing in peer-to-peer agricultural mutual assistance networks, investor yield management platforms, and high-security administrative consoles.
              </p>
            </section>

            <section className="p-4 rounded-lg bg-neutral-900/60 border border-neutral-800">
              <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">2. AUDIENCE</span>
              <p className="mt-1 text-neutral-200">
                Agricultural investors seeking reliable returns by directly sponsoring smallholder and commercial farmers; farming cooperatives requiring capital for mechanization; and platform administrators operating the matching desk.
              </p>
            </section>

            <section className="p-4 rounded-lg bg-neutral-900/60 border border-neutral-800">
              <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">3. GOAL</span>
              <p className="mt-1 text-neutral-200">
                Build a simple, non-ambiguous, professional 3-page web platform for FARM BASE CLUB where investors register with email, phone, and bank details, monitor their dividend percentage commitment bar, execute "Render Assistance" (offer to pay) and "Get Assistance" (demand payment), with full administrative control via authorized administrative credentials.
              </p>
            </section>

            <section className="p-4 rounded-lg bg-neutral-900/60 border border-neutral-800">
              <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">4. STYLE & OUTPUT</span>
              <ul className="mt-1 list-disc list-inside text-neutral-300 space-y-1 text-xs sm:text-sm">
                <li><strong className="text-white">Background Color:</strong> Deep Black (#000000)</li>
                <li><strong className="text-white">Border Accent:</strong> Subtle Neutral Slate & Emerald Green accents</li>
                <li><strong className="text-white">Text Color:</strong> Crisp White (#ffffff)</li>
                <li><strong className="text-white">Button Color:</strong> Emerald Green (#16a34a / #22c55e)</li>
                <li><strong className="text-white">3D Graphic Logo:</strong> Embossed agricultural gold-emerald shield insignia with wheat, tractor, and crop sprouts</li>
              </ul>
            </section>

            <section className="p-4 rounded-lg bg-neutral-900/60 border border-neutral-800">
              <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">5. FEATURES</span>
              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded bg-black border border-neutral-800">
                  <h4 className="font-semibold text-emerald-400">Public Pages</h4>
                  <p className="text-neutral-400 mt-0.5">Home, About Us, Vision 2030, Contact Desk with agricultural sponsorship content.</p>
                </div>
                <div className="p-2.5 rounded bg-black border border-neutral-800">
                  <h4 className="font-semibold text-emerald-400">Investor Dashboard</h4>
                  <p className="text-neutral-400 mt-0.5">Referral link, Commitment bar (% dividend), Date of Assistance, Withdrawal date, Assistance history.</p>
                </div>
                <div className="p-2.5 rounded bg-black border border-neutral-800">
                  <h4 className="font-semibold text-emerald-400">Assistance Network</h4>
                  <p className="text-neutral-400 mt-0.5">"Render Assistance" (offer to pay) & "Get Assistance" (demand payment) workflows.</p>
                </div>
                <div className="p-2.5 rounded bg-black border border-neutral-800">
                  <h4 className="font-semibold text-emerald-400">Admin Console</h4>
                  <p className="text-neutral-400 mt-0.5">Dedicated admin icon, pause dividend progress, stop user withdrawals, drop direct dashboard messages, match assist orders.</p>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-neutral-900 border-t border-neutral-800 flex items-center justify-between">
          <span className="text-xs text-neutral-400">
            Farm Base Club Core Architecture Specification
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
