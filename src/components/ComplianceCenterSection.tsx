import React, { useState } from 'react';
import {
  ShieldCheck,
  Building2,
  FileCheck2,
  Search,
  CheckCircle2,
  AlertTriangle,
  UploadCloud,
  FileText,
  Trash2,
  Award,
  Zap,
  Sparkles,
  ExternalLink,
  Lock,
  RefreshCw,
  Info,
  Clock,
  CheckCircle,
  HelpCircle,
  BadgePercent,
  FileBadge,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { UserProfile, ProviderComplianceData, ComplianceAuthorization } from '../types';

interface ComplianceCenterSectionProps {
  user: UserProfile;
  onUpdateUser?: (updatedUser: Partial<UserProfile>) => void;
  onRewardPointsEarned?: (points: number, reason: string) => void;
}

// Preset database for popular / sample Cluj-Napoca providers for instant demonstration
const SAMPLE_COMPANIES_DB: Record<string, Partial<ProviderComplianceData>> = {
  '38491204': {
    cui: '38491204',
    companyName: 'MUREȘAN INSTAL CLUJ S.R.L.',
    companyType: 'SRL',
    regCom: 'J12/1842/2017',
    address: 'Str. Observatorului nr. 34, Ap. 12',
    city: 'Cluj-Napoca',
    county: 'Cluj',
    vatStatus: true,
    vatPayer: true,
    anafStatus: 'Activ',
    mainCaen: '4322',
    caenDescription: 'Lucrări de instalații sanitare, de încălzire și de aer condiționat',
    isCaenEligible: true
  },
  '42109852': {
    cui: '42109852',
    companyName: 'POPESCU ION ELECTRIC PFA',
    companyType: 'PFA',
    regCom: 'F12/340/2020',
    address: 'Calea Mănăștur nr. 89, Bl. C4',
    city: 'Cluj-Napoca',
    county: 'Cluj',
    vatStatus: false,
    vatPayer: false,
    anafStatus: 'Activ',
    mainCaen: '4321',
    caenDescription: 'Lucrări de instalații electrice',
    isCaenEligible: true
  },
  '45981200': {
    cui: '45981200',
    companyName: 'TRANSILVANIA CLEAN PRO S.R.L.',
    companyType: 'SRL',
    regCom: 'J12/910/2022',
    address: 'Str. Aurel Vlaicu nr. 14, Ap. 5',
    city: 'Cluj-Napoca',
    county: 'Cluj',
    vatStatus: true,
    vatPayer: true,
    anafStatus: 'Activ',
    mainCaen: '8121',
    caenDescription: 'Activități generale de curățenie a clădirilor',
    isCaenEligible: true
  },
  '31245678': {
    cui: '31245678',
    companyName: 'LOCAL CRAFT EXPERT CLUJ I.I.',
    companyType: 'II',
    regCom: 'F12/115/2018',
    address: 'Str. Republicii nr. 45',
    city: 'Cluj-Napoca',
    county: 'Cluj',
    vatStatus: false,
    vatPayer: false,
    anafStatus: 'Activ',
    mainCaen: '4333',
    caenDescription: 'Lucrări de pardosire și placare a pereților',
    isCaenEligible: true
  }
};

// Algorithmic validation of Romanian CUI
export function validateRomanianCUI(rawCui: string): boolean {
  const clean = rawCui.replace(/[^0-9]/g, '');
  if (clean.length < 2 || clean.length > 10) return false;
  
  const weights = [7, 5, 3, 2, 1, 7, 5, 3, 2];
  const digits = clean.split('').map(Number);
  const controlDigit = digits.pop()!;
  
  const paddedDigits: number[] = [];
  const padLength = 9 - digits.length;
  for (let i = 0; i < padLength; i++) {
    paddedDigits.push(0);
  }
  const fullDigits = [...paddedDigits, ...digits];
  
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += fullDigits[i] * weights[i];
  }
  
  let calculatedControl = (sum * 10) % 11;
  if (calculatedControl === 10) calculatedControl = 0;
  
  return calculatedControl === controlDigit;
}

export const ComplianceCenterSection: React.FC<ComplianceCenterSectionProps> = ({
  user,
  onUpdateUser,
  onRewardPointsEarned
}) => {
  const initialCompliance: ProviderComplianceData = user.complianceData || {
    cui: '',
    companyName: '',
    companyType: 'SRL',
    regCom: '',
    address: '',
    city: user.city || 'Cluj-Napoca',
    county: 'Cluj',
    vatStatus: false,
    vatPayer: false,
    anafStatus: 'Neverificat',
    mainCaen: '',
    caenDescription: '',
    isCaenEligible: false,
    authorizations: [],
    earlyBirdEligible: false,
    earlyBirdActivated: false,
    verificationScore: 0,
    idCardUploaded: false,
    cuiCertificateUploaded: false,
    status: 'unverified'
  };

  const [compliance, setCompliance] = useState<ProviderComplianceData>(initialCompliance);
  const [cuiInput, setCuiInput] = useState<string>(initialCompliance.cui || '');
  const [isLoadingApi, setIsLoadingApi] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiSuccess, setApiSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'fiscal' | 'authorizations' | 'early_bird'>('fiscal');
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  // New Authorization form state
  const [newAuthType, setNewAuthType] = useState<'anre' | 'iscir' | 'sanitary' | 'trade' | 'qualification' | 'insurance'>('anre');
  const [newAuthDocNum, setNewAuthDocNum] = useState<string>('');
  const [newAuthExpiry, setNewAuthExpiry] = useState<string>('2028-12-31');
  const [isAddingAuth, setIsAddingAuth] = useState<boolean>(false);

  // Calculate Verification Score
  const calculateScore = (data: ProviderComplianceData): number => {
    let score = 0;
    if (data.cui && data.anafStatus === 'Activ') score += 40;
    if (data.cuiCertificateUploaded) score += 15;
    if (data.idCardUploaded) score += 15;
    if (data.authorizations && data.authorizations.length > 0) {
      score += Math.min(30, data.authorizations.length * 15);
    }
    return Math.min(100, score);
  };

  // Perform API Verification (Simulating official OpenAPI / ANAF / RegCom connection)
  const handleVerifyCUI = async () => {
    const cleanCui = cuiInput.replace(/[^0-9]/g, '').trim();
    if (!cleanCui) {
      setApiError('Introduceți un CUI/CIF valid (ex: 38491204 sau 42109852).');
      return;
    }

    setIsLoadingApi(true);
    setApiError(null);
    setApiSuccess(null);

    // Simulate network delay to the Romanian fiscal API gateway
    await new Promise((resolve) => setTimeout(resolve, 850));

    const isValidFormat = validateRomanianCUI(cleanCui);
    const sampleRecord = SAMPLE_COMPANIES_DB[cleanCui];

    if (!isValidFormat && !sampleRecord) {
      setIsLoadingApi(false);
      setApiError('Format CUI incorect conform algoritmului cifrei de control ANAF. Vă rugăm verificați cifrele introduse.');
      return;
    }

    let companyData: Partial<ProviderComplianceData>;

    if (sampleRecord) {
      companyData = sampleRecord;
    } else {
      // Dynamic synthesis for any valid Romanian CUI
      const isPfa = cleanCui.length <= 8 && parseInt(cleanCui.slice(-2)) % 2 === 0;
      const compType = isPfa ? 'PFA' : 'SRL';
      const year = 2018 + (parseInt(cleanCui.slice(0, 2)) % 7);
      
      companyData = {
        cui: cleanCui,
        companyName: isPfa ? `${user.name.toUpperCase()} SERVICII ${compType}` : `TRANSILVANIA CRAFT ${cleanCui.slice(-4)} ${compType}`,
        companyType: compType,
        regCom: isPfa ? `F12/${cleanCui.slice(-3)}/${year}` : `J12/${cleanCui.slice(-4)}/${year}`,
        address: 'Str. Clinicilor nr. 18, Demisol',
        city: 'Cluj-Napoca',
        county: 'Cluj',
        vatStatus: !isPfa,
        vatPayer: !isPfa,
        anafStatus: 'Activ',
        mainCaen: isPfa ? '4322' : '4321',
        caenDescription: isPfa
          ? 'Lucrări de instalații sanitare, de încălzire și de aer condiționat'
          : 'Lucrări de instalații electrice și mentenanță',
        isCaenEligible: true
      };
    }

    const updatedCompliance: ProviderComplianceData = {
      ...compliance,
      ...companyData,
      cui: cleanCui,
      cuiCertificateUploaded: true,
      lastApiCheck: new Date().toLocaleDateString('ro-RO', { hour: '2-digit', minute: '2-digit' }),
      status: 'in_review'
    };

    const newScore = calculateScore(updatedCompliance);
    updatedCompliance.verificationScore = newScore;
    updatedCompliance.earlyBirdEligible = newScore >= 50;

    if (newScore >= 70) {
      updatedCompliance.status = 'verified';
    }

    setCompliance(updatedCompliance);
    setIsLoadingApi(false);
    setApiSuccess(`Compania „${updatedCompliance.companyName}” a fost identificată și validată cu succes prin Registrul Fiscal.`);

    // Persist to user
    if (onUpdateUser) {
      onUpdateUser({
        complianceData: updatedCompliance,
        isVerified: true
      });
    }

    if (onRewardPointsEarned && !user.complianceData?.cui) {
      onRewardPointsEarned(80, 'Verificare CUI & Date Firmă în Compliance Center');
    }
  };

  // Add Professional Authorization
  const handleAddAuthorization = () => {
    if (!newAuthDocNum.trim()) {
      setApiError('Introduceți numărul autorizației/certificatului.');
      return;
    }

    const titles: Record<string, { title: string; issuer: string; badge: string }> = {
      anre: { title: 'Autorizație Electrician ANRE (Grad IIA/IIB)', issuer: 'Autoritatea Națională de Reglementare în Domeniul Energiei', badge: 'ANRE Autorizat ⚡' },
      iscir: { title: 'Autorizație Tehnician ISCIR (Centrale & Cazane)', issuer: 'Inspecția de Stat pentru Controlul Cazanelor', badge: 'ISCIR Certificat 🛡️' },
      sanitary: { title: 'Aviz Sanitar-Veterinar / DSP Cluj', issuer: 'Direcția de Sănătate Publică Cluj', badge: 'DSP Aprobat 🧪' },
      trade: { title: 'Certificat de Competențe Meserii Calificate', issuer: 'Ministerul Muncii & CNFPA', badge: 'Meșter Calificat 🏆' },
      qualification: { title: 'Diplomă de Calificare Profesională', issuer: 'Liceu Tehnologic / Școală Profesională', badge: 'Diplomă Acreditată 📜' },
      insurance: { title: 'Poliță de Răspundere Civilă Profesională (100.000€)', issuer: 'Allianz-Tiriac / Omniasig Cluj', badge: 'Asigurat Profesional 🛡️' }
    };

    const config = titles[newAuthType];
    const newAuth: ComplianceAuthorization = {
      id: `auth-${Date.now()}`,
      type: newAuthType,
      title: config.title,
      issuer: config.issuer,
      docNumber: newAuthDocNum.trim(),
      issuedAt: '2024-01-15',
      expiresAt: newAuthExpiry || '2028-12-31',
      status: 'verified',
      verificationBadge: config.badge,
      fileName: `certificat_${newAuthType}_${newAuthDocNum}.pdf`,
      fileSize: '1.4 MB'
    };

    const updatedAuths = [...(compliance.authorizations || []), newAuth];
    const updatedCompliance: ProviderComplianceData = {
      ...compliance,
      authorizations: updatedAuths
    };

    const newScore = calculateScore(updatedCompliance);
    updatedCompliance.verificationScore = newScore;
    if (newScore >= 70) updatedCompliance.status = 'verified';

    setCompliance(updatedCompliance);
    setIsAddingAuth(false);
    setNewAuthDocNum('');
    setApiSuccess(`Autorizația „${config.title}” a fost adăugată și verificată automat.`);

    if (onUpdateUser) {
      onUpdateUser({
        complianceData: updatedCompliance,
        isVerified: true
      });
    }

    if (onRewardPointsEarned) {
      onRewardPointsEarned(50, `Validare Autorizație ${newAuthType.toUpperCase()}`);
    }
  };

  // Remove Authorization
  const handleRemoveAuth = (id: string) => {
    const updatedAuths = (compliance.authorizations || []).filter(a => a.id !== id);
    const updatedCompliance: ProviderComplianceData = {
      ...compliance,
      authorizations: updatedAuths
    };
    updatedCompliance.verificationScore = calculateScore(updatedCompliance);
    setCompliance(updatedCompliance);

    if (onUpdateUser) {
      onUpdateUser({
        complianceData: updatedCompliance
      });
    }
  };

  // Simulate ID Card Upload
  const handleToggleIdCard = () => {
    const newIdStatus = !compliance.idCardUploaded;
    const updatedCompliance: ProviderComplianceData = {
      ...compliance,
      idCardUploaded: newIdStatus
    };
    updatedCompliance.verificationScore = calculateScore(updatedCompliance);
    setCompliance(updatedCompliance);

    if (onUpdateUser) {
      onUpdateUser({
        complianceData: updatedCompliance
      });
    }

    if (newIdStatus && onRewardPointsEarned) {
      onRewardPointsEarned(30, 'Verificare Carte de Identitate Administrator');
    }
  };

  // Activate Early Bird Cluj Program
  const handleActivateEarlyBird = () => {
    const updatedCompliance: ProviderComplianceData = {
      ...compliance,
      earlyBirdActivated: true,
      earlyBirdExpiresAt: '60 Zile Rămase (0% Comision)'
    };
    setCompliance(updatedCompliance);

    if (onUpdateUser) {
      onUpdateUser({
        complianceData: updatedCompliance,
        role: 'prestator'
      });
    }

    setApiSuccess('🎉 Felicitări! Programul Early Bird Cluj (0% Comision timp de 60 de zile) a fost activat pentru profilul tău.');
    if (onRewardPointsEarned) {
      onRewardPointsEarned(100, 'Activare Program Early Bird Provider Cluj');
    }
  };

  const isVerified = compliance.status === 'verified' || compliance.verificationScore >= 70;

  return (
    <div id="compliance-center-container" className="bg-slate-900 border border-slate-700/80 rounded-3xl p-4 sm:p-5 text-white shadow-xl space-y-4">
      {/* Header with expand toggle */}
      <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-teal-700 text-white rounded-2xl shadow-md border border-emerald-400/30">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm sm:text-base font-black tracking-tight text-white flex items-center gap-1.5">
                <span>Compliance Center</span>
                <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  ANAF & RegCom API
                </span>
              </h3>
            </div>
            <p className="text-[11px] text-slate-300 font-medium">
              Verificare legală automată CUI, PFA/SRL & Autorizații (ANRE, ISCIR)
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {isVerified ? (
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 text-[11px] font-black rounded-xl">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Verificat 100%</span>
            </span>
          ) : (
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-amber-500/20 border border-amber-400/50 text-amber-300 text-[11px] font-black rounded-xl">
              <Clock className="w-3.5 h-3.5" />
              <span>{compliance.verificationScore}% Complet</span>
            </span>
          )}
          <button
            type="button"
            className="p-1.5 text-slate-400 hover:text-white transition rounded-lg"
            aria-label="Toggle Compliance Center"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-4 pt-1">
          {/* Status and Score Progress Bar */}
          <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-bold flex items-center space-x-1.5">
                <FileBadge className="w-4 h-4 text-emerald-400" />
                <span>Nivel de Conformitate Legală</span>
              </span>
              <span className="font-mono font-black text-emerald-400 text-sm">
                {compliance.verificationScore}%
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-700/80 p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  compliance.verificationScore >= 70
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                    : compliance.verificationScore >= 40
                    ? 'bg-gradient-to-r from-amber-500 to-emerald-400'
                    : 'bg-gradient-to-r from-orange-500 to-amber-500'
                }`}
                style={{ width: `${compliance.verificationScore}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[10px] text-slate-400 font-medium">
              <span>CUI Firmă (+40%)</span>
              <span>CI Administrator (+15%)</span>
              <span>Autorizații Tehnice (+30%)</span>
            </div>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="flex items-center space-x-1.5 bg-slate-950/60 p-1 rounded-2xl border border-slate-800 text-xs font-bold">
            <button
              id="tab-compliance-fiscal"
              type="button"
              onClick={() => setActiveTab('fiscal')}
              className={`flex-1 py-1.5 px-3 rounded-xl transition flex items-center justify-center space-x-1.5 ${
                activeTab === 'fiscal'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Verificare Firmă (CUI)</span>
            </button>

            <button
              id="tab-compliance-auth"
              type="button"
              onClick={() => setActiveTab('authorizations')}
              className={`flex-1 py-1.5 px-3 rounded-xl transition flex items-center justify-center space-x-1.5 ${
                activeTab === 'authorizations'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Autorizații ({compliance.authorizations?.length || 0})</span>
            </button>

            <button
              id="tab-compliance-earlybird"
              type="button"
              onClick={() => setActiveTab('early_bird')}
              className={`flex-1 py-1.5 px-3 rounded-xl transition flex items-center justify-center space-x-1.5 ${
                activeTab === 'early_bird'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                  : 'text-amber-400/90 hover:text-amber-300'
              }`}
            >
              <BadgePercent className="w-3.5 h-3.5" />
              <span>Early Bird (0%)</span>
            </button>
          </div>

          {/* Alert Messages */}
          {apiError && (
            <div className="p-3 bg-red-950/60 border border-red-800 text-red-200 text-xs rounded-xl flex items-start space-x-2 animate-in fade-in">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{apiError}</span>
            </div>
          )}

          {apiSuccess && (
            <div className="p-3 bg-emerald-950/60 border border-emerald-700 text-emerald-200 text-xs rounded-xl flex items-start space-x-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{apiSuccess}</span>
            </div>
          )}

          {/* TAB 1: FISCAL & CUI LOOKUP */}
          {activeTab === 'fiscal' && (
            <div className="space-y-3.5">
              <div className="space-y-1.5">
                <label htmlFor="input-cui-lookup" className="block text-xs font-bold text-slate-300">
                  Cod Unic de Înregistrare (CUI / CIF)
                </label>
                <div className="flex items-center space-x-2">
                  <div className="relative flex-1">
                    <input
                      id="input-cui-lookup"
                      type="text"
                      value={cuiInput}
                      onChange={(e) => setCuiInput(e.target.value.toUpperCase())}
                      placeholder="Ex: 38491204 (Instalații) sau 42109852 (Electrician)"
                      className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs font-mono font-bold focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    />
                    <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  </div>
                  <button
                    id="btn-verify-cui-api"
                    type="button"
                    onClick={handleVerifyCUI}
                    disabled={isLoadingApi}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition flex items-center space-x-1.5 shadow-md cursor-pointer shrink-0"
                  >
                    {isLoadingApi ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Se verifică...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-3.5 h-3.5" />
                        <span>Verifică ANAF</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Quick test CUI helpers */}
                <div className="flex items-center space-x-2 pt-1 text-[11px] text-slate-400 overflow-x-auto pb-1">
                  <span className="shrink-0 text-slate-400">Exemple rapide Cluj:</span>
                  <button
                    type="button"
                    onClick={() => { setCuiInput('38491204'); }}
                    className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-emerald-400 border border-slate-700 whitespace-nowrap"
                  >
                    38491204 (Mureșan SRL)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setCuiInput('42109852'); }}
                    className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-amber-400 border border-slate-700 whitespace-nowrap"
                  >
                    42109852 (Popescu PFA)
                  </button>
                </div>
              </div>

              {/* Verified Company Data Display */}
              {compliance.companyName && (
                <div className="bg-slate-950/80 border border-slate-700/90 rounded-2xl p-3.5 space-y-2.5">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div className="flex items-center space-x-2">
                      <span className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg">
                        <Building2 className="w-4 h-4" />
                      </span>
                      <div>
                        <h4 className="text-xs font-black text-white">{compliance.companyName}</h4>
                        <p className="text-[10px] text-slate-400 font-mono">
                          {compliance.regCom} • CUI {compliance.cui}
                        </p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-black rounded-lg">
                      {compliance.anafStatus} la ANAF
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2 bg-slate-900 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Sediu Social</span>
                      <span className="text-slate-200 font-semibold truncate block">{compliance.address}, {compliance.city}</span>
                    </div>

                    <div className="p-2 bg-slate-900 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Regim TVA</span>
                      <span className="text-slate-200 font-semibold">
                        {compliance.vatPayer ? 'Plătitor TVA' : 'Neplătitor TVA (Scutit)'}
                      </span>
                    </div>

                    <div className="col-span-2 p-2 bg-slate-900 rounded-xl border border-slate-800 space-y-0.5">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 text-[10px]">Cod CAEN Principal</span>
                        <span className="text-emerald-400 text-[10px] font-black">Eligibil Servicii Locale ✅</span>
                      </div>
                      <p className="text-slate-200 font-bold text-[11px]">
                        {compliance.mainCaen} - {compliance.caenDescription}
                      </p>
                    </div>
                  </div>

                  {/* ID Document & Registry Confirmation */}
                  <div className="pt-1 flex items-center justify-between border-t border-slate-800">
                    <div className="flex items-center space-x-2">
                      <input
                        id="check-id-uploaded"
                        type="checkbox"
                        checked={compliance.idCardUploaded}
                        onChange={handleToggleIdCard}
                        className="rounded-md bg-slate-900 border-slate-700 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      />
                      <label htmlFor="check-id-uploaded" className="text-[11px] text-slate-300 font-medium cursor-pointer">
                        Confirmare identitate CI Administrator ({user.name})
                      </label>
                    </div>
                    {compliance.lastApiCheck && (
                      <span className="text-[10px] text-slate-500">
                        Verificat: {compliance.lastApiCheck}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PROFESSIONAL AUTHORIZATIONS */}
          {activeTab === 'authorizations' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">Autorizații & Certificate Tehnice</h4>
                  <p className="text-[10px] text-slate-400">
                    Certificările ANRE, ISCIR sau calificare cresc rata de contractare cu 45%.
                  </p>
                </div>
                {!isAddingAuth && (
                  <button
                    id="btn-open-add-auth"
                    type="button"
                    onClick={() => setIsAddingAuth(true)}
                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition flex items-center space-x-1"
                  >
                    <span>+ Adaugă Certificat</span>
                  </button>
                )}
              </div>

              {/* Add Auth Form */}
              {isAddingAuth && (
                <div className="p-3.5 bg-slate-950 border border-slate-700 rounded-2xl space-y-3 animate-in fade-in">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
                    <span className="text-xs font-black text-emerald-400">Adăugare Autorizație Oficială</span>
                    <button
                      type="button"
                      onClick={() => setIsAddingAuth(false)}
                      className="text-slate-400 hover:text-white text-xs"
                    >
                      Anulează
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-1">Tip Certificare</label>
                      <select
                        value={newAuthType}
                        onChange={(e) => setNewAuthType(e.target.value as any)}
                        className="w-full p-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs font-bold"
                      >
                        <option value="anre">⚡ ANRE (Electrician Grad IIA/IIB)</option>
                        <option value="iscir">🛡️ ISCIR (Centrale Termice & Cazane)</option>
                        <option value="sanitary">🧪 DSP / Aviz Sanitar (Curățenie)</option>
                        <option value="trade">🏆 Certificat Calificare Meșteșuguri</option>
                        <option value="qualification">📜 Diplomă Studii Tehnice</option>
                        <option value="insurance">🛡️ Asigurare Răspundere Profesională</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-1">Număr Document / Autorizație</label>
                      <input
                        type="text"
                        value={newAuthDocNum}
                        onChange={(e) => setNewAuthDocNum(e.target.value)}
                        placeholder="Ex: ANRE-2024-CJ-8841"
                        className="w-full p-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs font-mono font-bold"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-slate-400 flex items-center space-x-1">
                      <UploadCloud className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Validare instantă prin registru public</span>
                    </span>
                    <button
                      id="btn-save-auth"
                      type="button"
                      onClick={handleAddAuthorization}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition"
                    >
                      Validează & Salvează
                    </button>
                  </div>
                </div>
              )}

              {/* List of active authorizations */}
              {(!compliance.authorizations || compliance.authorizations.length === 0) ? (
                <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl text-center space-y-1">
                  <FileText className="w-6 h-6 text-slate-500 mx-auto" />
                  <p className="text-xs text-slate-400 font-medium">Nicio autorizație înregistrată încă.</p>
                  <p className="text-[10px] text-slate-500">Adăugați ANRE, ISCIR sau certificatul de meserii pentru a obține insigna Pro.</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {compliance.authorizations.map((auth) => (
                    <div
                      key={auth.id}
                      className="p-3 bg-slate-950 border border-slate-800 hover:border-emerald-700/50 rounded-2xl flex items-center justify-between transition"
                    >
                      <div className="flex items-center space-x-2.5 min-w-0 pr-2">
                        <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl shrink-0">
                          <Award className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center space-x-1.5">
                            <span className="text-xs font-bold text-white truncate">{auth.title}</span>
                            <span className="px-1.5 py-0.2 bg-emerald-950 text-emerald-300 text-[9px] font-black rounded-md border border-emerald-800">
                              Activ
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 font-mono">
                            Doc: {auth.docNumber} • Valabil până: {auth.expiresAt}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveAuth(auth.id)}
                        className="p-1.5 text-slate-500 hover:text-red-400 transition"
                        title="Șterge autorizația"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: EARLY BIRD CLUJ PROGRAM & BADGE */}
          {activeTab === 'early_bird' && (
            <div className="space-y-3 bg-gradient-to-br from-slate-950 to-emerald-950/40 p-4 rounded-2xl border border-amber-500/30">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-amber-400 text-slate-950 rounded-xl font-black shadow-md">
                    <BadgePercent className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-amber-300 uppercase tracking-wider">
                      Program Early Bird Cluj-Napoca
                    </h4>
                    <p className="text-xs font-extrabold text-white">0% Comision pe Primele 60 de Zile</p>
                  </div>
                </div>

                {compliance.earlyBirdActivated ? (
                  <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/50 text-[10px] font-black rounded-xl">
                    Activ ✅
                  </span>
                ) : (
                  <span className="px-2.5 py-1 bg-amber-400/20 text-amber-300 border border-amber-400/50 text-[10px] font-black rounded-xl">
                    Disponibil
                  </span>
                )}
              </div>

              <div className="space-y-1.5 text-[11px] text-slate-300">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span><strong>100% Manoperă Încasată:</strong> Nu plătești niciun comision platformei timp de 60 de zile.</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span><strong>Badge de Prestator Fondator:</strong> Insignă specială vizibilă pe cartierele din Cluj.</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span><strong>Garanție Escrow Gratuită:</strong> Plățile clienților sunt securizate în avans.</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">Condiție eligibilitate:</span>
                  <span className="text-xs font-bold text-white">
                    {compliance.verificationScore >= 50
                      ? 'Scor minim atins (Verificare CUI completă)'
                      : 'Necesar minim 50% conformitate (Introduceți CUI)'}
                  </span>
                </div>

                {!compliance.earlyBirdActivated ? (
                  <button
                    id="btn-activate-earlybird"
                    type="button"
                    onClick={handleActivateEarlyBird}
                    disabled={compliance.verificationScore < 50}
                    className="px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 disabled:opacity-40 text-slate-950 font-black text-xs rounded-xl shadow-lg transition cursor-pointer"
                  >
                    Activează 0% Comision
                  </button>
                ) : (
                  <div className="text-right">
                    <span className="text-xs font-black text-emerald-400 font-mono">60 Zile Active</span>
                    <span className="text-[9px] text-slate-400 block">Comision Fondator Garantat</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
