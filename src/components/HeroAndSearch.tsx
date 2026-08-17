import React, { useState } from 'react';
import { Search, MapPin, ShieldCheck, Zap, Sparkles, Clock, CheckCircle2, ArrowRight } from 'lucide-react';

interface HeroAndSearchProps {
  currentCity: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  selectedCategory: string;
  onSelectCategory: (catSlug: string) => void;
  onOpenQuoteModal: () => void;
  onOpenPublishAdModal: () => void;
  totalProviders: number;
}

export const HeroAndSearch: React.FC<HeroAndSearchProps> = ({
  currentCity,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  selectedCategory,
  onSelectCategory,
  onOpenQuoteModal,
  onOpenPublishAdModal,
  totalProviders
}) => {
  return (
    <section className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl border border-slate-800">
      {/* Background Decorative Accent */}
      <div className="absolute -right-20 -top-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl space-y-6">
        {/* Badge Banner */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold rounded-full backdrop-blur-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Garanție Plată Escrow & {totalProviders}+ Meșteri Verificați în {currentCity}</span>
        </div>

        {/* Main Hero Title */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Găsește meșterul potrivit în <span className="text-emerald-400 underline decoration-emerald-500 decoration-2 underline-offset-4">{currentCity}</span> rapid și în siguranță.
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Compară prestatori locali verificați cu buletinul și cazierul, cere oferte sau programează servicii instant. Banii tăi rămân securizați în portofelul Escrow până confirmi execuția!
          </p>
        </div>

        {/* Interactive Search Box */}
        <form
          onSubmit={onSearchSubmit}
          className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 text-slate-900 shadow-2xl space-y-3 md:space-y-0 md:flex md:items-center md:gap-3"
        >
          {/* Service Search Input */}
          <div className="flex-1 relative">
            <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1 px-1">
              Ce serviciu cauți?
            </label>
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                placeholder="ex: Instalator sanitari, Electrician ANRE, Zugrav..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-xs font-semibold bg-slate-50 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 placeholder-slate-400"
              />
            </div>
          </div>

          {/* Location Input / Indicator */}
          <div className="w-full md:w-56 relative">
            <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1 px-1">
              Oraș / Cartier
            </label>
            <div className="relative flex items-center">
              <MapPin className="w-4 h-4 text-emerald-600 absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={currentCity}
                readOnly
                className="w-full pl-9 pr-3 py-2.5 text-xs font-bold bg-slate-100 rounded-xl border border-slate-200 outline-none text-slate-800"
              />
            </div>
          </div>

          {/* Search Button */}
          <div className="pt-2 md:pt-5 flex gap-2">
            <button
              type="submit"
              className="w-full md:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/30 flex items-center justify-center space-x-1.5 transition shrink-0"
            >
              <Search className="w-4 h-4" />
              <span>Caută Meșteri</span>
            </button>
          </div>
        </form>

        {/* Quick Filter Chips */}
        <div className="pt-1 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-bold text-[11px] mr-1">Filtre rapide:</span>
          <button
            onClick={() => onSelectCategory('all')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition border ${
              selectedCategory === 'all'
                ? 'bg-emerald-500 text-white border-emerald-400'
                : 'bg-white/10 text-slate-200 border-white/10 hover:bg-white/20'
            }`}
          >
            Toți Prestatorii
          </button>
          <button
            onClick={() => onSelectCategory('instalator')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition border ${
              selectedCategory === 'instalator'
                ? 'bg-emerald-500 text-white border-emerald-400'
                : 'bg-white/10 text-slate-200 border-white/10 hover:bg-white/20'
            }`}
          >
            🔧 Instalatori (Urgențe)
          </button>
          <button
            onClick={() => onSelectCategory('electrician')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition border ${
              selectedCategory === 'electrician'
                ? 'bg-emerald-500 text-white border-emerald-400'
                : 'bg-white/10 text-slate-200 border-white/10 hover:bg-white/20'
            }`}
          >
            ⚡ Electricieni ANRE
          </button>
          <button
            onClick={() => onSelectCategory('curatenie')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition border ${
              selectedCategory === 'curatenie'
                ? 'bg-emerald-500 text-white border-emerald-400'
                : 'bg-white/10 text-slate-200 border-white/10 hover:bg-white/20'
            }`}
          >
            🧹 Curățenie
          </button>
        </div>

        {/* Action CTAs */}
        <div className="pt-2 flex flex-wrap gap-3 border-t border-slate-800">
          <button
            onClick={onOpenQuoteModal}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold rounded-xl shadow-md flex items-center space-x-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>Cere Ofertă în 60 de secunde</span>
          </button>
          <button
            onClick={onOpenPublishAdModal}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl backdrop-blur border border-white/15 flex items-center space-x-1.5"
          >
            <span>Ești mesteriaș? Oferă Servicii</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
