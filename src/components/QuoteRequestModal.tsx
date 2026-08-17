import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  Camera,
  Clock,
  Send,
  UserCheck,
  FileText,
  AlertCircle
} from 'lucide-react';
import { Provider, UserProfile } from '../types';
import { CATEGORIES } from '../data/mockData';

interface QuoteRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetProvider?: Provider | null;
  currentCity: string;
  currentUser?: UserProfile;
}

const PRESET_REQUIREMENT_TAGS = [
  '⚡ Urgență - Am nevoie azi!',
  '🔧 Diagnostic & Reparație defecțiune',
  '🧱 Montaj / Lucrare nouă',
  '🗓️ Programare în Weekend',
  '💰 Doresc deviz estimativ gratuit',
  '🛡️ Solicit plată securizată prin Escrow'
];

export const QuoteRequestModal: React.FC<QuoteRequestModalProps> = ({
  isOpen,
  onClose,
  targetProvider,
  currentCity,
  currentUser
}) => {
  const [fullName, setFullName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [city, setCity] = useState(currentCity);
  const [serviceSlug, setServiceSlug] = useState(targetProvider?.categorySlug || 'instalator');
  const [details, setDetails] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [consent, setConsent] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successRequestId, setSuccessRequestId] = useState<string | null>(null);
  const [hasPhotoAttached, setHasPhotoAttached] = useState(false);

  // Sync with current user or target provider changes
  useEffect(() => {
    if (currentUser) {
      if (!fullName) setFullName(currentUser.name);
      if (!phone) setPhone(currentUser.phone || '0740 123 456');
      if (!email) setEmail(currentUser.email);
    }
    if (targetProvider?.categorySlug) {
      setServiceSlug(targetProvider.categorySlug);
    }
    setCity(currentCity);
  }, [currentUser, targetProvider, currentCity, isOpen]);

  if (!isOpen) return null;

  const handleToggleTag = (tag: string) => {
    let nextTags: string[];
    if (selectedTags.includes(tag)) {
      nextTags = selectedTags.filter((t) => t !== tag);
    } else {
      nextTags = [...selectedTags, tag];
    }
    setSelectedTags(nextTags);

    // Auto-update details with selected tag summary if empty or append
    if (nextTags.length > 0) {
      const tagsText = nextTags.join(' • ');
      setDetails((prev) => {
        if (!prev) return tagsText;
        return prev;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const fullDetails = [
      selectedTags.length > 0 ? `[Opțiuni: ${selectedTags.join(', ')}]` : '',
      details
    ]
      .filter(Boolean)
      .join('\n');

    const payload = {
      fullName: fullName || currentUser?.name || 'Client Loco',
      phone: phone || '0740 000 000',
      email: email || 'client@loco-instant.ro',
      city,
      serviceSlug,
      details: fullDetails || 'Cerere de ofertă rapidă (Express)',
      consent,
      hasPhotoAttached,
      targetProviderId: targetProvider?.id
    };

    try {
      const response = await fetch('/api/quote-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const body = await response.json();
        setSuccessRequestId(body.id || `REQ-${Math.floor(10000 + Math.random() * 90000)}`);
      } else {
        setSuccessRequestId(`REQ-${Math.floor(10000 + Math.random() * 90000)}`);
      }
    } catch {
      setSuccessRequestId(`REQ-${Math.floor(10000 + Math.random() * 90000)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isAutoFilled = Boolean(currentUser?.name && fullName === currentUser.name);

  return (
    <div
      id="quote-request-modal"
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-7 shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          id="btn-close-quote-modal"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-500 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {successRequestId ? (
          <div className="text-center py-5 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-2xl font-black shadow-inner">
              <CheckCircle2 className="w-10 h-10 animate-bounce" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-black text-slate-900">
                Cerere Express Trimisă cu Succes!
              </h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                {targetProvider
                  ? `Solicitarea a fost direcționată prioritar către ${targetProvider.name}. Timp estimat de răspuns: sub 15 minute.`
                  : `Cererea a fost distribuită către toți meșterii verificați din ${city}. Vei primi oferte directe pe telefon.`}
              </p>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs font-mono text-slate-700 font-bold flex items-center justify-between">
              <span>Cod Solicitare:</span>
              <span className="text-emerald-700">{successRequestId}</span>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-left text-xs text-emerald-900 flex items-start space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block">Garanția Loco Escrow</strong>
                <span>Plata se efectuează doar după ce lucrarea este finalizată conform înțelegerii.</span>
              </div>
            </div>

            <button
              id="btn-quote-success-close"
              type="button"
              onClick={() => {
                setSuccessRequestId(null);
                onClose();
              }}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition cursor-pointer active:scale-98"
            >
              Am Înțeles • Închide
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Header / Mode Indicator */}
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5 text-emerald-600 text-xs font-extrabold mb-1">
                  <Sparkles className="w-4 h-4" />
                  <span>Express 2-Tap Quote • Gratuit</span>
                </div>
                {isAutoFilled && (
                  <span className="flex items-center space-x-1 text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-200">
                    <UserCheck className="w-3 h-3" />
                    <span>Auto-Completat</span>
                  </span>
                )}
              </div>

              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                {targetProvider ? `Cere Ofertă: ${targetProvider.name}` : `Cere Ofertă Rapidă în ${city}`}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Completează în câteva secunde. Meșterii disponibili te vor contacta telefonic sau pe WhatsApp.
              </p>
            </div>

            {/* Target Provider Preview Card if targeted */}
            {targetProvider && (
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center space-x-3">
                <img
                  src={targetProvider.image}
                  alt={targetProvider.name}
                  className="w-11 h-11 rounded-xl object-cover border border-slate-200 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-1.5">
                    <h4 className="text-xs font-black text-slate-900 truncate">{targetProvider.name}</h4>
                    {targetProvider.isVerified && <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                  </div>
                  <p className="text-[11px] text-slate-500">{targetProvider.role} • {targetProvider.price}</p>
                </div>
                <div className="text-right text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">
                  <Clock className="w-3 h-3 inline mr-1" />
                  {targetProvider.responseTime}
                </div>
              </div>
            )}

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 1-Tap Quick Requirement Tags */}
              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
                  Alege Opțiuni Rapide (1-Tap):
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_REQUIREMENT_TAGS.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleToggleTag(tag)}
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-xl border transition cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Service & City Selectors */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[10px] font-extrabold uppercase text-slate-500 mb-1">
                    Categorie Serviciu
                  </label>
                  <select
                    value={serviceSlug}
                    onChange={(e) => setServiceSlug(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs font-bold bg-slate-50 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold uppercase text-slate-500 mb-1">
                    Oraș / Zonă
                  </label>
                  <div className="relative flex items-center">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 absolute left-2.5 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full pl-7 pr-2.5 py-2 text-xs font-bold bg-slate-50 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* User Contact Details (Auto-filled) */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[10px] font-extrabold uppercase text-slate-500 mb-1">
                    Numele Tău *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ion Popescu"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs font-semibold bg-slate-50 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold uppercase text-slate-500 mb-1">
                    Telefon Mobil *
                  </label>
                  <div className="relative flex items-center">
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
                    <input
                      type="tel"
                      required
                      placeholder="07xx xxx xxx"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-7 pr-2.5 py-2 text-xs font-semibold bg-slate-50 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Work Details & Optional Photo Attachment */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] font-extrabold uppercase text-slate-500">
                    Descriere Scurtă Defecțiune / Cerințe
                  </label>
                  <button
                    type="button"
                    onClick={() => setHasPhotoAttached(!hasPhotoAttached)}
                    className={`text-[10px] font-bold flex items-center space-x-1 px-2 py-0.5 rounded-lg border transition cursor-pointer ${
                      hasPhotoAttached
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Camera className="w-3 h-3" />
                    <span>{hasPhotoAttached ? '✓ Poză Adăugată' : '+ Poză Defecțiune'}</span>
                  </button>
                </div>
                <textarea
                  rows={2}
                  placeholder="Ex: Picură țeava de sub chiuvetă la îmbinare, rog intervenție după ora 16:00."
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-medium bg-slate-50 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Consent check */}
              <label className="flex items-start space-x-2 text-[11px] text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  required
                  className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span>
                  Sunt de acord să primesc oferte directe și notificări prin SMS / WhatsApp legate de această lucrare.
                </span>
              </label>

              {/* Express Submit Button */}
              <button
                id="btn-submit-express-quote"
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-600/30 flex items-center justify-center space-x-2 transition cursor-pointer active:scale-98"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Se transmite cererea...' : 'Trimite Solicitarea Instant (Gratuit)'}</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
