import { Provider, AdCategory, MarketplaceProduct, PromotionPackage, AppNotification, OrderItem, UserProfile, RewardItem, UserBadge, Review, UserAd } from '../types';

export const CATEGORIES: AdCategory[] = [
  { id: '1', name: 'Instalator', slug: 'instalator', icon: '🔧', providersCount: 42, badge: '24/7 Urgențe', isPopular: true, isUrgent: true },
  { id: '2', name: 'Electrician', slug: 'electrician', icon: '⚡', providersCount: 38, badge: 'Autorizat ANRE', isPopular: true, isUrgent: true },
  { id: '3', name: 'Lăcătuș de Deblocări', slug: 'lacatus', icon: '🔑', providersCount: 19, badge: 'Intervenție <20 min', isUrgent: true },
  { id: '4', name: 'Transport & Mutări', slug: 'transport-mobila', icon: '🚚', providersCount: 29, badge: 'Utilat complet' },
  { id: '5', name: 'Curățenie', slug: 'curatenie', icon: '🧹', providersCount: 51, badge: 'Verificat', isPopular: true },
  { id: '6', name: 'Reparații & Electrocasnice', slug: 'reparatii', icon: '🛠️', providersCount: 24, badge: 'Garanție 12 luni' },
  { id: '7', name: 'Aer Condiționat & Climatizare', slug: 'aer-conditionat', icon: '❄️', providersCount: 31, badge: 'Încărcare Freon' },
  { id: '8', name: 'Zugrav & Amenajări', slug: 'zugrav', icon: '🎨', providersCount: 47, badge: 'Preț pe mp' },
  { id: '9', name: 'Montaj Mobilă', slug: 'montaj-mobila', icon: '🪑', providersCount: 22, badge: 'IKEA / Dedeman' },
];

export const INITIAL_PROVIDERS: Provider[] = [
  {
    id: 'prov-1',
    name: 'Vasile Mureșan - Instalații Pro',
    role: 'Instalator Sanitari & Gaz (Autorizat)',
    categorySlug: 'instalator',
    city: 'Cluj-Napoca',
    district: 'Mănăștur, Zorilor, Centru',
    rating: 4.9,
    reviewsCount: 84,
    isVerified: true,
    isPro: true,
    is247: true,
    isUrgentAvailable: true,
    price: 'de la 120 RON',
    priceNum: 120,
    responseTime: '~15 min',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=300&auto=format&fit=crop&q=80',
    phone: '0722 123 456',
    whatsapp: '0722 123 456',
    email: 'vasile.muresan@instalatari.ro',
    description: 'Servicii complete de instalații sanitare, termice și gaz în Cluj-Napoca. Desfundări urgente, montaj centrale, instalații de cupru și PEX.',
    tags: ['Sanitare', 'Desfundări', 'Zorilor', 'Gaz', 'Urgențe 24/7'],
    coordinates: { lat: 46.7712, lng: 23.6236 }
  },
  {
    id: 'prov-2',
    name: 'Florin Instalatorul - Quick Service',
    role: 'Instalator Scurgeri & Robineți',
    categorySlug: 'instalator',
    city: 'Cluj-Napoca',
    district: 'Gheorgheni, Marști',
    rating: 4.8,
    reviewsCount: 52,
    isVerified: true,
    isPro: false,
    is247: true,
    isUrgentAvailable: true,
    price: 'de la 100 RON',
    priceNum: 100,
    responseTime: '~10 min',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    phone: '0744 555 666',
    whatsapp: '0744 555 666',
    email: 'florin@quickservice.ro',
    description: 'Specializat în remedieri rapide, schimbare baterii chiuvetă, sifon pardoseală, montaj cabine duș și defecțiuni urgente.',
    tags: ['Urgențe', 'Mărăști', 'Preț mic', 'Deblocări'],
    coordinates: { lat: 46.7785, lng: 23.6120 }
  },
  {
    id: 'prov-3',
    name: 'Ion Popescu Electric - ElectroGrup',
    role: 'Electrician Tablouri & Automatizări ANRE',
    categorySlug: 'electrician',
    city: 'Cluj-Napoca',
    district: 'Centru, Grigorescu, Buna Ziua',
    rating: 5.0,
    reviewsCount: 67,
    isVerified: true,
    isPro: true,
    is247: true,
    isUrgentAvailable: true,
    price: 'de la 150 RON',
    priceNum: 150,
    responseTime: '~20 min',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300&auto=format&fit=crop&q=80',
    phone: '0733 999 888',
    whatsapp: '0733 999 888',
    email: 'ion.popescu@electrogrup.ro',
    description: 'Electrician autorizat ANRE. Execut tablouri electrice, prize smart, iluminat LED, diagnoză scurtcircuite și verificări PRAM.',
    tags: ['ANRE', 'Tablouri', 'Buna Ziua', 'Smart Home'],
    coordinates: { lat: 46.7645, lng: 23.5821 }
  },
  {
    id: 'prov-4',
    name: 'Elena & Team Clean Pro',
    role: 'Curățenie Generală & După Șantier',
    categorySlug: 'curatenie',
    city: 'Cluj-Napoca',
    district: 'Toate cartierele & Florești',
    rating: 4.9,
    reviewsCount: 112,
    isVerified: true,
    isPro: true,
    is247: false,
    isUrgentAvailable: false,
    price: 'de la 80 RON/oră',
    priceNum: 80,
    responseTime: '~15 min',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&auto=format&fit=crop&q=80',
    phone: '0755 111 222',
    whatsapp: '0755 111 222',
    email: 'elena@teamclean.ro',
    description: 'Echipă profesionistă de curățenie cu aspiratoare Kärcher industriale și produse eco-friendly. Curățenie după constructor și spălare tapițerii.',
    tags: ['Curățenie', 'Șantier', 'Canapele', 'Florești'],
    coordinates: { lat: 46.7580, lng: 23.5900 }
  },
  {
    id: 'prov-5',
    name: 'Mihai Transport & Mutări Express',
    role: 'Transport Marfă & Mobilă cu Manipulanți',
    categorySlug: 'transport-mobila',
    city: 'Cluj-Napoca',
    district: 'Interurban & Local',
    rating: 4.7,
    reviewsCount: 39,
    isVerified: true,
    isPro: false,
    is247: true,
    isUrgentAvailable: true,
    price: 'de la 180 RON',
    priceNum: 180,
    responseTime: '~30 min',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=300&auto=format&fit=crop&q=80',
    phone: '0766 444 333',
    whatsapp: '0766 444 333',
    email: 'mihai@transportcluj.ro',
    description: 'Transport rapid cu utilitară 3.5 tone. Asigurăm băieți pentru manipulare, folie stretch și ancorare sigură a bunurilor.',
    tags: ['Transport', 'Manipulare', 'Mutări', 'Duba 3.5T'],
    coordinates: { lat: 46.7820, lng: 23.6300 }
  },
  {
    id: 'prov-6',
    name: 'Dan Lăcătușu - Deblocări Auto & Uși',
    role: 'Lăcătuș Mecanic de Urgență (Non-Stop)',
    categorySlug: 'lacatus',
    city: 'Cluj-Napoca',
    district: 'Mănăștur, Zorilor, Centru, Florești',
    rating: 4.9,
    reviewsCount: 78,
    isVerified: true,
    isPro: true,
    is247: true,
    isUrgentAvailable: true,
    price: 'de la 150 RON',
    priceNum: 150,
    responseTime: '~15 min',
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=300&auto=format&fit=crop&q=80',
    phone: '0770 123 789',
    whatsapp: '0770 123 789',
    email: 'dan@lacatuscluj.ro',
    description: 'Deblocare uși metalice, lemn, termopan fără distrugerea ușii. Deblocări auto rapide, schimbare butuci și montaj yale antiefracție.',
    tags: ['Deblocări Uși', 'Urgențe 24/7', 'Non-Stop', 'Yale Siguranță'],
    coordinates: { lat: 46.7680, lng: 23.5750 }
  },
  {
    id: 'prov-7',
    name: 'Radu Tech - Reparații Electrocasnice',
    role: 'Tehnician Mașini Spălat & Frigidere',
    categorySlug: 'reparatii',
    city: 'Cluj-Napoca',
    district: 'Gheorgheni, Mărăști, Zorilor',
    rating: 4.8,
    reviewsCount: 45,
    isVerified: true,
    isPro: true,
    is247: false,
    isUrgentAvailable: true,
    price: 'de la 90 RON constatare',
    priceNum: 90,
    responseTime: '~25 min',
    image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=300&auto=format&fit=crop&q=80',
    phone: '0788 333 222',
    whatsapp: '0788 333 222',
    email: 'radu@techcluj.ro',
    description: 'Reparații mașini de spălat rufe/vase, uscătoare, cuptoare electrice și frigidere la domiciliu. Piese originale cu garanție 12-24 luni.',
    tags: ['Electrocasnice', 'Mașini Spălat', 'Garanție 12 luni', 'Piese Originale'],
    coordinates: { lat: 46.7750, lng: 23.6050 }
  },
  {
    id: 'prov-8',
    name: 'ClimaExpert - Montaj & Service AC',
    role: 'Specialist Climatizare & Pompe de Căldură',
    categorySlug: 'aer-conditionat',
    city: 'Cluj-Napoca',
    district: 'Toate zonele & Județul Cluj',
    rating: 5.0,
    reviewsCount: 62,
    isVerified: true,
    isPro: true,
    is247: true,
    isUrgentAvailable: true,
    price: 'de la 250 RON',
    priceNum: 250,
    responseTime: '~20 min',
    image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=300&auto=format&fit=crop&q=80',
    phone: '0799 444 555',
    whatsapp: '0799 444 555',
    email: 'contact@climaexpert.ro',
    description: 'Montaj autorizat aparate aer condiționat, igienizare profesională antibacteriană cu ozon, încărcare freon ecologic R32/R410A.',
    tags: ['Aer Condiționat', 'Igienizare Ozon', 'Freon R32', 'Montaj Rapid'],
    coordinates: { lat: 46.7620, lng: 23.6150 }
  },
  {
    id: 'prov-9',
    name: 'Adrian Meșterul Zugrav',
    role: 'Zugrăveli Moderne & Finisaje Interioare',
    categorySlug: 'zugrav',
    city: 'Cluj-Napoca',
    district: 'Centru, Grigorescu, Zorilor, Mănăștur',
    rating: 4.9,
    reviewsCount: 54,
    isVerified: true,
    isPro: false,
    is247: false,
    isUrgentAvailable: false,
    price: 'de la 18 RON/mp',
    priceNum: 18,
    responseTime: '~40 min',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&auto=format&fit=crop&q=80',
    phone: '0745 678 901',
    whatsapp: '0745 678 901',
    email: 'adrian.zugrav@gmail.com',
    description: 'Zugrăveli mecanizate și clasice, gletuit, montaj tapet, profile decorative, vopsele lavabile antimucegai. Curățenie impecabilă la final.',
    tags: ['Zugrăveli', 'Glet', 'Lavabilă', 'Curat la cheie'],
    coordinates: { lat: 46.7690, lng: 23.5950 }
  },
  {
    id: 'prov-10',
    name: 'Tudor Montaj Mobilă Express',
    role: 'Montator Mobilier Dedeman, IKEA, Jysk',
    categorySlug: 'montaj-mobila',
    city: 'Cluj-Napoca',
    district: 'Toate cartierele Cluj & Florești, Baciu',
    rating: 4.9,
    reviewsCount: 41,
    isVerified: true,
    isPro: true,
    is247: false,
    isUrgentAvailable: true,
    price: 'de la 100 RON',
    priceNum: 100,
    responseTime: '~20 min',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=300&auto=format&fit=crop&q=80',
    phone: '0732 111 444',
    whatsapp: '0732 111 444',
    email: 'tudor.montaj@gmail.com',
    description: 'Montaj profesionist dulapuri cu uși glisante, bucătării la cheie, corpuri suspendate, paturi, canapele, birouri și debitare blat.',
    tags: ['IKEA', 'Dedeman', 'Bucătării', 'Montaj Mobilă'],
    coordinates: { lat: 46.7730, lng: 23.5850 }
  }
];

export const MARKETPLACE_PRODUCTS: MarketplaceProduct[] = [
  {
    id: 'prod-1',
    name: 'Miere Polifloră Pure de Munte (1kg)',
    producer: 'Stupina Tradițională Apuseni',
    price: 35,
    unit: 'borcan',
    city: 'Cluj-Napoca',
    category: 'Miere & Apicole',
    image: 'https://images.unsplash.com/photo-1587049352847-4a222e784d38?w=300&auto=format&fit=crop&q=80',
    description: 'Miere 100% naturală din zona montană Gilău/Apuseni, neprelucrată termic, bogată în enzime și polen.',
    inStock: true,
    badge: '100% Natural',
    rating: 5.0,
    reviewsCount: 28
  },
  {
    id: 'prod-2',
    name: 'Dulceață de Nuci Verzi cu Scorțișoară',
    producer: 'Cămara Bunicii Someșeni',
    price: 25,
    unit: 'borcan (310g)',
    city: 'Cluj-Napoca',
    category: 'Conserve & Dulcețuri',
    image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=300&auto=format&fit=crop&q=80',
    description: 'Rețetă veche din Transilvania. Nuci verzi culese la început de vară, fiarte în ceaun cu zahăr brun și baton de vanilie.',
    inStock: true,
    badge: 'Produs Local',
    rating: 4.9,
    reviewsCount: 19
  },
  {
    id: 'prod-3',
    name: 'Ouă de Țară de la Găini Crescute pe Iarbă (30 buc)',
    producer: 'Ferma Câmpenească Baciu',
    price: 38,
    unit: 'cofraj',
    city: 'Cluj-Napoca',
    category: 'Produse Proaspete',
    image: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=300&auto=format&fit=crop&q=80',
    description: 'Ouă proaspete zilnic de la găini crescute liber în aer liber. Gălbenuș intens, hrană fără chimicale.',
    inStock: true,
    badge: 'Proaspăt Azi',
    rating: 4.9,
    reviewsCount: 45
  },
  {
    id: 'prod-4',
    name: 'Brânză Proaspătă de Oaie în Burduf de Brad',
    producer: 'Muncelul de Jos - Mărginime',
    price: 45,
    unit: 'kg',
    city: 'Cluj-Napoca',
    category: 'Lactate Tradiționale',
    image: 'https://images.unsplash.com/photo-1452195100486-9cc805987862?w=300&auto=format&fit=crop&q=80',
    description: 'Brânză tradițională framântată manual și maturată în coajă de brad. Gust cremos și aromă autentică.',
    inStock: true,
    badge: 'Rețetă Autentică',
    rating: 5.0,
    reviewsCount: 33
  }
];

export const PROMOTION_PACKAGES: PromotionPackage[] = [
  {
    id: 'pkg-1',
    code: 'basic',
    name: 'Basic',
    price: 19,
    durationDays: 7,
    features: [
      'Afișare pe LOCO Instant',
      'Valabil 7 zile',
      'Includere în căutările din oraș',
      'Insignă Prestator Activ'
    ],
    color: 'emerald'
  },
  {
    id: 'pkg-2',
    code: 'standard',
    name: 'Standard',
    price: 39,
    durationDays: 14,
    features: [
      'Top 3 în Categorie',
      'Promovare pe grupuri locale & social media',
      'Valabil 14 zile',
      'Notificare push către clienți noi',
      'Link direct pe WhatsApp & Telefon'
    ],
    color: 'indigo',
    popular: true
  },
  {
    id: 'pkg-3',
    code: 'premium',
    name: 'Premium Ultra Boost',
    price: 79,
    durationDays: 30,
    features: [
      'Afișare prioritară pe Prima Pagină & Hartă',
      'Campanie de reclame dedicată (FB, OLX, TikTok, Instagram)',
      'Valabil 30 zile',
      'Evidențiere cu insignă Verificat PRO Gold',
      'Statistici detaliate apeluri & vizualizări'
    ],
    color: 'amber'
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'Ofertă nouă primită!',
    message: 'Vasile Mureșan a trimis o ofertă de 120 RON pentru solicitarea ta de instalații.',
    time: 'Acum 5 min',
    read: false,
    type: 'quote'
  },
  {
    id: 'notif-2',
    title: 'Comandă confirmată Escrow',
    message: 'Suma de 150 RON este blocată în siguranță în portofelul Escrow până la finalizarea lucrării.',
    time: 'Acum 2 ore',
    read: false,
    type: 'order'
  },
  {
    id: 'notif-3',
    title: 'Pachetul tău de promovare e activ',
    message: 'Anunțul tău "Electrician Autorizat" beneficiază de vizibilitate sporită timp de 14 zile.',
    time: 'Ieri, 18:30',
    read: true,
    type: 'promo'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    targetId: 'prov-1',
    targetType: 'provider',
    targetName: 'Vasile Mureșan - Instalații Pro',
    authorName: 'Alexandru Pop',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    rating: 5,
    comment: 'A ajuns în mai puțin de 20 de minute în Zorilor la o defecțiune de robinet spart. Lucrare foarte curată, echipament modern și preț exact conform estimării din aplicație. Recomand 100%!',
    createdAt: '05 Aug 2026',
    isVerifiedEscrow: true,
    serviceName: 'Schimbare robinet principal & fitinguri',
    tags: ['⚡ Foarte Rapid', '🔧 Punctual', '💰 Preț Corect'],
    reply: {
      authorName: 'Vasile Mureșan',
      comment: 'Mulțumesc mult Alexandru! Să le folosești cu plăcere și mă bucur că plată securizată Escrow a funcționat perfect.',
      createdAt: '05 Aug 2026'
    }
  },
  {
    id: 'rev-2',
    targetId: 'prov-1',
    targetType: 'provider',
    targetName: 'Vasile Mureșan - Instalații Pro',
    authorName: 'Ioana Moldovan',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    rating: 5,
    comment: 'Montaj centrală termică și radiator suplimentar. Dna. Vasile este un meseriaș autorizat de nota 10. Am primit garanție scrisă și bon de la casă.',
    createdAt: '28 Iul 2026',
    isVerifiedEscrow: true,
    serviceName: 'Montaj centrală termică',
    tags: ['🛡️ Garanție', '🤝 Amabil', '🧹 Curat la final']
  },
  {
    id: 'rev-3',
    targetId: 'prov-4',
    targetType: 'provider',
    targetName: 'Elena & Team Clean Pro',
    authorName: 'Cristian Rus',
    authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
    rating: 5,
    comment: 'Echipa Elenei a lăsat apartamentul impecabil după lucrările de zugrăvit! Canapeaua a fost curățată cu injecție-extracție Kärcher și arată ca nouă.',
    createdAt: '08 Aug 2026',
    isVerifiedEscrow: true,
    serviceName: 'Curățenie ap. 3 camere',
    tags: ['✨ Impecabil', '🧹 Curat la final', '⚡ Rapid']
  },
  {
    id: 'rev-4',
    targetId: 'prov-3',
    targetType: 'provider',
    targetName: 'Ion Popescu Electric - ElectroGrup',
    authorName: 'Simona Barbu',
    authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
    rating: 5,
    comment: 'Schimbare tablou electric vechi cu siguranțe automate Schneider. Electrician extrem de priceput și amabil. Plată prin Escrow simplă.',
    createdAt: '01 Aug 2026',
    isVerifiedEscrow: true,
    serviceName: 'Inlocuire tablou electric ANRE',
    tags: ['⚡ ANRE Autorizat', '🛡️ Siguranță', '🔧 Profesionist']
  }
];

export const INITIAL_ORDERS: OrderItem[] = [
  {
    id: 'ORD-2026-8812',
    providerId: 'prov-1',
    providerName: 'Vasile Mureșan',
    providerRole: 'Instalator Sanitari & Gaz',
    providerImage: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=150&auto=format&fit=crop&q=80',
    serviceName: 'Schimbare baterie baie & verificare robinet principal',
    amount: 120,
    city: 'Cluj-Napoca (Zorilor)',
    status: 'in_desfasurare',
    date: '10 Aug 2026, 11:30',
    escrowStatus: 'securizat',
    chatHistory: [
      { sender: 'client', text: 'Bună ziua, puteți ajunge în jur de ora 14:00?', time: '11:15' },
      { sender: 'provider', text: 'Da, sigur. Sunt pe drum spre Zorilor și am piesele necesare.', time: '11:20' }
    ]
  },
  {
    id: 'ORD-2026-7419',
    providerId: 'prov-4',
    providerName: 'Elena & Team Clean Pro',
    providerRole: 'Curățenie Generală',
    providerImage: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=150&auto=format&fit=crop&q=80',
    serviceName: 'Curățenie ap. 3 camere după zugrăvit',
    amount: 280,
    city: 'Cluj-Napoca (Mănăștur)',
    status: 'platita',
    date: '08 Aug 2026, 16:00',
    escrowStatus: 'eliberat',
    hasReview: true,
    reviewId: 'rev-3',
    chatHistory: [
      { sender: 'provider', text: 'Am finalizat curățenia. Vă rog verificați geamurile și pardoseala.', time: '15:45' },
      { sender: 'client', text: 'Totul arată impecabil! Am confirmat eliberarea plății.', time: '15:58' }
    ]
  }
];

export const REWARD_CATALOG: RewardItem[] = [
  {
    id: 'rew-1',
    title: 'Voucher 20 RON Reducere Comandă',
    description: 'Valabil la orice lucrare cu plată securizată Escrow de peste 100 RON.',
    pointsCost: 200,
    discountValue: '20 RON',
    type: 'voucher',
    code: 'LOCO20OFF',
    icon: '🎟️',
    badgeTag: 'Popular'
  },
  {
    id: 'rew-2',
    title: 'Comision Escrow 0% (Protecție Gratuită)',
    description: 'Fără nicio taxă administrativă de garantare pentru următoarea ta lucrare.',
    pointsCost: 350,
    discountValue: '100% Taxă Escrow',
    type: 'escrow_free',
    code: 'ESCROWFREE2026',
    icon: '🛡️',
    badgeTag: 'Recomandat'
  },
  {
    id: 'rew-3',
    title: 'Boost Anunț 7 Zile În Top Rezultate',
    description: 'Apare în prima poziție la căutările din orașul tău și primește insigna Pro.',
    pointsCost: 500,
    discountValue: 'Valoare 89 RON',
    type: 'promo_boost',
    code: 'BOOST7DAYS',
    icon: '🚀'
  },
  {
    id: 'rew-4',
    title: 'Badge Exclusiv "Client VIP Gold"',
    description: 'Răspuns prioritar de la top meșteri și sprijin dedicat de la echipa Loco.',
    pointsCost: 800,
    discountValue: 'Status VIP',
    type: 'badge_accent',
    code: 'VIPGOLD2026',
    icon: '👑'
  }
];

export const INITIAL_USER_BADGES: UserBadge[] = [
  {
    id: 'badge-1',
    name: 'Membru Verificat',
    description: 'Identitate & număr de telefon confirmate pe platformă.',
    icon: '🛡️',
    unlocked: true,
    unlockedAt: '15 Ian 2025',
    progress: 1,
    maxProgress: 1,
    category: 'loyalty'
  },
  {
    id: 'badge-2',
    name: 'Seria de Foc (3 Zile)',
    description: 'Logare consecutivă timp de 3 zile în aplicație.',
    icon: '🔥',
    unlocked: true,
    unlockedAt: 'Ieri',
    progress: 3,
    maxProgress: 3,
    category: 'speed'
  },
  {
    id: 'badge-3',
    name: 'Master Comenzi Local',
    description: 'Ai finalizat cel puțin 2 lucrări sau cumpărături cu plată Escrow.',
    icon: '🏆',
    unlocked: true,
    unlockedAt: '08 Aug 2026',
    progress: 2,
    maxProgress: 2,
    category: 'loyalty'
  },
  {
    id: 'badge-4',
    name: 'Ambasador Loco',
    description: 'Ai invitat 3 prieteni pe platformă folosind codul tău unic.',
    icon: '🤝',
    unlocked: false,
    progress: 1,
    maxProgress: 3,
    category: 'social'
  },
  {
    id: 'badge-5',
    name: 'Răspuns Ultracorespundent',
    description: 'Trimite sau răspunde la 5 solicitări în sub 10 minute.',
    icon: '⚡',
    unlocked: false,
    progress: 2,
    maxProgress: 5,
    category: 'speed'
  }
];

export const CURRENT_USER: UserProfile = {
  id: 'usr-881',
  name: 'Adina Traică',
  email: 'adinatraica@gmail.com',
  phone: '0740 123 999',
  city: 'Cluj-Napoca',
  role: 'client',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  isVerified: true,
  joinedDate: 'Ianuarie 2025',
  points: 450,
  streakDays: 3,
  lastCheckInDate: '2026-08-10',
  isCheckedInToday: false,
  tier: 'Silver',
  referralCode: 'ADINA2026',
  referralsCount: 1,
  referralEarnings: 100,
  badges: INITIAL_USER_BADGES,
  preferences: {
    preferredCategories: ['instalator', 'electrician', 'curatenie'],
    radiusKm: 5,
    enableDealAlerts: true,
    enableStreakReminders: true,
    enableUrgentNearbyAlerts: true,
    pushChannels: {
      browser: true,
      sms: true,
      email: true
    }
  },
  referralHistory: [
    {
      id: 'ref-1',
      friendName: 'Mihai Popescu',
      friendEmail: 'mihai.p***@gmail.com',
      status: 'Comandă Plasată',
      pointsEarned: 100,
      date: '02 Aug 2026'
    }
  ],
  pointsHistory: [
    {
      id: 'pt-1',
      action: 'Bonus daily streak (Ziua 3)',
      points: 40,
      type: 'earn',
      date: '10 Aug 2026, 09:15',
      category: 'streak'
    },
    {
      id: 'pt-2',
      action: 'Curățenie ap. 3 camere - Comandă Escrow finalizată',
      points: 50,
      type: 'earn',
      date: '08 Aug 2026, 16:05',
      category: 'order'
    },
    {
      id: 'pt-3',
      action: 'Adăugare recenzie verificată (Elena & Team Clean)',
      points: 25,
      type: 'earn',
      date: '08 Aug 2026, 16:10',
      category: 'review'
    },
    {
      id: 'pt-4',
      action: 'Bonus log-in zilnic (Ziua 2)',
      points: 30,
      type: 'earn',
      date: '09 Aug 2026, 10:00',
      category: 'streak'
    },
    {
      id: 'pt-5',
      action: 'Invitare prieten înregistrat (Mihai Popescu)',
      points: 100,
      type: 'earn',
      date: '02 Aug 2026, 14:20',
      category: 'referral'
    },
    {
      id: 'pt-6',
      action: 'Schimbare baterie baie - Comandă Escrow creată',
      points: 50,
      type: 'earn',
      date: '01 Aug 2026, 11:30',
      category: 'order'
    },
    {
      id: 'pt-7',
      action: 'Adăugare recenzie verificată (Vasile Mureșan)',
      points: 25,
      type: 'earn',
      date: '28 Iul 2026, 18:45',
      category: 'review'
    },
    {
      id: 'pt-8',
      action: 'Bonus log-in zilnic (Ziua 1)',
      points: 20,
      type: 'earn',
      date: '28 Iul 2026, 09:00',
      category: 'streak'
    },
    {
      id: 'pt-9',
      action: 'Completare profil & verificare număr telefon',
      points: 60,
      type: 'earn',
      date: '15 Ian 2025, 12:00',
      category: 'profile'
    },
    {
      id: 'pt-10',
      action: 'Bonus de bun venit pe Loco Instant',
      points: 50,
      type: 'earn',
      date: '15 Ian 2025, 11:55',
      category: 'welcome'
    }
  ],
  complianceData: {
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
    isCaenEligible: true,
    authorizations: [
      {
        id: 'auth-anre-1',
        type: 'anre',
        title: 'Autorizație Electrician & Instalații ANRE (Grad IIA)',
        issuer: 'Autoritatea Națională de Reglementare în Domeniul Energiei',
        docNumber: 'ANRE-2024-CJ-8841',
        issuedAt: '15 Ian 2024',
        expiresAt: '31 Dec 2028',
        status: 'verified',
        verificationBadge: 'ANRE Autorizat ⚡',
        fileName: 'autorizatie_anre_muresan.pdf',
        fileSize: '1.2 MB'
      }
    ],
    earlyBirdEligible: true,
    earlyBirdActivated: true,
    earlyBirdExpiresAt: '60 Zile Rămase (0% Comision)',
    verificationScore: 85,
    verifiedAt: '10 Aug 2026',
    idCardUploaded: true,
    cuiCertificateUploaded: true,
    status: 'verified',
    lastApiCheck: 'Astăzi, 11:30'
  }
};

export const MOCK_USER_ADS: UserAd[] = [
  {
    id: 'ad-1',
    title: 'Curățenie Profesională Rezidențială & Birouri Cluj-Napoca',
    category: 'Curățenie & Menaj',
    city: 'Cluj-Napoca',
    price: 'De la 120 Lei/ședință',
    status: 'boosted',
    packageType: 'PROMO-VIP 2026',
    viewsCount: 1420,
    contactsCount: 184,
    conversionRate: 12.96,
    publishedDate: '15 Iun 2026',
    expiresInDays: 18,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80',
    analytics7d: [
      { date: '06 Aug', vizualizari: 145, contacte: 18, apeluri: 10, mesaje: 5, cereriOferta: 3 },
      { date: '07 Aug', vizualizari: 162, contacte: 22, apeluri: 12, mesaje: 6, cereriOferta: 4 },
      { date: '08 Aug', vizualizari: 198, contacte: 29, apeluri: 15, mesaje: 9, cereriOferta: 5 },
      { date: '09 Aug', vizualizari: 210, contacte: 31, apeluri: 16, mesaje: 10, cereriOferta: 5 },
      { date: '10 Aug', vizualizari: 245, contacte: 36, apeluri: 20, mesaje: 11, cereriOferta: 5 },
      { date: '11 Aug', vizualizari: 230, contacte: 32, apeluri: 18, mesaje: 9, cereriOferta: 5 },
      { date: '12 Aug', vizualizari: 230, contacte: 16, apeluri: 8, mesaje: 5, cereriOferta: 3 }
    ],
    analytics30d: [
      { date: 'Săpt 1', vizualizari: 280, contacte: 32, apeluri: 18, mesaje: 9, cereriOferta: 5 },
      { date: 'Săpt 2', vizualizari: 340, contacte: 42, apeluri: 22, mesaje: 13, cereriOferta: 7 },
      { date: 'Săpt 3', vizualizari: 390, contacte: 52, apeluri: 28, mesaje: 16, cereriOferta: 8 },
      { date: 'Săpt 4', vizualizari: 410, contacte: 58, apeluri: 32, mesaje: 18, cereriOferta: 8 }
    ]
  },
  {
    id: 'ad-2',
    title: 'Instalații Sanitare Urgente 24/7 & Desfundări Cămine',
    category: 'Instalații & Sanitari',
    city: 'Cluj-Napoca',
    price: 'De la 150 Lei',
    status: 'boosted',
    packageType: 'Standard Boost',
    viewsCount: 890,
    contactsCount: 112,
    conversionRate: 12.58,
    publishedDate: '01 Iul 2026',
    expiresInDays: 3,
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
    analytics7d: [
      { date: '06 Aug', vizualizari: 95, contacte: 12, apeluri: 8, mesaje: 3, cereriOferta: 1 },
      { date: '07 Aug', vizualizari: 110, contacte: 15, apeluri: 10, mesaje: 3, cereriOferta: 2 },
      { date: '08 Aug', vizualizari: 135, contacte: 19, apeluri: 12, mesaje: 5, cereriOferta: 2 },
      { date: '09 Aug', vizualizari: 140, contacte: 20, apeluri: 13, mesaje: 5, cereriOferta: 2 },
      { date: '10 Aug', vizualizari: 155, contacte: 21, apeluri: 14, mesaje: 5, cereriOferta: 2 },
      { date: '11 Aug', vizualizari: 130, contacte: 15, apeluri: 10, mesaje: 3, cereriOferta: 2 },
      { date: '12 Aug', vizualizari: 125, contacte: 10, apeluri: 6, mesaje: 3, cereriOferta: 1 }
    ]
  },
  {
    id: 'ad-3',
    title: 'Montaj Parchet, Rigips & Zugrăveli Interioare Premium',
    category: 'Finisaje & Zugrăveli',
    city: 'Cluj-Napoca',
    price: 'Ofertă personalizată',
    status: 'active',
    packageType: 'Gratuit',
    viewsCount: 540,
    contactsCount: 48,
    conversionRate: 8.88,
    publishedDate: '10 Iul 2026',
    expiresInDays: 22,
    image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=600&q=80',
    analytics7d: [
      { date: '06 Aug', vizualizari: 60, contacte: 5, apeluri: 3, mesaje: 1, cereriOferta: 1 },
      { date: '07 Aug', vizualizari: 72, contacte: 6, apeluri: 3, mesaje: 2, cereriOferta: 1 },
      { date: '08 Aug', vizualizari: 80, contacte: 8, apeluri: 4, mesaje: 2, cereriOferta: 2 },
      { date: '09 Aug', vizualizari: 85, contacte: 9, apeluri: 5, mesaje: 2, cereriOferta: 2 },
      { date: '10 Aug', vizualizari: 92, contacte: 10, apeluri: 5, mesaje: 3, cereriOferta: 2 },
      { date: '11 Aug', vizualizari: 78, contacte: 6, apeluri: 3, mesaje: 2, cereriOferta: 1 },
      { date: '12 Aug', vizualizari: 73, contacte: 4, apeluri: 2, mesaje: 1, cereriOferta: 1 }
    ]
  },
  {
    id: 'ad-4',
    title: 'Transport Marfă & Mutări Mobilitate Rapidă Transilvania',
    category: 'Transport & Mutări',
    city: 'Cluj-Napoca',
    price: 'De la 100 Lei',
    status: 'paused',
    packageType: 'Gratuit',
    viewsCount: 320,
    contactsCount: 22,
    conversionRate: 6.87,
    publishedDate: '20 Iul 2026',
    expiresInDays: 1,
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80',
    analytics7d: [
      { date: '06 Aug', vizualizari: 30, contacte: 2, apeluri: 1, mesaje: 1, cereriOferta: 0 },
      { date: '07 Aug', vizualizari: 35, contacte: 3, apeluri: 2, mesaje: 1, cereriOferta: 0 },
      { date: '08 Aug', vizualizari: 40, contacte: 3, apeluri: 2, mesaje: 1, cereriOferta: 0 },
      { date: '09 Aug', vizualizari: 42, contacte: 4, apeluri: 2, mesaje: 1, cereriOferta: 1 },
      { date: '10 Aug', vizualizari: 45, contacte: 4, apeluri: 2, mesaje: 1, cereriOferta: 1 },
      { date: '11 Aug', vizualizari: 38, contacte: 2, apeluri: 1, mesaje: 1, cereriOferta: 0 },
      { date: '12 Aug', vizualizari: 30, contacte: 1, apeluri: 1, mesaje: 0, cereriOferta: 0 }
    ]
  },
  {
    id: 'ad-5',
    title: 'Servicii Electrician Autorizat ANRE & Tablouri Electrice',
    category: 'Instalații & Electricieni',
    city: 'Cluj-Napoca',
    price: 'De la 90 Lei',
    status: 'pending_review',
    packageType: 'Gratuit',
    viewsCount: 15,
    contactsCount: 0,
    conversionRate: 0,
    publishedDate: 'Astăzi, 13 Aug 2026',
    expiresInDays: 30,
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
    analytics7d: [
      { date: '13 Aug', vizualizari: 15, contacte: 0, apeluri: 0, mesaje: 0, cereriOferta: 0 }
    ]
  },
  {
    id: 'ad-6',
    title: 'Reparații Electrocasnice & Mașini de Spălat la Domiciliu',
    category: 'Reparații & Service',
    city: 'Cluj-Napoca',
    price: 'Diagnoză gratuită',
    status: 'expired',
    packageType: 'Standard Boost',
    viewsCount: 410,
    contactsCount: 38,
    conversionRate: 9.26,
    publishedDate: '10 Mai 2026',
    expiresInDays: 0,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80',
    analytics7d: [
      { date: '06 Aug', vizualizari: 12, contacte: 1, apeluri: 1, mesaje: 0, cereriOferta: 0 },
      { date: '07 Aug', vizualizari: 5, contacte: 0, apeluri: 0, mesaje: 0, cereriOferta: 0 }
    ]
  }
];

