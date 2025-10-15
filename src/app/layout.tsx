import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';

// Optimize font loading with display swap
const inter = Inter({ 
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
  preload: true,
  variable: '--font-inter',
  adjustFontFallback: true,
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#171717' }
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL('https://hcmc-ktv.com'),
  title: {
    default: 'Asia Night Life - KTV Directory & Reviews',
    template: '%s | Asia Night Life',
  },
  description: 'Discover the best KTV venues in Asia. Reviews, ratings, and information about nightlife entertainment.',
  keywords: ['KTV', 'Asia', 'Nightlife', 'Entertainment', 'Reviews', 'Karaoke'],
  authors: [{ name: 'Asia Night Life' }],
  creator: 'Asia Night Life',
  publisher: 'Asia Night Life',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://hcmc-ktv.com',
    siteName: 'Asia Night Life',
    title: 'Asia Night Life - KTV Directory & Reviews',
    description: 'Discover the best KTV venues in Asia',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Asia Night Life - KTV Directory',
    description: 'Discover the best KTV venues in Asia',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://bgorfttjlqffhbqdoyzg.supabase.co" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://picsum.photos" />
        
        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="KTV Directory" />
        
        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js').then(
                    (registration) => {
                      console.log('SW registered:', registration.scope);
                    },
                    (err) => {
                      console.log('SW registration failed:', err);
                    }
                  );
                });
              }
            `,
          }}
        />
      </head>
      <body className={cn(inter.className, 'antialiased min-h-screen bg-background text-foreground no-scrollbar')} suppressHydrationWarning>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
