'use client';

import Link from 'next/link';
import { Logo } from '../Logo';
import { useEffect, useState } from 'react';

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
    <path d="M10.1 12.1a2.5 2.5 0 1 0-2.2 0" />
    <path d="M16.3 12.1a2.5 2.5 0 1 0-2.2 0" />
    <path d="M4 6.8V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.8a2.59 2.59 0 0 0-2.1-2.6 11.4 11.4 0 0 0-15.8 0A2.59 2.59 0 0 0 4 6.8Z" />
    <path d="m9.4 17.5 1.8-1.4 1.3 1.4" />
    <path d="M16 16.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z" />
  </svg>
);

export function Footer() {
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

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
