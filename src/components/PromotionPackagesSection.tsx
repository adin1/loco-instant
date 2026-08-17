import React, { useState } from 'react';
import { Sparkles, Check, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { PROMOTION_PACKAGES } from '../data/mockData';
import { PromotionPackage } from '../types';

interface PromotionPackagesSectionProps {
  onOpenPublishAdModal: (packageCode?: string) => void;
}

export const PromotionPackagesSection: React.FC<PromotionPackagesSectionProps> = ({
  onOpenPublishAdModal
}) => {
  const [selectedPkgCode, setSelectedPkgCode] = useState<string>('standard');

  return (
    <section className="space-y-6">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full border border-amber-200">
          📣 Promovare Anunțuri & Servicii
        </span>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          Alege un Pachet de Promovare LOCO Instant
        </h2>
        <p className="text-xs text-slate-500">
          Obține cu până la de 10 ori mai mulți clienți prin promovare locală direcționată pe LOCO Instant, Facebook Ads, TikTok și OLX.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PROMOTION_PACKAGES.map((pkg: PromotionPackage) => {
          const isSelected = selectedPkgCode === pkg.code;

          return (
            <div
              key={pkg.id}
              onClick={() => setSelectedPkgCode(pkg.code)}
              className={`rounded-3xl p-6 border-2 transition-all cursor-pointer flex flex-col justify-between relative bg-white shadow-xs ${
                isSelected
                  ? 'border-emerald-600 ring-4 ring-emerald-500/10 shadow-xl scale-[1.02]'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {pkg.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[10px] font-black px-3 py-0.5 rounded-full uppercase tracking-wider shadow-md">
                  Recomandat de meșteri
                </span>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-extrabold text-slate-900">{pkg.name}</h3>
                  <span className="text-xs font-bold bg-slate-100 px-2.5 py-1 rounded-xl text-slate-600">
                    {pkg.durationDays} zile
                  </span>
                </div>

                <div>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-3xl font-black text-slate-900">{pkg.price}</span>
                    <span className="text-xs font-bold text-slate-500">RON</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Valabil {pkg.durationDays} zile de la activare</p>
                </div>

                <ul className="space-y-2.5 pt-2 border-t border-slate-100">
                  {pkg.features.map((feat) => (
                    <li key={feat} className="flex items-start space-x-2 text-xs text-slate-700">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenPublishAdModal(pkg.code);
                  }}
                  className={`w-full py-3 rounded-xl font-bold text-xs transition flex items-center justify-center space-x-1.5 ${
                    isSelected
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                  }`}
                >
                  <span>Selectează Pachetul {pkg.name}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
