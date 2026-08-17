import React, { useState } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  QrCode,
  Sparkles,
  ExternalLink,
  Gift,
  CheckCircle2,
  Download,
  Smartphone
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface SocialShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  categoryTag?: string;
  userReferralCode?: string;
  onRewardPointsEarned?: (points: number, reason: string) => void;
}

export const SocialShareModal: React.FC<SocialShareModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  url,
  imageUrl,
  categoryTag,
  userReferralCode = 'LOCO2026',
  onRewardPointsEarned
}) => {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [sharedPlatforms, setSharedPlatforms] = useState<string[]>([]);

  if (!isOpen) return null;

  const fullShareUrl = `${url}?ref=${userReferralCode}`;
  const encodedUrl = encodeURIComponent(fullShareUrl);
  const shareMessage = `Vezi "${title}" pe Loco Instant (${categoryTag || 'Servicii Locale'}): ${description}`;
  const encodedMessage = encodeURIComponent(`${shareMessage} ${fullShareUrl}`);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(fullShareUrl);
    setCopied(true);
    if (!sharedPlatforms.includes('copy')) {
      setSharedPlatforms((prev) => [...prev, 'copy']);
      if (onRewardPointsEarned) {
        onRewardPointsEarned(25, 'Distribuire link pe Loco Instant (+25 Puncte)');
      }
    }
    setTimeout(() => setCopied(false), 2500);
  };

  const handleToggleQrCode = () => {
    setShowQr((prev) => {
      const nextState = !prev;
      if (nextState && !sharedPlatforms.includes('qr')) {
        setSharedPlatforms((p) => [...p, 'qr']);
        if (onRewardPointsEarned) {
          onRewardPointsEarned(15, 'Generare Cod QR pentru distribuire fizică (+15 Puncte)');
        }
      }
      return nextState;
    });
  };

  const handleDownloadQr = () => {
    const svgElement = document.getElementById('share-qr-code-svg');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = `loco-qr-${userReferralCode}.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(svgUrl);
  };

  const handlePlatformShare = (platformName: string, shareLink: string) => {
    window.open(shareLink, '_blank');
    if (!sharedPlatforms.includes(platformName)) {
      setSharedPlatforms((prev) => [...prev, platformName]);
      if (onRewardPointsEarned) {
        onRewardPointsEarned(50, `Distribuire pe ${platformName} (+50 Puncte Loco)`);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-2xl flex items-center justify-center border border-emerald-500/30 text-emerald-400">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-tight">
                Distribuie & Câștigă Puncte
              </h3>
              <p className="text-xs text-slate-300">
                Atrage prieteni și primești +50 Puncte Loco
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto max-h-[80vh]">
          {/* Card Preview */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex gap-4 items-center">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={title}
                className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
              />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-extrabold text-xl shrink-0">
                LOCO
              </div>
            )}
            <div className="flex-1 min-w-0">
              {categoryTag && (
                <span className="inline-block px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-md mb-1">
                  {categoryTag}
                </span>
              )}
              <h4 className="font-bold text-sm text-slate-900 truncate">
                {title}
              </h4>
              <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">
                {description}
              </p>
            </div>
          </div>

          {/* Direct Share Buttons */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-3">
              Alege platforma de distribuire:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {/* WhatsApp */}
              <button
                onClick={() =>
                  handlePlatformShare(
                    'WhatsApp',
                    `https://api.whatsapp.com/send?text=${encodedMessage}`
                  )
                }
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold text-xs transition group"
              >
                <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">
                  💬
                </span>
                <span>WhatsApp</span>
              </button>

              {/* Facebook */}
              <button
                onClick={() =>
                  handlePlatformShare(
                    'Facebook',
                    `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
                  )
                }
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 font-bold text-xs transition group"
              >
                <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">
                  👍
                </span>
                <span>Facebook</span>
              </button>

              {/* Telegram */}
              <button
                onClick={() =>
                  handlePlatformShare(
                    'Telegram',
                    `https://t.me/share/url?url=${encodedUrl}&text=${encodeURIComponent(
                      shareMessage
                    )}`
                  )
                }
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-800 font-bold text-xs transition group"
              >
                <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">
                  ✈️
                </span>
                <span>Telegram</span>
              </button>

              {/* Email */}
              <button
                onClick={() =>
                  handlePlatformShare(
                    'Email',
                    `mailto:?subject=${encodeURIComponent(
                      title
                    )}&body=${encodedMessage}`
                  )
                }
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 font-bold text-xs transition group"
              >
                <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">
                  ✉️
                </span>
                <span>Email</span>
              </button>
            </div>
          </div>

          {/* Referral Direct Link Copy & QR Action */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">
                Link personalizat cu codul tău ({userReferralCode}):
              </label>
              <button
                id="btn-generate-qr-code"
                type="button"
                onClick={handleToggleQrCode}
                className="text-xs font-extrabold text-emerald-600 hover:text-emerald-700 hover:underline flex items-center space-x-1.5 cursor-pointer bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200 transition"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>{showQr ? 'Ascunde Cod QR' : 'Generează Cod QR'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
              <input
                type="text"
                readOnly
                value={fullShareUrl}
                className="bg-transparent text-xs text-slate-700 font-mono px-3 flex-1 outline-none truncate"
              />
              <button
                onClick={handleCopyLink}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition cursor-pointer ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copiat!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiază</span>
                  </>
                )}
              </button>
            </div>

            {/* Prominent Generate QR Code Button */}
            {!showQr && (
              <button
                type="button"
                onClick={handleToggleQrCode}
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 active:scale-[0.99] text-white font-extrabold text-xs rounded-2xl flex items-center justify-center space-x-2 border border-slate-700 shadow-sm transition cursor-pointer"
              >
                <QrCode className="w-4 h-4 text-emerald-400" />
                <span>Generează Cod QR (pentru scanare fizică)</span>
              </button>
            )}
          </div>

          {/* QR Code Scannable View */}
          {showQr && (
            <div className="p-4 sm:p-5 bg-gradient-to-b from-slate-50 to-emerald-50/50 rounded-2xl border-2 border-emerald-200 flex flex-col items-center justify-center text-center space-y-3.5 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-1.5 text-xs font-black text-slate-900">
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                  <span>Cod QR pentru Scanare Fizică</span>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadQr}
                  className="inline-flex items-center space-x-1 px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 text-[11px] font-bold rounded-lg border border-slate-200 shadow-2xs transition cursor-pointer"
                  title="Descarcă imaginea SVG a codului QR"
                >
                  <Download className="w-3 h-3 text-emerald-600" />
                  <span>Descarcă SVG</span>
                </button>
              </div>

              {/* Real Rendered SVG QR Code */}
              <div className="bg-white p-3.5 rounded-2xl border-2 border-emerald-400 shadow-md flex flex-col items-center justify-center">
                <QRCodeSVG
                  id="share-qr-code-svg"
                  value={fullShareUrl}
                  size={160}
                  level="M"
                  includeMargin={true}
                  bgColor="#ffffff"
                  fgColor="#0f172a"
                />
                <span className="text-[10px] font-black text-emerald-700 uppercase tracking-wider mt-1">
                  Loco Instant • Scan & Share
                </span>
              </div>

              <div className="space-y-1 max-w-xs">
                <p className="text-xs text-slate-700 font-bold">
                  Scanează cu camera telefonului pentru a deschide instant
                </p>
                <p className="text-[11px] text-slate-500 font-mono break-all line-clamp-1">
                  {fullShareUrl}
                </p>
              </div>
            </div>
          )}

          {/* Referral Points Badge Notification */}
          <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-black shrink-0 text-sm">
              🎁
            </div>
            <div className="text-xs text-amber-900">
              <span className="font-extrabold">Bonus de Recomandare Loco:</span>{' '}
              Fiecare vizitator care își creează cont prin linkul tău aduce{' '}
              <strong className="text-amber-700">+100 Puncte Loco</strong> pentru
              tine și <strong className="text-amber-700">20 RON voucher</strong>{' '}
              pentru el!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
