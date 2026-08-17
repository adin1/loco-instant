import React, { useState } from 'react';
import { X, PlusCircle, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { PROMOTION_PACKAGES, CATEGORIES } from '../data/mockData';

interface PublishAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPackageCode?: string;
  currentCity: string;
}

export const PublishAdModal: React.FC<PublishAdModalProps> = ({
  isOpen,
  onClose,
  defaultPackageCode = 'standard',
  currentCity
}) => {
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState(CATEGORIES[0].id);
  const [locality, setLocality] = useState(currentCity);
  const [zone, setZone] = useState('');
  const [estimatedPrice, setEstimatedPrice] = useState('');
  const [packageCode, setPackageCode] = useState(defaultPackageCode);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [description, setDescription] = useState('');
  const [externalPromo, setExternalPromo] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8 animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-500 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-2xl font-black">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-black text-slate-900">Anunțul tău a fost Publicat!</h3>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              Pachetul de promovare tău este activ. Anunțul tău va apărea în căutările din {locality} și pe rețelele sociale.
            </p>
            <button
              onClick={() => {
                setSuccess(false);
                onClose();
              }}
              className="w-full py-3 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md"
            >
              Închide și Vezi Anunțul
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <div className="flex items-center space-x-2 text-emerald-600 text-xs font-bold mb-1">
                <PlusCircle className="w-4 h-4" />
                <span>Ești Prestator sau Mester?</span>
              </div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Publică Anunțul Tău de Servicii pe LOCO Instant
              </h2>
              <p className="text-xs text-slate-500">
                Atrage clienți noi direct pe telefon și pe WhatsApp în orașul tău
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Titlu Anunț *</label>
                  <input
                    type="text"
                    required
                    placeholder="ex. Instalator Sanitar & Desfundări Urgente"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Categorie *</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-bold bg-slate-50 rounded-xl border border-slate-200 outline-none"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Oraș / Localitate *</label>
                  <input
                    type="text"
                    required
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 rounded-xl border border-slate-200 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Zonă / Cartier</label>
                  <input
                    type="text"
                    placeholder="ex. Mănăștur"
                    value={zone}
                    onChange={(e) => setZone(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 rounded-xl border border-slate-200 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Tarif Estimativ (RON)</label>
                  <input
                    type="number"
                    placeholder="120"
                    value={estimatedPrice}
                    onChange={(e) => setEstimatedPrice(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 rounded-xl border border-slate-200 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Telefon *</label>
                  <input
                    type="tel"
                    required
                    placeholder="07xx xxx xxx"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 rounded-xl border border-slate-200 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">WhatsApp</label>
                  <input
                    type="tel"
                    placeholder="07xx xxx xxx"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 rounded-xl border border-slate-200 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="contact@domeniu.ro"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 rounded-xl border border-slate-200 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                  Pachet de Promovare
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {PROMOTION_PACKAGES.map((pkg) => (
                    <button
                      type="button"
                      key={pkg.code}
                      onClick={() => setPackageCode(pkg.code)}
                      className={`p-2.5 rounded-xl border text-left transition ${
                        packageCode === pkg.code
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <span className="text-xs block font-bold">{pkg.name}</span>
                      <span className="text-[11px] text-emerald-600 font-extrabold">{pkg.price} RON</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Descriere Serviciu</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Descrie serviciile oferite, experiența ta, disponibilitatea și ce te recomandă."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 rounded-xl border border-slate-200 outline-none"
                />
              </div>

              <label className="flex items-center space-x-2 text-xs text-slate-700">
                <input
                  type="checkbox"
                  checked={externalPromo}
                  onChange={(e) => setExternalPromo(e.target.checked)}
                  className="rounded text-emerald-600"
                />
                <span>Distribuie anunțul și pe Facebook Ads, TikTok, Instagram & OLX.</span>
              </label>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition"
              >
                {isSubmitting ? 'Se procesează plată & publicare...' : 'Publică și Activează Promovarea'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
