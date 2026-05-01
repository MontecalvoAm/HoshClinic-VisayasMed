"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react"; // Import signIn from next-auth/react
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Use NextAuth's signIn method
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false, // Don't redirect automatically so we can handle errors
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      if (result?.ok) {
        // Redirect to dashboard on success
        router.push("/admin");
      }
    } catch (err: any) {
      setError(err.message || "Invalid login credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50/50 py-4 px-4 sm:px-6 lg:px-8 overflow-hidden relative">
      {/* Back to Landing Page */}
      <div className="absolute top-6 left-6">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-gray-500 hover:text-[#2b5a9a] transition-colors font-bold text-xs group py-2 px-3 hover:bg-white rounded-lg shadow-sm border border-transparent hover:border-gray-100 transition-all"
        >
          <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Landing Page
        </Link>
      </div>

      <div className="max-w-md w-full bg-white p-5 sm:p-7 rounded-[2.25rem] shadow-2xl border border-gray-100 flex flex-col items-center">
        {/* Logo and Header Section */}
        <div className="text-center mb-5 w-full">
          <div className="relative w-20 h-20 mx-auto mb-2">
            <Image 
              src="/Visayas Medical.png" 
              alt="Hosh Clinic Logo" 
              fill
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-[#2b5a9a] text-xl font-black uppercase tracking-tight leading-tight">
            Hosh Clinic
          </h1>
          <p className="text-[#2b5a9a] text-[9px] font-bold uppercase tracking-widest mt-0.5">
            A Member of Appleone Medical Group
          </p>
          <p className="mt-2 text-gray-500 text-[10px] leading-snug w-full mx-auto font-medium whitespace-nowrap overflow-hidden text-ellipsis">
            85 Osmeña Blvd., Brgy. Sta. Cruz, Cebu City, Philippines 6000
          </p>
          <p className="text-gray-500 text-[10px] font-medium mt-0.5">
            Tel: (032) 253 1901 • www.visayasmedcebu.com.ph
          </p>
        </div>

        <form className="w-full space-y-4" onSubmit={handleLogin}>
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-2 text-red-700 text-[10px] rounded-lg">
              {error}
            </div>
          )}
          
          <div>
            <label htmlFor="email-address" className="block text-[10px] font-black text-black uppercase mb-1.5 tracking-widest px-1">
              Email Address
            </label>
            <input
              id="email-address"
              type="email"
              autoComplete="email"
              required
              className="w-full px-4 py-3 bg-[#eff6ff] border-none text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-[#2b5a9a] transition-all placeholder:text-gray-400 font-medium"
              placeholder="admin@vismed.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-[10px] font-black text-black uppercase mb-1.5 tracking-widest px-1">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                className="w-full px-4 py-3 bg-[#eff6ff] border-none text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-[#2b5a9a] transition-all pr-12 font-medium"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#2b5a9a] transition-colors p-1"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg className="w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] px-1 font-bold">
            <label className="flex items-center cursor-pointer group">
              <input 
                type="checkbox" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-gray-300 text-[#2b5a9a] focus:ring-[#2b5a9a] cursor-pointer" 
              />
              <span className="ml-1.5 text-gray-500 font-bold group-hover:text-gray-700 transition-colors">Remember Me</span>
            </label>
            <a href="#" className="text-[#3b82f6] hover:text-[#2b5a9a] transition-colors">Forgot Password?</a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-[#3b66ac] hover:bg-[#2b5a9a] text-white font-black text-sm uppercase rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed mt-2 tracking-widest"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

          <div className="text-center mt-4 pt-3 border-t border-gray-50 flex flex-col items-center gap-0.5">
            <p className="text-[10px] text-gray-500 font-bold">Don't have an account yet?</p>
            <button 
              type="button"
              className="text-[10px] font-bold text-[#3b82f6] hover:text-[#2b5a9a] transition-colors hover:underline"
            >
              Contact Hospital Administrator
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
