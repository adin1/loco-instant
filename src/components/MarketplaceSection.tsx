import React from 'react';
import { ShoppingBag, Star, Heart, CheckCircle2, ArrowRight, Share2 } from 'lucide-react';
import { MARKETPLACE_PRODUCTS } from '../data/mockData';
import { MarketplaceProduct } from '../types';

interface MarketplaceSectionProps {
  currentCity: string;
  onOrderProduct: (product: MarketplaceProduct) => void;
  onShareProduct?: (product: MarketplaceProduct) => void;
}

export const MarketplaceSection: React.FC<MarketplaceSectionProps> = ({
  currentCity,
  onOrderProduct,
  onShareProduct
}) => {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 bg-amber-100 text-amber-800 rounded-xl font-bold text-xs">
              🏡 Producători Locali
            </span>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Marketplace Local & Produse de Casă
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            Cumpără miere, dulcețuri, ouă de țară și brânzeturi direct de la producătorii locali din {currentCity}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {MARKETPLACE_PRODUCTS.map((prod) => (
          <article
            key={prod.id}
            className="bg-white rounded-3xl p-4 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3 group"
          >
            <div className="space-y-3">
              <div className="relative h-40 rounded-2xl overflow-hidden bg-slate-100">
                <img
                  src={prod.image}
                  alt={prod.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {prod.badge && (
                  <span className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-lg shadow-sm">
                    {prod.badge}
                  </span>
                )}
                <span className="absolute bottom-2 right-2 bg-slate-900/80 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-lg backdrop-blur-xs">
                  {prod.city}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-extrabold text-amber-700 uppercase tracking-wider block">
                  {prod.category}
                </span>
                <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 line-clamp-1">
                  {prod.name}
                </h3>
                <p className="text-[11px] text-slate-500 font-semibold">{prod.producer}</p>
              </div>

              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {prod.description}
              </p>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                <div className="flex items-center space-x-1 font-bold text-amber-600">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{prod.rating} ({prod.reviewsCount})</span>
                </div>
                <div className="text-right">
                  <span className="text-base font-black text-slate-900">{prod.price} RON</span>
                  <span className="text-[10px] text-slate-400 block">/ {prod.unit}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => onOrderProduct(prod)}
                className="flex-1 py-2.5 bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl transition flex items-center justify-center space-x-1.5 shadow-sm"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Comandă Local</span>
              </button>
              {onShareProduct && (
                <button
                  onClick={() => onShareProduct(prod)}
                  className="px-3 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs rounded-xl border border-amber-200 flex items-center justify-center transition"
                  title="Distribuie & Câștigă Puncte"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
