import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  BarChart
} from 'recharts';
import {
  TrendingUp,
  Eye,
  Phone,
  MessageSquare,
  Sparkles,
  PlusCircle,
  Filter,
  Calendar,
  Zap,
  Award,
  ArrowUpRight,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Pause,
  Play,
  Share2,
  BarChart3,
  Search,
  AlertCircle,
  Download,
  FileSpreadsheet,
  Printer,
  FileText,
  Check,
  SlidersHorizontal,
  ArrowUpDown,
  Clock,
  RotateCcw,
  Wallet,
  Target,
  Users,
  CreditCard,
  CalendarRange,
  ArrowLeft
} from 'lucide-react';
import { UserAd, AdAnalyticsDataPoint } from '../types';
import { MOCK_USER_ADS } from '../data/mockData';
import {
  DateRangePicker,
  DateRangeState,
  DateRangePreset,
  getPresetDateRange,
  formatRoDate
} from './DateRangePicker';

interface DashboardAnunturiPageProps {
  onOpenPublishAdModal: (packageCode?: string) => void;
  onShareAd?: (adTitle: string) => void;
  currentCity?: string;
  onBack?: () => void;
}

export const DashboardAnunturiPage: React.FC<DashboardAnunturiPageProps> = ({
  onOpenPublishAdModal,
  onShareAd,
  currentCity = 'Cluj-Napoca',
  onBack
}) => {
  const [ads, setAds] = useState<UserAd[]>(MOCK_USER_ADS);
  const [selectedAdId, setSelectedAdId] = useState<string>('all');
  const [dateRange, setDateRange] = useState<DateRangeState>(() => getPresetDateRange('7d'));
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'boosted' | 'pending_review' | 'expired' | 'expiring' | 'paused'>('all');
  const [sortOption, setSortOption] = useState<
    'views-desc' | 'views-asc' | 'contacts-desc' | 'contacts-asc' | 'rate-desc' | 'recent'
  >('views-desc');
  const [chartType, setChartType] = useState<'area' | 'bar'>('area');

  // Filtered & Sorted ads list
  const filteredAds = useMemo(() => {
    let result = ads.filter((ad) => {
      const matchSearch =
        !searchQuery ||
        ad.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ad.category.toLowerCase().includes(searchQuery.toLowerCase());

      let matchStatus = true;
      if (statusFilter === 'active') matchStatus = ad.status === 'active';
      else if (statusFilter === 'boosted') matchStatus = ad.status === 'boosted';
      else if (statusFilter === 'pending_review') matchStatus = ad.status === 'pending_review';
      else if (statusFilter === 'expired') matchStatus = ad.status === 'expired' || Boolean(ad.expiresInDays !== undefined && ad.expiresInDays <= 0);
      else if (statusFilter === 'expiring') matchStatus = Boolean(ad.expiresInDays !== undefined && ad.expiresInDays > 0 && ad.expiresInDays <= 5);
      else if (statusFilter === 'paused') matchStatus = ad.status === 'paused';

      return matchSearch && matchStatus;
    });

    // Apply Sorting
    return result.sort((a, b) => {
      if (sortOption === 'views-desc') return b.viewsCount - a.viewsCount;
      if (sortOption === 'views-asc') return a.viewsCount - b.viewsCount;
      if (sortOption === 'contacts-desc') return b.contactsCount - a.contactsCount;
      if (sortOption === 'contacts-asc') return a.contactsCount - b.contactsCount;
      if (sortOption === 'rate-desc') return b.conversionRate - a.conversionRate;
      if (sortOption === 'recent') return b.id.localeCompare(a.id);
      return 0;
    });
  }, [ads, searchQuery, statusFilter, sortOption]);

  // Dynamically calculate analytics dataset and KPIs based on date range & selected ad
  const analyticsData = useMemo(() => {
    const targetAds = selectedAdId === 'all' ? ads : ads.filter((a) => a.id === selectedAdId);
    const isSingle = selectedAdId !== 'all';
    const foundSingleAd = isSingle ? ads.find((a) => a.id === selectedAdId) : null;

    const start = new Date(dateRange.startDate);
    const end = new Date(dateRange.endDate);
    const dayDiff = Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);

    // Standard 7d preset
    if (dateRange.preset === '7d') {
      if (foundSingleAd?.analytics7d && foundSingleAd.analytics7d.length > 0) {
        const data = foundSingleAd.analytics7d;
        const vSum = data.reduce((s, p) => s + p.vizualizari, 0);
        const cSum = data.reduce((s, p) => s + p.contacte, 0);
        const aSum = data.reduce((s, p) => s + p.apeluri, 0);
        const mSum = data.reduce((s, p) => s + p.mesaje, 0);
        const oSum = data.reduce((s, p) => s + p.cereriOferta, 0);
        return {
          chartData: data,
          totalViews: vSum,
          totalContacts: cSum,
          avgConversionRate: vSum > 0 ? ((cSum / vSum) * 100).toFixed(2) : '0.00',
          totalApeluri: aSum,
          totalMesaje: mSum,
          totalCereri: oSum
        };
      } else {
        const aggregated: { [date: string]: AdAnalyticsDataPoint } = {};
        ads.forEach((ad) => {
          (ad.analytics7d || []).forEach((pt) => {
            if (!aggregated[pt.date]) {
              aggregated[pt.date] = {
                date: pt.date,
                vizualizari: 0,
                contacte: 0,
                apeluri: 0,
                mesaje: 0,
                cereriOferta: 0
              };
            }
            aggregated[pt.date].vizualizari += pt.vizualizari;
            aggregated[pt.date].contacte += pt.contacte;
            aggregated[pt.date].apeluri += pt.apeluri;
            aggregated[pt.date].mesaje += pt.mesaje;
            aggregated[pt.date].cereriOferta += pt.cereriOferta;
          });
        });
        const data = Object.values(aggregated);
        const vSum = data.reduce((s, p) => s + p.vizualizari, 0);
        const cSum = data.reduce((s, p) => s + p.contacte, 0);
        const aSum = data.reduce((s, p) => s + p.apeluri, 0);
        const mSum = data.reduce((s, p) => s + p.mesaje, 0);
        const oSum = data.reduce((s, p) => s + p.cereriOferta, 0);
        return {
          chartData: data,
          totalViews: vSum,
          totalContacts: cSum,
          avgConversionRate: vSum > 0 ? ((cSum / vSum) * 100).toFixed(2) : '0.00',
          totalApeluri: aSum,
          totalMesaje: mSum,
          totalCereri: oSum
        };
      }
    }

    // Standard 30d preset
    if (dateRange.preset === '30d') {
      if (foundSingleAd?.analytics30d && foundSingleAd.analytics30d.length > 0) {
        const data = foundSingleAd.analytics30d;
        const vSum = data.reduce((s, p) => s + p.vizualizari, 0);
        const cSum = data.reduce((s, p) => s + p.contacte, 0);
        const aSum = data.reduce((s, p) => s + p.apeluri, 0);
        const mSum = data.reduce((s, p) => s + p.mesaje, 0);
        const oSum = data.reduce((s, p) => s + p.cereriOferta, 0);
        return {
          chartData: data,
          totalViews: vSum,
          totalContacts: cSum,
          avgConversionRate: vSum > 0 ? ((cSum / vSum) * 100).toFixed(2) : '0.00',
          totalApeluri: aSum,
          totalMesaje: mSum,
          totalCereri: oSum
        };
      } else {
        const data: AdAnalyticsDataPoint[] = [
          { date: 'Săpt 1', vizualizari: 650, contacte: 78, apeluri: 42, mesaje: 24, cereriOferta: 12 },
          { date: 'Săpt 2', vizualizari: 780, contacte: 95, apeluri: 51, mesaje: 29, cereriOferta: 15 },
          { date: 'Săpt 3', vizualizari: 890, contacte: 112, apeluri: 60, mesaje: 34, cereriOferta: 18 },
          { date: 'Săpt 4', vizualizari: 850, contacte: 81, apeluri: 45, mesaje: 24, cereriOferta: 12 }
        ];
        const vSum = data.reduce((s, p) => s + p.vizualizari, 0);
        const cSum = data.reduce((s, p) => s + p.contacte, 0);
        return {
          chartData: data,
          totalViews: vSum,
          totalContacts: cSum,
          avgConversionRate: ((cSum / vSum) * 100).toFixed(2),
          totalApeluri: 198,
          totalMesaje: 116,
          totalCereri: 57
        };
      }
    }

    // Dynamic generator for Custom Range, 90d, this_month, last_month
    const baseDailyViews = targetAds.reduce((sum, a) => sum + Math.max(10, Math.round(a.viewsCount / 14)), 0);
    const hasBoosted = targetAds.some((a) => a.status === 'boosted');
    const conversionMultiplier = hasBoosted ? 0.124 : 0.088;

    const data: AdAnalyticsDataPoint[] = [];

    if (dayDiff <= 14) {
      for (let i = 0; i < dayDiff; i++) {
        const current = new Date(start);
        current.setDate(start.getDate() + i);
        const dayLabel = current.toLocaleDateString('ro-RO', { day: '2-digit', month: 'short' });
        const wave = 0.85 + 0.3 * Math.sin(i * 1.25) + (i % 2 === 0 ? 0.1 : 0);
        const views = Math.max(15, Math.round(baseDailyViews * wave));
        const contacts = Math.max(1, Math.round(views * conversionMultiplier));
        const apeluri = Math.round(contacts * 0.52);
        const mesaje = Math.round(contacts * 0.31);
        const cereriOferta = Math.max(0, contacts - apeluri - mesaje);

        data.push({
          date: dayLabel,
          vizualizari: views,
          contacte: contacts,
          apeluri,
          mesaje,
          cereriOferta
        });
      }
    } else if (dayDiff <= 45) {
      const steps = Math.min(6, Math.max(3, Math.ceil(dayDiff / 7)));
      const stepDays = Math.max(1, Math.round(dayDiff / steps));
      for (let s = 0; s < steps; s++) {
        const sStart = new Date(start);
        sStart.setDate(start.getDate() + s * stepDays);
        const label = `Săpt ${s + 1} (${sStart.toLocaleDateString('ro-RO', { day: 'numeric', month: 'short' })})`;
        const wave = 0.9 + 0.22 * Math.sin(s * 1.4);
        const views = Math.max(50, Math.round(baseDailyViews * stepDays * wave));
        const contacts = Math.max(5, Math.round(views * conversionMultiplier));
        const apeluri = Math.round(contacts * 0.53);
        const mesaje = Math.round(contacts * 0.30);
        const cereriOferta = Math.max(0, contacts - apeluri - mesaje);

        data.push({
          date: label,
          vizualizari: views,
          contacte: contacts,
          apeluri,
          mesaje,
          cereriOferta
        });
      }
    } else {
      const steps = Math.min(8, Math.max(4, Math.ceil(dayDiff / 14)));
      const stepDays = Math.max(1, Math.round(dayDiff / steps));
      for (let s = 0; s < steps; s++) {
        const sStart = new Date(start);
        sStart.setDate(start.getDate() + s * stepDays);
        const label = `Perioada ${s + 1} (${sStart.toLocaleDateString('ro-RO', { day: 'numeric', month: 'short' })})`;
        const wave = 0.95 + 0.18 * Math.cos(s * 1.1);
        const views = Math.max(120, Math.round(baseDailyViews * stepDays * wave));
        const contacts = Math.max(12, Math.round(views * conversionMultiplier));
        const apeluri = Math.round(contacts * 0.52);
        const mesaje = Math.round(contacts * 0.31);
        const cereriOferta = Math.max(0, contacts - apeluri - mesaje);

        data.push({
          date: label,
          vizualizari: views,
          contacte: contacts,
          apeluri,
          mesaje,
          cereriOferta
        });
      }
    }

    const vSum = data.reduce((s, p) => s + p.vizualizari, 0);
    const cSum = data.reduce((s, p) => s + p.contacte, 0);
    const aSum = data.reduce((s, p) => s + p.apeluri, 0);
    const mSum = data.reduce((s, p) => s + p.mesaje, 0);
    const oSum = data.reduce((s, p) => s + p.cereriOferta, 0);

    return {
      chartData: data,
      totalViews: vSum,
      totalContacts: cSum,
      avgConversionRate: vSum > 0 ? ((cSum / vSum) * 100).toFixed(2) : '0.00',
      totalApeluri: aSum,
      totalMesaje: mSum,
      totalCereri: oSum
    };
  }, [ads, selectedAdId, dateRange]);

  const {
    chartData,
    totalViews,
    totalContacts,
    avgConversionRate,
    totalApeluri,
    totalMesaje,
    totalCereri
  } = analyticsData;

  const boostedCount = useMemo(() => {
    return ads.filter((a) => a.status === 'boosted').length;
  }, [ads]);

  // Total promotional spend calculation in RON
  const totalSpend = useMemo(() => {
    const pkgSpend = ads.reduce((sum, a) => {
      if (a.packageType === 'PROMO-VIP 2026') return sum + 149;
      if (a.packageType === 'Standard Boost') return sum + 49;
      if (a.packageType === 'Master') return sum + 299;
      return sum;
    }, 0);
    return pkgSpend > 0 ? pkgSpend : 247;
  }, [ads]);

  const costPerLead = useMemo(() => {
    if (totalContacts === 0) return '0.00';
    return (totalSpend / totalContacts).toFixed(2);
  }, [totalSpend, totalContacts]);

  // Breakdown data for contact channels pie chart
  const contactChannelsData = useMemo(() => {
    return [
      { name: 'Apeluri Telefonice', value: totalApeluri || 112, color: '#10b981' },
      { name: 'Mesaje Chat / WhatsApp', value: totalMesaje || 68, color: '#3b82f6' },
      { name: 'Cereri Ofertă Directe', value: totalCereri || 44, color: '#f59e0b' }
    ];
  }, [totalApeluri, totalMesaje, totalCereri]);

  // Comparison data by ad for BarChart
  const adsComparisonData = useMemo(() => {
    return ads.map((ad) => ({
      shortTitle: ad.title.length > 20 ? ad.title.substring(0, 20) + '...' : ad.title,
      vizualizari: ad.viewsCount,
      contacte: ad.contactsCount
    }));
  }, [ads]);

  const toggleAdStatus = (id: string) => {
    setAds((prev) =>
      prev.map((ad) => {
        if (ad.id === id) {
          const newStatus = ad.status === 'paused' ? 'active' : 'paused';
          return { ...ad, status: newStatus };
        }
        return ad;
      })
    );
  };

  const [exportStatus, setExportStatus] = useState<string | null>(null);

  const triggerExportNotice = (msg: string) => {
    setExportStatus(msg);
    setTimeout(() => setExportStatus(null), 4000);
  };

  const handleExportCSV = () => {
    if (!chartData || chartData.length === 0) return;

    const selectedAdTitle =
      selectedAdId === 'all'
        ? 'Toate Anunțurile'
        : ads.find((a) => a.id === selectedAdId)?.title || 'Anunț Selectat';

    const headers = [
      'Data/Perioada',
      'Vizualizari',
      'Contacte Totale',
      'Apeluri Telefonice',
      'Mesaje Chat',
      'Cereri Oferta'
    ];

    const rows = chartData.map((pt) => [
      `"${pt.date}"`,
      pt.vizualizari,
      pt.contacte,
      pt.apeluri,
      pt.mesaje,
      pt.cereriOferta
    ]);

    const csvRows = [headers.join(','), ...rows.map((r) => r.join(','))];
    const csvString = '\uFEFF' + csvRows.join('\n');

    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const safeTitle = selectedAdTitle.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 20);
    const dateStamp = new Date().toISOString().split('T')[0];

    link.href = url;
    link.setAttribute('download', `Raport_Loco_${safeTitle}_${dateRange.startDate}_la_${dateRange.endDate}_${dateStamp}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    triggerExportNotice('📊 Raportul CSV a fost descărcat cu succes!');
  };

  const handleExportAdsCSV = () => {
    const listToExport = filteredAds.length > 0 ? filteredAds : ads;
    if (!listToExport || listToExport.length === 0) return;

    const headers = [
      'ID Anunt',
      'Titlu Anunt',
      'Categorie',
      'Pret',
      'Status',
      'Pachet Promovare',
      'Vizualizari Totale',
      'Contacte Totale',
      'Rata Conversie (%)',
      'Data Publicarii',
      'Zile Pana la Expirare'
    ];

    const rows = listToExport.map((ad) => [
      `"${ad.id}"`,
      `"${ad.title.replace(/"/g, '""')}"`,
      `"${ad.category}"`,
      `"${ad.price}"`,
      `"${ad.status === 'boosted' ? 'Promovat (VIP)' : ad.status === 'active' ? 'Activ' : 'In pauza'}"`,
      `"${ad.packageType || 'Gratuit'}"`,
      ad.viewsCount,
      ad.contactsCount,
      ad.conversionRate,
      `"${ad.publishedDate}"`,
      ad.expiresInDays !== undefined ? ad.expiresInDays : 'N/A'
    ]);

    const csvRows = [headers.join(','), ...rows.map((r) => r.join(','))];
    const csvString = '\uFEFF' + csvRows.join('\n');

    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateStamp = new Date().toISOString().split('T')[0];

    link.href = url;
    link.setAttribute('download', `Anunturi_Loco_Instant_${dateStamp}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    triggerExportNotice(`📊 Fișierul CSV cu cele ${listToExport.length} anunțuri a fost descărcat cu succes!`);
  };

  const handleExportPDF = () => {
    const selectedAdTitle =
      selectedAdId === 'all'
        ? 'Toate Anunțurile'
        : ads.find((a) => a.id === selectedAdId)?.title || 'Anunț Selectat';

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Te rugăm să permiți deschiderea ferestrelor pop-up pentru a genera raportul PDF.');
      return;
    }

    const todayStr = new Date().toLocaleDateString('ro-RO', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });

    const rowsHtml = chartData
      .map(
        (pt) => `
        <tr>
          <td><strong>${pt.date}</strong></td>
          <td>${pt.vizualizari.toLocaleString()}</td>
          <td style="color: #10b981; font-weight: bold;">${pt.contacte.toLocaleString()}</td>
          <td>${pt.apeluri}</td>
          <td>${pt.mesaje}</td>
          <td>${pt.cereriOferta}</td>
        </tr>
      `
      )
      .join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="ro">
      <head>
        <meta charset="UTF-8">
        <title>Raport Performanță Anunțuri - Loco Instant</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 32px; color: #0f172a; line-height: 1.5; background: #ffffff; }
          .report-header { border-bottom: 3px solid #10b981; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-end; }
          .brand-title { font-size: 24px; font-weight: 900; color: #0f172a; margin: 0; }
          .brand-subtitle { font-size: 13px; color: #64748b; margin-top: 4px; }
          .report-meta { text-align: right; font-size: 12px; color: #475569; }
          .kpi-container { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 28px; }
          .kpi-card { background: #f8fafc; border: 1px solid #e2e8f0; padding: 14px; border-radius: 12px; text-align: center; }
          .kpi-label { font-size: 10px; font-weight: 800; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px; margin-bottom: 4px; }
          .kpi-num { font-size: 20px; font-weight: 900; color: #0f172a; font-family: monospace; }
          .section-title { font-size: 15px; font-weight: 800; color: #0f172a; margin-bottom: 12px; border-left: 4px solid #10b981; padding-left: 8px; }
          .data-table { width: 100%; border-collapse: collapse; margin-top: 12px; }
          .data-table th { background: #0f172a; color: #ffffff; padding: 10px 12px; font-size: 11px; font-weight: 800; text-align: left; text-transform: uppercase; }
          .data-table td { padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-size: 12px; }
          .data-table tr:nth-child(even) { background: #f8fafc; }
          .footer { margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 16px; text-align: center; font-size: 11px; color: #94a3b8; }
          @media print {
            body { padding: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="report-header">
          <div>
            <h1 class="brand-title">🚀 Loco Instant - Raport Performanță</h1>
            <div class="brand-subtitle">
              Anunț vizat: <strong>${selectedAdTitle}</strong> • Oraș: <strong>${currentCity}</strong>
            </div>
          </div>
          <div class="report-meta">
            <div>Data generării: <strong>${todayStr}</strong></div>
            <div>Perioadă selectată: <strong>${dateRange.label} (${formatRoDate(dateRange.startDate)} – ${formatRoDate(dateRange.endDate)})</strong></div>
          </div>
        </div>

        <div class="kpi-container">
          <div class="kpi-card">
            <div class="kpi-label">Total Vizualizări</div>
            <div class="kpi-num" style="color: #059669">${totalViews.toLocaleString()}</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-label">Contacte Totale</div>
            <div class="kpi-num" style="color: #d97706">${totalContacts.toLocaleString()}</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-label">Rată Conversie</div>
            <div class="kpi-num" style="color: #4f46e5">${avgConversionRate}%</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-label">Anunțuri Promovate</div>
            <div class="kpi-num" style="color: #ea580c">${boostedCount} / ${ads.length}</div>
          </div>
        </div>

        <div class="section-title">Evoluție Trafic & Solicitări Directe</div>
        <table class="data-table">
          <thead>
            <tr>
              <th>Data / Perioada</th>
              <th>Vizualizări</th>
              <th>Contacte Totale</th>
              <th>Apeluri Telefonice</th>
              <th>Mesaje Chat</th>
              <th>Cereri Ofertă</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>

        <div class="footer">
          Raport generat din sistemul de analitică Loco Instant România (${currentCity}). Document confidențial destinat titularului contului.
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();

    triggerExportNotice('📄 Raportul PDF a fost pregătit pentru imprimare / salvare!');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Back Navigation Bar */}
      {onBack && (
        <div className="flex items-center justify-between bg-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl border border-slate-200 shadow-xs">
          <button
            id="btn-dashboard-back-home"
            type="button"
            onClick={onBack}
            className="inline-flex items-center space-x-2.5 text-xs font-black text-slate-800 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-50/80 active:bg-emerald-100 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl border border-slate-200 hover:border-emerald-200 transition cursor-pointer min-h-[42px] active:scale-95 shrink-0 group shadow-2xs"
          >
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-600 text-white shadow-xs group-hover:bg-emerald-700 group-hover:scale-105 transition shrink-0">
              <ArrowLeft className="w-3.5 h-3.5 stroke-[2.8]" />
            </div>
            <span className="hidden sm:inline font-black">Înapoi la Pagina Principală (Meșteri & Servicii)</span>
            <span className="sm:hidden font-black">Înapoi la Acasă</span>
          </button>
          <span className="hidden sm:inline-block text-[11px] font-semibold text-slate-400">
            Loco Instant • Mod Administrare Anunțuri
          </span>
        </div>
      )}

      {/* Page Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 font-extrabold text-xs rounded-full border border-emerald-500/30 flex items-center space-x-1.5">
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Analitică & Performanță Live 2026</span>
              </span>
              <span className="text-xs text-slate-400 font-medium">• Oraș: {currentCity}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Dashboard Anunțuri & Audiență
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl font-medium">
              Urmărește evoluția în timp real a vizualizărilor, apelurilor telefonice și cererilor de ofertă primite de la clienții din {currentCity}.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onOpenPublishAdModal('promo-vip')}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-slate-950 font-black text-xs rounded-2xl shadow-lg transition transform hover:scale-105 active:scale-95 flex items-center space-x-2"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Promovează Anunț (PROMO-VIP)</span>
            </button>
            <button
              onClick={() => onOpenPublishAdModal()}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-2xl shadow-md transition flex items-center space-x-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Adaugă Anunț Nou</span>
            </button>
          </div>
        </div>
      </div>

      {/* High-Level Executive Performance Summary Section */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-lg border border-slate-700 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-700/80">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-white tracking-tight">
                Rezumat Executiv & Performanță
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                Viziune sintetică asupra bugetului investit, rata de conversie și totalul de lead-uri obținute
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            <span className="px-3 py-1 bg-slate-800/90 text-slate-300 font-bold text-[11px] rounded-full border border-slate-700 flex items-center space-x-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              <span>{dateRange.label} ({formatRoDate(dateRange.startDate)} – {formatRoDate(dateRange.endDate)})</span>
            </span>
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 font-extrabold text-[11px] rounded-full border border-emerald-500/30 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ROI Excelent • CPL: {costPerLead} RON / lead</span>
            </span>
          </div>
        </div>

        {/* 3 Main Executive Summary Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Executive Metric 1: Total Spend */}
          <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/90 hover:border-amber-500/50 transition group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-xl pointer-events-none group-hover:bg-amber-500/20 transition" />
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                <Wallet className="w-4 h-4 text-amber-400" />
                <span>Total Spend (Buget Investit)</span>
              </span>
              <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-md font-mono font-bold">
                Promovare
              </span>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-black text-white tracking-tight font-mono">
                {totalSpend} <span className="text-lg text-amber-400 font-sans">RON</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium mt-2 flex items-center justify-between">
              <span>Cost mediu per lead (CPL):</span>
              <strong className="text-amber-300 font-mono">{costPerLead} RON</strong>
            </p>
          </div>

          {/* Executive Metric 2: Average Conversion Rate */}
          <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/90 hover:border-indigo-500/50 transition group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl pointer-events-none group-hover:bg-indigo-500/20 transition" />
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                <TrendingUp className="w-4 h-4 text-indigo-400" />
                <span>Average Conversion Rate</span>
              </span>
              <span className="text-[10px] bg-indigo-400/20 text-indigo-300 px-2 py-0.5 rounded-md font-bold">
                Rată Conversie
              </span>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-black text-white tracking-tight font-mono">
                {avgConversionRate}%
              </span>
              <span className="text-xs font-bold text-emerald-400 flex items-center bg-emerald-500/20 px-2 py-0.5 rounded-md">
                <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                +2.4% vs medie
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium mt-2">
              Rată de transformare din vizitatori în contacte direct interesate
            </p>
          </div>

          {/* Executive Metric 3: Total Leads Generated */}
          <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/90 hover:border-emerald-500/50 transition group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none group-hover:bg-emerald-500/20 transition" />
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                <Users className="w-4 h-4 text-emerald-400" />
                <span>Total Leads Generated</span>
              </span>
              <span className="text-[10px] bg-emerald-400/20 text-emerald-300 px-2 py-0.5 rounded-md font-bold">
                Solicitări Directe
              </span>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-black text-white tracking-tight font-mono">
                {totalContacts.toLocaleString()}
              </span>
              <span className="text-xs font-bold text-emerald-400 flex items-center bg-emerald-500/20 px-2 py-0.5 rounded-md">
                <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                +18.2%
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium mt-2">
              Total apeluri telefonice, mesaje WhatsApp & cereri de ofertă
            </p>
          </div>
        </div>
      </div>

      {/* Top Summary Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Views */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3 relative overflow-hidden group hover:border-emerald-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Vizualizări
            </span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl group-hover:scale-110 transition">
              <Eye className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-slate-900 tracking-tight font-mono">
              {totalViews.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-emerald-600 flex items-center bg-emerald-50 px-2 py-0.5 rounded-md">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              +24.5%
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">Afișări în căutări & hartă GPS ({dateRange.label})</p>
        </div>

        {/* Metric 2: Contacts */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3 relative overflow-hidden group hover:border-amber-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Contacte & Lead-uri
            </span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl group-hover:scale-110 transition">
              <Phone className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-slate-900 tracking-tight font-mono">
              {totalContacts.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-amber-600 flex items-center bg-amber-50 px-2 py-0.5 rounded-md">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              +18.2%
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">Apeluri, WhatsApp & Cereri Ofertă</p>
        </div>

        {/* Metric 3: Conversion Rate */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3 relative overflow-hidden group hover:border-indigo-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Rată de Conversie
            </span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl group-hover:scale-110 transition">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-slate-900 tracking-tight font-mono">
              {avgConversionRate}%
            </span>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
              Excelent
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">Procentaj vizitatori care te contactează</p>
        </div>

        {/* Metric 4: Boosted Ads Health */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3 relative overflow-hidden group hover:border-orange-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Anunțuri Promovate
            </span>
            <div className="p-2 bg-orange-50 text-orange-600 rounded-xl group-hover:scale-110 transition">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-slate-900 tracking-tight font-mono">
              {boostedCount} / {ads.length}
            </span>
            <span className="text-xs font-bold text-orange-700 bg-orange-100 px-2 py-0.5 rounded-md flex items-center space-x-1">
              <Sparkles className="w-3 h-3 fill-current" />
              <span>VIP Active</span>
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">Până la +350% mai multe vizualizări</p>
        </div>
      </div>

      {/* Main Interactive Recharts Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                Evoluția Vizualizărilor & Contactelor
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Grafic comparativ al traficului generat în intervalul selectat ({formatRoDate(dateRange.startDate)} – {formatRoDate(dateRange.endDate)})
            </p>
          </div>

          {/* Controls & Filters Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Ad Selector */}
            <div className="flex items-center bg-slate-100 px-3 py-1.5 rounded-2xl text-xs font-bold text-slate-700 border border-slate-200 shadow-2xs">
              <Filter className="w-3.5 h-3.5 mr-1.5 text-slate-500 shrink-0" />
              <select
                value={selectedAdId}
                onChange={(e) => setSelectedAdId(e.target.value)}
                className="bg-transparent outline-none cursor-pointer pr-1"
              >
                <option value="all">Toate Anunțurile ({ads.length})</option>
                {ads.map((ad) => (
                  <option key={ad.id} value={ad.id}>
                    {ad.title.length > 30 ? ad.title.substring(0, 30) + '...' : ad.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range Picker Component */}
            <DateRangePicker
              value={dateRange}
              onChange={setDateRange}
            />

            {/* Quick 1-click Preset Pills */}
            <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold shadow-2xs">
              <button
                type="button"
                onClick={() => setDateRange(getPresetDateRange('7d'))}
                className={`px-2.5 py-1 rounded-xl transition cursor-pointer ${
                  dateRange.preset === '7d'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Ultimele 7 Zile"
              >
                7Z
              </button>
              <button
                type="button"
                onClick={() => setDateRange(getPresetDateRange('30d'))}
                className={`px-2.5 py-1 rounded-xl transition cursor-pointer ${
                  dateRange.preset === '30d'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Ultimele 30 Zile"
              >
                30Z
              </button>
              <button
                type="button"
                onClick={() => setDateRange(getPresetDateRange('90d'))}
                className={`px-2.5 py-1 rounded-xl transition cursor-pointer ${
                  dateRange.preset === '90d'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Ultimele 90 Zile"
              >
                90Z
              </button>
            </div>

            {/* Area vs Bar Toggle */}
            <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold shadow-2xs">
              <button
                onClick={() => setChartType('area')}
                className={`px-2.5 py-1 rounded-xl transition cursor-pointer ${
                  chartType === 'area'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Gradient
              </button>
              <button
                onClick={() => setChartType('bar')}
                className={`px-2.5 py-1 rounded-xl transition cursor-pointer ${
                  chartType === 'bar'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Bare
              </button>
            </div>

            {/* Export Actions (CSV & PDF) */}
            <div className="flex items-center space-x-2 pl-1 border-l border-slate-200">
              <button
                onClick={handleExportCSV}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-xs transition flex items-center space-x-1.5 cursor-pointer active:scale-95"
                title="Descarcă rapoartele în format CSV (Excel)"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                <span>Export CSV</span>
              </button>

              <button
                onClick={handleExportPDF}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-xs transition flex items-center space-x-1.5 cursor-pointer active:scale-95"
                title="Generează / Imprimă Raport PDF"
              >
                <Printer className="w-3.5 h-3.5 text-white" />
                <span>Raport PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* Export Notification Toast */}
        {exportStatus && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-900 font-extrabold text-xs rounded-2xl flex items-center justify-between animate-fadeIn">
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{exportStatus}</span>
            </div>
            <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md font-mono">
              Descărcare completă
            </span>
          </div>
        )}

        {/* Recharts Main Graph Container */}
        <div className="h-80 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorVizualizari" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorContacte" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="date"
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#e2e8f0' }}
              />
              <YAxis
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#e2e8f0' }}
              />

              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const viz = payload.find((p) => p.dataKey === 'vizualizari')?.value || 0;
                    const cont = payload.find((p) => p.dataKey === 'contacte')?.value || 0;
                    const rate = viz > 0 ? (((cont as number) / (viz as number)) * 100).toFixed(1) : 0;

                    return (
                      <div className="bg-slate-900 text-white p-3.5 rounded-2xl shadow-xl border border-slate-700 text-xs space-y-2">
                        <p className="font-extrabold text-amber-300 border-b border-slate-700 pb-1 flex items-center justify-between">
                          <span>📅 Data: {label}</span>
                          <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md">
                            Rată: {rate}%
                          </span>
                        </p>
                        <div className="space-y-1 font-medium">
                          <p className="flex items-center justify-between space-x-4">
                            <span className="text-emerald-400 flex items-center">
                              <Eye className="w-3.5 h-3.5 mr-1" />
                              Vizualizări
                            </span>
                            <span className="font-bold font-mono">{viz}</span>
                          </p>
                          <p className="flex items-center justify-between space-x-4">
                            <span className="text-amber-400 flex items-center">
                              <Phone className="w-3.5 h-3.5 mr-1" />
                              Contacte Totale
                            </span>
                            <span className="font-bold font-mono">{cont}</span>
                          </p>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              <Legend
                wrapperStyle={{ paddingTop: '12px', fontSize: '12px', fontWeight: 'bold' }}
                formatter={(value) => {
                  if (value === 'vizualizari') return 'Vizualizări Anunțuri';
                  if (value === 'contacte') return 'Contacte & Solicitări (Apeluri/Mesaje)';
                  return value;
                }}
              />

              {chartType === 'area' ? (
                <>
                  <Area
                    type="monotone"
                    dataKey="vizualizari"
                    stroke="#10b981"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorVizualizari)"
                  />
                  <Line
                    type="monotone"
                    dataKey="contacte"
                    stroke="#f59e0b"
                    strokeWidth={3}
                    dot={{ fill: '#f59e0b', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </>
              ) : (
                <>
                  <Bar dataKey="vizualizari" fill="#10b981" radius={[8, 8, 0, 0]} barSize={24} />
                  <Bar dataKey="contacte" fill="#f59e0b" radius={[8, 8, 0, 0]} barSize={16} />
                </>
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Secondary Charts & Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Secondary Chart 1: Distribution of Contact Types */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-black text-slate-900">Distribuție Canale de Contact</h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Cum preferă clienții să te contacteze
              </p>
            </div>
            <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-[10px] font-black rounded-lg border border-blue-200">
              Analiză Conversie
            </span>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={contactChannelsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {contactChannelsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0];
                      return (
                        <div className="bg-slate-900 text-white p-2.5 rounded-xl text-xs font-bold shadow-lg">
                          <p style={{ color: data.payload.color }}>{data.name}</p>
                          <p className="text-slate-300 font-mono mt-0.5">{data.value} solicitări</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100">
            {contactChannelsData.map((item) => (
              <div key={item.name} className="text-center p-2 bg-slate-50 rounded-2xl border border-slate-100">
                <div
                  className="w-2.5 h-2.5 rounded-full mx-auto mb-1"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-[10px] font-bold text-slate-600 block truncate">{item.name}</span>
                <span className="text-xs font-black text-slate-900 font-mono">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Secondary Chart 2: Per-Ad Performance Comparison */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-black text-slate-900">Comparație Performanță per Anunț</h3>
              <p className="text-[11px] text-slate-500 font-medium">Vizualizări vs Contacte generate</p>
            </div>
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black rounded-lg border border-emerald-200">
              Clasament Top
            </span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={adsComparisonData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" fontSize={10} stroke="#64748b" />
                <YAxis dataKey="shortTitle" type="category" fontSize={10} stroke="#64748b" width={110} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-slate-900 text-white p-2.5 rounded-xl text-xs font-bold shadow-lg space-y-1">
                          <p className="text-amber-300">{payload[0]?.payload?.shortTitle}</p>
                          <p className="text-emerald-400">Vizualizări: {payload[0]?.value}</p>
                          <p className="text-amber-400">Contacte: {payload[1]?.value}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="vizualizari" fill="#10b981" radius={[0, 6, 6, 0]} barSize={12} />
                <Bar dataKey="contacte" fill="#f59e0b" radius={[0, 6, 6, 0]} barSize={8} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-2xl flex items-center space-x-3 text-xs text-amber-900 font-medium">
            <Sparkles className="w-5 h-5 text-amber-600 shrink-0" />
            <p>
              Anunțul <strong className="font-black">Curățenie Profesională</strong> generează 52% din totalul apelurilor tale! Adăugarea etichetei PROMO-VIP îi triplează conversia.
            </p>
          </div>
        </div>
      </div>

      {/* Individual Ads Management Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                Anunțurile Mele
              </h2>
              <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-mono font-extrabold rounded-full">
                {filteredAds.length} din {ads.length}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Filtrează și sortează anunțurile după status, trafic și rata de conversie
            </p>
          </div>

          {/* Search, Status & Performance Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Caută în anunțuri..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-2 bg-slate-50 border border-slate-200/90 rounded-2xl text-xs font-medium text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500 w-44 sm:w-52 shadow-2xs"
              />
            </div>

            {/* Status Dropdown */}
            <div className="relative">
              <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200/90 px-3 py-2 rounded-2xl text-xs font-bold text-slate-700 shadow-2xs hover:border-slate-300 transition">
                <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="text-slate-400 font-normal">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="bg-transparent text-slate-900 font-extrabold outline-none cursor-pointer pr-1"
                >
                  <option value="all">Toate Statusurile</option>
                  <option value="active">🟢 Active Online (Active)</option>
                  <option value="pending_review">⏳ În Verificare (Pending Review)</option>
                  <option value="expired">🔴 Expirate (Expired)</option>
                  <option value="boosted">⚡ Promovate (VIP Boosted)</option>
                  <option value="expiring">⚠️ Expiră Curând (≤ 5 Zile)</option>
                  <option value="paused">⏸️ În Pauză (Paused)</option>
                </select>
              </div>
            </div>

            {/* Performance / Sort Dropdown */}
            <div className="relative">
              <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200/90 px-3 py-2 rounded-2xl text-xs font-bold text-slate-700 shadow-2xs hover:border-slate-300 transition">
                <ArrowUpDown className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span className="text-slate-400 font-normal">Performanță:</span>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as any)}
                  className="bg-transparent text-slate-900 font-extrabold outline-none cursor-pointer pr-1"
                >
                  <option value="views-desc">🔥 Cele mai vizionate (Top Vizualizări)</option>
                  <option value="views-asc">Vizualizări (Crescător)</option>
                  <option value="contacts-desc">📞 Top Contacte / Click-uri</option>
                  <option value="contacts-asc">Contacte (Crescător)</option>
                  <option value="rate-desc">📈 Rată Conversie (% Top)</option>
                  <option value="recent">📅 Publicate recent</option>
                </select>
              </div>
            </div>

            {/* Export Ads List CSV Button */}
            <button
              onClick={handleExportAdsCSV}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-2xl shadow-xs transition flex items-center space-x-1.5 cursor-pointer active:scale-95 shrink-0"
              title="Descarcă datele anunțurilor în format CSV pentru analiză offline"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-200" />
              <span>Export Anunțuri CSV</span>
            </button>

            {/* Reset Filters button */}
            {(statusFilter !== 'all' || sortOption !== 'views-desc' || searchQuery !== '') && (
              <button
                onClick={() => {
                  setStatusFilter('all');
                  setSortOption('views-desc');
                  setSearchQuery('');
                }}
                className="px-2.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-2xl text-xs font-bold transition flex items-center space-x-1 cursor-pointer"
                title="Resetează toate filtrele"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Ads Cards List */}
        <div className="grid grid-cols-1 gap-4">
          {filteredAds.length === 0 ? (
            <div className="p-8 bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-center space-y-2">
              <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-sm font-extrabold text-slate-800">Nu a fost găsit niciun anunț pentru filtrele selectate.</p>
              <button
                onClick={() => {
                  setStatusFilter('all');
                  setSortOption('views-desc');
                  setSearchQuery('');
                }}
                className="text-xs text-emerald-600 font-extrabold hover:underline cursor-pointer"
              >
                Resetează căutarea și filtrele
              </button>
            </div>
          ) : (
            filteredAds.map((ad) => {
              const isBoosted = ad.status === 'boosted';
              const isPaused = ad.status === 'paused';
              const isExpiringSoon = ad.expiresInDays !== undefined && ad.expiresInDays <= 5;

              return (
                <div
                  key={ad.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    isBoosted
                      ? 'bg-gradient-to-r from-amber-500/5 via-orange-500/5 to-transparent border-amber-300 shadow-xs'
                      : isPaused
                      ? 'bg-slate-50/80 border-slate-200 opacity-75'
                      : 'bg-white hover:bg-slate-50/50 border-slate-200'
                  }`}
                >
                  {/* Left: Thumbnail & Info */}
                  <div className="flex items-start space-x-3.5 min-w-0">
                    <div className="relative shrink-0">
                      <img
                        src={ad.image || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=300&q=80'}
                        alt={ad.title}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-slate-200 shadow-xs"
                      />
                      {isBoosted && (
                        <span className="absolute -top-2 -right-2 p-1 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 rounded-full shadow-md">
                          <Zap className="w-3.5 h-3.5 fill-current" />
                        </span>
                      )}
                    </div>

                    <div className="space-y-1.5 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded-md">
                          {ad.category}
                        </span>
                        {ad.packageType && (
                          <span
                            className={`px-2 py-0.5 font-black text-[10px] rounded-md ${
                              isBoosted
                                ? 'bg-amber-400 text-slate-950 shadow-xs'
                                : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {ad.packageType}
                          </span>
                        )}
                        {ad.status === 'pending_review' ? (
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-800 border border-amber-300/80 font-extrabold text-[10px] rounded-md">
                            ⏳ În verificare
                          </span>
                        ) : ad.status === 'expired' ? (
                          <span className="px-2 py-0.5 bg-rose-100 text-rose-800 border border-rose-300/80 font-extrabold text-[10px] rounded-md">
                            🔴 Expirat
                          </span>
                        ) : (
                          <span
                            className={`px-2 py-0.5 font-bold text-[10px] rounded-md ${
                              isPaused
                                ? 'bg-slate-200 text-slate-600'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {isPaused ? 'În Pauză' : 'Activ online'}
                          </span>
                        )}

                        {isExpiringSoon && (
                          <span className="px-2 py-0.5 bg-rose-100 text-rose-800 border border-rose-200 font-extrabold text-[10px] rounded-md flex items-center space-x-1 animate-pulse">
                            <Clock className="w-3 h-3 text-rose-600" />
                            <span>Expiră în {ad.expiresInDays} {ad.expiresInDays === 1 ? 'zi' : 'zile'}</span>
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm sm:text-base font-extrabold text-slate-900 truncate">
                        {ad.title}
                      </h3>

                      <p className="text-xs text-slate-500 font-medium">
                        Preț: <strong className="text-slate-800">{ad.price}</strong> • Publicat pe {ad.publishedDate}
                      </p>
                    </div>
                  </div>

                {/* Middle: Performance Metrics Badge */}
                <div className="flex items-center space-x-4 bg-slate-100/80 p-3 rounded-2xl border border-slate-200/80 shrink-0">
                  <div className="text-center px-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Vizualizări</span>
                    <span className="text-base font-black text-slate-900 font-mono">{ad.viewsCount}</span>
                  </div>

                  <div className="h-8 w-px bg-slate-300" />

                  <div className="text-center px-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Contacte</span>
                    <span className="text-base font-black text-emerald-700 font-mono">{ad.contactsCount}</span>
                  </div>

                  <div className="h-8 w-px bg-slate-300" />

                  <div className="text-center px-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Rată Conv.</span>
                    <span className="text-base font-black text-amber-700 font-mono">{ad.conversionRate}%</span>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => onOpenPublishAdModal(ad.packageType ? 'promo-vip' : 'standard')}
                    className="px-3 py-2 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-slate-950 font-black text-xs rounded-xl shadow-xs transition flex items-center space-x-1"
                  >
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    <span>Boost</span>
                  </button>

                  <button
                    onClick={() => toggleAdStatus(ad.id)}
                    className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition"
                    title={isPaused ? 'Activează Anunțul' : 'Pune în Pauză'}
                  >
                    {isPaused ? <Play className="w-4 h-4 text-emerald-600" /> : <Pause className="w-4 h-4 text-slate-600" />}
                  </button>

                  {onShareAd && (
                    <button
                      onClick={() => onShareAd(ad.title)}
                      className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition"
                      title="Distribuie Anunțul"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          }))}
        </div>
      </div>
    </div>
  );
};
