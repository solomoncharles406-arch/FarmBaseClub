import React from 'react';
import { X, FileText, CheckCircle2 } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept?: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose, onAccept }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-neutral-950 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden text-white flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-neutral-900 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Terms and Conditions</h3>
              <p className="text-xs text-neutral-400">Farm Base Club Agricultural Platform</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Terms Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans">
          
          <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-2">
            <h4 className="font-bold text-white text-base">FARM BASE CLUB TERMS AND CONDITIONS</h4>
            <p>
              Welcome to Farm Base Club Agricultural platform. These Terms and Conditions govern your use of our website, mobile platform, and investment services. By creating an account or investing, you agree to these Terms and Condition.
            </p>
          </div>

          <div className="space-y-2">
            <h5 className="font-bold text-white uppercase tracking-wider text-xs text-emerald-400">ABOUT FARM BASE CLUB</h5>
            <p>
              Farm Base Club is a registered agricultural firm in Africa that support farmers financially, and provides farm produce trading. We provide an opportunity for members of the public to co-invest and assist one another in our agricultural projects and earn returns based on profit of agricultural products sold.
            </p>
            <p>
              Our platform operates as Farm Base Club a peer-assisted agricultural financing platform.
            </p>
          </div>

          <div className="space-y-2">
            <h5 className="font-bold text-white uppercase tracking-wider text-xs text-emerald-400">2. DEFINITIONS</h5>
            <p><strong className="text-white">FARM BASE CLUB</strong> is our company name.</p>
            <p><strong className="text-white">User</strong> means any person who creates an account and is willing to assist.</p>
          </div>

          <div className="space-y-2">
            <h5 className="font-bold text-white uppercase tracking-wider text-xs text-emerald-400">3. ELIGIBILITY</h5>
            <p>3.1. You must be 18 years and above.</p>
            <p>3.2. You must provide accurate KYC information: Full Name, Valid Phone Number, Email, and Bank Account Details.</p>
            <p>3.3. One account per person. Multiple accounts will be banned.</p>
            <p>3.4. Farm Base Club reserves the right to reject any registration.</p>
          </div>

          <div className="space-y-2">
            <h5 className="font-bold text-white uppercase tracking-wider text-xs text-emerald-400">4. NATURE OF INVESTMENT</h5>
            <p>4.1. Your investment is used directly to support another farmer for agricultural purposes including but not limited to: farm land lease, seedlings, fertilizers, livestock feeds, labour, storage and logistics.</p>
            <p>4.2. This is NOT a banking deposit. It is an agricultural co-investment, just a means of farmers coming together to support each other.</p>
            <p>4.3. Returns are based on agricultural output and market performance.</p>
            <p>4.4. Minimum Investment: NGN 10,000. Maximum Investment: NGN 40,000,000 per slot. Investing above 40,000,000 will lead to automatic ban and forfeiture of the money.</p>
          </div>

          <div className="space-y-2">
            <h5 className="font-bold text-white uppercase tracking-wider text-xs text-emerald-400">5. HOW IT WORKS, RENDER ASSISTANCE (RA) & GET ASSISTANCE (GA)</h5>
            <p>5.1. RENDER ASSISTANCE (RA) is a way of lending a fellow farmer money for 20 Days. Your funds are allocated to an active farm cycle. Render Assistance duration is 20 days.</p>
            <p>5.2. DIVIDEND After 20 days, you are eligible for up to 20% dividend once you click on Get Assistance, another farmer or farmers will pay you with interest of 20%.</p>
            <p>5.3. GET ASSISTANCE (GA): REQUEST WITHDRAWAL After maturity, you can request your capital + dividend via the request withdrawal button (GA) on your dashboard.</p>
            <p>5.4. Approval is done by the system admin. Payouts are processed within 24 to 48 hours.</p>
            <p>5.5. You must have an active "Request withdrawal" to be eligible for withdrawal.</p>
            <p>5.6. Individual/s who refuses to pay within 24 hours after their account is matched will be banned from using Farm Base Club's platform.</p>
          </div>

          <div className="space-y-2">
            <h5 className="font-bold text-white uppercase tracking-wider text-xs text-emerald-400">6. RISK DISCLOSURE</h5>
            <p>6.1. Agriculture involves risks: weather, pests, disease, market price fluctuation.</p>
            <p>6.2. While Farm Base Club takes all measures to secure investments through insurance and best practices, we do not guarantee 100% capital protection in cases of force majeure (flood, drought, fire, government policy).</p>
            <p>6.3. By investing, you acknowledge and accept these risks.</p>
            <p>6.4. Past performance does not guarantee future returns.</p>
          </div>

          <div className="space-y-2">
            <h5 className="font-bold text-white uppercase tracking-wider text-xs text-emerald-400">7. PAYMENTS & WITHDRAWALS</h5>
            <p>7.1. All payments are in Nigerian Naira (NGN).</p>
            <p>7.2. Deposits must be made to the account displayed on user's dashboard only.</p>
            <p>7.3. Withdrawals are only to the bank account registered in your name, don't use a third party account.</p>
            <p>7.4. Farm Base Club will never ask for your password or login details.</p>
          </div>

          <div className="space-y-2">
            <h5 className="font-bold text-white uppercase tracking-wider text-xs text-emerald-400">8. USER OBLIGATIONS</h5>
            <p>8.1. You must keep your login details confidential.</p>
            <p>8.2. You must not use the platform for money laundering or fraud.</p>
            <p>8.3. You must not create fake payment proof as it will result to permanent ban of account.</p>
            <p>8.4. Any attempt to manipulate the system will lead to permanent ban and forfeiture of funds.</p>
          </div>

          <div className="space-y-2">
            <h5 className="font-bold text-white uppercase tracking-wider text-xs text-emerald-400">9. COMPANY OBLIGATIONS</h5>
            <p>9.1. To manage funds transparently and provide regular farm updates.</p>
            <p>9.2. To process withdrawal requests fairly and timely.</p>
            <p>9.3. To maintain data privacy and security.</p>
          </div>

          <div className="space-y-2">
            <h5 className="font-bold text-white uppercase tracking-wider text-xs text-emerald-400">10. CANCELLATION & REFUND</h5>
            <p>10.1. An account matched for payment can be cancelled and banned within 24 hours if not yet paid.</p>
            <p>10.2. After approved, cancellation is not possible until maturity.</p>
            <p>10.3. In case of proven system error, a refund will be processed within 7 working days.</p>
          </div>

          <div className="space-y-2">
            <h5 className="font-bold text-white uppercase tracking-wider text-xs text-emerald-400">11. FEES</h5>
            <p>11.1. Farm Base Club charges a 0% management fee on dividends earned.</p>
            <p>11.2. No hidden charges.</p>
          </div>

          <div className="space-y-2">
            <h5 className="font-bold text-white uppercase tracking-wider text-xs text-emerald-400">12. ACCOUNT SUSPENSION & TERMINATION</h5>
            <p>Farm Base Club reserve the right to suspend or terminate accounts that violate these Terms; provide false information, or engage in fraudulent activity.</p>
          </div>

          <div className="space-y-2">
            <h5 className="font-bold text-white uppercase tracking-wider text-xs text-emerald-400">13. LIMITATION OF LIABILITY</h5>
            <p>Farm Base Club shall not be liable for indirect losses, loss of profit, or third-party actions.</p>
          </div>

          <div className="space-y-2">
            <h5 className="font-bold text-white uppercase tracking-wider text-xs text-emerald-400">14. PRIVACY POLICY</h5>
            <p>Your personal data will be used only for KYC, payment processing, and communication. We do not sell your data.</p>
          </div>

          <div className="space-y-2">
            <h5 className="font-bold text-white uppercase tracking-wider text-xs text-emerald-400">15. INTELLECTUAL PROPERTY</h5>
            <p>All content on the platform, including logo, Company name, text, images are property of Farm Base Club.</p>
          </div>

          <div className="space-y-2">
            <h5 className="font-bold text-white uppercase tracking-wider text-xs text-emerald-400">17. CHANGES TO TERMS</h5>
            <p>We may update these Terms at any time. Continued use of the platform means you accept the new Terms.</p>
          </div>

          <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-2 text-xs">
            <p className="font-semibold text-white">
              By clicking "I Agree" you confirm that you have read, understood, and accepted these Terms and Conditions.
            </p>
            <p className="text-neutral-400">
              <strong className="text-white">Disclaimer:</strong> By accessing and using our platform, you acknowledge and agree that Farm Base Club shall not be held liable for any direct, indirect, incidental, or consequential financial losses, damages, or missed opportunities incurred by individuals. Please invest only what you can afford.
            </p>
            <p className="text-neutral-400">
              All participation, investments, or transactions are undertaken at your own risk. Farm Base Club has the Right to Restrict or Terminate Accounts.
              We are committed to maintaining a fair, safe, and transparent environment for all users. Farm Base Club reserves the absolute right to suspend, restrict, or permanently terminate any user account, without prior notice, if we detect any attempt to cheat, exploit, hack, or manipulate the system or its features.
              Fraudulent activities, by usage of unauthorized automated bots, or deceptive practices is a violations of our Terms of Service or community guidelines. Farm Base Club has the right to shutdown the company if we encounter huge losses.
              By continuing or Accepting to use our services, you agree to abide by these terms.
            </p>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-neutral-900 border-t border-neutral-800 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-neutral-400 hover:text-white transition"
          >
            Close
          </button>
          {onAccept && (
            <button
              type="button"
              onClick={() => {
                onAccept();
                onClose();
              }}
              className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition shadow-md flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>I Have Read & Accept Terms</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
