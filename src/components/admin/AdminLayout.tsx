'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarTrigger,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
} from '@/components/ui/sidebar';
import {
  Home,
  Building2,
  FileText,
  Users,
  Settings,
  LogOut,
  CalendarCheck,
} from 'lucide-react';
import { Logo } from '../Logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '../ui/button';

const menuItems = [
  {
    href: '/admin',
    label: 'Dashboard',
    icon: Home,
  },
  {
    href: '/admin/ktvs',
    label: 'KTVs',
    icon: Building2,
  },
  {
    href: '/admin/bookings',
    label: 'Bookings',
    icon: CalendarCheck,
  },
  {
    href: '/admin/articles',
    label: 'Articles',
    icon: FileText,
  },
  {
    href: '/admin/users',
    label: 'Users',
    icon: Users,
  },
  {
    href: '/admin/settings',
    label: 'Settings',
    icon: Settings,
  },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMobile = useIsMobile();

  return (
    <SidebarProvider
      defaultOpen={!isMobile}
      collapsible={isMobile ? 'offcanvas' : 'icon'}
    >
      <Sidebar side="left" variant="sidebar" className="p-0">
        <SidebarContent className="flex flex-col p-2">
          <SidebarHeader>
            <Logo />
          </SidebarHeader>
          <SidebarMenu className="flex-1">
            {menuItems.map(({ href, label, icon: Icon }) => (
              <SidebarMenuItem key={href}>
                <Link href={href}>
                  <SidebarMenuButton
                    isActive={pathname === href}
                    tooltip={{ children: label }}
                    asChild
                  >
                    <div>
                      <Icon />
                      <span>{label}</span>
                    </div>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
          <SidebarFooter className="flex-col !items-stretch">
            <div className="flex items-center gap-2 rounded-md p-2 hover:bg-muted">
              <Avatar className="h-9 w-9">
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <div className="flex flex-col text-sm group-data-[collapsible=icon]:hidden">
                <span className="font-semibold">Admin User</span>
                <span className="text-muted-foreground">admin@aura.com</span>
              </div>
            </div>
             <Button variant="ghost" className="justify-start gap-2">
                <LogOut />
                <span className="group-data-[collapsible=icon]:hidden">Logout</span>
             </Button>
          </SidebarFooter>
        </SidebarContent>
      </Sidebar>

      <SidebarInset>
        <header className="flex h-14 items-center justify-between border-b bg-background px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <h1 className="text-lg font-semibold">Dashboard</h1>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}

// Custom hook to detect mobile screen
function useIsMobile() {
    const [isMobile, setIsMobile] = React.useState(false);

    React.useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    return isMobile;
}
