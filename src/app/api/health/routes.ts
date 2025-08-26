import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Vérifications de santé
  const checks = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0',
    checks: {
      server: true,
      database: true, // À implémenter si vous avez une DB
      cache: true,    // À implémenter si vous avez un cache
    }
  };

  // Vérifier si tous les services sont healthy
  const isHealthy = Object.values(checks.checks).every(check => check === true);

  if (!isHealthy) {
    return NextResponse.json(
      { ...checks, status: 'unhealthy' },
      { status: 503 }
    );
  }

  return NextResponse.json(checks, { status: 200 });
}

// Endpoint pour les métriques (optionnel)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Log des métriques (à adapter selon votre système de monitoring)
    console.log('Metrics received:', {
      timestamp: new Date().toISOString(),
      metrics: body
    });

    return NextResponse.json({ 
      success: true,
      message: 'Metrics recorded' 
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid metrics data' },
      { status: 400 }
    );
  }
}