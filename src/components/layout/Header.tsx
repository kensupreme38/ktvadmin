
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from '../Logo';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/directory', label: 'Karaoke List' },
  { href: '/articles', label: 'Aura Insights'},
  { href: '/contact', label: 'Contact' },
];

const NavLinks = ({ className }: { className?: string }) => {
  const pathname = usePathname();
  // Hide nav links on admin pages
  if (pathname.startsWith('/admin')) {
    return null;
  }
  return (
    <nav className={cn('flex items-center gap-4 lg:gap-6', className)}>
      {navLinks.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary',
            pathname === href ? 'text-primary' : 'text-muted-foreground'
          )}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
};

const MobileNavLinks = () => {
    const pathname = usePathname();
    return (
        <div className="flex flex-col space-y-3">
            {navLinks.map(({ href, label }) => (
            <Link
                key={href}
                href={href}
                className={cn(
                'text-base font-medium transition-colors hover:text-primary',
                pathname === href ? 'text-primary' : 'text-foreground'
                )}
            >
                {label}
            </Link>
            ))}
        </div>
    );
};

export function Header() {
  const pathname = usePathname();
  if (pathname.startsWith('/admin')) {
    return null;
  }
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        {/* Desktop Logo */}
        <div className="mr-4 hidden md:flex">
          <Link href="/">
            <Logo />
          </Link>
        </div>
        
        {/* Mobile Menu & Logo */}
        <div className="flex w-full items-center justify-between md:hidden">
            <Sheet>
                <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="mr-2">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle Menu</span>
                </Button>
                </SheetTrigger>
                <SheetContent side="left" className="pr-0">
                    <SheetHeader>
                        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                    </SheetHeader>
                    <Link href="/" className="flex items-center mb-6">
                        <Logo />
                    </Link>
                    <div className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
                        <MobileNavLinks />
                    </div>
                </SheetContent>
            </Sheet>
          <div className="flex justify-center">
             <Link href="/">
                <Logo />
             </Link>
          </div>
           {/* Empty div to balance the flexbox */}
          <div className="w-10"></div>
        </div>

        {/* Desktop Nav */}
        <div className="hidden flex-1 items-center justify-end space-x-2 md:flex">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Can add search here if needed */}
          </div>
          <NavLinks />
        </div>
      </div>
    </header>
  );
}
