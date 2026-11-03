import React from 'react';
import { Logo } from './Logo';
import { Shield, Sparkles, HeartHandshake, Phone, Mail, MapPin } from 'lucide-react';

interface FooterProps {
  setActivePage: (page: 'home' | 'about' | 'vision' | 'contact' | 'dashboard' | 'admin') => void;
  onOpenAdminLogin?: () => void;
  onOpenPromptFormula?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  setActivePage,
}) => {
  return (
    <footer className="w-full bg-black border-t border-neutral-800 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Brand & 3D Logo */}
          <div className="space-y-4 md:col-span-1">
            <Logo size="md" />
            <p className="text-xs text-neutral-400 leading-relaxed">
              Empowering rural and commercial farmers with financial sponsorship to increase production yields, mechanized equipment, and guarantee up to 20% dividend in a disciplined 20-day cycle for member investors.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
              <HeartHandshake className="w-4 h-4" />
              <span>Rooted in Growth · Growing Together</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-300">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li>
                <button
                  onClick={() => setActivePage('home')}
                  className="hover:text-white transition"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('about')}
                  className="hover:text-white transition"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('vision')}
                  className="hover:text-white transition"
                >
                  Vision 2030
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('contact')}
                  className="hover:text-white transition"
                >
                  Contact Desk
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActivePage('home');
                    setTimeout(() => {
                      document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
                    }, 80);
                  }}
                  className="hover:text-white transition text-neutral-300 flex items-center gap-1.5"
                >
                  <span>Frequently Asked Questions (FAQ)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Investor & Assistance Portal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-300">
              Assistance Network
            </h4>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li>
                <span className="text-neutral-400 text-xs">"Render Assistance" (Offer to Pay)</span>
              </li>
              <li>
                <span className="text-neutral-400 text-xs">"Get Assistance" (Demand Payment)</span>
              </li>
              <li>
                <span className="text-neutral-400 text-xs">Commitment Bar (% Dividend)</span>
              </li>
              <li className="pt-1">
                <a
                  href="https://wa.me/2349131376638?text=Hello%20Farm%20Base%20Club%2C%20I%20need%20assistance"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 font-bold transition flex items-center gap-1.5 text-xs"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                  <span>Official WhatsApp Desk</span>
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="pt-6 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-500">
          <div>
            © {new Date().getFullYear()} Farm Base Club. All Rights Reserved. Peer-Assisted Agricultural Financing Platform.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-neutral-400">Farm Base Club · Africa's Premier Co-Investment Network</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
