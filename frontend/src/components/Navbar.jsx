import React from 'react';
import { Briefcase, Sparkles } from 'lucide-react';
import { Badge } from './ui/badge';

const Navbar = ({ appliedCount }) => {
  return (
    <nav className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 shadow-lg shadow-teal-500/25">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-slate-800 tracking-tight">
                Creator Board
              </span>
              <span className="text-xs text-slate-500 hidden sm:block">
                Find your next brand collaboration
              </span>
            </div>
          </div>

          {/* Applied Counter */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 border border-slate-200">
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span className="text-sm font-medium text-slate-700">Applied</span>
              <Badge 
                className="bg-teal-600 hover:bg-teal-600 text-white px-2 py-0.5 text-xs"
              >
                {appliedCount}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
