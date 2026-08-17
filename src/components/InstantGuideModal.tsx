import React, { useState } from 'react';
import {
  X,
  Compass,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  MapPin,
  Clock,
  Phone,
  Coins,
  Flame,
  ShoppingBag,
  Truck,
  HelpCircle,
  Zap,
  Lock,
  Star,
  Users,
  Search,
  ThumbsUp
} from 'lucide-react';

interface InstantGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToView: (view: string, segment?: any) => void;
  onOpenQuoteModal: () => void;
  onOpenPublishAdModal: () => void;
  onOpenRetentionHub: () => void;
  onRewardPointsEarned?: (points: number, reason: string) => void;
  currentCity: string;
}

type GuideTab = 'tour' | 'client' | 'provider' | 'escrow' | 'faq';

interface TourStep {
  id: number;
  title: string;
  subtitle: string;
  badge: string;
  icon: React.ReactNode;
  content: string;
  tips: string[];
  actionLabel?: string;
  onAction?: () => void;
}

export const InstantGuideModal: React.FC<InstantGuideModalProps> = ({
  isOpen,
  onClose,
  onNavigateToView,
  onOpenQuoteModal,
  onOpenPublishAdModal,
  onOpenRetentionHub,
  onRewardPointsEarned,
  currentCity
}) => {
  const [activeTab, setActiveTab] = useState<GuideTab>('tour');
  const [currentStep, setCurrentStep] = useState(0);
  const [hasClaimedBonus, setHasClaimedBonus] = useState(false);

  if (!isOpen) return null;

  const tourSteps: TourStep[] = [
    {
      id: 1,
      title: 'Găsește & Filtrează Meșteri Verificați',
      subtitle: 'Cum funcționează căutarea inteligentă',
      badge: 'Pasul 1 / 6',
      icon: <Search className="w-6 h-6 text-emerald-600" />,
      content:
        'Alege categoria de interes (Instalator, Electrician, Lăcătuș de urgență etc.) din bara superioară sau din lista de categorii. Poți filtra rapid meșterii activi 24/7, cei cu badge PRO și cei mai bine cotați de comunitate.',
      tips: [
        'Folosește comutatorul de oraș pentru a schimba instant aria de căutare.',
        'Badge-ul verde cu scut indică prestatori verificați cu identitate și atestat.'
      ],
      actionLabel: 'Explorează Meșteri Acasă',
      onAction: () => {
        onNavigateToView('home', 'providers');
        onClose();
      }
    },
    {
      id: 2,
      title: 'Harta Live GPS Sincronizată',
      subtitle: 'Localizare în timp real în cartierul tău',
      badge: 'Pasul 2 / 6',
      icon: <MapPin className="w-6 h-6 text-emerald-600" />,
      content:
        'Când selectezi un serviciu sau dai click pe pictograma de hartă a unui prestator, harta GPS se centrează automat și evidențiază poziția meșterilor apropiați, timpul estimat de răspuns și tariful de pornire.',
      tips: [
        'Apasă pe oricare pin de pe hartă pentru a vedea cardul rapid de contact.',
        'Pinii au iconițe dedicate fiecărei meserii (cheie, cheie mecanică, fulger etc.).'
      ],
      actionLabel: 'Deschide Harta Live GPS',
      onAction: () => {
        onNavigateToView('map');
        onClose();
      }
    },
    {
      id: 3,
      title: 'Cere Ofertă Express în 60 Secunde',
      subtitle: 'Formular rapid fără bătăi de cap',
      badge: 'Pasul 3 / 6',
      icon: <Sparkles className="w-6 h-6 text-amber-500" />,
      content:
        'Ai nevoie de o intervenție urgentă sau de o lucrare planificată? Completează datele sumare ale lucrării, alege tag-urile specifice și cererea ta este transmisă instantaneu meșterilor disponibili din orașul tău.',
      tips: [
        'Poți cere ofertă generică sau direct unui meșter ales de pe profilul său.',
        'Vei primi apel telefonic sau mesaj WhatsApp în cel mai scurt timp.'
      ],
      actionLabel: 'Deschide Formular Cerere Ofertă',
      onAction: () => {
        onOpenQuoteModal();
        onClose();
      }
    },
    {
      id: 4,
      title: 'Plăți Sigure prin Sistemul Escrow',
      subtitle: 'Garanție 100% pentru clienți și meșteri',
      badge: 'Pasul 4 / 6',
      icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
      content:
        'Prin sistemul Loco Escrow, plata ta este securizată într-un cont de garanție la începerea lucrării. Meșterul începe lucrarea știind că fondurile sunt asigurate, iar banii se eliberează doar după ce confirmi finalizarea satisfăcătoare.',
      tips: [
        'În caz de dispută, fondurile pot fi restituite conform politicii de garanție.',
        'Toate tranzacțiile generează recenzii verificate Escrow de încredere maximă.'
      ],
      actionLabel: 'Vezi Panoul de Comenzi & Escrow',
      onAction: () => {
        onNavigateToView('orders');
        onClose();
      }
    },
    {
      id: 5,
      title: 'Piață Locală & Curierat Express',
      subtitle: 'Producători locali și livrări rapide',
      badge: 'Pasul 5 / 6',
      icon: <ShoppingBag className="w-6 h-6 text-indigo-600" />,
      content:
        'În afară de meșteri, platforma include secțiunea de Marketplace pentru produse tradiționale și meșteșugărești din zona ta, precum și serviciul de Curierat Local dedicat (moto, auto, utilitară 3.5T).',
      tips: [
        'Produsele locale pot fi comandate direct cu plată garantată.',
        'Curieratul oferă estimare de preț automată în funcție de adrese și gabarit.'
      ],
      actionLabel: 'Vezi Piața Locală',
      onAction: () => {
        onNavigateToView('marketplace');
        onClose();
      }
    },
    {
      id: 6,
      title: 'Centrul Loco Rewards & Puncte',
      subtitle: 'Check-in zilnic, serii active și reduceri',
      badge: 'Pasul 6 / 6',
      icon: <Flame className="w-6 h-6 text-orange-500" />,
      content:
        'Câștigi Puncte Loco la fiecare check-in zilnic (Daily Streak), când recomanzi un meșter prin butonul de Distribuie (+50P) sau când lași o recenzie (+75P). Punctele se convertesc în reduceri la manoperă și vouchere.',
      tips: [
        'Menține seria zilnică activă pentru a debloca multiplicatori x2 și insigne Pro.',
        'Poți revendica vouchere direct din panoul de recompense.'
      ],
      actionLabel: 'Deschide Centrul Loco Rewards',
      onAction: () => {
        onOpenRetentionHub();
        onClose();
      }
    }
  ];

  const handleNextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep((s) => s + 1);
    } else if (!hasClaimedBonus) {
      setHasClaimedBonus(true);
      if (onRewardPointsEarned) {
        onRewardPointsEarned(25, 'Finalizare Ghid Instant Interactiv');
      }
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    }
  };

  const step = tourSteps[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
        {/* Header with Title & Tabs */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white p-4 sm:p-6 border-b border-slate-700 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer"
            title="Închide Ghidul"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20">
              <Compass className="w-5 h-5 text-slate-950 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  Ghid Instant Loco
                </h2>
                <span className="bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                  Activ • {currentCity}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Află cum găsești rapid meșteri, comanzi în siguranță și folosești toate funcțiile platformei.
              </p>
            </div>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 no-scrollbar pt-2">
            <button
              type="button"
              onClick={() => setActiveTab('tour')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'tour'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                  : 'bg-white/10 text-slate-300 hover:bg-white/15 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Tur Interactiv</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('client')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'client'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                  : 'bg-white/10 text-slate-300 hover:bg-white/15 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Ghid Client</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('provider')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'provider'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                  : 'bg-white/10 text-slate-300 hover:bg-white/15 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ghid Meșter / Prestator</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('escrow')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'escrow'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                  : 'bg-white/10 text-slate-300 hover:bg-white/15 hover:text-white'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Garanție Escrow</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('faq')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'faq'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                  : 'bg-white/10 text-slate-300 hover:bg-white/15 hover:text-white'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Întrebări Frecvente</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* TAB 1: INTERACTIVE TOUR */}
          {activeTab === 'tour' && (
            <div className="space-y-6">
              {/* Progress Dots */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                  {step.badge}
                </span>
                <div className="flex items-center space-x-1.5">
                  {tourSteps.map((s, idx) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setCurrentStep(idx)}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        idx === currentStep
                          ? 'w-6 bg-emerald-600'
                          : idx < currentStep
                          ? 'w-2 bg-emerald-300'
                          : 'w-2 bg-slate-200'
                      }`}
                      title={`Mergi la ${s.title}`}
                    />
                  ))}
                </div>
              </div>

              {/* Main Card with Step Content */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4">
                <div className="flex items-start space-x-3.5">
                  <div className="w-12 h-12 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center shrink-0">
                    {step.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">{step.title}</h3>
                    <p className="text-xs font-semibold text-slate-500">{step.subtitle}</p>
                  </div>
                </div>

                <p className="text-sm text-slate-700 leading-relaxed font-normal">{step.content}</p>

                {/* Practical Tips */}
                <div className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-2">
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                    💡 Sfaturi Rapide:
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-600 font-medium">
                    {step.tips.map((tip, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Direct Action Trigger */}
                {step.actionLabel && step.onAction && (
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={step.onAction}
                      className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm transition cursor-pointer"
                    >
                      <span>{step.actionLabel}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                    </button>
                  </div>
                )}
              </div>

              {/* Tour Navigation Controls */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  disabled={currentStep === 0}
                  className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    currentStep === 0
                      ? 'text-slate-300 bg-slate-100 cursor-not-allowed'
                      : 'text-slate-700 bg-slate-100 hover:bg-slate-200 active:scale-95'
                  }`}
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Pasul Anterior</span>
                </button>

                {currentStep < tourSteps.length - 1 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="flex items-center space-x-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl shadow-md transition cursor-pointer active:scale-95"
                  >
                    <span>Pasul Următor</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      handleNextStep();
                      onClose();
                    }}
                    className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-black rounded-xl shadow-lg transition cursor-pointer active:scale-95"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Am Înțeles Tot • Finalizează</span>
                    {hasClaimedBonus ? null : <span className="bg-white/20 text-white text-[10px] px-1.5 py-0.5 rounded font-extrabold">+25P Bonus</span>}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: CLIENT GUIDE */}
          {activeTab === 'client' && (
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900">Cum găsesc cel mai bun meșter?</h4>
                    <p className="text-xs text-slate-600">Verifică recenziile, tariful de pornire și timpul estimat.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onNavigateToView('home', 'providers');
                    onClose();
                  }}
                  className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition"
                >
                  Vezi Meșteri
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <h5 className="text-xs font-bold text-slate-900">1. Selectează & Contactează</h5>
                  </div>
                  <p className="text-xs text-slate-600">
                    Apasă pe «Sună Acum» sau «Chat & Escrow» pentru a discuta direct detaliile lucrării tale.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <h5 className="text-xs font-bold text-slate-900">2. Cere Ofertă Gratuită</h5>
                  </div>
                  <p className="text-xs text-slate-600">
                    Descrie problema în formular și primești până la 3 propuneri de preț fără niciun cost.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <div className="flex items-center space-x-2">
                    <Lock className="w-4 h-4 text-blue-600" />
                    <h5 className="text-xs font-bold text-slate-900">3. Blochează Plata în Escrow</h5>
                  </div>
                  <p className="text-xs text-slate-600">
                    Banii sunt păstrați în siguranță până când verifici că robinetul nu curge sau lucrarea e gata.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-amber-500" />
                    <h5 className="text-xs font-bold text-slate-900">4. Lasă o Recenzie</h5>
                  </div>
                  <p className="text-xs text-slate-600">
                    Evaluează meșterul cu stele și tag-uri pentru a ajuta comunitatea și a primi +75 Puncte Loco.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PROVIDER GUIDE */}
          {activeTab === 'provider' && (
            <div className="space-y-4">
              <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-emerald-400 uppercase tracking-wider">
                    Pentru Profesioniști & Meșteri
                  </span>
                  <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-400/30">
                    Comisioane Mici • Zero Risc
                  </span>
                </div>
                <h4 className="text-base font-black text-white">Publică Anunțul Tău și Primește Clienți</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Înregistrează-ți profilul de meșter sau companie în mai puțin de 2 minute. Apari pe harta live a orașului tău și primești cereri directe de la clienți.
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      onOpenPublishAdModal();
                      onClose();
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow transition"
                  >
                    Publică Anunț Gratuit
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onNavigateToView('dashboard-anunturi');
                      onClose();
                    }}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition"
                  >
                    Deschide Dashboard Anunțuri
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-1.5">
                  <div className="font-bold text-slate-900 flex items-center space-x-1.5">
                    <span className="w-5 h-5 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-[10px] font-black">
                      1
                    </span>
                    <span>Profil Complet</span>
                  </div>
                  <p className="text-slate-600">Adaugă poze cu lucrările tale, tarife clare și numărul de telefon.</p>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-1.5">
                  <div className="font-bold text-slate-900 flex items-center space-x-1.5">
                    <span className="w-5 h-5 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-[10px] font-black">
                      2
                    </span>
                    <span>Plăți Garantate</span>
                  </div>
                  <p className="text-slate-600">Banii sunt securizați în Escrow înainte să cumperi materialele.</p>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-1.5">
                  <div className="font-bold text-slate-900 flex items-center space-x-1.5">
                    <span className="w-5 h-5 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-[10px] font-black">
                      3
                    </span>
                    <span>Promovare VIP</span>
                  </div>
                  <p className="text-slate-600">Activează pachetele de promovare pentru a fi primul pe hartă și căutări.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ESCROW GUARANTEE */}
          {activeTab === 'escrow' && (
            <div className="space-y-4">
              <div className="p-5 bg-emerald-50/80 border border-emerald-200 rounded-2xl space-y-3">
                <div className="flex items-center space-x-2 text-emerald-800 font-extrabold text-sm">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <span>Cum te protejează sistemul Loco Escrow?</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  Eliminăm nesiguranța lucrărilor făcute de mântuială sau teama prestatorilor de a nu fi plătiți. 
                  Loco Escrow acționează ca un intermediar de încredere (trust neutral):
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 text-xs">
                  <div className="bg-white p-3 rounded-xl border border-emerald-200/80">
                    <span className="font-extrabold text-emerald-800 block mb-1">Pasul 1: Depozit</span>
                    <span className="text-slate-600">Clientul depune suma agreată în contul de garanție securizat.</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-emerald-200/80">
                    <span className="font-extrabold text-emerald-800 block mb-1">Pasul 2: Execuție</span>
                    <span className="text-slate-600">Meșterul execută lucrarea conform specificațiilor agreate.</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-emerald-200/80">
                    <span className="font-extrabold text-emerald-800 block mb-1">Pasul 3: Eliberare</span>
                    <span className="text-slate-600">Clientul verifică și apasă «Eliberează Fondurile».</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between bg-slate-900 text-white p-4 rounded-2xl">
                <div>
                  <span className="text-xs font-bold text-emerald-400">Verifică starea comenzilor tale active</span>
                  <p className="text-xs text-slate-300">Vezi comenzile în derulare, chat-ul și plățile în așteptare.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onNavigateToView('orders');
                    onClose();
                  }}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold rounded-xl transition cursor-pointer"
                >
                  Vezi Comenzi
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: FAQ */}
          {activeTab === 'faq' && (
            <div className="space-y-3">
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-1">
                <h4 className="text-xs font-black text-slate-900">Costă ceva să cer o ofertă?</h4>
                <p className="text-xs text-slate-600">
                  Nu! Cererile de ofertă transmise prin platformă sunt 100% gratuite pentru toți clienții.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-1">
                <h4 className="text-xs font-black text-slate-900">Cum știu dacă un meșter este de încredere?</h4>
                <p className="text-xs text-slate-600">
                  Verifică insigna de „Verificat”, numărul de recenzii cu steluțe și badge-urile Escrow din profilul prestatorului.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-1">
                <h4 className="text-xs font-black text-slate-900">Cum adun Puncte Loco Rewards?</h4>
                <p className="text-xs text-slate-600">
                  Fă check-in zilnic (+15-30P), distribuie pagina unui meșter prietenilor (+50P) sau lasă o recenzie după o lucrare (+75P).
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-1">
                <h4 className="text-xs font-black text-slate-900">Ce fac în cazul unei urgențe la miezul nopții?</h4>
                <p className="text-xs text-slate-600">
                  Bifează filtrul «Urgențe 24/7» sau alege categoria Lăcătuș / Instalații de urgență pentru a găsi specialiști disponibili non-stop.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold">Loco Instant 2026 • Servicii Locale Verificate</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition cursor-pointer"
          >
            Închide Ghidul
          </button>
        </div>
      </div>
    </div>
  );
};
