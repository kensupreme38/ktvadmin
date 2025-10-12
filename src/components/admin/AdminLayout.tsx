

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
  Building2,
  Settings,
  LogOut,
  Bell,
  Tags,
  ChevronRight,
  PlusCircle,
  Image as ImageIcon,
} from 'lucide-react';
import { Logo } from '../Logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useIsMobile } from '@/hooks/use-mobile';


const menuItems = [
  {
    href: '/admin',
    label: 'KTVs',
    icon: Building2,
  },
  {
    href: '/admin/ktvs/new',
    label: 'Thêm KTV',
    icon: PlusCircle,
  },
  {
    href: '/admin/categories',
    label: 'Categories',
    icon: Tags,
  },
  {
    href: '/admin/media',
    label: 'Media',
    icon: ImageIcon,
  },
  {
    href: '/admin/settings',
    label: 'Settings',
    icon: Settings,
  },
];

const notifications = [
    {
        title: "New booking from Nguyen Van A",
        description: "Kingdom KTV - VIP Room, 2024-07-20 at 8:00 PM",
    },
    {
        title: "New review for Catwalk KTV",
        description: "'The place to see and be seen. Very high-end...' - David Chen",
    },
     {
        title: "Booking Canceled",
        description: "Le Van C canceled their booking for ICOOL KTV.",
    },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const [hasUnread, setHasUnread] = React.useState(true);

  const getPageTitle = () => {
    if (pathname.startsWith('/admin/ktvs/new')) {
      return 'Add New KTV';
    }
    const menuItem = menuItems.find(item => pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href)));
    return menuItem?.label || 'KTVs';
  };
  
  const pageTitle = getPageTitle();

  return (
    <SidebarProvider
      defaultOpen={!isMobile}
      collapsible={isMobile ? 'offcanvas' : 'icon'}
    >
      <Sidebar side="left" className="p-0">
        <SidebarContent className="flex flex-col p-2">
          <SidebarHeader>
            <Logo />
          </SidebarHeader>
          <SidebarMenu className="flex-1">
            {menuItems.map(({ href, label, icon: Icon }) => (
              <SidebarMenuItem key={href}>
                <Link href={href}>
                  <SidebarMenuButton
                    isActive={pathname === href || (href !== '/admin' && pathname.startsWith(href) && href !== '/admin/ktvs/new') || (href === '/admin/ktvs/new' && pathname === '/admin/ktvs/new')}
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
            <div className="flex items-center gap-2 text-lg font-semibold">
                {pathname.startsWith('/admin/ktvs/new') ? (
                  <>
                    <Link href="/admin" className="text-muted-foreground hover:text-foreground">KTVs</Link>
                    <ChevronRight className="h-4 w-4" />
                    <span>{pageTitle}</span>
                  </>
                ) : (
                  <h1>{pageTitle}</h1>
                )}
            </div>
          </div>
          <div>
            <Popover onOpenChange={() => setHasUnread(false)}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {hasUnread && <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary/80"></span>
                  </span>}
                  <span className="sr-only">Toggle notifications</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-[380px]">
                <div className="p-2">
                  <h3 className="font-medium">Notifications</h3>
                </div>
                <div className="space-y-2">
                  {notifications.map((notification, index) => (
                    <div key={index} className="p-2 hover:bg-muted rounded-md">
                        <p className="text-sm font-medium leading-none">{notification.title}</p>
                        <p className="text-sm text-muted-foreground">{notification.description}</p>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
