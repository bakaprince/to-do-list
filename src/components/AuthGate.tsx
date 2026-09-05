import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Lock, CheckCircle2, CloudLightning, ArrowRight, Leaf } from 'lucide-react';

export const AuthGate: React.FC = () => {
  const { signInWithGoogle, error, clearError } = useAuth();

  return (
    <div className="py-12 px-4 sm:px-6">
      <div className="max-w-md mx-auto bg-[#FDFCF9] border border-[#D9CFC4] rounded-[32px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-8 sm:p-10 text-center">
        {/* Shield Icon Accent */}
        <div className="w-14 h-14 mx-auto rounded-2xl bg-[#EAE3DC] border border-[#D9CFC4] flex items-center justify-center mb-6 shadow-inner">
          <Leaf className="w-7 h-7 text-[#5D6D5E]" />
        </div>

        <h2 className="text-3xl font-serif italic tracking-tight text-[#2C332D] mb-2.5">
          Personal Garden
        </h2>
        <p className="text-sm text-[#8C7E6F] leading-relaxed mb-8 font-medium">
          Sign in securely with your Google account to access your personal task garden. All tasks are isolated in Firestore and only nourished by you.
        </p>

        {error && (
          <div className="mb-6 p-3.5 rounded-2xl bg-[#FAF5F2] border border-[#D9CFC4] text-left flex items-start justify-between text-xs text-[#8C7E6F]">
            <span>{error}</span>
            <button
              onClick={clearError}
              className="ml-2 font-bold text-[#3E362E] hover:opacity-75"
            >
              ×
            </button>
          </div>
        )}

        {/* Google Sign-in Primary CTA */}
        <button
          id="google-signin-hero-button"
          onClick={signInWithGoogle}
          className="w-full inline-flex items-center justify-center gap-3 py-3.5 px-5 rounded-2xl border border-[#D9CFC4] bg-white text-[#3E362E] font-semibold text-sm hover:bg-[#F7F3F0] transition-colors shadow-sm group"
        >
          {/* Official Google 'G' Icon */}
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.14z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.14C3.25 21.37 7.34 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.59H1.26C.46 8.19 0 9.98 0 12s.46 3.81 1.26 5.41l4.02-3.14z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.25 2.63 1.26 6.59l4.02 3.14c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          <span>Continue with Google</span>
          <ArrowRight className="w-4 h-4 ml-auto text-[#8C7E6F] group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* Security & privacy points */}
        <div className="mt-8 pt-6 border-t border-[#EAE3DC] text-left space-y-3.5">
          <div className="flex items-start gap-2.5 text-xs text-[#8C7E6F]">
            <ShieldCheck className="w-4 h-4 text-[#5D6D5E] shrink-0 mt-0.5" />
            <span>
              <strong className="font-semibold text-[#2C332D]">Complete Record Isolation:</strong> Firestore rules strictly isolate tasks so only you can access your personal items.
            </span>
          </div>
          <div className="flex items-start gap-2.5 text-xs text-[#8C7E6F]">
            <CloudLightning className="w-4 h-4 text-[#5D6D5E] shrink-0 mt-0.5" />
            <span>
              <strong className="font-semibold text-[#2C332D]">Realtime Firestore Sync:</strong> Changes instantly synchronize across sessions through cloud snapshot listeners.
            </span>
          </div>
          <div className="flex items-start gap-2.5 text-xs text-[#8C7E6F]">
            <CheckCircle2 className="w-4 h-4 text-[#5D6D5E] shrink-0 mt-0.5" />
            <span>
              <strong className="font-semibold text-[#2C332D]">Refined Task Management:</strong> Organize with priority tags, status filters, and organic completion tracking.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
