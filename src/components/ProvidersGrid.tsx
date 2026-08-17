import React from 'react';
import {
  ShieldCheck,
  Star,
  Clock,
  Phone,
  MessageSquare,
  MapPin,
  CheckCircle2,
  Sparkles,
  Filter,
  Share2,
  Zap
} from 'lucide-react';
import { Provider } from '../types';

interface ProvidersGridProps {
  providers: Provider[];
  onOpenQuoteModal: (provider?: Provider) => void;
  onOpenChat: (provider: Provider) => void;
  selectedCategory: string;
  onShareProvider?: (provider: Provider) => void;
  onOpenReviews?: (provider: Provider) => void;
  onShowOnMap?: (provider: Provider) => void;
}

export const ProvidersGrid: React.FC<ProvidersGridProps> = ({
  providers,
  onOpenQuoteModal,
  onOpenChat,
  selectedCategory,
  onShareProvider,
  onOpenReviews,
  onShowOnMap
}) => {
  return (
    <section id="providers-listing-section" className="space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Prestatori Disponibili în Apropiere
            </h2>
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold rounded-full border border-emerald-200">
              Live
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Meșteri verificați cu buletinul, garanție de execuție și recenzii de la clienți reali
          </p>
        </div>
        <div className="self-start sm:self-auto flex items-center space-x-2">
          <span className="text-xs font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-xl border border-slate-200">
            {providers.length} meșteri gata de intervenție
          </span>
        </div>
      </div>

      {providers.length === 0 ? (
        <div className="p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-3">
          <p className="text-slate-500 text-sm">Nu am găsit niciun prestator conform filtrelor selectate.</p>
          <button
            id="btn-general-quote"
            type="button"
            onClick={() => onOpenQuoteModal()}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition cursor-pointer"
          >
            Trimite o cerere generală de ofertă în oraș
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {providers.map((p) => (
            <article
              key={p.id}
              id={`provider-card-${p.id}`}
              className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                {/* Header Info */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <div className="relative shrink-0">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-14 h-14 rounded-2xl object-cover border border-slate-200 group-hover:scale-105 transition-transform"
                      />
                      {p.is247 && (
                        <span className="absolute -bottom-1 -right-1 bg-rose-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full border border-white flex items-center shadow-xs">
                          <Zap className="w-2.5 h-2.5 fill-current mr-0.5" />
                          24/7
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <h3 className="font-extrabold text-sm text-slate-900 line-clamp-1">{p.name}</h3>
                        {p.isVerified && (
                          <ShieldCheck
                            className="w-4 h-4 text-emerald-600 shrink-0"
                            title="Identitate & Cazier Verificate"
                          />
                        )}
                      </div>
                      <p className="text-xs text-slate-500 font-medium">{p.role}</p>
                      <button
                        type="button"
                        onClick={() => onShowOnMap && onShowOnMap(p)}
                        className="inline-flex items-center space-x-1 text-[10px] text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 font-bold px-2 py-0.5 rounded-lg border border-emerald-200 transition cursor-pointer mt-0.5"
                        title="Localizează pe harta GPS"
                      >
                        <MapPin className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
                        <span className="truncate max-w-[130px]">{p.district ? `${p.district.split(',')[0]} (Hartă)` : `${p.city} (Hartă)`}</span>
                      </button>
                    </div>
                  </div>

                  {/* Rating Badge */}
                  <div
                    onClick={() => onOpenReviews && onOpenReviews(p)}
                    className="text-right shrink-0 cursor-pointer group/rating hover:opacity-80 transition"
                    title="Apasă pentru a vedea recenziile"
                  >
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-amber-50 group-hover/rating:bg-amber-100 text-amber-800 font-extrabold text-xs rounded-lg border border-amber-200">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span>{p.rating.toFixed(1)}</span>
                    </span>
                    <p className="text-[10px] text-emerald-600 font-extrabold mt-0.5 underline decoration-emerald-300">
                      {p.reviewsCount} recenzii ★
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {p.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {p.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Price & Response time bar */}
                <div className="flex items-center justify-between text-xs bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Tarif estimativ</span>
                    <span className="font-extrabold text-emerald-700">{p.price}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Timp răspuns</span>
                    <span className="font-bold text-slate-700 flex items-center justify-end space-x-1">
                      <Clock className="w-3 h-3 text-emerald-600" />
                      <span>{p.responseTime}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Streamlined Mobile Actions with Clear Hierarchy */}
              <div className="pt-2 flex items-center gap-2">
                {/* Dominant Primary Action */}
                <button
                  type="button"
                  onClick={() => onOpenQuoteModal(p)}
                  className="flex-1 min-h-[44px] py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-xs transition flex items-center justify-center space-x-1.5 cursor-pointer active:scale-98"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Cere Ofertă</span>
                </button>

                {/* Direct Call Button */}
                <a
                  href={`tel:${p.phone}`}
                  className="min-h-[44px] min-w-[44px] px-3 py-2.5 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-bold text-xs rounded-xl flex items-center justify-center transition cursor-pointer active:scale-95"
                  title="Apelează Direct"
                >
                  <Phone className="w-4 h-4 text-emerald-400" />
                </a>

                {/* Direct Chat / WhatsApp */}
                <button
                  type="button"
                  onClick={() => onOpenChat(p)}
                  className="min-h-[44px] min-w-[44px] px-3 py-2.5 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl border border-slate-200 flex items-center justify-center transition cursor-pointer active:scale-95"
                  title="Deschide Chat Securizat"
                >
                  <MessageSquare className="w-4 h-4 text-slate-700" />
                </button>

                {/* View on Live Map Button */}
                {onShowOnMap && (
                  <button
                    type="button"
                    onClick={() => onShowOnMap(p)}
                    className="min-h-[44px] min-w-[44px] px-3 py-2.5 bg-emerald-50 hover:bg-emerald-100 active:bg-emerald-200 text-emerald-800 font-bold text-xs rounded-xl border border-emerald-200 flex items-center justify-center transition cursor-pointer active:scale-95"
                    title="Arată Meșterul pe Harta Live"
                  >
                    <MapPin className="w-4 h-4 text-emerald-600" />
                  </button>
                )}

                {/* Social Share Reward Button */}
                {onShareProvider && (
                  <button
                    type="button"
                    onClick={() => onShareProvider(p)}
                    className="min-h-[44px] min-w-[44px] px-3 py-2.5 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs rounded-xl border border-purple-200 flex items-center justify-center transition cursor-pointer active:scale-95"
                    title="Distribuie & Câștigă 15P"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};
