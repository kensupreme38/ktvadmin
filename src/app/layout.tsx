import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from '@/components/ui/toaster';
import { ScrollToTopButton } from '@/components/ScrollToTopButton';

export const metadata: Metadata = {
  title: 'Aura KTV - Ho Chi Minh City KTV Directory',
  description: 'Your ultimate guide to KTV venues in Ho Chi Minh City.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
      </head>
      <body className={cn('antialiased min-h-screen flex flex-col no-scrollbar')} suppressHydrationWarning>
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
        <Toaster />
        <ScrollToTopButton />
      </body>
    </html>
  );
}
