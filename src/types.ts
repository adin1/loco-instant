export interface Review {
  id: string;
  targetId: string;
  targetType: 'provider' | 'user' | 'product';
  targetName?: string;
  authorName: string;
  authorAvatar?: string;
  authorRole?: 'client' | 'prestator';
  rating: number;
  comment: string;
  createdAt: string;
  orderId?: string;
  serviceName?: string;
  isVerifiedEscrow?: boolean;
  tags?: string[];
  reply?: {
    authorName: string;
    comment: string;
    createdAt: string;
  };
}

export interface Provider {
  id: string;
  name: string;
  role: string;
  categorySlug: string;
  city: string;
  district?: string;
  rating: number;
  reviewsCount: number;
  isVerified: boolean;
  isPro: boolean;
  is247: boolean;
  isUrgentAvailable: boolean;
  price: string;
  priceNum: number;
  responseTime: string;
  image: string;
  phone: string;
  whatsapp: string;
  email: string;
  description: string;
  tags: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  reviews?: Review[];
}

export interface AdCategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
  providersCount: number;
  badge?: string;
  isPopular?: boolean;
  isUrgent?: boolean;
}

export interface MarketplaceProduct {
  id: string;
  name: string;
  producer: string;
  price: number;
  unit: string;
  city: string;
  category: string;
  image: string;
  description: string;
  inStock: boolean;
  badge?: string;
  rating: number;
  reviewsCount: number;
}

export interface PromotionPackage {
  id: string;
  code: string;
  name: string;
  price: number;
  durationDays: number;
  features: string[];
  color: string;
  popular?: boolean;
}

export interface QuoteRequest {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  city: string;
  serviceSlug: string;
  serviceName: string;
  details: string;
  consent: boolean;
  status: 'noua' | 'in_lucru' | 'oferte_primite' | 'acceptata' | 'finalizata';
  createdAt: string;
}

export interface OrderItem {
  id: string;
  providerId?: string;
  providerName: string;
  providerRole: string;
  providerImage: string;
  serviceName: string;
  amount: number;
  city: string;
  status: 'noua' | 'acceptata' | 'in_desfasurare' | 'finalizata' | 'anulata' | 'platita';
  date: string;
  escrowStatus: 'in_espera' | 'securizat' | 'eliberat' | 'restituit';
  chatHistory: { sender: 'client' | 'provider' | 'system'; text: string; time: string }[];
  hasReview?: boolean;
  reviewId?: string;
}

export interface DeliveryOrder {
  id: string;
  pickupAddress: string;
  deliveryAddress: string;
  city: string;
  itemType: string;
  vehicleType: 'moto' | 'auto' | 'van';
  estimatedCost: number;
  status: 'plasata' | 'preluata' | 'in_tranzit' | 'livrata';
  courierName?: string;
  courierPhone?: string;
  createdAt: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'order' | 'quote' | 'promo' | 'system' | 'reward' | 'recommendation';
  link?: string;
}

export interface UserBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
  category: 'loyalty' | 'community' | 'speed' | 'social';
}

export interface RewardItem {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  discountValue: string;
  type: 'voucher' | 'promo_boost' | 'escrow_free' | 'badge_accent';
  code: string;
  icon: string;
  badgeTag?: string;
}

export interface UserRetentionPreferences {
  preferredCategories: string[];
  radiusKm: number;
  enableDealAlerts: boolean;
  enableStreakReminders: boolean;
  enableUrgentNearbyAlerts: boolean;
  pushChannels: {
    browser: boolean;
    sms: boolean;
    email: boolean;
  };
}

export interface ReferralRecord {
  id: string;
  friendName: string;
  friendEmail: string;
  status: 'Inscris' | 'Comandă Plasată' | 'În Așteptare';
  pointsEarned: number;
  date: string;
}

export interface PointsTransaction {
  id: string;
  action: string;
  points: number;
  type?: 'earn' | 'spend';
  date: string;
  category?: 'order' | 'review' | 'streak' | 'referral' | 'profile' | 'welcome' | string;
}

export interface AdAnalyticsDataPoint {
  date: string;
  vizualizari: number;
  contacte: number;
  apeluri: number;
  mesaje: number;
  cereriOferta: number;
}

export interface UserAd {
  id: string;
  title: string;
  category: string;
  city: string;
  price: string;
  status: 'active' | 'boosted' | 'paused' | 'expired' | 'pending_review';
  viewsCount: number;
  contactsCount: number;
  conversionRate: number;
  publishedDate: string;
  expiresInDays?: number;
  packageType?: 'Gratuit' | 'Standard Boost' | 'PROMO-VIP 2026' | 'Master';
  image?: string;
  analytics7d?: AdAnalyticsDataPoint[];
  analytics30d?: AdAnalyticsDataPoint[];
}

export interface ComplianceAuthorization {
  id: string;
  type: 'anre' | 'iscir' | 'sanitary' | 'trade' | 'qualification' | 'insurance' | 'other';
  title: string;
  issuer: string;
  docNumber: string;
  issuedAt: string;
  expiresAt: string;
  status: 'verified' | 'pending_review' | 'expired';
  fileName?: string;
  fileSize?: string;
  verificationBadge?: string;
}

export interface ProviderComplianceData {
  cui: string;
  companyName: string;
  companyType: 'SRL' | 'PFA' | 'II' | 'IF' | 'Individual';
  regCom: string;
  address: string;
  city: string;
  county: string;
  vatStatus: boolean;
  vatPayer: boolean;
  anafStatus: 'Activ' | 'Inactiv' | 'Radiat' | 'Neverificat';
  mainCaen: string;
  caenDescription: string;
  isCaenEligible: boolean;
  authorizations: ComplianceAuthorization[];
  earlyBirdEligible: boolean;
  earlyBirdActivated: boolean;
  earlyBirdExpiresAt?: string;
  verificationScore: number; // 0-100%
  verifiedAt?: string;
  idCardUploaded: boolean;
  cuiCertificateUploaded: boolean;
  status: 'unverified' | 'in_review' | 'verified' | 'rejected';
  lastApiCheck?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  role: 'client' | 'prestator' | 'admin';
  avatar: string;
  isVerified: boolean;
  rating?: number;
  completedJobs?: number;
  joinedDate: string;
  points: number;
  streakDays: number;
  lastCheckInDate?: string;
  isCheckedInToday?: boolean;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  referralCode: string;
  referralsCount: number;
  referralEarnings: number;
  badges: UserBadge[];
  preferences: UserRetentionPreferences;
  referralHistory: ReferralRecord[];
  pointsHistory?: PointsTransaction[];
  complianceData?: ProviderComplianceData;
}

