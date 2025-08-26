import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validation des données
    if (!data.email || !data.firstName || !data.city) {
      return NextResponse.json(
        { error: 'Données manquantes' },
        { status: 400 }
      );
    }

    // Ici, vous pouvez :
    // 1. Sauvegarder dans une base de données
    // 2. Envoyer un email de confirmation
    // 3. Ajouter à une newsletter
    // 4. Envoyer à un CRM

    // Exemple de structure de données reçues
    const surveyData = {
      firstName: data.firstName,
      city: data.city,
      email: data.email,
      localConsumption: data.localConsumption,
      impressedBy: data.impressedBy,
      subscription: data.subscription,
      submittedAt: new Date().toISOString(),
    };

    // Log pour développement (à remplacer par vraie persistence)
    console.log('Survey submission:', surveyData);

    // Simuler un délai de traitement
    await new Promise(resolve => setTimeout(resolve, 500));

    // Réponse de succès
    return NextResponse.json({
      success: true,
      message: 'Merci pour votre participation !',
      data: {
        firstName: data.firstName,
        city: data.city,
      }
    });

  } catch (error) {
    console.error('Erreur lors de la soumission:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'WhatsClose Survey API',
    version: '1.0.0'
  });
}