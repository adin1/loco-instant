import React from 'react';
import { ShieldCheck, Server, Database, Sparkles, CheckCircle2, AlertTriangle, Layers, Zap, ArrowLeft } from 'lucide-react';

interface ExecutiveAuditTabProps {
  onBack?: () => void;
}

export const ExecutiveAuditTab: React.FC<ExecutiveAuditTabProps> = ({ onBack }) => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2 animate-fadeIn">
      {/* Top Back Navigation Bar */}
      {onBack && (
        <div className="flex items-center justify-between bg-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl border border-slate-200 shadow-xs">
          <button
            id="btn-audit-back-home"
            type="button"
            onClick={onBack}
            className="inline-flex items-center space-x-2.5 text-xs font-black text-slate-800 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-50/80 active:bg-emerald-100 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl border border-slate-200 hover:border-emerald-200 transition cursor-pointer min-h-[42px] active:scale-95 shrink-0 group shadow-2xs"
          >
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-600 text-white shadow-xs group-hover:bg-emerald-700 group-hover:scale-105 transition shrink-0">
              <ArrowLeft className="w-3.5 h-3.5 stroke-[2.8]" />
            </div>
            <span className="hidden sm:inline font-black">Înapoi la Pagina Principală (Meșteri & Servicii)</span>
            <span className="sm:hidden font-black">Înapoi la Acasă</span>
          </button>
          <span className="hidden sm:inline-block text-[11px] font-semibold text-slate-400">
            Loco Instant • Raport Tehnic & Arhitectură
          </span>
        </div>
      )}

      {/* Executive Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 space-y-4">
        <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400">
          <Zap className="w-4 h-4" />
          <span>Raport Audit Tehnic & Plan de Migrare 2026</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
          Loco Instant — Starea Arhitecturii & Sursa de Adevăr
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
          Aici este prezentată sinteza diagnosticării proiectului `loco-instant-complete-automation-e2e.git`. Toate funcționalitățile din versiunea veche au fost păstrate integral și integrate în noul design sistem 2026!
        </p>
      </div>

      {/* Grid of Key Diagnostic Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center space-x-2 text-emerald-600 font-bold text-xs">
            <Server className="w-4 h-4" />
            <span>NestJS Backend Core</span>
          </div>
          <p className="text-xl font-black text-slate-900">17 Module Active</p>
          <p className="text-xs text-slate-500">
            Auth, Ads, Chat, Payments Escrow, Search OpenSearch, Reviews, Disputes, Evidence, Notifications.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center space-x-2 text-emerald-600 font-bold text-xs">
            <Database className="w-4 h-4" />
            <span>Prisma ORM & PostgreSQL</span>
          </div>
          <p className="text-xl font-black text-slate-900">Bază de date pregătită</p>
          <p className="text-xs text-slate-500">
            Schema include utilizatori, roluri (client/prestator), anunțuri, oferte, plăți Escrow & poze.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center space-x-2 text-emerald-600 font-bold text-xs">
            <Layers className="w-4 h-4" />
            <span>Next.js App Router</span>
          </div>
          <p className="text-xl font-black text-slate-900">Design 2026 Modern</p>
          <p className="text-xs text-slate-500">
            Păstrează toate route-urile, paginile SEO per serviciu/oraș, hărți, marketplace și pachete de promovare.
          </p>
        </div>
      </div>

      {/* Migration Rule & Principles */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 space-y-3">
        <div className="flex items-center space-x-2 text-emerald-900 font-black text-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>Motto-ul Migrării: FUNCȚIONALITATE VECHE + DESIGN NOU = VERSIUNEA FINALĂ</span>
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-emerald-900 font-medium">
          <li className="flex items-center space-x-1.5">
            <span className="text-emerald-600 font-bold">✓</span>
            <span>Niciun meniu, serviciu sau categorie nu a fost eliminat.</span>
          </li>
          <li className="flex items-center space-x-1.5">
            <span className="text-emerald-600 font-bold">✓</span>
            <span>Harta interactivă cu poziționare GPS a prestatorilor.</span>
          </li>
          <li className="flex items-center space-x-1.5">
            <span className="text-emerald-600 font-bold">✓</span>
            <span>Marketplace local cu susținerea producătorilor de casă.</span>
          </li>
          <li className="flex items-center space-x-1.5">
            <span className="text-emerald-600 font-bold">✓</span>
            <span>Serviciu dedicat de comandă livrare & transport mobilă.</span>
          </li>
          <li className="flex items-center space-x-1.5">
            <span className="text-emerald-600 font-bold">✓</span>
            <span>Pachete de promovare anunțuri (Basic, Standard, Premium).</span>
          </li>
          <li className="flex items-center space-x-1.5">
            <span className="text-emerald-600 font-bold">✓</span>
            <span>Garanție de plată securizată Escrow & chat în timp real.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
