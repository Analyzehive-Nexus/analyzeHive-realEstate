import { getSignInUrl } from '@workos-inc/authkit-nextjs';
import { Building2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const signInUrl = await getSignInUrl({
    redirectUri: process.env.WORKOS_REDIRECT_URI,
  });

  return (
    <div className="flex min-h-screen bg-white font-sans">
      {/* Left side: branding/gradient */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-700 to-blue-900 flex-col justify-center p-16 text-white relative overflow-hidden">
        {/* Decorative circle shapes like in the image */}
        <div className="absolute -bottom-24 -left-24 w-96 h-96 border-[40px] border-blue-400/10 rounded-full" />
        <div className="absolute -bottom-48 -left-48 w-[600px] h-[600px] border-[20px] border-blue-400/5 rounded-full" />
        
        <div className="relative z-10 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Building2 className="w-12 h-12" />
            <span className="text-4xl font-bold tracking-tight">Analyzehive</span>
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight mt-2">Flow</h1>
          <p className="text-xl text-blue-100/80 max-w-md leading-relaxed">
            The most complete Real Estate ERP & CRM system for modern developers and property managers.
          </p>
          <button className="mt-8 px-8 py-3 bg-blue-500/30 border border-blue-400/30 rounded-full backdrop-blur-sm hover:bg-blue-500/40 transition-all font-semibold self-start text-sm">
            Read More
          </button>
        </div>
      </div>

      {/* Right side: Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 bg-white dark:bg-slate-950">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left space-y-2">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-slate-50">Hello Again!</h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">Welcome Back</p>
          </div>

          <div className="space-y-6 pt-8">
            <a 
              href={signInUrl}
              className="flex w-full justify-center items-center py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold text-lg shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-all"
            >
              Sign in with WorkOS
            </a>
          </div>
        </div>
        
        {/* Footer info for mobile */}
        <div className="lg:hidden mt-auto pt-12 flex items-center gap-2 opacity-50">
          <Building2 className="w-5 h-5" />
          <span className="font-bold">Analyzehive Flow</span>
        </div>
      </div>
    </div>
  );
}