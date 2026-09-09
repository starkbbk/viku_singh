import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import './photographic-motion.css';
import './responsive.css';
import './photo-effects.css';

const display = localFont({
  src: '../../public/fonts/Anton-Regular.ttf',
  variable: '--font-display',
  display: 'swap',
  weight: '400',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#101210',
};

export const metadata: Metadata = {
  title: 'Viku Singh — Photography & Visual Stories',
  description: 'The photographic world of Viku Singh. Live events, fashion, street stories and moments in motion. Independent photographer based in New Delhi, India.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={display.variable}><body>{children}</body></html>;
}
