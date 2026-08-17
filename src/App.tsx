import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowLeftCircle, Compass, HelpCircle, Sparkles } from 'lucide-react';
import { Header } from './components/Header';
import { HeroAndSearch } from './components/HeroAndSearch';
import { CategorySection } from './components/CategorySection';
import { LiveMapSection } from './components/LiveMapSection';
import { ProvidersGrid } from './components/ProvidersGrid';
import { MarketplaceSection } from './components/MarketplaceSection';
import { DeliveryServiceSection } from './components/DeliveryServiceSection';
import { PromotionPackagesSection } from './components/PromotionPackagesSection';
import { QuoteRequestModal } from './components/QuoteRequestModal';
import { PublishAdModal } from './components/PublishAdModal';
import { OrdersAndEscrowDrawer } from './components/OrdersAndEscrowDrawer';
import { UserProfileModal } from './components/UserProfileModal';
import { NotificationsPopover } from './components/NotificationsPopover';
import { ExecutiveAuditTab } from './components/ExecutiveAuditTab';
import { LocoRetentionHubModal } from './components/LocoRetentionHubModal';
import { SocialShareModal } from './components/SocialShareModal';
import { ReviewSystem } from './components/ReviewSystem';
import { DashboardAnunturiPage } from './components/DashboardAnunturiPage';
import { BottomNavigationBar } from './components/BottomNavigationBar';
import { SegmentedIntentSwitcher, HomeIntentSegment } from './components/SegmentedIntentSwitcher';
import { InstantGuideModal } from './components/InstantGuideModal';
import {
  auth,
  subscribeToUserProfile,
  subscribeToUserOrders,
  saveUserProfileToFirestore
} from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

import {
  INITIAL_PROVIDERS,
  INITIAL_ORDERS,
  INITIAL_NOTIFICATIONS,
  CURRENT_USER,
  CATEGORIES,
  INITIAL_REVIEWS
} from './data/mockData';

import { Provider, OrderItem, AppNotification, UserProfile, MarketplaceProduct, Review } from './types';

export default function App() {
  const [currentCity, setCurrentCity] = useState('Cluj-Napoca');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeView, setActiveView] = useState('home');
  const [homeIntentSegment, setHomeIntentSegment] = useState<HomeIntentSegment>('providers');
  const [viewHistory, setViewHistory] = useState<{ view: string; homeIntentSegment: HomeIntentSegment }[]>([]);
  const [navDirection, setNavDirection] = useState<'forward' | 'backward'>('forward');
  const [mobileHapticToast, setMobileHapticToast] = useState<boolean>(false);

  const [isBackHovered, setIsBackHovered] = useState(false);

  // Helper: Detect mobile device environment (touch screen or mobile viewport/UA)
  const isMobileDevice = () => {
    if (typeof window === 'undefined') return false;
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isMobileWidth = window.innerWidth <= 768;
    const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent || ''
    );
    return isMobileWidth || hasTouch || isMobileUA;
  };

  // Helper: Trigger tactile haptic feedback pattern if hardware/browser allows
  const triggerHapticFeedback = () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        // Crisp tactile double-pulse pattern
        navigator.vibrate([18, 30, 22]);
      } catch {
        // Ignore fallback if vibration blocked by browser policy
      }
    }
  };

  const previousViewTitle = useMemo(() => {
    if (viewHistory.length === 0) return 'Meniul Principal (Meșteri & Servicii)';
    const lastEntry = viewHistory[viewHistory.length - 1];

    if (lastEntry.view === 'home' || lastEntry.view === 'search') {
      switch (lastEntry.homeIntentSegment) {
        case 'marketplace':
          return 'Piață Locală (Produse & Producători)';
        case 'delivery':
          return 'Curierat & Livrare Locală';
        case 'all':
          return 'Toate Serviciile & Produsele';
        case 'providers':
        default:
          return 'Meșteri & Servicii';
      }
    }

    switch (lastEntry.view) {
      case 'map':
        return 'Hartă Live GPS';
      case 'marketplace':
        return 'Piață Locală';
      case 'delivery':
        return 'Curierat & Livrare';
      case 'promovare':
        return 'Pachete Promovare';
      case 'dashboard-anunturi':
        return 'Dashboard Anunțuri';
      case 'audit':
        return 'Raport Audit';
      default:
        return 'Meniul Principal';
    }
  }, [viewHistory]);

  const handleNavigate = (newView: string, targetSegment?: HomeIntentSegment) => {
    if (newView === activeView && (!targetSegment || targetSegment === homeIntentSegment)) return;
    setNavDirection('forward');
    setViewHistory((prev) => [...prev, { view: activeView, homeIntentSegment }]);
    setActiveView(newView);
    if (targetSegment) {
      setHomeIntentSegment(targetSegment);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoBack = () => {
    const isMobile = isMobileDevice();
    setNavDirection('backward');

    if (isMobile) {
      triggerHapticFeedback();
      // Brief visual badge indicator for mobile tactile feedback
      setMobileHapticToast(true);
      setTimeout(() => setMobileHapticToast(false), 1400);
    }

    if (viewHistory.length > 0) {
      const lastEntry = viewHistory[viewHistory.length - 1];
      setViewHistory((old) => old.slice(0, old.length - 1));
      setActiveView(lastEntry.view);
      if (lastEntry.homeIntentSegment) {
        setHomeIntentSegment(lastEntry.homeIntentSegment);
      }
    } else {
      setActiveView('home');
      setHomeIntentSegment('providers');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Quick Filters State
  const [filter247Only, setFilter247Only] = useState(false);
  const [filterVerifiedOnly, setFilterVerifiedOnly] = useState(false);
  const [filterTopRated, setFilterTopRated] = useState(false);

  // App State Data
  const [providers, setProviders] = useState<Provider[]>(INITIAL_PROVIDERS);
  const [orders, setOrders] = useState<OrderItem[]>(INITIAL_ORDERS);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [user, setUser] = useState<UserProfile>(CURRENT_USER);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);

  // Modals & Panels State
  const [selectedProviderForMap, setSelectedProviderForMap] = useState<Provider | null>(null);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [targetQuoteProvider, setTargetQuoteProvider] = useState<Provider | null>(null);
  const [isPublishAdModalOpen, setIsPublishAdModalOpen] = useState(false);
  const [defaultPromoCode, setDefaultPromoCode] = useState('standard');
  const [isOrdersDrawerOpen, setIsOrdersDrawerOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isInstantGuideOpen, setIsInstantGuideOpen] = useState(false);

  // Review System Modal State
  const [reviewModalState, setReviewModalState] = useState<{
    isOpen: boolean;
    targetProvider?: Provider | null;
    targetOrder?: OrderItem | null;
    initialMode?: 'view' | 'write';
  }>({
    isOpen: false,
    targetProvider: null,
    targetOrder: null,
    initialMode: 'view'
  });

  // Retention & Social Share Modal States
  const [isRetentionHubOpen, setIsRetentionHubOpen] = useState(false);
  const [shareModalState, setShareModalState] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    url: string;
    imageUrl?: string;
    categoryTag?: string;
  }>({
    isOpen: false,
    title: '',
    description: '',
    url: ''
  });

  // Real-time Firebase Auth and Firestore state sync
  useEffect(() => {
    let unsubscribeProfile: (() => void) | null = null;
    let unsubscribeOrders: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        // Sync user profile from Firestore if authenticated
        unsubscribeProfile = subscribeToUserProfile(fbUser.uid, (firestoreUser) => {
          if (firestoreUser) {
            setUser(firestoreUser);
          } else {
            // First time auth: initialize Firestore document with baseline profile
            const initialUser: UserProfile = {
              ...CURRENT_USER,
              id: fbUser.uid,
              name: fbUser.displayName || CURRENT_USER.name,
              email: fbUser.email || CURRENT_USER.email,
              avatar: fbUser.photoURL || CURRENT_USER.avatar
            };
            saveUserProfileToFirestore(initialUser).catch((err) =>
              console.warn('Eroare la salvarea inițială a profilului în Firestore:', err)
            );
          }
        });

        // Sync orders in real-time
        unsubscribeOrders = subscribeToUserOrders(fbUser.uid, (firestoreOrders) => {
          if (firestoreOrders && firestoreOrders.length > 0) {
            setOrders(firestoreOrders);
          }
        });
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeProfile) unsubscribeProfile();
      if (unsubscribeOrders) unsubscribeOrders();
    };
  }, []);

  // Filtered Providers calculation
  const filteredProviders = useMemo(() => {
    return providers.filter((p) => {
      const matchCity = p.city.toLowerCase().includes(currentCity.toLowerCase());
      const matchCategory =
        selectedCategory === 'all' || p.categorySlug === selectedCategory;
      const matchQuery =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const match247 = !filter247Only || p.is247;
      const matchVerified = !filterVerifiedOnly || p.isVerified;
      const matchRating = !filterTopRated || p.rating >= 4.8;

      return matchCity && matchCategory && matchQuery && match247 && matchVerified && matchRating;
    });
  }, [providers, currentCity, selectedCategory, searchQuery, filter247Only, filterVerifiedOnly, filterTopRated]);

  const selectedCategoryName = useMemo(() => {
    if (selectedCategory === 'all') return undefined;
    return CATEGORIES.find((c) => c.slug === selectedCategory)?.name || selectedCategory;
  }, [selectedCategory]);

  const handleSelectCategory = (catSlug: string) => {
    setSelectedCategory(catSlug);
    if (catSlug !== 'all') {
      const match =
        providers.find((p) => p.categorySlug === catSlug && p.city.toLowerCase().includes(currentCity.toLowerCase())) ||
        providers.find((p) => p.categorySlug === catSlug);
      if (match) {
        setSelectedProviderForMap(match);
      }
    } else {
      setSelectedProviderForMap(null);
    }
  };

  const handleShowProviderOnMap = (provider: Provider) => {
    setSelectedProviderForMap(provider);
    if (activeView !== 'home' && activeView !== 'search' && activeView !== 'map') {
      handleNavigate('home', 'providers');
    } else if (homeIntentSegment !== 'providers' && homeIntentSegment !== 'all') {
      setHomeIntentSegment('providers');
    }
    setTimeout(() => {
      const mapElement = document.getElementById('live-map-section');
      if (mapElement) {
        mapElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 120);
  };

  // Handlers
  const handleOpenQuoteModal = (provider?: Provider) => {
    setTargetQuoteProvider(provider || null);
    setIsQuoteModalOpen(true);
  };

  const handleOpenPublishAdModal = (packageCode?: string) => {
    if (packageCode) setDefaultPromoCode(packageCode);
    setIsPublishAdModalOpen(true);
  };

  const handleOpenChat = (provider: Provider) => {
    // Find or create order for chat
    setIsOrdersDrawerOpen(true);
  };

  // Retention Handlers
  const handleUpdateUser = (updatedUser: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updatedUser }));
  };

  const handleRewardPointsEarned = (points: number, reason: string) => {
    const nowFormatted =
      new Date().toLocaleDateString('ro-RO', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }) +
      ', ' +
      new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newTx = {
      id: `pt-tx-${Date.now()}`,
      action: reason,
      points,
      type: 'earn' as const,
      date: nowFormatted
    };

    setUser((prev) => {
      const newPoints = prev.points + points;
      const updatedHistory = [newTx, ...(prev.pointsHistory || [])];
      return { ...prev, points: newPoints, pointsHistory: updatedHistory };
    });

    const newNotif: AppNotification = {
      id: `notif-reward-${Date.now()}`,
      title: `🎉 +${points} Puncte Loco Câștigate!`,
      message: `${reason}. Ai acum în total ${user.points + points} Puncte Loco.`,
      time: 'Acum',
      read: false,
      type: 'reward'
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleShareProvider = (provider: Provider) => {
    setShareModalState({
      isOpen: true,
      title: provider.name,
      description: `${provider.role} în ${provider.city}. Rating: ${provider.rating} ⭐. Tarif: ${provider.price}.`,
      url: `https://loco-instant.ro/p/${provider.id}`,
      imageUrl: provider.image,
      categoryTag: provider.categorySlug
    });
  };

  const handleShareProduct = (product: MarketplaceProduct) => {
    setShareModalState({
      isOpen: true,
      title: product.name,
      description: `Producător: ${product.producer} (${product.city}). Preț: ${product.price} RON / ${product.unit}`,
      url: `https://loco-instant.ro/market/${product.id}`,
      imageUrl: product.image,
      categoryTag: 'Marketplace'
    });
  };

  // Review System Handlers
  const handleOpenReviewsForProvider = (provider: Provider, initialMode: 'view' | 'write' = 'view') => {
    setReviewModalState({
      isOpen: true,
      targetProvider: provider,
      targetOrder: null,
      initialMode
    });
  };

  const handleOpenReviewsForOrder = (order: OrderItem) => {
    const matchingProvider =
      providers.find((p) => p.id === order.providerId || p.name.includes(order.providerName)) || null;

    setReviewModalState({
      isOpen: true,
      targetProvider: matchingProvider,
      targetOrder: order,
      initialMode: 'write'
    });
  };

  const handleAddReview = (newReviewData: {
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
  }) => {
    const newReview: Review = {
      ...newReviewData,
      id: `rev-${Date.now()}`,
      createdAt: 'Azi'
    };

    setReviews((prev) => [newReview, ...prev]);

    // Recalculate and update provider rating and reviews count
    setProviders((prev) =>
      prev.map((p) => {
        if (p.id === newReview.targetId || p.name === newReview.targetName) {
          const newCount = p.reviewsCount + 1;
          const newRating = Number(((p.rating * p.reviewsCount + newReview.rating) / newCount).toFixed(1));
          return {
            ...p,
            rating: newRating,
            reviewsCount: newCount
          };
        }
        return p;
      })
    );

    // If review submitted for an order, update order state
    if (newReview.orderId) {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === newReview.orderId
            ? { ...o, hasReview: true, reviewId: newReview.id }
            : o
        )
      );
    }

    // Reward points for leaving a review
    handleRewardPointsEarned(25, 'Adăugare recenzie verificată pentru meseriaș');
  };

  const handleReleaseEscrow = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, escrowStatus: 'eliberat', status: 'platita' }
          : o
      )
    );

    // Reward points for order completion
    handleRewardPointsEarned(50, 'Finalizare comandă securizată cu plată Escrow');
  };

  const handleSendMessage = (orderId: string, text: string) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              chatHistory: [
                ...o.chatHistory,
                { sender: 'client', text, time: timeNow }
              ]
            }
          : o
      )
    );
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleOrderProduct = (prod: MarketplaceProduct) => {
    const newOrder: OrderItem = {
      id: `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      providerName: prod.producer,
      providerRole: prod.category,
      providerImage: prod.image,
      serviceName: `${prod.name} (${prod.unit})`,
      amount: prod.price,
      city: currentCity,
      status: 'in_desfasurare',
      date: 'Azi, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      escrowStatus: 'securizat',
      chatHistory: [
        {
          sender: 'provider',
          text: `Bună ziua! Am primit comanda pentru ${prod.name}. Livrăm în 24 de ore!`,
          time: 'Azi'
        }
      ]
    };

    setOrders((prev) => [newOrder, ...prev]);
    setIsOrdersDrawerOpen(true);
  };

  const handleRequestDelivery = (data: any) => {
    const newOrder: OrderItem = {
      id: `TR-${Math.floor(1000 + Math.random() * 9000)}`,
      providerName: 'Serviciu Curierat Loco Express',
      providerRole: 'Livrare Locală',
      providerImage:
        'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=150&auto=format&fit=crop&q=80',
      serviceName: `Transport ${data.itemType} de la ${data.pickup} la ${data.delivery}`,
      amount: data.estimatedPrice,
      city: currentCity,
      status: 'in_desfasurare',
      date: 'Azi, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      escrowStatus: 'securizat',
      chatHistory: [
        {
          sender: 'system',
          text: 'Soferul a fost asignat și se deplasează spre adresa de preluare.',
          time: 'Azi'
        }
      ]
    };

    setOrders((prev) => [newOrder, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Navigation Header */}
      <Header
        currentCity={currentCity}
        onCityChange={(city) => {
          setCurrentCity(city);
          setSelectedCategory('all');
        }}
        activeView={activeView}
        onViewChange={(view) => {
          handleNavigate(view);
          if (view === 'orders') setIsOrdersDrawerOpen(true);
        }}
        onGoBack={handleGoBack}
        notifications={notifications}
        onOpenNotifications={() => setIsNotificationsOpen(!isNotificationsOpen)}
        onOpenQuoteModal={() => handleOpenQuoteModal()}
        onOpenPublishAdModal={() => handleOpenPublishAdModal()}
        user={user}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenRetentionHub={() => setIsRetentionHubOpen(true)}
        onOpenInstantGuide={() => setIsInstantGuideOpen(true)}
      />

      {/* Main Container View Switch */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 pb-24 lg:pb-8">
        {activeView === 'audit' ? (
          <ExecutiveAuditTab onBack={handleGoBack} />
        ) : (
          <>
            {/* Secondary View Top Back / Breadcrumb Bar */}
            <AnimatePresence mode="wait">
              {activeView !== 'home' && activeView !== 'search' && (
                <motion.div
                  key="global-back-nav-container"
                  initial={{ opacity: 0, y: -10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.98 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center justify-between gap-2 bg-white px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl border border-slate-200 shadow-xs mb-4"
                >
                  <div className="relative inline-flex items-center min-w-0 shrink-0">
                    <motion.button
                      id="btn-global-back-nav"
                      type="button"
                      onClick={handleGoBack}
                      onMouseEnter={() => setIsBackHovered(true)}
                      onMouseLeave={() => setIsBackHovered(false)}
                      title={`Înapoi la: ${previousViewTitle}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{
                        opacity: 1,
                        x: 0,
                        scale: [1, 1.02, 1],
                        boxShadow: [
                          '0 0 0 rgba(16, 185, 129, 0)',
                          '0 0 12px rgba(16, 185, 129, 0.28)',
                          '0 0 0 rgba(16, 185, 129, 0)'
                        ]
                      }}
                      exit={{ opacity: 0, x: -10 }}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.93, x: -4 }}
                      transition={{
                        opacity: { duration: 0.2 },
                        x: { duration: 0.2 },
                        scale: { repeat: Infinity, duration: 2.6, ease: 'easeInOut' },
                        boxShadow: { repeat: Infinity, duration: 2.6, ease: 'easeInOut' }
                      }}
                      className="relative inline-flex items-center justify-center space-x-1.5 sm:space-x-2.5 text-[11px] sm:text-xs font-black text-slate-800 hover:text-emerald-900 bg-slate-100 hover:bg-emerald-50 active:bg-emerald-100 px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl border-2 border-slate-200 hover:border-emerald-500 hover:ring-2 hover:ring-emerald-400/50 hover:shadow-[0_0_16px_rgba(16,185,129,0.3)] transition-all duration-200 cursor-pointer min-h-[38px] sm:min-h-[42px] shrink-0 group max-w-full before:absolute before:-inset-2 sm:before:-inset-1 before:content-[''] before:rounded-2xl"
                    >
                      <motion.div
                        animate={{ x: [0, -3, 0] }}
                        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                        className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-emerald-600 text-white shadow-xs group-hover:bg-emerald-700 group-hover:ring-2 group-hover:ring-emerald-300 group-hover:scale-105 transition-all shrink-0 aspect-square my-auto"
                      >
                        <ArrowLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.8] shrink-0" />
                      </motion.div>
                      <span className="hidden sm:inline font-black whitespace-nowrap">Înapoi la Pagina Principală (Meșteri & Servicii)</span>
                      <span className="sm:hidden font-black whitespace-nowrap tracking-tight">Înapoi Acasă</span>
                    </motion.button>

                    {/* Mobile Haptic & Slide-Back Floating Indicator */}
                    <AnimatePresence>
                      {mobileHapticToast && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8, y: -6 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.8, y: -6 }}
                          transition={{ duration: 0.18 }}
                          className="absolute -top-7 left-0 z-50 bg-emerald-600 text-white font-bold text-[10px] px-2.5 py-0.5 rounded-full shadow-md flex items-center space-x-1 whitespace-nowrap"
                        >
                          <span>📳</span>
                          <span>Feedback tactil & revenire</span>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Floating descriptive tooltip on hover */}
                    <AnimatePresence>
                      {isBackHovered && (
                        <motion.div
                          initial={{ opacity: 0, y: 6, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 4, scale: 0.95 }}
                          transition={{ duration: 0.15, ease: 'easeOut' }}
                          className="absolute left-0 top-full mt-2 z-50 pointer-events-none hidden sm:flex items-center space-x-2 bg-slate-900/95 backdrop-blur-xs text-white text-[11px] font-semibold px-3 py-1.5 rounded-lg shadow-xl border border-slate-700/80 whitespace-nowrap"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span>
                            Revenire la <strong className="text-emerald-300 font-black">{previousViewTitle}</strong>
                          </span>
                          {/* Triangle indicator */}
                          <div className="absolute -top-1 left-5 w-2 h-2 bg-slate-900 rotate-45 border-l border-t border-slate-700" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="text-[11px] font-bold text-slate-500 truncate pl-2 flex items-center space-x-1.5">
                    <span className="hidden sm:inline text-slate-400">Secțiune:</span>
                    <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100 uppercase tracking-wider text-[10px] font-black">
                      {activeView === 'map' && '🗺️ Hartă Live GPS'}
                      {activeView === 'marketplace' && '🛒 Piață Locală'}
                      {activeView === 'delivery' && '🚚 Curierat & Livrare'}
                      {activeView === 'promovare' && '⚡ Pachete Promovare'}
                      {activeView === 'dashboard-anunturi' && '📈 Dashboard Anunțuri'}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* View Container with Directional Slide-Back / Slide-Forward Tactile Transitions */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeView}
                initial={{
                  opacity: 0,
                  x: navDirection === 'backward' ? -24 : 24,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                exit={{
                  opacity: 0,
                  x: navDirection === 'backward' ? 24 : -24,
                }}
                transition={{
                  duration: 0.24,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="space-y-8"
              >
                {/* View: Home / Main Marketplace Dashboard */}
                {(activeView === 'home' || activeView === 'search') && (
                  <>
                    <HeroAndSearch
                      currentCity={currentCity}
                      searchQuery={searchQuery}
                      onSearchChange={setSearchQuery}
                      onSearchSubmit={(e) => e.preventDefault()}
                      selectedCategory={selectedCategory}
                      onSelectCategory={handleSelectCategory}
                      onOpenQuoteModal={() => handleOpenQuoteModal()}
                      onOpenPublishAdModal={() => handleOpenPublishAdModal()}
                      totalProviders={filteredProviders.length}
                    />

                    {/* Sticky Mobile Segmented Intent Switcher & Quick Filters */}
                    <SegmentedIntentSwitcher
                      activeSegment={homeIntentSegment}
                      onSegmentChange={setHomeIntentSegment}
                      providersCount={filteredProviders.length}
                      filter247Only={filter247Only}
                      onToggle247={() => setFilter247Only(!filter247Only)}
                      filterVerifiedOnly={filterVerifiedOnly}
                      onToggleVerified={() => setFilterVerifiedOnly(!filterVerifiedOnly)}
                      filterTopRated={filterTopRated}
                      onToggleTopRated={() => setFilterTopRated(!filterTopRated)}
                      currentCity={currentCity}
                    />

                    {/* Content based on selected Intent Segment */}
                    {(homeIntentSegment === 'providers' || homeIntentSegment === 'all') && (
                      <>
                        <CategorySection
                          selectedCategory={selectedCategory}
                          onSelectCategory={handleSelectCategory}
                        />

                        <LiveMapSection
                          providers={filteredProviders}
                          selectedProviderId={selectedProviderForMap?.id || null}
                          selectedCategory={selectedCategory}
                          selectedCategoryName={selectedCategoryName}
                          onResetCategory={() => handleSelectCategory('all')}
                          onSelectProvider={setSelectedProviderForMap}
                          onOpenQuoteModal={handleOpenQuoteModal}
                          currentCity={currentCity}
                        />

                        <ProvidersGrid
                          providers={filteredProviders}
                          onOpenQuoteModal={handleOpenQuoteModal}
                          onOpenChat={handleOpenChat}
                          selectedCategory={selectedCategory}
                          onShareProvider={handleShareProvider}
                          onOpenReviews={handleOpenReviewsForProvider}
                          onShowOnMap={handleShowProviderOnMap}
                        />
                      </>
                    )}

                    {(homeIntentSegment === 'marketplace' || homeIntentSegment === 'all') && (
                      <MarketplaceSection
                        currentCity={currentCity}
                        onOrderProduct={handleOrderProduct}
                        onShareProduct={handleShareProduct}
                      />
                    )}

                    {(homeIntentSegment === 'delivery' || homeIntentSegment === 'all') && (
                      <DeliveryServiceSection
                        currentCity={currentCity}
                        onRequestDelivery={handleRequestDelivery}
                      />
                    )}

                    {homeIntentSegment === 'all' && (
                      <PromotionPackagesSection
                        onOpenPublishAdModal={handleOpenPublishAdModal}
                      />
                    )}
                  </>
                )}

                {/* View: Live Map Direct */}
                {activeView === 'map' && (
                  <div className="space-y-6">
                    <LiveMapSection
                      providers={filteredProviders}
                      selectedProviderId={selectedProviderForMap?.id || null}
                      selectedCategory={selectedCategory}
                      selectedCategoryName={selectedCategoryName}
                      onResetCategory={() => handleSelectCategory('all')}
                      onSelectProvider={setSelectedProviderForMap}
                      onOpenQuoteModal={handleOpenQuoteModal}
                      currentCity={currentCity}
                    />
                    <ProvidersGrid
                      providers={filteredProviders}
                      onOpenQuoteModal={handleOpenQuoteModal}
                      onOpenChat={handleOpenChat}
                      selectedCategory={selectedCategory}
                      onShareProvider={handleShareProvider}
                      onOpenReviews={handleOpenReviewsForProvider}
                      onShowOnMap={handleShowProviderOnMap}
                    />
                  </div>
                )}

                {/* View: Marketplace Direct */}
                {activeView === 'marketplace' && (
                  <MarketplaceSection
                    currentCity={currentCity}
                    onOrderProduct={handleOrderProduct}
                    onShareProduct={handleShareProduct}
                  />
                )}

                {/* View: Delivery Direct */}
                {activeView === 'delivery' && (
                  <DeliveryServiceSection
                    currentCity={currentCity}
                    onRequestDelivery={handleRequestDelivery}
                  />
                )}

                {/* View: Promotion Direct */}
                {activeView === 'promovare' && (
                  <PromotionPackagesSection
                    onOpenPublishAdModal={handleOpenPublishAdModal}
                  />
                )}

                {/* View: Dashboard Anunturi Direct */}
                {activeView === 'dashboard-anunturi' && (
                  <DashboardAnunturiPage
                    onOpenPublishAdModal={handleOpenPublishAdModal}
                    onBack={handleGoBack}
                    onShareAd={(title) => {
                      setShareModalState({
                        isOpen: true,
                        title: `Anunțul meu pe Loco Instant: ${title}`,
                        description: `Vezi detaliile și contactează-mă pe Loco Instant ${currentCity}!`,
                        url: window.location.href,
                        categoryTag: 'Promovare Anunț'
                      });
                    }}
                    currentCity={currentCity}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 mt-12 py-8 px-4 sm:px-6 lg:px-8 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-white font-extrabold text-sm tracking-tight">
              LOCO<span className="text-emerald-500">INSTANT</span>
            </span>
            <p className="mt-1">
              Marketplace local de servicii, meșteri verificați & plăți protejate prin Escrow.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 text-slate-300 font-bold">
            <button onClick={() => handleNavigate('home')} className="hover:text-emerald-400 cursor-pointer">
              Acasă
            </button>
            <button onClick={() => handleNavigate('map')} className="hover:text-emerald-400 cursor-pointer">
              Hartă GPS
            </button>

            <button onClick={() => handleNavigate('marketplace')} className="hover:text-emerald-400 cursor-pointer">
              Marketplace Local
            </button>
            <button onClick={() => handleNavigate('promovare')} className="hover:text-emerald-400 cursor-pointer">
              Promovare
            </button>
            <button onClick={() => handleNavigate('dashboard-anunturi')} className="hover:text-emerald-400 text-emerald-400 font-black cursor-pointer">
              📈 Dashboard Anunțuri
            </button>
            <button onClick={() => handleNavigate('audit')} className="hover:text-emerald-400 cursor-pointer">
              Audit 2026
            </button>
          </div>
          <p className="text-[11px] text-slate-500">
            © 2026 Loco Instant (loco-instant.ro). Toate drepturile rezervate.
          </p>
        </div>
      </footer>

      {/* Persistent Mobile Bottom Navigation Bar */}
      <BottomNavigationBar
        activeView={activeView}
        onViewChange={(view) => {
          handleNavigate(view);
          if (view === 'orders') setIsOrdersDrawerOpen(true);
        }}
        onGoBack={handleGoBack}
        onOpenQuoteModal={() => handleOpenQuoteModal()}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenRetentionHub={() => setIsRetentionHubOpen(true)}
        orders={orders}
        notifications={notifications}
        user={user}
      />

      {/* Global Modals & Drawers */}
      <QuoteRequestModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        targetProvider={targetQuoteProvider}
        currentCity={currentCity}
        currentUser={user}
      />

      <PublishAdModal
        isOpen={isPublishAdModalOpen}
        onClose={() => setIsPublishAdModalOpen(false)}
        defaultPackageCode={defaultPromoCode}
        currentCity={currentCity}
      />

      <OrdersAndEscrowDrawer
        isOpen={isOrdersDrawerOpen}
        onClose={() => setIsOrdersDrawerOpen(false)}
        orders={orders}
        onReleaseEscrow={handleReleaseEscrow}
        onSendMessage={handleSendMessage}
        onWriteReviewForOrder={handleOpenReviewsForOrder}
      />

      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={user}
        onUpdateRole={(role) => setUser((prev) => ({ ...prev, role }))}
        onOpenRetentionHub={() => setIsRetentionHubOpen(true)}
        onRewardPointsEarned={handleRewardPointsEarned}
        onUpdateUser={handleUpdateUser}
        onOpenDashboardAnunturi={() => {
          setIsProfileModalOpen(false);
          handleNavigate('dashboard-anunturi');
        }}
      />

      <NotificationsPopover
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={handleMarkAllNotificationsRead}
        onSelectNotification={(n) => {
          setIsNotificationsOpen(false);
          setIsOrdersDrawerOpen(true);
        }}
      />

      {/* Retention & Loyalty Hub Modal */}
      <LocoRetentionHubModal
        isOpen={isRetentionHubOpen}
        onClose={() => setIsRetentionHubOpen(false)}
        user={user}
        onUpdateUser={handleUpdateUser}
        onAddNotification={(n) => setNotifications((prev) => [n, ...prev])}
        onOpenSocialShare={() => {
          setIsRetentionHubOpen(false);
          setShareModalState({
            isOpen: true,
            title: 'Platforma Loco Instant Cluj-Napoca',
            description: 'Servicii rapide de la meșteri verificați, plăți securizate Escrow & livrare locală.',
            url: 'https://loco-instant.ro',
            categoryTag: 'Loco Rewards'
          });
        }}
      />

      {/* Universal Social Share Modal */}
      <SocialShareModal
        isOpen={shareModalState.isOpen}
        onClose={() => setShareModalState((prev) => ({ ...prev, isOpen: false }))}
        title={shareModalState.title}
        description={shareModalState.description}
        url={shareModalState.url}
        imageUrl={shareModalState.imageUrl}
        categoryTag={shareModalState.categoryTag}
        userReferralCode={user.referralCode}
        onRewardPointsEarned={handleRewardPointsEarned}
      />

      {/* Verified Review System Modal */}
      <ReviewSystem
        isOpen={reviewModalState.isOpen}
        onClose={() => setReviewModalState((prev) => ({ ...prev, isOpen: false }))}
        targetProvider={reviewModalState.targetProvider}
        targetOrder={reviewModalState.targetOrder}
        reviews={reviews}
        onAddReview={handleAddReview}
        currentUser={user}
        initialMode={reviewModalState.initialMode}
      />

      {/* Instant Interactive Guide Modal (Ghid Instant Loco) */}
      <InstantGuideModal
        isOpen={isInstantGuideOpen}
        onClose={() => setIsInstantGuideOpen(false)}
        onNavigateToView={handleNavigate}
        onOpenQuoteModal={() => handleOpenQuoteModal()}
        onOpenPublishAdModal={() => handleOpenPublishAdModal()}
        onOpenRetentionHub={() => setIsRetentionHubOpen(true)}
        onRewardPointsEarned={handleRewardPointsEarned}
        currentCity={currentCity}
      />

      {/* Floating Instant Guide Quick Trigger (Bottom-Right) */}
      <aside
        aria-label="Ajutor și Ghid Rapid"
        className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-40 flex items-center"
      >
        <button
          id="btn-floating-instant-guide"
          type="button"
          onClick={() => setIsInstantGuideOpen(true)}
          className="group flex items-center space-x-2 bg-gradient-to-r from-indigo-600 via-indigo-700 to-slate-900 hover:from-indigo-500 hover:to-slate-800 text-white font-black text-xs px-3.5 py-2.5 rounded-2xl shadow-xl hover:shadow-indigo-500/25 border border-indigo-300/40 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          title="Deschide Ghidul Instant Interactiv"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <Compass className="w-4 h-4 text-indigo-200 group-hover:rotate-45 transition-transform" />
          <span className="font-extrabold tracking-tight">Ghid Instant</span>
        </button>
      </aside>
    </div>
  );
}
