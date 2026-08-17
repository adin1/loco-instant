import React, { useState, useRef, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronDown,
  CalendarRange,
  Clock,
  Check,
  RotateCcw,
  Sparkles,
  ArrowRight,
  X
} from 'lucide-react';

export type DateRangePreset = '7d' | '30d' | '90d' | 'this_month' | 'last_month' | 'custom';

export interface DateRangeState {
  preset: DateRangePreset;
  startDate: string; // Format: YYYY-MM-DD
  endDate: string;   // Format: YYYY-MM-DD
  label: string;
}

interface DateRangePickerProps {
  value: DateRangeState;
  onChange: (newValue: DateRangeState) => void;
  className?: string;
}

// Format date to Romanian readable format (e.g. "14 Aug 2026")
export const formatRoDate = (dateStr: string): string => {
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('ro-RO', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateStr;
  }
};

// Calculate helper presets based on reference date (defaults to 2026-08-14 or current date)
export const getPresetDateRange = (preset: DateRangePreset, refDateStr: string = '2026-08-14'): DateRangeState => {
  const ref = new Date(refDateStr);
  const formatDate = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const end = new Date(ref);
  const start = new Date(ref);

  switch (preset) {
    case '7d': {
      start.setDate(end.getDate() - 6);
      return {
        preset: '7d',
        startDate: formatDate(start),
        endDate: formatDate(end),
        label: 'Ultimele 7 Zile'
      };
    }
    case '30d': {
      start.setDate(end.getDate() - 29);
      return {
        preset: '30d',
        startDate: formatDate(start),
        endDate: formatDate(end),
        label: 'Ultimele 30 Zile'
      };
    }
    case '90d': {
      start.setDate(end.getDate() - 89);
      return {
        preset: '90d',
        startDate: formatDate(start),
        endDate: formatDate(end),
        label: 'Ultimele 90 Zile (3 Luni)'
      };
    }
    case 'this_month': {
      start.setDate(1);
      return {
        preset: 'this_month',
        startDate: formatDate(start),
        endDate: formatDate(end),
        label: 'Luna Aceasta'
      };
    }
    case 'last_month': {
      const lastMonthEnd = new Date(ref.getFullYear(), ref.getMonth(), 0);
      const lastMonthStart = new Date(ref.getFullYear(), ref.getMonth() - 1, 1);
      return {
        preset: 'last_month',
        startDate: formatDate(lastMonthStart),
        endDate: formatDate(lastMonthEnd),
        label: 'Luna Trecută'
      };
    }
    case 'custom':
    default:
      return {
        preset: 'custom',
        startDate: formatDate(start),
        endDate: formatDate(end),
        label: 'Interval Personalizat'
      };
  }
};

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  value,
  onChange,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempStart, setTempStart] = useState(value.startDate);
  const [tempEnd, setTempEnd] = useState(value.endDate);
  const [tempPreset, setTempPreset] = useState<DateRangePreset>(value.preset);
  const [error, setError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Sync temp values when external value changes or popover opens
  useEffect(() => {
    setTempStart(value.startDate);
    setTempEnd(value.endDate);
    setTempPreset(value.preset);
    setError(null);
  }, [value, isOpen]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelectPreset = (preset: DateRangePreset) => {
    setTempPreset(preset);
    setError(null);
    if (preset !== 'custom') {
      const range = getPresetDateRange(preset);
      setTempStart(range.startDate);
      setTempEnd(range.endDate);
    }
  };

  const handleApply = () => {
    if (!tempStart || !tempEnd) {
      setError('Te rugăm să selectezi ambele date.');
      return;
    }

    if (tempStart > tempEnd) {
      setError('Data de început nu poate fi ulterioară datei de sfârșit.');
      return;
    }

    let finalLabel = 'Interval Personalizat';
    if (tempPreset === '7d') finalLabel = 'Ultimele 7 Zile';
    else if (tempPreset === '30d') finalLabel = 'Ultimele 30 Zile';
    else if (tempPreset === '90d') finalLabel = 'Ultimele 90 Zile';
    else if (tempPreset === 'this_month') finalLabel = 'Luna Aceasta';
    else if (tempPreset === 'last_month') finalLabel = 'Luna Trecută';
    else {
      finalLabel = `${formatRoDate(tempStart)} – ${formatRoDate(tempEnd)}`;
    }

    onChange({
      preset: tempPreset,
      startDate: tempStart,
      endDate: tempEnd,
      label: finalLabel
    });
    setIsOpen(false);
  };

  // Calculate day count
  const calculateDays = (s: string, e: string): number => {
    try {
      const start = new Date(s).getTime();
      const end = new Date(e).getTime();
      const diff = Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;
      return diff > 0 ? diff : 0;
    } catch {
      return 0;
    }
  };

  const daysCount = calculateDays(tempStart, tempEnd);

  return (
    <div className={`relative inline-block text-left ${className}`} ref={containerRef}>
      {/* Main Trigger Button */}
      <button
        id="date-range-picker-trigger"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 px-3.5 py-2 rounded-2xl text-xs font-bold transition shadow-xs border cursor-pointer ${
          isOpen
            ? 'bg-slate-900 text-white border-slate-900 ring-2 ring-emerald-500/20'
            : 'bg-slate-50 hover:bg-slate-100/90 text-slate-800 border-slate-200 hover:border-slate-300'
        }`}
      >
        <CalendarRange className={`w-4 h-4 shrink-0 ${isOpen ? 'text-emerald-400' : 'text-emerald-600'}`} />
        <span className="font-extrabold truncate max-w-[180px] sm:max-w-[240px]">
          {value.preset === 'custom'
            ? `${formatRoDate(value.startDate)} – ${formatRoDate(value.endDate)}`
            : value.label}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-emerald-400' : ''
          }`}
        />
      </button>

      {/* Popover Dropdown Panel */}
      {isOpen && (
        <div
          id="date-range-picker-popover"
          className="absolute right-0 mt-2 w-[340px] sm:w-[460px] bg-white rounded-3xl shadow-2xl border border-slate-200/90 p-5 z-50 animate-fadeIn space-y-4"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-xl">
                <CalendarIcon className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900">Filtrează Perioada de Analiză</h4>
                <p className="text-[10px] text-slate-500 font-medium">
                  Vizualizări, contacte și click-uri în intervalul ales
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Presets Grid */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5 block">
              Intervale Predefinite Rapide
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {[
                { id: '7d' as DateRangePreset, label: '⚡ Ultimele 7 Zile' },
                { id: '30d' as DateRangePreset, label: '📅 Ultimele 30 Zile' },
                { id: '90d' as DateRangePreset, label: '📈 Ultimele 90 Zile' },
                { id: 'this_month' as DateRangePreset, label: '🗓️ Luna Aceasta' },
                { id: 'last_month' as DateRangePreset, label: '⏮️ Luna Trecută' },
                { id: 'custom' as DateRangePreset, label: '✏️ Personalizat' }
              ].map((preset) => {
                const isSelected = tempPreset === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset.id)}
                    className={`px-2.5 py-1.5 text-xs font-extrabold rounded-xl transition text-left flex items-center justify-between cursor-pointer border ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200/80 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <span className="truncate">{preset.label}</span>
                    {isSelected && <Check className="w-3 h-3 text-white ml-1 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Date Inputs Section */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-slate-800 flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                <span>Interval calendaristic exact</span>
              </span>
              <span className="text-[10px] font-mono font-bold bg-white text-slate-700 px-2 py-0.5 rounded-md border border-slate-200">
                {daysCount} {daysCount === 1 ? 'zi selectată' : 'zile selectate'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="text-[10px] font-bold text-slate-500 mb-1 block">Data de Început:</label>
                <input
                  type="date"
                  value={tempStart}
                  max={tempEnd || '2026-12-31'}
                  onChange={(e) => {
                    setTempStart(e.target.value);
                    setTempPreset('custom');
                    setError(null);
                  }}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 mb-1 block">Data de Sfârșit:</label>
                <input
                  type="date"
                  value={tempEnd}
                  min={tempStart}
                  max="2026-12-31"
                  onChange={(e) => {
                    setTempEnd(e.target.value);
                    setTempPreset('custom');
                    setError(null);
                  }}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs"
                />
              </div>
            </div>

            {/* Formatted range preview */}
            <div className="text-[11px] text-slate-600 bg-white p-2 rounded-xl border border-slate-200/60 flex items-center justify-between">
              <span className="font-semibold">{formatRoDate(tempStart)}</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 mx-2 shrink-0" />
              <span className="font-semibold">{formatRoDate(tempEnd)}</span>
            </div>

            {error && (
              <p className="text-[11px] font-extrabold text-rose-600 bg-rose-50 p-2 rounded-xl border border-rose-200">
                ⚠️ {error}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                const def = getPresetDateRange('7d');
                setTempStart(def.startDate);
                setTempEnd(def.endDate);
                setTempPreset('7d');
                setError(null);
              }}
              className="text-[11px] font-extrabold text-slate-500 hover:text-slate-800 flex items-center space-x-1 cursor-pointer transition"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset la 7 zile</span>
            </button>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
              >
                Anulează
              </button>
              <button
                id="apply-date-range-btn"
                type="button"
                onClick={handleApply}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-xs transition cursor-pointer active:scale-95 flex items-center space-x-1"
              >
                <Check className="w-3.5 h-3.5 mr-0.5" />
                <span>Aplică Interval</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
