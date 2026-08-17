import React, { useState } from 'react';
import { Truck, MapPin, ArrowRight, Package, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface DeliveryServiceSectionProps {
  currentCity: string;
  onRequestDelivery: (data: any) => void;
}

export const DeliveryServiceSection: React.FC<DeliveryServiceSectionProps> = ({
  currentCity,
  onRequestDelivery
}) => {
  const [pickup, setPickup] = useState('');
  const [delivery, setDelivery] = useState('');
  const [itemType, setItemType] = useState('Mobilă & Obiecte Voluminoase');
  const [vehicle, setVehicle] = useState<'moto' | 'auto' | 'van'>('van');
  const [submitted, setSubmitted] = useState(false);

  const estimatedPrice = vehicle === 'moto' ? 25 : vehicle === 'auto' ? 60 : 150;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRequestDelivery({ pickup, delivery, itemType, vehicle, estimatedPrice, city: currentCity });
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <section className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center font-bold">
            <Truck className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight">
              Serviciu Comandă Livrare & Transport Local
            </h2>
            <p className="text-xs text-slate-400">
              Transport pachete, mobilă, cumpărături sau obiecte grele în {currentCity}
            </p>
          </div>
        </div>
        <span className="text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-xl">
          ⚡ Livrare în ~30-45 minute
        </span>
      </div>

      {submitted ? (
        <div className="p-6 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-center space-y-2 animate-in fade-in">
          <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
          <h3 className="text-lg font-black text-emerald-300">Comandă de Transport Preluată!</h3>
          <p className="text-xs text-slate-300">
            Un curier local sau o utilitară se îndreaptă spre adresa de preluare. ID Comandă: TR-{Math.floor(1000 + Math.random() * 9000)}
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Adresă Preluare (A)
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-emerald-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="ex: Str. Republicii 12, Cluj-Napoca"
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs font-semibold bg-slate-800/80 rounded-xl border border-slate-700 text-white placeholder-slate-500 outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Adresă Destinație (B)
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-indigo-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="ex: Str. Observatorului 4, Mănăștur"
                  value={delivery}
                  onChange={(e) => setDelivery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs font-semibold bg-slate-800/80 rounded-xl border border-slate-700 text-white placeholder-slate-500 outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Ce doriți să transportați?
              </label>
              <select
                value={itemType}
                onChange={(e) => setItemType(e.target.value)}
                className="w-full px-3 py-2.5 text-xs font-bold bg-slate-800/80 rounded-xl border border-slate-700 text-white outline-none"
              >
                <option value="Mobilă & Obiecte Voluminoase">Mobilă, electrocasnice & canapele</option>
                <option value="Pachet / Cumpărături">Pachet mic / Cumpărături magazin</option>
                <option value="Materiale Construcții">Materiale de construcții & saci</option>
                <option value="Documente Urgente">Documente / Plic securizat</option>
              </select>
            </div>
          </div>

          <div className="space-y-4 flex flex-col justify-between">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">
                Alegeți Vehiculul Potrivit
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setVehicle('moto')}
                  className={`p-3 rounded-xl border text-center transition ${
                    vehicle === 'moto'
                      ? 'bg-indigo-600 border-indigo-400 text-white'
                      : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="block text-lg">🛵</span>
                  <span className="text-[11px] font-bold block">Moto / Scooter</span>
                  <span className="text-[10px] opacity-80">25 RON</span>
                </button>

                <button
                  type="button"
                  onClick={() => setVehicle('auto')}
                  className={`p-3 rounded-xl border text-center transition ${
                    vehicle === 'auto'
                      ? 'bg-indigo-600 border-indigo-400 text-white'
                      : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="block text-lg">🚗</span>
                  <span className="text-[11px] font-bold block">Autoturism</span>
                  <span className="text-[10px] opacity-80">60 RON</span>
                </button>

                <button
                  type="button"
                  onClick={() => setVehicle('van')}
                  className={`p-3 rounded-xl border text-center transition ${
                    vehicle === 'van'
                      ? 'bg-indigo-600 border-indigo-400 text-white'
                      : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="block text-lg">🚚</span>
                  <span className="text-[11px] font-bold block">Utilitară 3.5T</span>
                  <span className="text-[10px] opacity-80">150 RON</span>
                </button>
              </div>
            </div>

            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Preț estimativ curse</span>
                <span className="text-xl font-black text-emerald-400">{estimatedPrice} RON</span>
              </div>
              <button
                type="submit"
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-lg flex items-center space-x-1.5 transition"
              >
                <span>Solicită Transport</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </form>
      )}
    </section>
  );
};
