import { getSignInUrl } from '@workos-inc/authkit-nextjs';
import { Building2, ArrowRight, ArrowLeft, ShieldCheck, Lock } from "lucide-react";
import { headers } from 'next/headers';
import logoImg from "@/public/logo.png";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const headersList = headers();
  const host = headersList?.get('host') || 'localhost:3000';
  const isLocal = host.includes('localhost');
  const redirectUri = isLocal
    ? `http://${host}/api/auth/callback`
    : (process.env.WORKOS_REDIRECT_URI || `https://${host}/api/auth/callback`);

  const signInUrl = await getSignInUrl({
    redirectUri,
  });

  return (
    <div className="flex min-h-screen bg-[#FCFCFC] font-sans relative overflow-hidden">
      
      {/* Custom Styles for Minimalist Polish */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes subtleGlow {
          0%, 100% { transform: scale(1) translate(0, 0); opacity: 0.05; }
          50% { transform: scale(1.1) translate(20px, -20px); opacity: 0.08; }
        }
        @keyframes shine {
          0% { left: -100%; }
          50%, 100% { left: 200%; }
        }
        .animate-subtle-glow { animation: subtleGlow 12s infinite ease-in-out; }
        .btn-shine-effect {
          position: relative;
          overflow: hidden;
        }
        .btn-shine-effect::after {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          width: 50%;
          background: linear-gradient(to right, transparent, rgba(255,255,255,0.06), transparent);
          transform: skewX(-12deg);
          pointer-events: none;
          animation: shine 6s infinite ease-in-out;
        }
      `}} />

      {/* Left side: Premium Minimalist Branding Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#080B11] flex-col justify-between p-20 text-white relative overflow-hidden select-none border-r border-white/[0.03]">
        
        {/* Deep, Ultra-Subtle Ambient Glow (Minimalist Atmosphere) */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-blue-500/5 blur-[150px] pointer-events-none animate-subtle-glow" />
        
        {/* Subtle Architectural Wireframe Grid Overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="minimal-grid" width="80" height="80" patternUnits="userSpaceOnUse">
                <path d="M 80 0 L 0 0 0 80" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#minimal-grid)" />
            {/* Fine clean structural line */}
            <line x1="0" y1="0" x2="1000" y2="1000" stroke="white" strokeWidth="0.5" strokeOpacity="0.5" />
          </svg>
        </div>

        {/* Top Branding: Clean Logo and Wide tracking text */}
        <div className="relative z-10 flex items-center justify-between w-full">
          <div className="flex items-center gap-3.5 group cursor-pointer">
            <div className="h-9 w-9 rounded-lg bg-white/[0.04] border border-white/10 p-1.5 flex items-center justify-center backdrop-blur-md transition-all duration-300 group-hover:bg-white/[0.08] group-hover:border-white/20">
              <img 
                src={logoImg.src} 
                alt="flowEstate Logo" 
                className="w-full h-full object-contain filter opacity-80 group-hover:opacity-100 transition-opacity" 
              />
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-300 transition-colors group-hover:text-white">
              flowEstate
            </span>
          </div>
          
          <a 
            href="#" 
            className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-slate-400 hover:text-white transition-colors duration-300 group"
          >
            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
            Website
          </a>
        </div>

        {/* Clean, spacious Typography at the bottom left */}
        <div className="relative z-10 space-y-6 text-left max-w-sm mb-12">
          <div className="space-y-2">
            <h1 className="text-3xl font-light tracking-[0.15em] text-white/95 uppercase leading-[1.35]">
              Build Smarter. <br />
              Deliver Faster. <br />
              Track Anywhere.
            </h1>
          </div>
          <p className="text-[12px] text-slate-400/90 leading-relaxed font-normal tracking-[0.05em] max-w-[320px]">
            From real-time labor attendance to complex ledger accounts, our powerful ERP lets you run sites seamlessly across devices.
          </p>
          <div className="w-6 h-[1px] bg-white/40 mt-6" />
        </div>

        {/* Minimal Footer */}
        <div className="relative z-10 text-[8px] text-slate-600 uppercase tracking-[0.25em] font-medium text-left">
          flowEstate ERP © 2026
        </div>
      </div>

      {/* Right side: Clean Authentication Center Container */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 bg-[#FAF9F6]/30 relative min-h-screen">
        {/* Soft atmospheric background glow */}
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-slate-200/20 blur-[100px] pointer-events-none" />

        <div className="w-full max-w-[380px] relative z-10">
          
          {/* Card Container for right side login content */}
          <div className="bg-white border border-slate-100 rounded-3xl p-10 md:p-12 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.03)] relative overflow-hidden flex flex-col items-center">
            
            {/* Header Content */}
            <div className="text-left w-full space-y-2 mb-10">
              <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">Welcome Back</h2>
              <p className="text-slate-400 text-xs font-medium">
                Access your flowEstate workspace
              </p>
            </div>

            {/* Call to Actions - Premium minimalist button */}
            <div className="w-full space-y-4">
              <a 
                href={signInUrl}
                className="btn-shine-effect flex w-full justify-center items-center py-4 bg-[#0F172A] hover:bg-[#1E293B] text-white rounded-full font-semibold text-[10px] uppercase tracking-[0.2em] shadow-sm transition-all duration-300 active:scale-[0.98] group gap-2 border border-white/5"
              >
                <span>Sign in with WorkOS SSO</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-300" />
              </a>
            </div>

            {/* Trust Badges - Ultra minimal, clean */}
            <div className="mt-10 pt-6 border-t border-slate-100 w-full flex items-center justify-center gap-6 text-[8px] font-semibold text-slate-400 uppercase tracking-[0.2em] select-none">
              <span className="flex items-center gap-2 transition-colors hover:text-slate-600">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-60"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500/80"></span>
                </span>
                <Lock className="w-3 h-3 text-slate-400/85" />
                SSO Secured
              </span>
              
              <span className="flex items-center gap-2 transition-colors hover:text-slate-600">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500/80"></span>
                </span>
                <ShieldCheck className="w-3 h-3 text-slate-400/85" />
                RLS Shielded
              </span>
            </div>

          </div>
        </div>

        {/* Footer info for mobile */}
        <div className="lg:hidden mt-12 flex items-center gap-2 opacity-40 text-[9px] font-bold tracking-widest text-slate-400 uppercase">
          <Building2 className="w-4 h-4" />
          <span>flowEstate</span>
        </div>
      </div>
    </div>
  );
}