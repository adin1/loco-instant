import React from 'react';
import { CATEGORIES } from '../data/mockData';
import { AdCategory } from '../types';

interface CategorySectionProps {
  selectedCategory: string;
  onSelectCategory: (slug: string) => void;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  selectedCategory,
  onSelectCategory
}) => {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Categorii de Servicii & Urgențe
          </h2>
          <p className="text-xs text-slate-500">
            Alege domeniul dorit pentru a vedea prestatorii disponibili în timp real
          </p>
        </div>
        {selectedCategory !== 'all' && (
          <button
            onClick={() => onSelectCategory('all')}
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200"
          >
            Afișează Toate Categorile ×
          </button>
        )}
      </div>

      {/* Grid of Category Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {CATEGORIES.map((cat: AdCategory) => {
          const isSelected = selectedCategory === cat.slug;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(isSelected ? 'all' : cat.slug)}
              className={`p-4 rounded-2xl border text-left transition-all relative group flex flex-col justify-between ${
                isSelected
                  ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-200 scale-[1.02]'
                  : 'bg-white border-slate-200 text-slate-800 hover:border-emerald-300 hover:shadow-md'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl p-1 bg-slate-100 rounded-xl group-hover:scale-110 transition-transform inline-block">
                  {cat.icon}
                </span>
                {cat.badge && (
                  <span
                    className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md ${
                      isSelected
                        ? 'bg-emerald-700 text-white'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {cat.badge}
                  </span>
                )}
              </div>

              <div>
                <h3
                  className={`font-extrabold text-xs sm:text-sm leading-tight ${
                    isSelected ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {cat.name}
                </h3>
                <p
                  className={`text-[11px] mt-1 font-medium ${
                    isSelected ? 'text-emerald-100' : 'text-slate-500'
                  }`}
                >
                  {cat.providersCount} prestatori activi
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
