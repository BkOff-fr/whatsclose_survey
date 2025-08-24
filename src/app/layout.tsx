import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import LenisProvider from '@/components/providers/LenisProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'WhatsClose Survey - Découvrons vos besoins',
  description: 'Participez à notre sondage interactif pour nous aider à créer la meilleure expérience de produits locaux en casiers 24/7',
  keywords: 'WhatsClose, produits locaux, casiers, survey, sondage, alimentation locale',
  openGraph: {
    title: 'WhatsClose Survey',
    description: 'Aidez-nous à créer le futur des produits locaux',
    type: 'website',
    locale: 'fr_FR',
    siteName: 'WhatsClose'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WhatsClose Survey',
    description: 'Participez à notre sondage interactif'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <LenisProvider>
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}