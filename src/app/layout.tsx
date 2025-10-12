import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'Aura KTV - Admin',
  description: 'Admin dashboard for Aura KTV.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
      </head>
      <body className={cn('antialiased min-h-screen flex flex-col no-scrollbar')} suppressHydrationWarning>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
