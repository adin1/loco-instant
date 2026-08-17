import React, { useState } from 'react';
import {
  X,
  User,
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
  Settings,
  LogOut,
  CheckCircle2,
  Award,
  Flame,
  Gift,
  Sparkles,
  TrendingUp,
  Star,
  Users,
  ChevronRight,
  PlusCircle,
  Coins,
  Clock,
  Calendar,
  BarChart3
} from 'lucide-react';
import { UserProfile, PointsTransaction } from '../types';
import { DailyStreakIndicator } from './DailyStreakIndicator';
import { ComplianceCenterSection } from './ComplianceCenterSection';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onUpdateRole: (newRole: 'client' | 'prestator' | 'admin') => void;
  onOpenRetentionHub?: () => void;
  onRewardPointsEarned?: (points: number, reason: string) => void;
  onUpdateUser?: (updatedUser: Partial<UserProfile>) => void;
  onOpenDashboardAnunturi?: () => void;
}

interface PointsBalanceProps {
  user: UserProfile;
  onOpenRetentionHub?: () => void;
  onCloseModal?: () => void;
}

export const DailyStreakCounter = DailyStreakIndicator;

interface PointsHistorySectionProps {
  history?: PointsTransaction[];
}

export const PointsHistorySection: React.FC<PointsHistorySectionProps> = ({ history = [] }) => {
  const [filter, setFilter] = useState<'all' | 'order' | 'review' | 'streak'>('all');

  // Limit to last 10 actions as requested
  const filteredHistory = history
    .filter((tx) => filter === 'all' || tx.category === filter || tx.action.toLowerCase().includes(filter))
    .slice(0, 10);

  const getActionIcon = (category?: string, actionStr: string = '') => {
    const actLower = actionStr.toLowerCase();
    if (category === 'order' || actLower.includes('comandă')) {
      return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
    }
    if (category === 'review' || actLower.includes('recenzie')) {
      return <Star className="w-4 h-4 text-amber-500 fill-amber-500" />;
    }
    if (category === 'streak' || actLower.includes('streak') || actLower.includes('log-in')) {
      return <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />;
    }
    if (category === 'referral' || actLower.includes('prieten') || actLower.includes('referral')) {
      return <Users className="w-4 h-4 text-indigo-600" />;
    }
    return <Sparkles className="w-4 h-4 text-amber-600" />;
  };

  return (
    <div className="space-y-3 pt-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-slate-100 rounded-lg text-slate-800">
            <Clock className="w-4 h-4 text-slate-700" />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase text-slate-800 tracking-wider">
              Istoric Detaliat Puncte
            </h4>
            <p className="text-[10px] text-slate-500 font-medium">
              Ultimele 10 acțiuni de fidelizare înregistrate
            </p>
          </div>
        </div>
        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-black rounded-md border border-emerald-200">
          {history.length} Tranzacții
        </span>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center space-x-1.5 text-[11px] overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setFilter('all')}
          className={`px-2.5 py-1 rounded-xl font-bold transition whitespace-nowrap ${
            filter === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Toate ({history.length > 10 ? 10 : history.length})
        </button>
        <button
          onClick={() => setFilter('order')}
          className={`px-2.5 py-1 rounded-xl font-bold transition whitespace-nowrap ${
            filter === 'order'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Comenzi
        </button>
        <button
          onClick={() => setFilter('review')}
          className={`px-2.5 py-1 rounded-xl font-bold transition whitespace-nowrap ${
            filter === 'review'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Recenzii
        </button>
        <button
          onClick={() => setFilter('streak')}
          className={`px-2.5 py-1 rounded-xl font-bold transition whitespace-nowrap ${
            filter === 'streak'
              ? 'bg-orange-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Streak
        </button>
      </div>

      {/* History Items List */}
      {filteredHistory.length === 0 ? (
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center text-xs text-slate-500 font-medium">
          Nicio acțiune înregistrată pentru filtrul selectat.
        </div>
      ) : (
        <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
          {filteredHistory.map((item) => (
            <div
              key={item.id}
              className="p-3 bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 rounded-2xl flex items-center justify-between transition"
            >
              <div className="flex items-center space-x-3 min-w-0 pr-2">
                <div className="p-2 bg-white rounded-xl shadow-xs border border-slate-200 shrink-0">
                  {getActionIcon(item.category, item.action)}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">{item.action}</p>
                  <p className="text-[10px] text-slate-500 font-medium flex items-center space-x-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>{item.date}</span>
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-black text-xs rounded-lg inline-block font-mono">
                  +{item.points} P
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const PointsBalance: React.FC<PointsBalanceProps> = ({ user, onOpenRetentionHub, onCloseModal }) => {
  // Tier Calculation
  const getTierInfo = (points: number) => {
    if (points >= 2000) {
      return {
        name: 'Platinum VIP 💎',
        color: 'from-purple-600 to-indigo-600',
        textColor: 'text-purple-700',
        nextTier: 3000,
        nextName: 'Diamond Elite'
      };
    } else if (points >= 1000) {
      return {
        name: 'Gold Member 🥇',
        color: 'from-amber-500 to-orange-500',
        textColor: 'text-amber-700',
        nextTier: 2000,
        nextName: 'Platinum VIP'
      };
    } else if (points >= 500) {
      return {
        name: 'Silver Level 🥈',
        color: 'from-slate-400 to-slate-600',
        textColor: 'text-slate-700',
        nextTier: 1000,
        nextName: 'Gold Member'
      };
    }
    return {
      name: 'Bronze Starter 🥉',
      color: 'from-amber-700 to-amber-900',
      textColor: 'text-amber-900',
      nextTier: 500,
      nextName: 'Silver Level'
    };
  };

  const tier = getTierInfo(user.points);
  const progressPct = Math.min(100, Math.round((user.points / tier.nextTier) * 100));

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 p-5 rounded-3xl text-white shadow-xl relative overflow-hidden space-y-3 border border-slate-700/50">
      <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 rounded-xl font-black shadow-md">
            <Flame className="w-5 h-5 fill-current" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-black text-amber-300 tracking-wider block">
              Program Fidelitate
            </span>
            <h3 className="text-sm font-extrabold text-white">Loco Rewards Balance</h3>
          </div>
        </div>

        {onOpenRetentionHub && (
          <button
            onClick={() => {
              if (onCloseModal) onCloseModal();
              onOpenRetentionHub();
            }}
            className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-md transition flex items-center space-x-1"
          >
            <span>Hub Recompense</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Points Counter Display */}
      <div className="flex items-baseline space-x-2 py-1">
        <span className="text-4xl font-black tracking-tight text-amber-300 drop-shadow-sm font-mono">
          {user.points.toLocaleString()}
        </span>
        <span className="text-sm font-bold text-slate-300">Puncte Loco</span>
      </div>

      {/* Progress Bar to Next Tier */}
      <div className="space-y-1 text-[11px]">
        <div className="flex justify-between text-slate-300 font-semibold">
          <span>Nivel: <strong className="text-white">{tier.name}</strong></span>
          <span>
            {user.points} / {tier.nextTier} P pentru {tier.nextName}
          </span>
        </div>
        <div className="w-full h-2 bg-slate-700/80 rounded-full overflow-hidden p-0.5 border border-slate-600">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateRole,
  onOpenRetentionHub,
  onRewardPointsEarned,
  onUpdateUser,
  onOpenDashboardAnunturi
}) => {
  const [rewardSimMsg, setRewardSimMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSimulateReward = (points: number, reason: string) => {
    if (onRewardPointsEarned) {
      onRewardPointsEarned(points, reason);
      setRewardSimMsg(`🎉 Tranzacție reușită: +${points} Puncte Loco adăugate!`);
      setTimeout(() => setRewardSimMsg(null), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-200 space-y-5 my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-500 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* User Header */}
        <div className="flex items-center space-x-4">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500 shadow-md"
          />
          <div>
            <div className="flex items-center space-x-1.5">
              <h2 className="text-lg font-black text-slate-900">{user.name}</h2>
              {user.isVerified && <ShieldCheck className="w-4 h-4 text-emerald-600" />}
            </div>
            <p className="text-xs text-slate-500 font-medium">{user.email}</p>
            <div className="flex items-center space-x-2 mt-1">
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-extrabold text-[10px] rounded-md">
                Cont Verificat • {user.role.toUpperCase()}
              </span>
              <span className="px-2 py-0.5 bg-amber-100 text-amber-900 font-black text-[10px] rounded-md flex items-center space-x-1">
                <Flame className="w-3 h-3 fill-amber-500 text-amber-600" />
                <span>Streak: {user.streakDays || 1} Zile</span>
              </span>
            </div>
          </div>
        </div>

        {/* Quick Link to Dashboard Anunțuri */}
        {onOpenDashboardAnunturi && (
          <button
            onClick={() => {
              onClose();
              onOpenDashboardAnunturi();
            }}
            className="w-full p-3 bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white rounded-2xl flex items-center justify-between shadow-xs hover:shadow-md transition text-xs group"
          >
            <div className="flex items-center space-x-2.5">
              <div className="p-1.5 bg-emerald-500/20 text-emerald-300 rounded-xl">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="font-extrabold block text-white">Vezi Dashboard Anunțuri & Statistica</span>
                <span className="text-[10px] text-slate-300 font-medium">Evoluție vizualizări & contacte în timp real</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white transition" />
          </button>
        )}

        {/* LOCO REWARDS - POINTS BALANCE COMPONENT */}
        <PointsBalance
          user={user}
          onOpenRetentionHub={onOpenRetentionHub}
          onCloseModal={onClose}
        />

        {/* PROMINENT DAILY STREAK COUNTER COMPONENT */}
        <DailyStreakCounter
          user={user}
          onUpdateUser={onUpdateUser}
          onRewardPointsEarned={onRewardPointsEarned}
        />

        {/* COMPLIANCE CENTER SECTION - AUTOMATED FISCAL & LEGAL VERIFICATION */}
        <ComplianceCenterSection
          user={user}
          onUpdateUser={onUpdateUser}
          onRewardPointsEarned={onRewardPointsEarned}
        />

        {/* DETAILED POINTS HISTORY SECTION (LAST 10 ACTIONS) */}
        <PointsHistorySection history={user.pointsHistory} />

        {/* HOW TO EARN POINTS BREAKDOWN */}
        <div className="space-y-2">
          <h4 className="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center justify-between">
            <span>Cum Câștigi Puncte Loco?</span>
            <span className="text-[10px] text-emerald-600 font-bold">Ghid Instant</span>
          </h4>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <div className="flex items-center justify-between font-bold text-slate-900">
                <span className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Comenzi Escrow</span>
                </span>
                <span className="text-emerald-700 font-black">+50 P</span>
              </div>
              <p className="text-[10px] text-slate-500">Pentru fiecare comandă finalizată și plătită securizat.</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <div className="flex items-center justify-between font-bold text-slate-900">
                <span className="flex items-center space-x-1.5">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>Recenzie Verificată</span>
                </span>
                <span className="text-amber-700 font-black">+25 P</span>
              </div>
              <p className="text-[10px] text-slate-500">După ce lași o evaluare meseriașului dumneavoastră.</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <div className="flex items-center justify-between font-bold text-slate-900">
                <span className="flex items-center space-x-1.5">
                  <Users className="w-4 h-4 text-indigo-600" />
                  <span>Invită Prieteni</span>
                </span>
                <span className="text-indigo-700 font-black">+100 P</span>
              </div>
              <p className="text-[10px] text-slate-500">Codul tău: <strong className="font-mono text-slate-800">{user.referralCode}</strong> + 20 RON Credit.</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <div className="flex items-center justify-between font-bold text-slate-900">
                <span className="flex items-center space-x-1.5">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span>Serie Log-in (Streak)</span>
                </span>
                <span className="text-orange-700 font-black">+50..300 P</span>
              </div>
              <p className="text-[10px] text-slate-500">Serie activă: <strong>{user.streakDays || 1} Zile</strong> zilnice.</p>
            </div>
          </div>
        </div>

        {/* SIMULATOR / TEST TRIGGER FOR REWARDING USER */}
        {onRewardPointsEarned && (
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900 flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Simulează Câștig de Puncte (Test Live)</span>
              </span>
            </div>

            {rewardSimMsg && (
              <p className="text-[11px] font-bold text-emerald-700 animate-in fade-in">
                {rewardSimMsg}
              </p>
            )}

            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() => handleSimulateReward(50, 'Simulare: Finalizare Comandă Escrow')}
                className="px-2 py-1.5 bg-white hover:bg-amber-100 border border-amber-300 text-amber-900 font-extrabold text-[11px] rounded-xl transition"
              >
                +50 P Comandă
              </button>
              <button
                onClick={() => handleSimulateReward(25, 'Simulare: Recenzie Verificată Adăugată')}
                className="px-2 py-1.5 bg-white hover:bg-amber-100 border border-amber-300 text-amber-900 font-extrabold text-[11px] rounded-xl transition"
              >
                +25 P Recenzie
              </button>
              <button
                onClick={() => handleSimulateReward(100, 'Simulare: Prieten Înregistrat cu Cod Recomandare')}
                className="px-2 py-1.5 bg-white hover:bg-amber-100 border border-amber-300 text-amber-900 font-extrabold text-[11px] rounded-xl transition"
              >
                +100 P Referral
              </button>
            </div>
          </div>
        )}

        {/* Contact Info Card */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
          <div className="flex items-center justify-between text-slate-700">
            <span className="flex items-center space-x-1.5 font-semibold text-slate-500">
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>Telefon</span>
            </span>
            <span className="font-bold text-slate-900">{user.phone}</span>
          </div>
          <div className="flex items-center justify-between text-slate-700">
            <span className="flex items-center space-x-1.5 font-semibold text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>Oraș Principal</span>
            </span>
            <span className="font-bold text-slate-900">{user.city}</span>
          </div>
          <div className="flex items-center justify-between text-slate-700">
            <span className="flex items-center space-x-1.5 font-semibold text-slate-500">
              <Award className="w-3.5 h-3.5 text-emerald-600" />
              <span>Membru din</span>
            </span>
            <span className="font-bold text-slate-900">{user.joinedDate}</span>
          </div>
        </div>

        {/* Role Switcher */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700">Comută Modul Contului</label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => onUpdateRole('client')}
              className={`p-2 rounded-xl text-xs font-bold border transition ${
                user.role === 'client'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
              }`}
            >
              Client
            </button>
            <button
              onClick={() => onUpdateRole('prestator')}
              className={`p-2 rounded-xl text-xs font-bold border transition ${
                user.role === 'prestator'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
              }`}
            >
              Prestator
            </button>
            <button
              onClick={() => onUpdateRole('admin')}
              className={`p-2 rounded-xl text-xs font-bold border transition ${
                user.role === 'admin'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
              }`}
            >
              Admin
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-1 space-y-2">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition"
          >
            Închide Profilul
          </button>
        </div>
      </div>
    </div>
  );
};

