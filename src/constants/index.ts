// Application Config
export const APP_CONFIG = {
  name: 'WhatsClose',
  tagline: 'Le local à portée de main',
  description: 'Révolutionnez vos courses locales avec nos casiers intelligents 24/7',
  version: '1.0.0',
  launchDate: 'Q1 2025',
  website: 'https://whatsclose.com',
  support: 'support@whatsclose.com'
};

// API Config
export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || '/api',
  timeout: 10000,
  retryAttempts: 3,
  retryDelay: 1000
};

// Animation Config
export const ANIMATION_CONFIG = {
  // Durées standard
  duration: {
    instant: 0.1,
    fast: 0.3,
    normal: 0.5,
    slow: 0.8,
    verySlow: 1.2
  },
  
  // Easing functions
  easing: {
    smooth: [0.4, 0, 0.2, 1],
    bounce: [0.68, -0.55, 0.265, 1.55],
    elastic: [0.175, 0.885, 0.32, 1.275]
  },
  
  // Spring animations
  spring: {
    gentle: { stiffness: 100, damping: 10 },
    normal: { stiffness: 200, damping: 20 },
    stiff: { stiffness: 400, damping: 30 }
  }
};

// 3D Scene Config
export const SCENE_CONFIG = {
  camera: {
    defaultPosition: [0, 5, 15] as [number, number, number],
    defaultFOV: 60,
    near: 0.1,
    far: 1000
  },
  
  scenes: [
    {
      id: 'chat',
      name: 'Chat',
      position: [0, 5, 15] as [number, number, number],
      lookAt: [0, 0, 0] as [number, number, number],
      fov: 60
    },
    {
      id: 'market',
      name: 'Producteurs Locaux',
      position: [-15, 8, 10] as [number, number, number],
      lookAt: [-15, 0, -10] as [number, number, number],
      fov: 50
    },
    {
      id: 'locker',
      name: 'Casiers Intelligents',
      position: [15, 8, 10] as [number, number, number],
      lookAt: [15, 0, -10] as [number, number, number],
      fov: 50
    },
    {
      id: 'delivery',
      name: 'Livraison Express',
      position: [0, 10, -20] as [number, number, number],
      lookAt: [0, 0, -30] as [number, number, number],
      fov: 50
    },
    {
      id: 'app',
      name: 'Application Mobile',
      position: [0, 8, 20] as [number, number, number],
      lookAt: [0, 0, 10] as [number, number, number],
      fov: 50
    }
  ]
};

// Survey Questions
export const SURVEY_QUESTIONS = {
  maxSteps: 9,
  typingDelay: 1000,
  readingTimePerWord: 200, // ms
  
  validationRules: {
    firstName: {
      minLength: 2,
      maxLength: 50,
      pattern: /^[a-zA-ZÀ-ÿ\s'-]+$/
    },
    email: {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    city: {
      minLength: 2,
      maxLength: 100
    }
  }
};

// UI Config
export const UI_CONFIG = {
  glassmorphism: {
    background: 'bg-black/20',
    backdropBlur: 'backdrop-blur-2xl',
    border: 'border-white/10'
  },
  
  colors: {
    primary: '#4ade80',
    primaryDark: '#22c55e',
    secondary: '#3b82f6',
    accent: '#f59e0b',
    danger: '#ef4444',
    success: '#10b981'
  },
  
  breakpoints: {
    mobile: 640,
    tablet: 768,
    laptop: 1024,
    desktop: 1280
  }
};

// Local Storage Keys
export const STORAGE_KEYS = {
  userData: 'whatsclose_user_data',
  surveyProgress: 'whatsclose_survey_progress',
  preferences: 'whatsclose_preferences',
  completedSurvey: 'whatsclose_completed',
  apiCache: 'whatsclose_api_cache'
};

// Analytics Events
export const ANALYTICS_EVENTS = {
  // Page views
  pageView: 'page_view',
  
  // Survey events
  surveyStarted: 'survey_started',
  surveyProgress: 'survey_progress',
  surveyCompleted: 'survey_completed',
  surveyAbandoned: 'survey_abandoned',
  
  // Story events
  storyStarted: 'story_started',
  storySceneViewed: 'story_scene_viewed',
  storyCompleted: 'story_completed',
  storySkipped: 'story_skipped',
  
  // Interaction events
  buttonClicked: 'button_clicked',
  linkClicked: 'link_clicked',
  formSubmitted: 'form_submitted',
  
  // 3D Scene events
  sceneInteraction: '3d_scene_interaction',
  cameraMove: '3d_camera_move'
};

// Error Messages
export const ERROR_MESSAGES = {
  network: 'Une erreur réseau est survenue. Veuillez réessayer.',
  validation: 'Veuillez vérifier les informations saisies.',
  submission: 'Impossible d\'envoyer vos données. Veuillez réessayer.',
  generic: 'Une erreur inattendue est survenue.',
  emailExists: 'Cette adresse email est déjà enregistrée.',
  invalidEmail: 'L\'adresse email n\'est pas valide.',
  requiredField: 'Ce champ est obligatoire.',
  minLength: (field: string, min: number) => `${field} doit contenir au moins ${min} caractères.`,
  maxLength: (field: string, max: number) => `${field} ne doit pas dépasser ${max} caractères.`
};

// Success Messages
export const SUCCESS_MESSAGES = {
  surveySaved: 'Vos réponses ont été sauvegardées.',
  surveyCompleted: 'Merci d\'avoir complété le sondage !',
  emailSent: 'Un email de confirmation a été envoyé.',
  copied: 'Copié dans le presse-papier !',
  subscribed: 'Vous êtes maintenant inscrit à notre newsletter.'
};

// Feature Flags
export const FEATURES = {
  enableAnalytics: process.env.NODE_ENV === 'production',
  enableDebugMode: process.env.NODE_ENV === 'development',
  enable3DEffects: true,
  enableAnimations: true,
  enableSoundEffects: false,
  enableEmailValidation: true,
  enableLocalStorage: true,
  enableAPICache: true
};

// Benefits Data
export const BENEFITS = [
  {
    title: 'Produits Ultra-Frais',
    description: 'Directement du producteur à votre casier en moins de 24h',
    icon: '🥬'
  },
  {
    title: 'Disponible 24/7',
    description: 'Récupérez vos courses quand vous voulez, où vous voulez',
    icon: '⏰'
  },
  {
    title: 'Circuit Court',
    description: 'Soutenez l\'économie locale et réduisez votre empreinte carbone',
    icon: '🌱'
  },
  {
    title: 'Prix Juste',
    description: 'Sans intermédiaire, des prix équitables pour tous',
    icon: '💰'
  }
];

// Cities (for launch)
export const LAUNCH_CITIES = [
  'Lyon',
  'Paris',
  'Marseille',
  'Toulouse',
  'Bordeaux',
  'Lille',
  'Nantes',
  'Strasbourg',
  'Montpellier',
  'Nice'
];

// Social Links
export const SOCIAL_LINKS = {
  twitter: 'https://twitter.com/whatsclose',
  linkedin: 'https://linkedin.com/company/whatsclose',
  instagram: 'https://instagram.com/whatsclose',
  facebook: 'https://facebook.com/whatsclose'
};