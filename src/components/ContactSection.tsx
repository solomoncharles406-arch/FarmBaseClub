import React, { useState } from 'react';
import { Send, CheckCircle2, Clock } from 'lucide-react';
import { ContactInquiry } from '../types';

interface ContactSectionProps {
  onSendMessage?: (inquiry: Omit<ContactInquiry, 'id' | 'createdAt' | 'read' | 'resolved'>) => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onSendMessage }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Investor Account & Assistance Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    
    if (onSendMessage) {
      onSendMessage({
        name,
        email,
        phone,
        subject,
        message,
      });
    }
    setSubmitted(true);
  };

  return (
    <div className="space-y-16 py-6 pb-20">
      
      {/* Title Header */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-semibold text-emerald-400 uppercase tracking-widest">
          <span>Contact Desk</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          We're Here to Support Your Agricultural Sponsorship.
        </h1>
        <p className="text-base sm:text-lg text-neutral-300 leading-relaxed">
          Have questions regarding Render Assistance or Get Assistance, cooperative verification, or payout schedules? Reach our central support and cooperative liaison desk 24/7.
        </p>
      </section>

      {/* Main Grid: Info + Interactive Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* WhatsApp Assistance Desk & Operating Hours */}
        <div className="space-y-6">
          
          {/* WhatsApp Direct Assistance Desk (Number Hidden From Display) */}
          <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-950 border border-emerald-500 flex items-center justify-center text-emerald-400 shadow-md">
                <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Official WhatsApp Desk</h3>
                <span className="text-xs text-emerald-400 font-mono font-semibold">Active & Online 24/7</span>
              </div>
            </div>

            <p className="text-sm text-neutral-300 leading-relaxed">
              Connect immediately with a verified Farm Base Club liaison officer for assistance matching, proof confirmation, or account resolution.
            </p>

            <div className="p-3.5 rounded-xl bg-black border border-neutral-800 flex items-center justify-between">
              <span className="text-xs text-neutral-400">WhatsApp Desk:</span>
              <span className="text-xs font-bold text-emerald-400 font-mono px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800">
                Verified Direct Channel (Instant Connect)
              </span>
            </div>

            <a
              href="https://wa.me/2349131376638?text=Hello%20Farm%20Base%20Club%2C%20I%20need%20assistance"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2.5 transition shadow-lg shadow-emerald-950/60 group"
            >
              <svg className="w-5 h-5 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
              <span>Message on WhatsApp Desk</span>
            </a>
          </div>

          {/* Operating Hours */}
          <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-400" />
              <span>Operating Hours</span>
            </h3>
            <div className="space-y-2 text-xs text-neutral-300">
              <p className="flex justify-between">
                <span>Assistance Matching Desk:</span>
                <span className="text-emerald-400 font-semibold">24 Hours / 7 Days</span>
              </p>
              <p className="flex justify-between">
                <span>Cooperative Field Verification:</span>
                <span className="text-white">Mon - Sat (8am - 6pm)</span>
              </p>
              <p className="flex justify-between">
                <span>WhatsApp Response Time:</span>
                <span className="text-emerald-400 font-semibold">&lt; 15 Minutes</span>
              </p>
            </div>
          </div>

        </div>

        {/* Support Inquiry Form */}
        <div className="lg:col-span-2 p-8 rounded-3xl bg-neutral-950 border border-neutral-800">
          {submitted ? (
            <div className="py-16 text-center space-y-4">
              <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto animate-bounce" />
              <div className="inline-block px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-600 text-xs font-semibold text-emerald-400">
                Directly Routed to Admin Mailbox
              </div>
              <h3 className="text-2xl font-bold text-white">Inquiry Received by Central Admin!</h3>
              <p className="text-sm text-neutral-300 max-w-md mx-auto">
                Thank you, <strong className="text-white">{name}</strong>. Your message has been deposited directly into the Central Operations Mailbox. A portfolio officer will review and reach out to you via <strong className="text-white">{email}</strong> or WhatsApp shortly.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setMessage('');
                }}
                className="px-6 py-2.5 text-xs font-semibold text-white bg-neutral-800 hover:bg-neutral-700 rounded-xl transition"
              >
                Send Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <h3 className="text-2xl font-extrabold text-white">Send Direct Message to Contact Desk</h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Fill out the form below for account assistance, cooperative partnership inquiries, or corporate sponsorships.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 block mb-1.5">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ibrahim Danladi"
                    className="w-full px-4 py-2.5 bg-black border border-neutral-800 focus:border-emerald-500 rounded-xl text-white text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 block mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="investor@example.com"
                    className="w-full px-4 py-2.5 bg-black border border-neutral-800 focus:border-emerald-500 rounded-xl text-white text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 block mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+234 803 123 4567"
                    className="w-full px-4 py-2.5 bg-black border border-neutral-800 focus:border-emerald-500 rounded-xl text-white text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 block mb-1.5">
                    Inquiry Topic
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-2.5 bg-black border border-neutral-800 focus:border-emerald-500 rounded-xl text-white text-sm focus:outline-none"
                  >
                    <option value="Investor Account & Assistance Inquiry">Investor Account & Assistance Inquiry</option>
                    <option value="Render Assistance Payment Verification">Render Assistance Payment Verification</option>
                    <option value="Get Assistance Payout Schedule">Get Assistance Payout Schedule</option>
                    <option value="Farming Cooperative Partnership">Farming Cooperative Partnership</option>
                    <option value="General Support">General Support</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 block mb-1.5">
                  Message Details
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Detail your inquiry or request here..."
                  className="w-full px-4 py-3 bg-black border border-neutral-800 focus:border-emerald-500 rounded-xl text-white text-sm focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition shadow-lg shadow-emerald-950/60 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Inquiry to Contact Desk</span>
              </button>
            </form>
          )}
        </div>

      </div>

    </div>
  );
};
