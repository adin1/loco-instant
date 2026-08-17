import React from 'react';
import { Wrench, ShoppingBag, Truck, Zap, ShieldCheck, Star, Layers, MapPin } from 'lucide-react';

export type HomeIntentSegment = 'all' | 'providers' | 'marketplace' | 'delivery';

interface SegmentedIntentSwitcherProps {
  activeSegment: HomeIntentSegment;
  onSegmentChange: (segment: HomeIntentSegment) => void;
  providersCount: number;
  filter247Only: boolean;
  onToggle247: () => void;
  filterVerifiedOnly: boolean;
  onToggleVerified: () => void;
  filterTopRated: boolean;
  onToggleTopRated: () => void;
  currentCity: string;
}

export const SegmentedIntentSwitcher: React.FC<SegmentedIntentSwitcherProps> = ({
  activeSegment,
  onSegmentChange,
  providersCount,
  filter247Only,
  onToggle247,
  filterVerifiedOnly,
  onToggleVerified,
  filterTopRated,
  onToggleTopRated,
  currentCity
}) => {
  return (
    <div
      id="segmented-intent-switcher"
      className="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-xs space-y-3 sticky top-16 z-30 backdrop-blur-md bg-white/95"
    >
      {/* Primary Intent Segmented Control Tabs */}
      <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 overflow-x-auto no-scrollbar gap-1">
        {/* Tab 1: Meșteri & Servicii */}
        <button
          id="segment-tab-providers"
          type="button"
          onClick={() => onSegmentChange('providers')}
          className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 whitespace-nowrap ${
            activeSegment === 'providers'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Wrench className="w-3.5 h-3.5" />
          <span>Meșteri & Servicii</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
              activeSegment === 'providers'
                ? 'bg-emerald-700 text-white'
                : 'bg-slate-200 text-slate-700'
            }`}
          >
            {providersCount}
          </span>
        </button>

        {/* Tab 2: Piață Locală */}
        <button
          id="segment-tab-marketplace"
          type="button"
          onClick={() => onSegmentChange('marketplace')}
          className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 whitespace-nowrap ${
            activeSegment === 'marketplace'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Piață & Producători</span>
        </button>

        {/* Tab 3: Livrare Rapidă */}
        <button
          id="segment-tab-delivery"
          type="button"
          onClick={() => onSegmentChange('delivery')}
          className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 whitespace-nowrap ${
            activeSegment === 'delivery'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Truck className="w-3.5 h-3.5" />
          <span>Curierat & Livrare</span>
        </button>

        {/* Tab 4: Toate Secțiunile */}
        <button
          id="segment-tab-all"
          type="button"
          onClick={() => onSegmentChange('all')}
          className={`flex items-center space-x-1 px-2.5 py-2 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 whitespace-nowrap ${
            activeSegment === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-800 hover:bg-white/60'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Toate</span>
        </button>
      </div>

      {/* Quick Filter Pills (Urgent 24/7, Verificat Escrow, Top 4.8+) */}
      {(activeSegment === 'providers' || activeSegment === 'all') && (
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5 text-xs">
          <span className="text-[11px] font-bold text-slate-400 shrink-0 mr-0.5">Filtre:</span>

          {/* 24/7 Filter Pill */}
          <button
            id="filter-pill-247"
            type="button"
            onClick={onToggle247}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-xl text-[11px] font-extrabold border transition cursor-pointer shrink-0 ${
              filter247Only
                ? 'bg-rose-500 text-white border-rose-600 shadow-xs'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Zap className="w-3 h-3 text-amber-300 fill-amber-300" />
            <span>Urgențe 24/7</span>
          </button>

          {/* Verified ID & Escrow Pill */}
          <button
            id="filter-pill-verified"
            type="button"
            onClick={onToggleVerified}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-xl text-[11px] font-extrabold border transition cursor-pointer shrink-0 ${
              filterVerifiedOnly
                ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>Verificați cu Buletin</span>
          </button>

          {/* Rating 4.8+ Pill */}
          <button
            id="filter-pill-rating"
            type="button"
            onClick={onToggleTopRated}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-xl text-[11px] font-extrabold border transition cursor-pointer shrink-0 ${
              filterTopRated
                ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-xs'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
            <span>Rating 4.8+</span>
          </button>
        </div>
      )}
    </div>
  );
};
