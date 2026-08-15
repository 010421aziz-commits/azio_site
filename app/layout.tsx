import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: { default: 'Куран Академия | Бишкек', template: '%s | Куран Академия' },
  description: 'Куран жаттоо жана ижаза алуу медресеси — Куран, тажвид, араб тили жана диний сабактар.',
  openGraph: { type: 'website', locale: 'ky_KG', siteName: 'Куран Академия' },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ky">
      <body>{children}</body>
    </html>
  );
}