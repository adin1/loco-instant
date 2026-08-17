import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Phone,
  Clock,
  Sparkles,
  X,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Map,
  Eye,
  EyeOff
} from 'lucide-react';
import { Provider } from '../types';

interface LiveMapSectionProps {
  providers: Provider[];
  selectedProviderId: string | null;
  selectedCategory?: string;
  selectedCategoryName?: string;
  onSelectProvider: (provider: Provider) => void;
  onOpenQuoteModal: (provider?: Provider) => void;
  onResetCategory?: () => void;
  currentCity: string;
}

const CATEGORY_ICONS: Record<string, string> = {
  instalator: '🔧',
  electrician: '⚡',
  lacatus: '🔑',
  'transport-mobila': '🚚',
  curatenie: '🧹',
  reparatii: '🛠️',
  'aer-conditionat': '❄️',
  zugrav: '🎨',
  'montaj-mobila': '🪑'
};

export const LiveMapSection: React.FC<LiveMapSectionProps> = ({
  providers,
  selectedProviderId,
  selectedCategory = 'all',
  selectedCategoryName,
  onSelectProvider,
  onOpenQuoteModal,
  onResetCategory,
  currentCity
}) => {
  const [isMapMinimized, setIsMapMinimized] = useState<boolean>(false);
  const [activeMarker, setActiveMarker] = useState<Provider | null>(() => {
    return providers.find((p) => p.id === selectedProviderId) || providers[0] || null;
  });

  // Keep activeMarker synchronized whenever the filtered providers or selectedProviderId change
  useEffect(() => {
    if (selectedProviderId) {
      const found = providers.find((p) => p.id === selectedProviderId);
      if (found) {
        setActiveMarker(found);
        return;
      }
    }
    if (providers.length > 0) {
      // If current activeMarker is no longer in filtered list, pick the first one
      if (!activeMarker || !providers.some((p) => p.id === activeMarker.id)) {
        setActiveMarker(providers[0]);
      }
    } else {
      setActiveMarker(null);
    }
  }, [providers, selectedProviderId]);

  const handleMarkerClick = (provider: Provider) => {
    setActiveMarker(provider);
    onSelectProvider(provider);
  };

  return (
    <section
      id="live-map-section"
      className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-4 scroll-mt-20 transition-all"
    >
      {/* Header bar with controls */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 bg-emerald-500 rounded-full animate-ping" />
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Harta Live cu Meșteri în {currentCity}
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            Localizare GPS în timp real pentru serviciile selectate
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2 text-xs font-bold">
          {selectedCategory !== 'all' && (
            <div className="flex items-center space-x-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-xl">
              <span>{CATEGORY_ICONS[selectedCategory] || '🏷️'}</span>
              <span className="font-extrabold">{selectedCategoryName || selectedCategory}</span>
              {onResetCategory && (
                <button
                  type="button"
                  onClick={onResetCategory}
                  className="ml-1 p-0.5 hover:bg-emerald-200 rounded text-emerald-700 cursor-pointer"
                  title="Resetează filtrul"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          )}

          <div className="flex items-center space-x-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
            <span className="flex items-center space-x-1 text-emerald-700 px-2 py-0.5 bg-emerald-100 rounded-lg">
              <span className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse" />
              <span>GPS Activ</span>
            </span>
            <span className="text-slate-700 px-2 font-black">{providers.length} meșteri</span>
          </div>

          {/* Toggle Map Button (Comută Hartă) */}
          <button
            id="btn-toggle-live-map"
            type="button"
            onClick={() => setIsMapMinimized((prev) => !prev)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border font-black transition-all cursor-pointer shadow-xs active:scale-95 ${
              isMapMinimized
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-500 shadow-emerald-500/20'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
            }`}
            title={isMapMinimized ? 'Extinde Harta Live GPS' : 'Minimizează Harta Live pentru a te concentra pe listă'}
          >
            {isMapMinimized ? (
              <>
                <Eye className="w-3.5 h-3.5 text-emerald-200" />
                <span>Comută Hartă (Afișează)</span>
                <ChevronDown className="w-3.5 h-3.5 text-white" />
              </>
            ) : (
              <>
                <EyeOff className="w-3.5 h-3.5 text-slate-600" />
                <span>Comută Hartă (Minimizează)</span>
                <ChevronUp className="w-3.5 h-3.5 text-slate-600" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Minimized Placeholder View */}
      {isMapMinimized ? (
        <div
          onClick={() => setIsMapMinimized(false)}
          className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white border border-slate-700 flex items-center justify-between cursor-pointer hover:border-emerald-500 transition-all group"
        >
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-emerald-500/20 border border-emerald-500/40 rounded-xl flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <Map className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-black text-white flex items-center space-x-1.5">
                <span>Harta Live este minimizată</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-extrabold">
                  {providers.length} meșteri în {currentCity}
                </span>
              </p>
              <p className="text-[11px] text-slate-400">
                Apasă aici sau pe butonul «Comută Hartă» pentru a redeschide vizualizarea GPS interactivă.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsMapMinimized(false);
            }}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold rounded-xl transition shadow-sm whitespace-nowrap cursor-pointer"
          >
            Extinde Harta
          </button>
        </div>
      ) : (
        /* Interactive Map Visual Stage */
        <div className="relative w-full h-84 sm:h-96 rounded-2xl bg-slate-950 overflow-hidden border border-slate-200 shadow-inner group animate-in fade-in zoom-in-95 duration-200">
          {/* Radar Background & Grid Lines */}
          <div
            className="absolute inset-0 opacity-25 bg-cover bg-center"
            style={{
              backgroundImage: `radial-gradient(#10b981 1.2px, transparent 1.2px), radial-gradient(#334155 1px, #0f172a 1px)`,
              backgroundSize: `24px 24px, 48px 48px`,
              backgroundPosition: `0 0, 12px 12px`
            }}
          />

          {/* City Streets Visual Lines */}
          <svg className="absolute inset-0 w-full h-full stroke-emerald-500/20" strokeWidth="2" fill="none">
            <path d="M 0,100 Q 200,80 400,180 T 800,200" />
            <path d="M 100,0 Q 150,200 300,400" />
            <path d="M 300,0 Q 250,150 600,400" strokeWidth="3" className="stroke-emerald-500/30" />
          </svg>

          {/* Floating Top Indicators */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-30">
            <div className="bg-slate-900/90 text-white backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-xs font-bold flex items-center space-x-1.5 shadow-md pointer-events-auto">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>Centru {currentCity} • Rază 15 km</span>
            </div>

            {selectedCategory !== 'all' && (
              <div className="bg-emerald-600/95 text-white backdrop-blur-md px-3 py-1.5 rounded-xl border border-emerald-400 text-xs font-extrabold flex items-center space-x-1 shadow-lg pointer-events-auto animate-pulse">
                <Sparkles className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Serviciu Filtru:</span>
                <span>{selectedCategoryName || selectedCategory}</span>
              </div>
            )}
          </div>

          {/* Empty State when no providers match */}
          {providers.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center p-6 text-center z-30 bg-slate-900/80 backdrop-blur-xs">
              <div className="bg-slate-800 border border-slate-700 p-5 rounded-2xl max-w-sm space-y-3 shadow-xl">
                <div className="w-10 h-10 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                  🗺️
                </div>
                <p className="text-white text-xs font-bold">
                  Nu există meșteri înregistrați pe această categorie în {currentCity}.
                </p>
                {onResetCategory && (
                  <button
                    type="button"
                    onClick={onResetCategory}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition cursor-pointer"
                  >
                    Vezi toți meșterii din oraș
                  </button>
                )}
              </div>
            </div>
          )}

          {/* GPS Markers Layer */}
          {providers.map((p, idx) => {
            // Calculate relative map position based on index & coordinates
            const leftPercent = 18 + ((idx * 23 + 12) % 68);
            const topPercent = 22 + ((idx * 19 + 18) % 55);
            const isSelected = activeMarker?.id === p.id;
            const catIcon = CATEGORY_ICONS[p.categorySlug] || '🛠️';

            return (
              <div
                key={p.id}
                style={{ left: `${leftPercent}%`, top: `${topPercent}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20 transition-all duration-300"
              >
                <button
                  type="button"
                  onClick={() => handleMarkerClick(p)}
                  className={`relative group/marker flex flex-col items-center transition-all cursor-pointer ${
                    isSelected ? 'scale-125 z-40' : 'hover:scale-110 z-20 opacity-90 hover:opacity-100'
                  }`}
                >
                  {/* Marker Pulse effect */}
                  {isSelected && (
                    <span className="absolute w-12 h-12 bg-emerald-500/40 rounded-full animate-ping pointer-events-none" />
                  )}

                  {/* Marker Pin Bubble */}
                  <div
                    className={`px-2.5 py-1 rounded-xl font-black text-[11px] shadow-xl flex items-center space-x-1.5 border transition-all ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-white ring-4 ring-emerald-400/50 shadow-emerald-500/30'
                        : 'bg-slate-900 text-emerald-300 border-slate-700 hover:bg-emerald-600 hover:text-white'
                    }`}
                  >
                    <span>{catIcon}</span>
                    <span className="font-extrabold whitespace-nowrap">{p.name.split(' ')[0]}</span>
                    {p.is247 && <span className="text-[9px] bg-rose-500 text-white px-1 rounded font-bold">24/7</span>}
                  </div>

                  {/* Pin Stem */}
                  <div className={`w-0.5 h-3 ${isSelected ? 'bg-emerald-400 shadow-sm' : 'bg-slate-600'}`} />
                </button>
              </div>
            );
          })}

          {/* Selected Marker Popup Card */}
          {activeMarker && (
            <div className="absolute bottom-3 left-3 right-3 sm:left-auto sm:right-3 sm:w-84 bg-white/98 text-slate-900 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-2xl z-40 space-y-3 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center space-x-2.5">
                  <div className="relative shrink-0">
                    <img
                      src={activeMarker.image}
                      alt={activeMarker.name}
                      className="w-11 h-11 rounded-xl object-cover border border-slate-200"
                    />
                    <span className="absolute -bottom-1 -right-1 text-xs">
                      {CATEGORY_ICONS[activeMarker.categorySlug] || '🔧'}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center space-x-1">
                      <h4 className="font-extrabold text-xs text-slate-900 line-clamp-1">
                        {activeMarker.name}
                      </h4>
                      {activeMarker.isVerified && (
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" title="Verificat" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-1 font-medium">{activeMarker.role}</p>
                  </div>
                </div>
                <span className="text-xs font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200 shrink-0">
                  ★ {activeMarker.rating.toFixed(1)}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-600 bg-slate-50 p-2 rounded-xl border border-slate-100">
                <span className="font-extrabold text-emerald-700">{activeMarker.price}</span>
                <span className="flex items-center space-x-1 text-slate-500 font-semibold">
                  <Clock className="w-3 h-3 text-emerald-600" />
                  <span>Răspuns: {activeMarker.responseTime}</span>
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onOpenQuoteModal(activeMarker)}
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-xs transition cursor-pointer"
                >
                  Cere Ofertă Express
                </button>
                <a
                  href={`tel:${activeMarker.phone}`}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center transition cursor-pointer"
                  title="Apelează Direct"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
