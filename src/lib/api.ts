import { UserData, SurveySubmission } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// Configuration des headers par défaut
const defaultHeaders = {
  'Content-Type': 'application/json',
};

// Gestion des erreurs API
class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

// Fonction fetch avec gestion d'erreur
async function fetchWithError(url: string, options?: RequestInit) {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new ApiError(response.status, `HTTP error! status: ${response.status}`);
  }

  return response;
}

// API Endpoints
export const api = {
  // Soumettre le formulaire de survey
  submitSurvey: async (data: UserData): Promise<SurveySubmission> => {
    try {
      const response = await fetchWithError(`${API_BASE_URL}/submit-survey`, {
        method: 'POST',
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      // Track event si Google Analytics est configuré
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'survey_completed', {
          event_category: 'engagement',
          event_label: data.city,
          value: 1
        });
      }

      return result;
    } catch (error) {
      console.error('Survey submission error:', error);
      
      // Retourner une réponse d'erreur formatée
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Une erreur est survenue',
        error: 'submission_failed'
      };
    }
  },

  // Vérifier si un email existe déjà
  checkEmail: async (email: string): Promise<{ exists: boolean }> => {
    try {
      const response = await fetchWithError(`${API_BASE_URL}/check-email`, {
        method: 'POST',
        body: JSON.stringify({ email }),
      });

      return await response.json();
    } catch (error) {
      console.error('Email check error:', error);
      return { exists: false };
    }
  },

  // Obtenir les statistiques (si nécessaire)
  getStats: async (): Promise<any> => {
    try {
      const response = await fetchWithError(`${API_BASE_URL}/stats`);
      return await response.json();
    } catch (error) {
      console.error('Stats fetch error:', error);
      return null;
    }
  },

  // Envoyer un feedback
  sendFeedback: async (feedback: {
    message: string;
    email?: string;
    rating?: number;
  }): Promise<{ success: boolean }> => {
    try {
      const response = await fetchWithError(`${API_BASE_URL}/feedback`, {
        method: 'POST',
        body: JSON.stringify(feedback),
      });

      return await response.json();
    } catch (error) {
      console.error('Feedback submission error:', error);
      return { success: false };
    }
  },
};

// Fonction pour gérer le retry avec exponential backoff
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0) {
      throw error;
    }
    
    await new Promise(resolve => setTimeout(resolve, delay));
    return retryWithBackoff(fn, retries - 1, delay * 2);
  }
}

// Export des fonctions utilitaires
export const apiHelpers = {
  // Formatter les données avant envoi
  formatSurveyData: (data: Partial<UserData>): UserData => {
    return {
      firstName: data.firstName?.trim() || '',
      lastName: data.lastName?.trim(),
      email: data.email?.toLowerCase().trim() || '',
      city: data.city?.trim() || '',
      localConsumption: data.localConsumption,
      impressedBy: data.impressedBy || [],
      subscription: data.subscription,
    };
  },

  // Valider les données côté client
  validateSurveyData: (data: Partial<UserData>): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!data.firstName || data.firstName.length < 2) {
      errors.push('Le prénom doit contenir au moins 2 caractères');
    }

    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push('L\'adresse email n\'est pas valide');
    }

    if (!data.city || data.city.length < 2) {
      errors.push('La ville doit contenir au moins 2 caractères');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  },

  // Gérer la mise en cache locale
  cacheResponse: (key: string, data: any, ttl: number = 3600000) => {
    if (typeof window === 'undefined') return;
    
    const item = {
      data,
      expiry: Date.now() + ttl,
    };
    
    try {
      localStorage.setItem(`api_cache_${key}`, JSON.stringify(item));
    } catch (error) {
      console.error('Cache storage error:', error);
    }
  },

  getCachedResponse: (key: string): any => {
    if (typeof window === 'undefined') return null;
    
    try {
      const item = localStorage.getItem(`api_cache_${key}`);
      if (!item) return null;
      
      const parsed = JSON.parse(item);
      
      if (Date.now() > parsed.expiry) {
        localStorage.removeItem(`api_cache_${key}`);
        return null;
      }
      
      return parsed.data;
    } catch (error) {
      console.error('Cache retrieval error:', error);
      return null;
    }
  },
};