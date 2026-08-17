import React, { useState } from 'react';
import {
  Zap,
  MapPin,
  Search,
  Bell,
  User,
  ShoppingBag,
  Truck,
  PlusCircle,
  ShieldCheck,
  Menu,
  X,
  Sparkles,
  Layers,
  FileText,
  Flame,
  Coins,
  ArrowLeft,
  Compass,
  HelpCircle
} from 'lucide-react';
import { AppNotification, UserProfile } from '../types';

interface HeaderProps {
  currentCity: string;
  onCityChange: (city: string) => void;
  activeView: string;
  onViewChange: (view: string) => void;
  onGoBack?: () => void;
  notifications: AppNotification[];
  onOpenNotifications: () => void;
  onOpenQuoteModal: () => void;
  onOpenPublishAdModal: () => void;
  user: UserProfile;
  onOpenProfile: () => void;
  onOpenRetentionHub: () => void;
  onOpenInstantGuide: () => void;
}

const CITIES = ['Cluj-Napoca', 'București', 'Timișoara', 'Iași', 'Brașov', 'Constanța', 'Sibiu', 'Oradea'];

export const Header: React.FC<HeaderProps> = ({
  currentCity,
  onCityChange,
  activeView,
  onViewChange,
  onGoBack,
  notifications,
  onOpenNotifications,
  onOpenQuoteModal,
  onOpenPublishAdModal,
  user,
  onOpenProfile,
  onOpenRetentionHub,
  onOpenInstantGuide
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleBack = () => {
    if (onGoBack) {
      onGoBack();
    } else {
      onViewChange('home');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-1.5 sm:gap-4">
        {/* Brand Logo & Location or Back Button */}
        <div className="flex items-center space-x-1.5 sm:space-x-3 shrink-0">
          {activeView !== 'home' ? (
            <button
              id="btn-header-back-home"
              type="button"
              onClick={handleBack}
              className="flex items-center space-x-1.5 min-h-[42px] px-3 py-1.5 bg-slate-900 hover:bg-emerald-600 active:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition cursor-pointer active:scale-95 shrink-0"
              title="Înapoi la Pagina Principală"
            >
              <ArrowLeft className="w-4 h-4 text-emerald-400" />
              <span className="font-bold">Înapoi</span>
            </button>
          ) : null}

          <button
            onClick={() => onViewChange('home')}
            className="flex items-center space-x-1.5 sm:space-x-2 text-left group cursor-pointer"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md shadow-emerald-200 group-hover:bg-emerald-500 transition-all shrink-0">
              <Zap className="w-4.5 h-4.5 sm:w-5 sm:h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center space-x-1 sm:space-x-1.5">
                <span className="text-lg sm:text-xl font-black tracking-tight text-slate-900">
                  LOCO<span className="text-emerald-600">INSTANT</span>
                </span>
                <span className="hidden md:inline-block px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200">
                  2026 Live
                </span>
              </div>
              <p className="text-[10px] text-slate-500 hidden md:block">
                Servicii & Meșteri Verificați • Plăți Escrow
              </p>
            </div>
          </button>

          {/* Location Selector Dropdown */}
          <div className="relative flex items-center bg-slate-100 hover:bg-slate-200/80 px-2 sm:px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 transition">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 mr-0.5 sm:mr-1 shrink-0" />
            <select
              value={currentCity}
              onChange={(e) => onCityChange(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-800 outline-none cursor-pointer pr-1 max-w-[80px] sm:max-w-none truncate"
            >
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-1 bg-slate-100/80 p-1 rounded-2xl border border-slate-200">
          <button
            onClick={() => onViewChange('home')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
              activeView === 'home'
                ? 'bg-white text-emerald-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Acasă & Meșteri
          </button>
          <button
            onClick={() => onViewChange('map')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
              activeView === 'map'
                ? 'bg-white text-emerald-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🗺️ Hartă Live
          </button>
          <button
            id="btn-header-nav-marketplace"
            type="button"
            onClick={() => onViewChange('marketplace')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              activeView === 'marketplace'
                ? 'bg-white text-emerald-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🛒 Marketplace
          </button>
          <button
            onClick={() => onViewChange('delivery')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
              activeView === 'delivery'
                ? 'bg-white text-emerald-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🚚 Livrare
          </button>
          <button
            onClick={() => onViewChange('dashboard-anunturi')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
              activeView === 'dashboard-anunturi'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📈 Dashboard Anunțuri
          </button>
          <button
            onClick={() => onViewChange('promovare')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
              activeView === 'promovare'
                ? 'bg-white text-emerald-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📣 Promovare
          </button>
          <button
            onClick={() => onViewChange('orders')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
              activeView === 'orders'
                ? 'bg-white text-emerald-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📋 Comenzi & Escrow
          </button>
          <button
            onClick={() => onViewChange('audit')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
              activeView === 'audit'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            📊 Audit Tech 2026
          </button>
        </nav>

        {/* Action Buttons & Profile */}
        <div className="flex items-center space-x-2">
          {/* Loco Rewards Pill Button */}
          <button
            onClick={onOpenRetentionHub}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs rounded-xl shadow-xs transition hover:scale-105 active:scale-95"
            title="Centrul de Recompense & Retenție - Serie Log-in Activă"
          >
            <Flame className="w-4 h-4 fill-current text-slate-950 animate-pulse" />
            <span className="hidden sm:inline-block">Rewards</span>
            <span className="bg-slate-950 text-amber-300 px-1.5 py-0.5 rounded-md text-[10px] font-extrabold flex items-center space-x-1">
              <span>{user.points}P</span>
              <span className="text-orange-400 border-l border-slate-800 pl-1 flex items-center">
                🔥{user.streakDays || 1}
              </span>
            </span>
          </button>

            {/* Quick Quote CTA */}
          <button
            onClick={onOpenQuoteModal}
            className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Cere Ofertă</span>
          </button>

          {/* Ghid Instant CTA Button */}
          <button
            id="btn-header-instant-guide"
            onClick={onOpenInstantGuide}
            className="inline-flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 text-xs font-extrabold rounded-xl shadow-xs transition hover:scale-105 active:scale-95 cursor-pointer"
            title="Ghid Instant - Cum funcționează platforma"
          >
            <Compass className="w-3.5 h-3.5 text-indigo-600 animate-spin-slow" />
            <span>Ghid Instant</span>
          </button>

          {/* Add Ad CTA */}
          <button
            onClick={onOpenPublishAdModal}
            className="hidden xl:inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Adaugă Anunț</span>
          </button>

          {/* Notifications Button */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-xl text-slate-600 hover:text-emerald-600 hover:bg-slate-100 transition"
            title="Notificări"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* User Profile Avatar / Login */}
          <button
            onClick={onOpenProfile}
            className="flex items-center space-x-2 p-1 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-200 transition"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-7 h-7 rounded-lg object-cover"
            />
            <span className="text-xs font-bold text-slate-800 hidden md:inline-block">
              {user.name.split(' ')[0]}
            </span>
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => { onViewChange('home'); setMobileMenuOpen(false); }}
              className={`p-2.5 text-left text-xs font-bold rounded-xl border ${
                activeView === 'home' ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              🏠 Acasă & Meșteri
            </button>
            <button
              onClick={() => { onViewChange('map'); setMobileMenuOpen(false); }}
              className={`p-2.5 text-left text-xs font-bold rounded-xl border ${
                activeView === 'map' ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              🗺️ Hartă Live
            </button>
            <button
              id="btn-header-drawer-marketplace"
              type="button"
              onClick={() => { onViewChange('marketplace'); setMobileMenuOpen(false); }}
              className={`p-2.5 text-left text-xs font-bold rounded-xl border cursor-pointer transition ${
                activeView === 'marketplace' ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              🛒 Marketplace Local
            </button>
            <button
              onClick={() => { onViewChange('delivery'); setMobileMenuOpen(false); }}
              className={`p-2.5 text-left text-xs font-bold rounded-xl border ${
                activeView === 'delivery' ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              🚚 Comandă Livrare
            </button>
            <button
              onClick={() => { onViewChange('dashboard-anunturi'); setMobileMenuOpen(false); }}
              className={`p-2.5 text-left text-xs font-bold rounded-xl border ${
                activeView === 'dashboard-anunturi' ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              📈 Dashboard Anunțuri
            </button>
            <button
              onClick={() => { onViewChange('promovare'); setMobileMenuOpen(false); }}
              className={`p-2.5 text-left text-xs font-bold rounded-xl border ${
                activeView === 'promovare' ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              📣 Promovare Anunțuri
            </button>
            <button
              onClick={() => { onViewChange('orders'); setMobileMenuOpen(false); }}
              className={`p-2.5 text-left text-xs font-bold rounded-xl border ${
                activeView === 'orders' ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              📋 Comenzi & Escrow
            </button>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => { onOpenInstantGuide(); setMobileMenuOpen(false); }}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl flex items-center justify-center space-x-2 shadow-md cursor-pointer"
            >
              <Compass className="w-4 h-4 text-indigo-200 animate-spin-slow" />
              <span>Ghid Instant Loco (Tur Interactiv)</span>
            </button>
            <button
              onClick={() => { onOpenQuoteModal(); setMobileMenuOpen(false); }}
              className="w-full py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>Cere Ofertă Instant (Gratuit)</span>
            </button>
            <button
              onClick={() => { onOpenPublishAdModal(); setMobileMenuOpen(false); }}
              className="w-full py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Ofer Servicii / Publică Anunț</span>
            </button>
            <button
              onClick={() => { onViewChange('audit'); setMobileMenuOpen(false); }}
              className="w-full py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200"
            >
              📊 Vezi Raport Executiv & Audit 2026
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
