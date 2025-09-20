'use client';

import Link from 'next/link';
import { Logo } from '../Logo';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

// Custom SVG components for WhatsApp and WeChat
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
  </svg>
);

const WeChatIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21.5 10.5c0 5.25-4.25 9.5-9.5 9.5s-9.5-4.25-9.5-9.5S6.75 1 12 1s9.5 4.25 9.5 9.5z" />
    <path d="M8 10.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5S10.33 9 9.5 9s-1.5.67-1.5 1.5z" />
    <path d="M14.5 10.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5S16.83 9 16 9s-1.5.67-1.5 1.5z" />
  </svg>
);


export function Footer() {
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="border-t border-border/40 bg-background/95">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <Logo />
            <p className="mt-2 text-sm text-muted-foreground">Your guide to Saigon's nightlife.</p>
          </div>
          <div className="flex items-center space-x-6">
            <Link href="#" className="text-muted-foreground hover:text-primary">
              <WeChatIcon className="h-5 w-5" />
              <span className="sr-only">WeChat</span>
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary">
              <WhatsAppIcon className="h-5 w-5" />
              <span className="sr-only">WhatsApp</span>
            </Link>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
          {currentYear && <p>&copy; {currentYear} Aura KTV. All rights reserved.</p>}
        </div>
      </div>
    </footer>
  );
}
