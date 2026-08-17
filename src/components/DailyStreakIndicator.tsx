import React, { useState } from 'react';
import { Flame, CheckCircle2, Sparkles } from 'lucide-react';
import { UserProfile } from '../types';

interface DailyStreakIndicatorProps {
  user: UserProfile;
  onUpdateUser?: (updatedUser: Partial<UserProfile>) => void;
  onRewardPointsEarned?: (points: number, reason: string) => void;
  compact?: boolean;
}

export const DailyStreakIndicator: React.FC<DailyStreakIndicatorProps> = ({
  user,
  onUpdateUser,
  onRewardPointsEarned,
  compact = false
}) => {
  const [justClaimed, setJustClaimed] = useState(false);
  const streak = user.streakDays || 1;
  const isCheckedIn = user.isCheckedInToday || false;

  // 7-day rewards schedule
  const streakRewards = [
    { day: 1, points: 20, label: 'L' },
    { day: 2, points: 30, label: 'M' },
    { day: 3, points: 40, label: 'M' },
    { day: 4, points: 50, label: 'J' },
    { day: 5, points: 60, label: 'V' },
    { day: 6, points: 75, label: 'S' },
    { day: 7, points: 100, label: 'D', isBonus: true }
  ];

  // Current position in 7-day cycle
  const currentCycleIndex = ((streak - 1) % 7) + 1;
  const todayBonusPoints = streakRewards.find((r) => r.day === currentCycleIndex)?.points || 50;

  const handleClaimStreakBonus = () => {
    if (isCheckedIn) return;

    const newStreakDays = streak + 1;
    const nextCycleIndex = ((newStreakDays - 1) % 7) + 1;
    const bonus = streakRewards.find((r) => r.day === nextCycleIndex)?.points || 50;

    if (onUpdateUser) {
      onUpdateUser({
        streakDays: newStreakDays,
        isCheckedInToday: true,
        points: user.points + bonus,
        lastCheckInDate: new Date().toISOString().split('T')[0]
      });
    }

    if (onRewardPointsEarned) {
      onRewardPointsEarned(bonus, `🔥 Bonus Log-in Zilnic - Ziua ${newStreakDays} consecutivă`);
    }

    setJustClaimed(true);
    setTimeout(() => setJustClaimed(false), 4000);
  };

  if (compact) {
    return (
      <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-amber-500/10 border border-amber-400/40 rounded-xl text-amber-900 font-extrabold text-xs">
        <Flame className="w-4 h-4 fill-amber-500 text-amber-600 animate-pulse" />
        <span>{streak} Zile Serie 🔥</span>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-amber-50 border-2 border-amber-400/40 p-4 rounded-3xl space-y-3 relative overflow-hidden shadow-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 flex items-center justify-center font-black shadow-md">
            <Flame className="w-6 h-6 fill-amber-200 text-amber-100 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-black text-slate-900">Serie Log-in Zilnică (Daily Streak)</span>
              <span className="px-2 py-0.5 bg-amber-500 text-slate-950 font-black text-[10px] rounded-full uppercase tracking-wider shadow-xs">
                {streak} {streak === 1 ? 'Zi' : 'Zile'} 🔥
              </span>
            </div>
            <p className="text-[11px] text-slate-600 font-medium">
              Intră zilnic în aplicație pentru puncte bonus și multiplicator de fidelitate!
            </p>
          </div>
        </div>
      </div>

      {/* 7-Day Visual Calendar Tracker */}
      <div className="grid grid-cols-7 gap-1.5 pt-1">
        {streakRewards.map((sr) => {
          const isCompleted = sr.day < currentCycleIndex || (sr.day === currentCycleIndex && isCheckedIn);
          const isTodayPending = sr.day === currentCycleIndex && !isCheckedIn;

          return (
            <div
              key={sr.day}
              className={`p-2 rounded-2xl text-center flex flex-col items-center justify-between border transition ${
                isCompleted
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-xs'
                  : isTodayPending
                  ? 'bg-amber-400 text-slate-950 border-amber-500 ring-2 ring-amber-400/60 scale-105 shadow-md font-bold'
                  : 'bg-white text-slate-400 border-slate-200'
              }`}
            >
              <span className="text-[10px] font-black uppercase tracking-wider">{sr.label}</span>
              <div className="my-1">
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-white" />
                ) : isTodayPending ? (
                  <Flame className="w-4 h-4 fill-amber-950 text-slate-950 animate-pulse" />
                ) : (
                  <span className="text-[10px] font-mono font-bold">+{sr.points}P</span>
                )}
              </div>
              <span className="text-[9px] font-bold">Zi {sr.day}</span>
            </div>
          );
        })}
      </div>

      {/* Interactive Claim Action Button or Success Banner */}
      <div className="pt-1">
        {!isCheckedIn ? (
          <button
            onClick={handleClaimStreakBonus}
            className="w-full py-2.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs rounded-2xl shadow-md transition transform hover:scale-[1.01] active:scale-95 flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-4 h-4 fill-slate-950" />
            <span>Revendică Bonusul de Azi (+{todayBonusPoints} Puncte Loco)</span>
          </button>
        ) : (
          <div className="p-2.5 bg-emerald-100/90 border border-emerald-300 rounded-2xl text-center flex items-center justify-center space-x-2 text-xs font-bold text-emerald-900">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>
              {justClaimed
                ? `🎉 Felicitări! Ai revendicat +${todayBonusPoints} Puncte Loco!`
                : `Ai revendicat bonusul pentru azi! Revino mâine pentru Ziua ${currentCycleIndex === 7 ? 1 : currentCycleIndex + 1}.`}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
