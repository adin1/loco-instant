import React, { useState } from 'react';
import {
  X,
  Star,
  ShieldCheck,
  Award,
  CheckCircle2,
  ThumbsUp,
  MessageSquare,
  Sparkles,
  Send,
  Filter,
  UserCheck
} from 'lucide-react';
import { Review, Provider, OrderItem, UserProfile } from '../types';

interface ReviewSystemProps {
  isOpen: boolean;
  onClose: () => void;
  targetProvider?: Provider | null;
  targetOrder?: OrderItem | null;
  reviews: Review[];
  onAddReview: (review: {
    targetId: string;
    targetType: 'provider' | 'user' | 'product';
    targetName?: string;
    authorName: string;
    authorAvatar?: string;
    authorRole?: 'client' | 'prestator';
    rating: number;
    comment: string;
    orderId?: string;
    serviceName?: string;
    isVerifiedEscrow?: boolean;
    tags?: string[];
  }) => void;
  currentUser: UserProfile;
  initialMode?: 'view' | 'write';
}

const AVAILABLE_TAGS = [
  '⚡ Foarte Rapid',
  '🔧 Punctual',
  '🧹 Curat la final',
  '💰 Preț Corect',
  '🤝 Amabil',
  '🛡️ Garanție Oferită',
  '✨ Profesionist',
  '💬 Comunicare Excelentă'
];

export const ReviewSystem: React.FC<ReviewSystemProps> = ({
  isOpen,
  onClose,
  targetProvider,
  targetOrder,
  reviews,
  onAddReview,
  currentUser,
  initialMode = 'view'
}) => {
  const [mode, setMode] = useState<'view' | 'write'>(
    initialMode === 'write' || (!targetProvider && targetOrder) ? 'write' : 'view'
  );

  // Write Mode State
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['🔧 Punctual', '💰 Preț Corect']);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');

  if (!isOpen) return null;

  const targetId = targetProvider?.id || targetOrder?.providerId || 'prov-1';
  const targetName = targetProvider?.name || targetOrder?.providerName || 'Prestator Loco';
  const targetRole = targetProvider?.role || targetOrder?.providerRole || 'Prestator Verificat';
  const targetImage = targetProvider?.image || targetOrder?.providerImage;

  // Filter relevant reviews for this target
  const providerReviews = reviews.filter(
    (r) => r.targetId === targetId || r.targetName === targetName
  );

  const totalReviewsCount = providerReviews.length;
  const averageRating =
    totalReviewsCount > 0
      ? (providerReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviewsCount).toFixed(1)
      : targetProvider?.rating.toFixed(1) || '5.0';

  // Rating Distribution
  const ratingCounts = {
    5: providerReviews.filter((r) => r.rating === 5).length,
    4: providerReviews.filter((r) => r.rating === 4).length,
    3: providerReviews.filter((r) => r.rating === 3).length,
    2: providerReviews.filter((r) => r.rating === 2).length,
    1: providerReviews.filter((r) => r.rating === 1).length
  };

  const filteredReviews = providerReviews.filter((r) => {
    if (filterRating === 'all') return true;
    return r.rating === filterRating;
  });

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      onAddReview({
        targetId: targetId,
        targetType: 'provider',
        targetName: targetName,
        authorName: currentUser.name,
        authorAvatar: currentUser.avatar,
        authorRole: currentUser.role,
        rating: rating,
        comment: comment.trim(),
        orderId: targetOrder?.id,
        serviceName: targetOrder?.serviceName || 'Serviciu Executat',
        isVerifiedEscrow: true,
        tags: selectedTags
      });

      setIsSubmitting(false);
      setMode('view');
    }, 400);
  };

  const getRatingLabel = (stars: number) => {
    switch (stars) {
      case 5:
        return '5★ Excelent (Recomand cu încredere)';
      case 4:
        return '4★ Foarte bun (Așteptări îndeplinite)';
      case 3:
        return '3★ Mulțumitor (Serviciu OK)';
      case 2:
        return '2★ Slab (Experiență neplăcută)';
      case 1:
        return '1★ Nesatisfăcător (Nerecomandat)';
      default:
        return '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-3">
            {targetImage ? (
              <img
                src={targetImage}
                alt={targetName}
                className="w-10 h-10 rounded-2xl object-cover ring-2 ring-emerald-500/30"
              />
            ) : (
              <div className="w-10 h-10 bg-emerald-600 rounded-2xl flex items-center justify-center text-white">
                <Star className="w-5 h-5 fill-white" />
              </div>
            )}
            <div>
              <h2 className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center gap-1.5">
                <span>{targetName}</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  <ShieldCheck className="w-3 h-3 mr-0.5" /> Verificat Escrow
                </span>
              </h2>
              <p className="text-xs text-slate-500">{targetRole}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-200 text-slate-500 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-4 py-2 bg-white border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setMode('view')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition ${
                mode === 'view'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Recenzii & Rating ({totalReviewsCount})
            </button>
            <button
              onClick={() => setMode('write')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition flex items-center space-x-1 ${
                mode === 'write'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Adaugă Recenzie Nouă</span>
            </button>
          </div>

          <div className="flex items-center space-x-1 text-xs font-black text-amber-500">
            <Star className="w-4 h-4 fill-amber-400" />
            <span>{averageRating}</span>
            <span className="text-slate-400 font-medium">/ 5.0</span>
          </div>
        </div>

        {/* Main Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {mode === 'write' ? (
            /* WRITE REVIEW FORM */
            <form onSubmit={handleSubmitReview} className="space-y-5 animate-in fade-in duration-200">
              <div className="bg-emerald-50/80 border border-emerald-200 p-4 rounded-2xl flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 bg-emerald-600 text-white rounded-xl">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      Recenzie Verificată prin Escrow (+25 Puncte Loco)
                    </h4>
                    <p className="text-[11px] text-slate-600">
                      Evaluarea ta ajută comunitatea din Cluj-Napoca să aleagă meseriași de încredere!
                    </p>
                  </div>
                </div>
              </div>

              {/* Star Rating Picker */}
              <div className="space-y-2 text-center bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider block">
                  Selectează Nota (1 - 5 Stele)
                </label>

                <div className="flex items-center justify-center space-x-2 py-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 transition transform hover:scale-110 focus:outline-none"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= (hoverRating || rating)
                            ? 'fill-amber-400 text-amber-400 drop-shadow-xs'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>

                <p className="text-xs font-bold text-amber-600 h-4">
                  {getRatingLabel(hoverRating || rating)}
                </p>
              </div>

              {/* Tag Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">
                  Alege Etichete Sugestive (Opțional)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {AVAILABLE_TAGS.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`px-2.5 py-1 text-xs font-semibold rounded-xl border transition ${
                          isSelected
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Comment Input Area */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Comentariul Tău despre Lucrare
                </label>
                <textarea
                  rows={4}
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Descrie cum s-a desfășurat lucrarea (punctualitate, calitate, atitudine, curățenie...)"
                  className="w-full p-3 text-xs font-medium border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 focus:bg-white transition"
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting || !comment.trim()}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg transition flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <span>Se salvează recenzia...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Trimite Recenzia & Primește +25 Puncte Loco</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            /* VIEW REVIEWS LIST & SUMMARY */
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Rating Summary Card */}
              <div className="bg-slate-50 p-4 sm:p-5 rounded-3xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                <div className="text-center sm:text-left sm:border-r border-slate-200 pr-0 sm:pr-4 space-y-1">
                  <div className="text-3xl font-black text-slate-900">{averageRating}</div>
                  <div className="flex justify-center sm:justify-start space-x-1 text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${
                          s <= Math.round(Number(averageRating))
                            ? 'fill-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-[11px] font-bold text-slate-500">
                    {totalReviewsCount} recenzii evaluate
                  </p>
                </div>

                {/* Rating Distribution Bars */}
                <div className="sm:col-span-2 space-y-1 text-[11px]">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = ratingCounts[star as keyof typeof ratingCounts] || 0;
                    const pct = totalReviewsCount > 0 ? (count / totalReviewsCount) * 100 : 0;
                    return (
                      <div key={star} className="flex items-center space-x-2">
                        <span className="w-12 font-bold text-slate-600 flex items-center">
                          {star} <Star className="w-3 h-3 fill-amber-400 text-amber-400 ml-0.5" />
                        </span>
                        <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-400 rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="w-8 text-right font-mono text-slate-400 text-[10px]">
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center justify-between text-xs pt-1">
                <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
                  <span className="text-slate-400 font-bold flex items-center mr-1">
                    <Filter className="w-3 h-3 mr-1" /> Filtrează:
                  </span>
                  <button
                    onClick={() => setFilterRating('all')}
                    className={`px-2.5 py-1 rounded-xl font-bold transition text-[11px] ${
                      filterRating === 'all'
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Toate
                  </button>
                  {[5, 4, 3, 2, 1].map((star) => (
                    <button
                      key={star}
                      onClick={() => setFilterRating(star)}
                      className={`px-2.5 py-1 rounded-xl font-bold transition text-[11px] flex items-center space-x-1 ${
                        filterRating === star
                          ? 'bg-amber-500 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <span>{star} ★</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Items List */}
              <div className="space-y-3">
                {filteredReviews.length === 0 ? (
                  <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
                    <MessageSquare className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="text-xs font-bold text-slate-500">
                      Nicio recenzie pentru filtrul selectat.
                    </p>
                    <button
                      onClick={() => setMode('write')}
                      className="px-3 py-1.5 bg-emerald-600 text-white font-extrabold text-xs rounded-xl hover:bg-emerald-700 transition inline-block"
                    >
                      Fii primul care lasă o recenzie!
                    </button>
                  </div>
                ) : (
                  filteredReviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2.5 hover:border-slate-300 transition"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2.5">
                          {rev.authorAvatar ? (
                            <img
                              src={rev.authorAvatar}
                              alt={rev.authorName}
                              className="w-9 h-9 rounded-xl object-cover ring-2 ring-slate-100"
                            />
                          ) : (
                            <div className="w-9 h-9 bg-slate-200 rounded-xl flex items-center justify-center font-bold text-slate-700 text-xs">
                              {rev.authorName.charAt(0)}
                            </div>
                          )}

                          <div>
                            <h4 className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
                              <span>{rev.authorName}</span>
                              {rev.isVerifiedEscrow && (
                                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full inline-flex items-center">
                                  <ShieldCheck className="w-3 h-3 mr-0.5" /> Client Verificat Escrow
                                </span>
                              )}
                            </h4>
                            <p className="text-[10px] text-slate-400">{rev.createdAt}</p>
                          </div>
                        </div>

                        {/* Stars */}
                        <div className="flex items-center space-x-0.5 text-amber-400 bg-amber-50 px-2 py-1 rounded-xl border border-amber-100">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span className="text-xs font-black text-amber-700">{rev.rating}.0</span>
                        </div>
                      </div>

                      {/* Comment text */}
                      <p className="text-xs text-slate-700 leading-relaxed font-medium">
                        "{rev.comment}"
                      </p>

                      {/* Attached Tags */}
                      {rev.tags && rev.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {rev.tags.map((t, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Provider Reply if available */}
                      {rev.reply && (
                        <div className="mt-2 p-3 bg-slate-50 border-l-2 border-emerald-500 rounded-r-2xl space-y-1 text-xs">
                          <div className="flex items-center justify-between text-[11px] font-bold text-slate-800">
                            <span className="flex items-center text-emerald-700">
                              <UserCheck className="w-3.5 h-3.5 mr-1" />
                              Răspuns de la {rev.reply.authorName}:
                            </span>
                            <span className="text-[10px] text-slate-400 font-normal">
                              {rev.reply.createdAt}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 italic">"{rev.reply.comment}"</p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
