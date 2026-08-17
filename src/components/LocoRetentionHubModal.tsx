import React, { useState } from 'react';
import {
  X,
  Flame,
  Gift,
  Award,
  Bell,
  Share2,
  CheckCircle2,
  Sparkles,
  Zap,
  TrendingUp,
  Copy,
  Check,
  ChevronRight,
  ShieldCheck,
  Sliders,
  Send,
  UserCheck,
  RefreshCw,
  Coins
} from 'lucide-react';
import { UserProfile, RewardItem, UserBadge, AppNotification } from '../types';
import { REWARD_CATALOG } from '../data/mockData';

interface LocoRetentionHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onUpdateUser: (updatedUser: Partial<UserProfile>) => void;
  onAddNotification: (notification: AppNotification) => void;
  onOpenSocialShare: () => void;
}

export const LocoRetentionHubModal: React.FC<LocoRetentionHubModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateUser,
  onAddNotification,
  onOpenSocialShare
}) => {
  const [activeTab, setActiveTab] = useState<'streak' | 'referrals' | 'badges' | 'preferences'>('streak');
  const [claimedToday, setClaimedToday] = useState(user.isCheckedInToday || false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [redeemedCode, setRedeemedCode] = useState<string | null>(null);

  // Preference state
  const [prefCategories, setPrefCategories] = useState<string[]>(
    user.preferences?.preferredCategories || ['instalator', 'electrician']
  );
  const [prefRadius, setPrefRadius] = useState<number>(user.preferences?.radiusKm || 5);
  const [prefDealAlerts, setPrefDealAlerts] = useState<boolean>(
    user.preferences?.enableDealAlerts ?? true
  );
  const [prefStreakReminders, setPrefStreakReminders] = useState<boolean>(
    user.preferences?.enableStreakReminders ?? true
  );
  const [prefUrgentAlerts, setPrefUrgentAlerts] = useState<boolean>(
    user.preferences?.enableUrgentNearbyAlerts ?? true
  );

  if (!isOpen) return null;

  const fullRefLink = `https://loco-instant.ro/register?ref=${user.referralCode}`;

  // Daily Check-in action
  const handleDailyCheckIn = () => {
    if (claimedToday) return;

    const newStreak = user.streakDays + 1;
    const bonusPoints = 50 + (newStreak > 3 ? 25 : 0);
    const updatedPoints = user.points + bonusPoints;

    setClaimedToday(true);

    // Update user state
    onUpdateUser({
      points: updatedPoints,
      streakDays: newStreak,
      isCheckedInToday: true,
      lastCheckInDate: new Date().toISOString().split('T')[0]
    });

    // Fire notification
    onAddNotification({
      id: `notif-checkin-${Date.now()}`,
      title: `🔥 Bonus Zilnic Revendicat (+${bonusPoints} Puncte)`,
      message: `Felicitări! Ai ajuns la o serie consecutivă de ${newStreak} zile pe Loco Instant! Ai acum ${updatedPoints} Puncte Loco.`,
      time: 'Acum',
      read: false,
      type: 'reward'
    });
  };

  // Redeem Reward action
  const handleRedeemReward = (reward: RewardItem) => {
    if (user.points < reward.pointsCost) {
      alert(`Ai nevoie de ${reward.pointsCost} Puncte Loco. Mai ai nevoie de ${reward.pointsCost - user.points} puncte!`);
      return;
    }

    const newPoints = user.points - reward.pointsCost;
    setRedeemedCode(reward.code);

    onUpdateUser({ points: newPoints });

    onAddNotification({
      id: `notif-redeem-${Date.now()}`,
      title: `🎁 Recompensă Deblocată: ${reward.title}`,
      message: `Aplicația a generat cu succes codul tău de reducere: ${reward.code}. Folosește-l la următoarea comandă sau lucrare!`,
      time: 'Acum',
      read: false,
      type: 'reward'
    });
  };

  // Copy Referral Link
  const handleCopyRef = () => {
    navigator.clipboard.writeText(fullRefLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Trigger test smart notification
  const handleSendTestNotification = () => {
    onAddNotification({
      id: `notif-test-${Date.now()}`,
      title: '📍 Alertă Smart Loco (Filtru Personalizat)',
      message: `Un meșter verificat în ${prefCategories[0] || 'Instalații'} se află la ${prefRadius} km de tine în Cluj-Napoca! Ai -10% reducere aplicabilă automat.`,
      time: 'Acum',
      read: false,
      type: 'recommendation'
    });
    alert('Notificarea smart de test a fost trimisă în centrul tău de notificări!');
  };

  // Save Preferences
  const handleSavePreferences = () => {
    onUpdateUser({
      preferences: {
        preferredCategories: prefCategories,
        radiusKm: prefRadius,
        enableDealAlerts: prefDealAlerts,
        enableStreakReminders: prefStreakReminders,
        enableUrgentNearbyAlerts: prefUrgentAlerts,
        pushChannels: { browser: true, sms: true, email: true }
      }
    });
    alert('Preferințele de notificare și recomandări au fost salvate!');
  };

  const toggleCategoryPref = (catSlug: string) => {
    setPrefCategories((prev) =>
      prev.includes(catSlug) ? prev.filter((c) => c !== catSlug) : [...prev, catSlug]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Banner Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white px-6 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 relative overflow-hidden shrink-0">
          <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center space-x-3.5 z-10">
            <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20 shrink-0">
              <Flame className="w-7 h-7 text-slate-950 fill-current" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-extrabold tracking-tight">
                  Loco Rewards & Retenție
                </h2>
                <span className="px-2.5 py-0.5 bg-amber-400 text-slate-950 font-black text-[10px] rounded-full uppercase tracking-wider">
                  Tier {user.tier || 'Silver'}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Revendică bonusul zilnic, câștigă puncte și deblochează comision 0%!
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 z-10">
            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 text-right">
              <div className="text-[10px] uppercase font-bold text-slate-300">
                Portofel Puncte
              </div>
              <div className="text-lg font-black text-amber-400 flex items-center justify-end space-x-1">
                <Coins className="w-4 h-4 text-amber-400" />
                <span>{user.points} Puncte</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50/80 px-4 pt-2 overflow-x-auto shrink-0 scrollbar-none">
          <button
            onClick={() => setActiveTab('streak')}
            className={`flex items-center space-x-2 px-4 py-3 text-xs font-bold border-b-2 transition whitespace-nowrap ${
              activeTab === 'streak'
                ? 'border-emerald-600 text-emerald-700 bg-white rounded-t-xl shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Flame className="w-4 h-4 text-amber-500" />
            <span>Bonus Zilnic & Recompense</span>
          </button>

          <button
            onClick={() => setActiveTab('referrals')}
            className={`flex items-center space-x-2 px-4 py-3 text-xs font-bold border-b-2 transition whitespace-nowrap ${
              activeTab === 'referrals'
                ? 'border-emerald-600 text-emerald-700 bg-white rounded-t-xl shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Gift className="w-4 h-4 text-purple-500" />
            <span>Recomandă & Distribuie</span>
          </button>

          <button
            onClick={() => setActiveTab('badges')}
            className={`flex items-center space-x-2 px-4 py-3 text-xs font-bold border-b-2 transition whitespace-nowrap ${
              activeTab === 'badges'
                ? 'border-emerald-600 text-emerald-700 bg-white rounded-t-xl shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Award className="w-4 h-4 text-blue-500" />
            <span>Insigne & Realizări ({user.badges.filter((b) => b.unlocked).length}/{user.badges.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('preferences')}
            className={`flex items-center space-x-2 px-4 py-3 text-xs font-bold border-b-2 transition whitespace-nowrap ${
              activeTab === 'preferences'
                ? 'border-emerald-600 text-emerald-700 bg-white rounded-t-xl shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Bell className="w-4 h-4 text-emerald-500" />
            <span>Alerte Smart & Preferințe</span>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: DAILY STREAK & REWARDS STORE */}
          {activeTab === 'streak' && (
            <div className="space-y-6">
              {/* Daily Streak Card */}
              <div className="p-6 bg-gradient-to-br from-amber-50 via-orange-50 to-emerald-50 rounded-3xl border border-amber-200/80 shadow-xs relative overflow-hidden">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="space-y-2 text-center md:text-left">
                    <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-extrabold border border-amber-300">
                      <Flame className="w-4 h-4 text-amber-600 fill-current" />
                      <span>Seria Ta Curentă: {user.streakDays} Zile Consecutive</span>
                    </div>
                    <h3 className="text-xl font-black text-slate-900">
                      Menține seria activă & primești bonusuri tot mai mari!
                    </h3>
                    <p className="text-xs text-slate-600 max-w-md">
                      Accesează platforma Loco Instant zilnic pentru a acumula Puncte Loco pe care le poți transforma în vouchere de reducere sau promovare gratuită.
                    </p>
                  </div>

                  <div className="shrink-0 text-center">
                    <button
                      onClick={handleDailyCheckIn}
                      disabled={claimedToday}
                      className={`px-6 py-3.5 rounded-2xl font-black text-xs sm:text-sm shadow-md flex items-center space-x-2 transition-all ${
                        claimedToday
                          ? 'bg-slate-200 text-slate-500 cursor-not-allowed border border-slate-300'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-200 hover:scale-105 active:scale-95'
                      }`}
                    >
                      {claimedToday ? (
                        <>
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          <span>Bonus Zilnic Revendicat Azi!</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5" />
                          <span>Revendică Bonus Zilnic (+50 Puncte)</span>
                        </>
                      )}
                    </button>
                    {!claimedToday && (
                      <p className="text-[11px] font-bold text-emerald-700 mt-2">
                        🔥 +50 Puncte te așteaptă!
                      </p>
                    )}
                  </div>
                </div>

                {/* Days Tracker Steps */}
                <div className="mt-6 pt-6 border-t border-amber-200/60 grid grid-cols-7 gap-2 text-center">
                  {[1, 2, 3, 4, 5, 6, 7].map((day) => {
                    const isCompleted = day <= user.streakDays;
                    const isCurrent = day === user.streakDays + 1 && !claimedToday;
                    const points = day === 7 ? 300 : day * 25 + 25;

                    return (
                      <div
                        key={day}
                        className={`p-2.5 rounded-2xl border flex flex-col items-center justify-center transition ${
                          isCompleted
                            ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                            : isCurrent
                            ? 'bg-amber-100 text-amber-900 border-amber-400 font-bold ring-2 ring-amber-400/50 animate-pulse'
                            : 'bg-white/80 text-slate-400 border-slate-200'
                        }`}
                      >
                        <span className="text-[10px] font-extrabold uppercase">
                          Ziua {day}
                        </span>
                        <div className="my-1 text-sm font-black">
                          {isCompleted ? '✓' : `+${points}`}
                        </div>
                        <span className="text-[9px] opacity-80">
                          {day === 7 ? 'Mega Bonus' : 'Puncte'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Redeem Catalog Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900">
                      Magazin Recompense & Vouchere Loco
                    </h3>
                    <p className="text-xs text-slate-500">
                      Transformă punctele acumulate în beneficii reale pentru comenzi și servicii.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                    Disponibil: {user.points} Puncte
                  </span>
                </div>

                {redeemedCode && (
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-300 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <div>
                        <div className="text-xs font-extrabold text-emerald-900">
                          Codul tău de reducere a fost generat!
                        </div>
                        <div className="font-mono text-sm font-bold text-emerald-800">
                          {redeemedCode}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(redeemedCode);
                        alert('Cod copiat în clipboard!');
                      }}
                      className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700"
                    >
                      Copiază Cod
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {REWARD_CATALOG.map((reward) => {
                    const canAfford = user.points >= reward.pointsCost;

                    return (
                      <div
                        key={reward.id}
                        className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-slate-300 transition flex flex-col justify-between space-y-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center space-x-3">
                            <span className="text-3xl p-2 bg-slate-100 rounded-xl">
                              {reward.icon}
                            </span>
                            <div>
                              <div className="flex items-center space-x-2">
                                <h4 className="font-bold text-sm text-slate-900">
                                  {reward.title}
                                </h4>
                                {reward.badgeTag && (
                                  <span className="px-2 py-0.5 text-[9px] font-extrabold bg-emerald-100 text-emerald-800 rounded-md">
                                    {reward.badgeTag}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-500 mt-0.5">
                                {reward.description}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                          <div className="text-xs">
                            <span className="font-black text-amber-600">
                              {reward.pointsCost} Puncte
                            </span>
                            <span className="text-slate-400 mx-1">•</span>
                            <span className="text-slate-600 font-medium">
                              Valoare: {reward.discountValue}
                            </span>
                          </div>

                          <button
                            onClick={() => handleRedeemReward(reward)}
                            disabled={!canAfford}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                              canAfford
                                ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                            }`}
                          >
                            {canAfford ? 'Schimbă Puncte' : 'Insuficiente Puncte'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: REFERRALS & SOCIAL SHARE */}
          {activeTab === 'referrals' && (
            <div className="space-y-6">
              {/* Referral Hero Card */}
              <div className="p-6 bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white rounded-3xl shadow-lg space-y-4">
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 bg-purple-500/30 text-purple-200 font-extrabold text-xs rounded-full border border-purple-400/30">
                    Programul "Invită & Câștigă"
                  </span>
                </div>
                <h3 className="text-xl font-extrabold tracking-tight">
                  Primești +100 Puncte Loco + 20 RON pentru fiecare prieten invitat!
                </h3>
                <p className="text-xs text-purple-200 max-w-xl">
                  Trimite linkul tău unic familiei, colegilor sau pe rețelele sociale. Ei primesc reducere la prima lucrare cu plată Escrow, iar tu ești recompensat automat!
                </p>

                {/* Link Box */}
                <div className="pt-2 flex flex-col sm:flex-row gap-2">
                  <div className="flex-1 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20 flex items-center justify-between">
                    <span className="text-xs font-mono text-purple-100 truncate">
                      {fullRefLink}
                    </span>
                    <span className="text-[10px] font-extrabold bg-purple-500 text-white px-2 py-0.5 rounded-md ml-2 shrink-0">
                      Cod: {user.referralCode}
                    </span>
                  </div>

                  <button
                    onClick={handleCopyRef}
                    className={`px-5 py-2.5 rounded-2xl font-bold text-xs flex items-center justify-center space-x-1.5 transition ${
                      copiedLink
                        ? 'bg-emerald-500 text-white'
                        : 'bg-white text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Copiat!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copiază Link</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={onOpenSocialShare}
                    className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-2xl flex items-center justify-center space-x-1.5 transition"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Distribuie Rapid</span>
                  </button>
                </div>
              </div>

              {/* Referral Statistics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                  <div className="text-2xl font-black text-slate-900">
                    {user.referralsCount}
                  </div>
                  <div className="text-xs text-slate-500 font-semibold mt-0.5">
                    Prieteni Înscriși
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                  <div className="text-2xl font-black text-amber-600">
                    +{user.referralEarnings}
                  </div>
                  <div className="text-xs text-slate-500 font-semibold mt-0.5">
                    Puncte Obținute din Invitații
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                  <div className="text-2xl font-black text-emerald-600">
                    20 RON
                  </div>
                  <div className="text-xs text-slate-500 font-semibold mt-0.5">
                    Voucher Gratuit per Prieten Active
                  </div>
                </div>
              </div>

              {/* Referral History Table */}
              <div className="space-y-3">
                <h4 className="font-extrabold text-sm text-slate-900">
                  Istoric Invitații & Recompensări
                </h4>

                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
                  {user.referralHistory.map((ref) => (
                    <div
                      key={ref.id}
                      className="p-3.5 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-extrabold flex items-center justify-center">
                          {ref.friendName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">
                            {ref.friendName}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {ref.friendEmail} • {ref.date}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-lg text-[10px]">
                          {ref.status}
                        </span>
                        <span className="font-black text-amber-600">
                          +{ref.pointsEarned} P
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BADGES & ACHIEVEMENTS */}
          {activeTab === 'badges' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  Colectează Insigne & Deblochează Status VIP
                </h3>
                <p className="text-xs text-slate-500">
                  Finalizează acțiuni în aplicație pentru a-ți crește reputația și pentru a primi bonificații suplimentare.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.badges.map((badge) => (
                  <div
                    key={badge.id}
                    className={`p-4 rounded-2xl border transition flex items-start space-x-3.5 ${
                      badge.unlocked
                        ? 'bg-emerald-50/60 border-emerald-200'
                        : 'bg-white border-slate-200 opacity-90'
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${
                        badge.unlocked
                          ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200'
                          : 'bg-slate-100 text-slate-400 grayscale'
                      }`}
                    >
                      {badge.icon}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-sm text-slate-900">
                          {badge.name}
                        </h4>
                        {badge.unlocked ? (
                          <span className="px-2 py-0.5 text-[9px] font-extrabold bg-emerald-600 text-white rounded-md">
                            Deblocată
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-slate-500">
                            {badge.progress} / {badge.maxProgress}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-500 mt-1">
                        {badge.description}
                      </p>

                      {/* Progress bar for locked badges */}
                      {!badge.unlocked && (
                        <div className="mt-2.5">
                          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                              style={{
                                width: `${(badge.progress / badge.maxProgress) * 100}%`
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SMART ALERTS & PREFERENCES */}
          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  Notificări Smart & Căutări Personalizate
                </h3>
                <p className="text-xs text-slate-500">
                  Setează domeniile și distanța pentru a primi alerte doar despre ofertele și meșterii care te interesează.
                </p>
              </div>

              {/* Category Preferences */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <label className="block text-xs font-bold text-slate-800">
                  1. Servicii de Interes Major în {user.city}:
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { name: 'Instalatori', slug: 'instalator' },
                    { name: 'Electricieni', slug: 'electrician' },
                    { name: 'Curățenie', slug: 'curatenie' },
                    { name: 'Lăcătuși 24/7', slug: 'lacatus' },
                    { name: 'Transport & Mutări', slug: 'transport-mobila' },
                    { name: 'Reparații Electrocasnice', slug: 'reparatii' }
                  ].map((cat) => {
                    const selected = prefCategories.includes(cat.slug);
                    return (
                      <button
                        key={cat.slug}
                        onClick={() => toggleCategoryPref(cat.slug)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                          selected
                            ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        {selected ? '✓ ' : '+ '}
                        {cat.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Distance Radius */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800">
                    2. Raza de Intervenție și Căutare Urgențe:
                  </label>
                  <span className="text-xs font-black text-emerald-600">
                    {prefRadius} km de mine
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={20}
                  value={prefRadius}
                  onChange={(e) => setPrefRadius(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                  <span>1 km (Apropiere)</span>
                  <span>10 km (Oraș)</span>
                  <span>20 km (Zonă Metropolitană)</span>
                </div>
              </div>

              {/* Notification Toggles */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <label className="block text-xs font-bold text-slate-800">
                  3. Canale și Alerte Active:
                </label>

                <div className="space-y-2.5">
                  <label className="flex items-center justify-between text-xs text-slate-700 cursor-pointer">
                    <span className="font-medium">
                      Alerte de meșteri disponibili de urgență lângă mine
                    </span>
                    <input
                      type="checkbox"
                      checked={prefUrgentAlerts}
                      onChange={(e) => setPrefUrgentAlerts(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded-sm focus:ring-emerald-500"
                    />
                  </label>

                  <label className="flex items-center justify-between text-xs text-slate-700 cursor-pointer">
                    <span className="font-medium">
                      Alerte pentru vouchere, puncte și promoții de reîntoarcere
                    </span>
                    <input
                      type="checkbox"
                      checked={prefDealAlerts}
                      onChange={(e) => setPrefDealAlerts(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded-sm focus:ring-emerald-500"
                    />
                  </label>

                  <label className="flex items-center justify-between text-xs text-slate-700 cursor-pointer">
                    <span className="font-medium">
                      Mementouri zilnice pentru menținerea seriei de logare (Streak)
                    </span>
                    <input
                      type="checkbox"
                      checked={prefStreakReminders}
                      onChange={(e) => setPrefStreakReminders(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded-sm focus:ring-emerald-500"
                    />
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-between items-center">
                <button
                  onClick={handleSendTestNotification}
                  className="w-full sm:w-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl border border-slate-300 flex items-center justify-center space-x-1.5"
                >
                  <Send className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Trimite Notificare Test Personalizată</span>
                </button>

                <button
                  onClick={handleSavePreferences}
                  className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  Salvează Preferințele Smart
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
