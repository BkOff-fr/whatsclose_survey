import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Configuration du middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

export function middleware(request: NextRequest) {
  // Headers de sécurité
  const headers = new Headers(request.headers);
  
  // Content Security Policy
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdnjs.cloudflare.com https://www.googletagmanager.com;
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https:;
    font-src 'self' data:;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    block-all-mixed-content;
    upgrade-insecure-requests;
    connect-src 'self' https://www.google-analytics.com;
  `.replace(/\s{2,}/g, ' ').trim();

  // Appliquer les headers de sécurité
  const response = NextResponse.next();
  
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Content-Security-Policy', cspHeader);
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  );
  
  // Headers pour optimiser les performances
  response.headers.set(
    'Link',
    '<https://fonts.googleapis.com>; rel=preconnect, <https://cdnjs.cloudflare.com>; rel=preconnect'
  );

  // Gérer la redirection pour les anciennes URLs (si nécessaire)
  const url = request.nextUrl.clone();
  
  // Exemple de redirection
  if (url.pathname === '/survey') {
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  // Analytics tracking (côté serveur si nécessaire)
  if (process.env.NODE_ENV === 'production') {
    // Log des visites pour analytics
    const visitorData = {
      path: request.nextUrl.pathname,
      userAgent: request.headers.get('user-agent'),
      referer: request.headers.get('referer'),
      timestamp: new Date().toISOString(),
    };
    
    // Vous pouvez envoyer ces données à votre service d'analytics
    // console.log('Page visit:', visitorData);
  }

  return response;
}

// Fonction utilitaire pour vérifier les bots
function isBot(userAgent: string | null): boolean {
  if (!userAgent) return false;
  
  const bots = [
    'bot',
    'crawl',
    'spider',
    'scraper',
    'facebookexternalhit',
    'WhatsApp',
    'Slack',
    'Twitter',
    'telegram'
  ];
  
  return bots.some(bot => 
    userAgent.toLowerCase().includes(bot.toLowerCase())
  );
}

// Fonction pour gérer le rate limiting basique
const requestCounts = new Map<string, { count: number; resetTime: number }>();

function rateLimit(ip: string, limit: number = 100, window: number = 60000): boolean {
  const now = Date.now();
  const record = requestCounts.get(ip);
  
  if (!record || now > record.resetTime) {
    requestCounts.set(ip, {
      count: 1,
      resetTime: now + window
    });
    return true;
  }
  
  if (record.count >= limit) {
    return false;
  }
  
  record.count++;
  return true;
}

// Nettoyage périodique de la map des requêtes
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of requestCounts.entries()) {
    if (now > record.resetTime) {
      requestCounts.delete(ip);
    }
  }
}, 60000); // Nettoyer toutes les minutes