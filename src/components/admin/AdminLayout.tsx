

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
  Tags,
  PlusCircle,
  Image as ImageIcon,
} from 'lucide-react';
import { Logo } from '../Logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '../ui/button';
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
    href: '/admin/media',
    label: 'Media',
    icon: ImageIcon,
  },
  {
    href: '/admin/categories',
    label: 'Categories',
    icon: Tags,
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
        <div className='flex flex-col h-screen'>
            <header className="flex h-14 items-center justify-between border-b bg-background px-4 shrink-0">
            <div className="flex items-center gap-2">
                <SidebarTrigger />
                <div className="flex items-center gap-2 text-lg font-semibold">
                    <h1>{pageTitle}</h1>
                </div>
            </div>
            </header>
            <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
