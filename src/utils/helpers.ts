import { UserData } from '@/types';

// Validation des emails
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Formatage du prénom
export const formatFirstName = (name: string): string => {
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
};

// Validation des données utilisateur
export const validateUserData = (data: Partial<UserData>): boolean => {
  if (!data.firstName || data.firstName.trim().length < 2) return false;
  if (!data.city || data.city.trim().length < 2) return false;
  if (!data.email || !validateEmail(data.email)) return false;
  return true;
};

// Calcul du temps de lecture
export const calculateReadingTime = (text: string): number => {
  const wordsPerMinute = 200;
  const wordCount = text.split(' ').length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute * 60 * 1000);
  return Math.max(readingTime, 1000); // Minimum 1 seconde
};

// Gestion du localStorage avec fallback
export const storage = {
  get: (key: string, defaultValue: any = null) => {
    if (typeof window === 'undefined') return defaultValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  },
  
  set: (key: string, value: any) => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  },
  
  remove: (key: string) => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }
};

// Debounce function
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = setTimeout(() => {
      func(...args);
    }, wait);
  };
};

// Throttle function
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Interpolation linéaire
export const lerp = (start: number, end: number, t: number): number => {
  return start * (1 - t) + end * t;
};

// Clamp value between min and max
export const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, value));
};

// Random entre deux valeurs
export const randomBetween = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

// Format date
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

// Détection mobile
export const isMobile = (): boolean => {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

// Détection Safari
export const isSafari = (): boolean => {
  if (typeof window === 'undefined') return false;
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
};

// Analytics helper (si vous utilisez Google Analytics)
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value
    });
  }
};

// Copier dans le presse-papier
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};

// Generateur d'ID unique
export const generateUniqueId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};