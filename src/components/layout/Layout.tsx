import React from 'react';
import { Navbar } from './Navbar';
import logo from '../../assets/logo.png';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20 pb-12">
        {children}
      </main>
      <footer className="bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-10 text-center text-slate-500 dark:text-slate-400 text-sm">
        <div className="container mx-auto px-4 flex flex-col items-center justify-center gap-4">
          <img src={logo} alt="Vidbanda" className="h-8 opacity-50 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0" />
          <div>
            <p>&copy; {new Date().getFullYear()} Vidbanda. All rights reserved.</p>
            <p className="mt-2 text-xs opacity-70">Powered by TMDB API. We do not host any files on our servers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
