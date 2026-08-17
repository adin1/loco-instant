import React from 'react';
import { Home, Map, Sparkles, ClipboardList, User, Flame, ShoppingBag, Truck, ArrowLeft } from 'lucide-react';
import { AppNotification, OrderItem, UserProfile } from '../types';

interface BottomNavigationBarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  onGoBack?: () => void;
  onOpenQuoteModal: () => void;
  onOpenProfile: () => void;
  onOpenRetentionHub: () => void;
  orders: OrderItem[];
  notifications: AppNotification[];
  user: UserProfile;
}

export const BottomNavigationBar: React.FC<BottomNavigationBarProps> = ({
  activeView,
  onViewChange,
  onGoBack,
  onOpenQuoteModal,
  onOpenProfile,
  onOpenRetentionHub,
  orders,
  notifications,
  user
}) => {
  const activeOrdersCount = orders.filter(
    (o) => o.status === 'in_desfasurare' || o.status === 'in_asteptare'
  ).length;

  const isSecondaryView = activeView !== 'home';

  const handleHomeOrBack = () => {
    if (isSecondaryView) {
      if (onGoBack) {
        onGoBack();
      } else {
        onViewChange('home');
      }
    } else {
      onViewChange('home');
    }
  };

  return (
    <nav
      id="mobile-bottom-navigation"
      aria-label="Navigare rapidă mobil"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 py-1.5 pb-safe"
    >
      <div className="max-w-lg mx-auto flex items-center justify-between relative">
        {/* 1. Acasă sau Înapoi */}
        <button
          id="btn-nav-home"
          type="button"
          onClick={handleHomeOrBack}
          className={`flex flex-col items-center justify-center flex-1 py-1 px-0.5 rounded-xl transition cursor-pointer min-h-[44px] min-w-0 ${
            isSecondaryView
              ? 'text-slate-900 bg-emerald-50/70 border border-emerald-200 font-extrabold shadow-2xs'
              : 'text-emerald-600 font-extrabold'
          }`}
          title={isSecondaryView ? 'Înapoi la Pagina Principală' : 'Pagina Principală'}
        >
          <div className="relative">
            {isSecondaryView ? (
              <ArrowLeft className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-emerald-600 stroke-[2.8] animate-pulse" />
            ) : (
              <Home className="w-4.5 h-4.5 sm:w-5 sm:h-5 stroke-[2.5]" />
            )}
            {activeView === 'home' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-emerald-600 rounded-full" />
            )}
          </div>
          <span className="text-[9px] sm:text-[10px] mt-0.5 tracking-tight font-bold truncate">
            {isSecondaryView ? 'Înapoi Acasă' : 'Acasă'}
          </span>
        </button>

        {/* 2. Hartă GPS */}
        <button
          id="btn-nav-map"
          type="button"
          onClick={() => onViewChange('map')}
          className={`flex flex-col items-center justify-center flex-1 py-1 px-0.5 rounded-xl transition cursor-pointer min-h-[44px] min-w-0 ${
            activeView === 'map'
              ? 'text-emerald-600 font-extrabold'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
          title="Hartă Live GPS"
        >
          <div className="relative">
            <Map className={`w-4.5 h-4.5 sm:w-5 sm:h-5 ${activeView === 'map' ? 'stroke-[2.5]' : 'stroke-2'}`} />
            {activeView === 'map' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-emerald-600 rounded-full" />
            )}
          </div>
          <span className="text-[9px] sm:text-[10px] mt-0.5 tracking-tight font-bold truncate">Hartă</span>
        </button>

        {/* 3. Marketplace Local */}
        <button
          id="btn-nav-marketplace"
          type="button"
          onClick={() => onViewChange('marketplace')}
          className={`flex flex-col items-center justify-center flex-1 py-1 px-0.5 rounded-xl transition cursor-pointer min-h-[44px] min-w-0 ${
            activeView === 'marketplace'
              ? 'text-emerald-600 font-extrabold'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
          title="Marketplace Produse & Servicii Locale"
        >
          <div className="relative">
            <ShoppingBag className={`w-4.5 h-4.5 sm:w-5 sm:h-5 ${activeView === 'marketplace' ? 'stroke-[2.5]' : 'stroke-2'}`} />
            {activeView === 'marketplace' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-emerald-600 rounded-full" />
            )}
          </div>
          <span className="text-[9px] sm:text-[10px] mt-0.5 tracking-tight font-bold truncate">Marketplace</span>
        </button>

        {/* 4. CENTER CTA: Cere Ofertă Express [+] */}
        <div className="flex-1 flex justify-center -mt-4 sm:-mt-5 shrink-0 px-0.5">
          <button
            id="btn-nav-express-quote"
            type="button"
            onClick={onOpenQuoteModal}
            className="w-10.5 h-10.5 sm:w-12 sm:h-12 bg-gradient-to-tr from-emerald-700 to-emerald-500 hover:from-emerald-600 hover:to-emerald-400 text-white rounded-full flex flex-col items-center justify-center shadow-lg shadow-emerald-600/40 border-2 border-white transition-transform active:scale-90 cursor-pointer"
            title="Cere Ofertă Rapidă (Express)"
          >
            <Sparkles className="w-4.5 h-4.5 sm:w-5 sm:h-5 animate-pulse" />
          </button>
        </div>

        {/* 5. Comenzi & Escrow */}
        <button
          id="btn-nav-orders"
          type="button"
          onClick={() => onViewChange('orders')}
          className={`flex flex-col items-center justify-center flex-1 py-1 px-0.5 rounded-xl transition cursor-pointer min-h-[44px] min-w-0 relative ${
            activeView === 'orders'
              ? 'text-emerald-600 font-extrabold'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
          title="Comenzile mele & Plăți Escrow"
        >
          <div className="relative">
            <ClipboardList className={`w-4.5 h-4.5 sm:w-5 sm:h-5 ${activeView === 'orders' ? 'stroke-[2.5]' : 'stroke-2'}`} />
            {activeOrdersCount > 0 && (
              <span className="absolute -top-1 -right-2 px-1.5 py-0.2 bg-emerald-600 text-white text-[8px] sm:text-[9px] font-black rounded-full border border-white">
                {activeOrdersCount}
              </span>
            )}
            {activeView === 'orders' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-emerald-600 rounded-full" />
            )}
          </div>
          <span className="text-[9px] sm:text-[10px] mt-0.5 tracking-tight font-bold truncate">Comenzi</span>
        </button>

        {/* 6. Cont / Dashboard */}
        <button
          id="btn-nav-profile"
          type="button"
          onClick={onOpenProfile}
          className={`flex flex-col items-center justify-center flex-1 py-1 px-0.5 rounded-xl transition cursor-pointer min-h-[44px] min-w-0 ${
            activeView === 'dashboard-anunturi'
              ? 'text-emerald-600 font-extrabold'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
          title="Contul Meu & Fidelitate"
        >
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full object-cover border border-slate-300"
            />
            {user.streakDays > 0 && (
              <span className="absolute -top-1 -right-1.5 bg-amber-500 text-slate-950 text-[7.5px] sm:text-[8px] font-black px-1 rounded-full border border-white">
                🔥{user.streakDays}
              </span>
            )}
          </div>
          <span className="text-[9px] sm:text-[10px] mt-0.5 tracking-tight font-bold truncate max-w-[50px]">
            {user.name.split(' ')[0]}
          </span>
        </button>
      </div>
    </nav>
  );
};
