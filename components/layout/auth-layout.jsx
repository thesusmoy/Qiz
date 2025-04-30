'use client';

import Image from 'next/image';
import { ShieldCheck } from 'lucide-react';

export function AuthLayout({ children }) {
  return (
    <div className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-indigo-950 to-blue-900">
      {/* Animated background shapes */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-400 opacity-30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-to-tr from-blue-400 via-cyan-400 to-indigo-400 opacity-20 rounded-full blur-2xl animate-pulse delay-1000" />
      </div>
      {/* Main content */}
      <div className="relative z-10 grid lg:grid-cols-2 w-full max-w-5xl shadow-2xl rounded-3xl overflow-hidden border border-gray-800 bg-white/5 backdrop-blur-xl">
        {/* Left branding section */}
        <div className="hidden lg:flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 via-gray-900 to-blue-900 h-full p-14 text-white border-r border-gray-800">
          <div className="flex flex-col items-center justify-center w-full h-full">
            <div className="flex items-center gap-4 mb-6">
              {/* <span className="bg-white/10 p-0 rounded-full border border-white/20"> */}
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                className="inline-block"
              >
                <rect
                  x="3"
                  y="4"
                  width="18"
                  height="16"
                  rx="3"
                  fill="#6366f1"
                />
                <rect x="7" y="8" width="10" height="2" rx="1" fill="#fff" />
                <rect x="7" y="12" width="6" height="2" rx="1" fill="#fff" />
                <circle cx="17" cy="13" r="1" fill="#fff" />
              </svg>
              {/* </span> */}
              <h1 className="font-extrabold text-7xl tracking-tight bg-gradient-to-r from-purple-400 via-indigo-400 to-cyan-300 bg-clip-text text-transparent animate-gradient-moving drop-shadow-xl">
                QIZ
              </h1>
            </div>
            <div className="flex flex-col items-center w-full">
              <p className="text-lg font-medium text-cyan-100 text-center mb-2 relative inline-block pencil-effect">
                Customizable Forms & Surveys Platform
              </p>
              <p className="text-base text-gray-300 text-center max-w-xs mt-1 relative inline-block pencil-effect">
                Secure, customizable, and scalable solution for modern
                organizations.
              </p>
            </div>
          </div>
        </div>
        {/* Right form section */}
        <div className="flex items-center justify-center p-8 h-full bg-white/80 dark:bg-gray-950/80">
          <div className="w-full max-w-md bg-white/90 dark:bg-gray-950/90 rounded-2xl shadow-xl p-8 flex flex-col gap-8 border border-gray-200 dark:border-gray-800">
            {children}
          </div>
        </div>
      </div>
      {/* Footer */}
      <footer className="absolute bottom-4 left-0 w-full flex justify-center z-20">
        <span className="text-xs text-gray-400 dark:text-gray-500">
          © {new Date().getFullYear()} QIZ Platform. All rights reserved.
        </span>
      </footer>
      <style jsx global>{`
        @keyframes gradient-moving {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient-moving {
          background-size: 200% 200%;
          animation: gradient-moving 3s linear infinite;
        }
        .pencil-effect {
          font-family:
            'Shadows Into Light', 'Comic Sans MS', cursive, sans-serif;
          background: linear-gradient(90deg, #e0e0e0 40%, #fff 60%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-fill-color: transparent;
          position: relative;
          animation: pencil-draw 1.2s cubic-bezier(0.4, 0, 0.2, 1) both;
        }
        @keyframes pencil-draw {
          0% {
            opacity: 0;
            transform: translateY(10px) scaleX(0.8);
          }
          60% {
            opacity: 1;
            transform: translateY(-2px) scaleX(1.05);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scaleX(1);
          }
        }
      `}</style>
    </div>
  );
}
