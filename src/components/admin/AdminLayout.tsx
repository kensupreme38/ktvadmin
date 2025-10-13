"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "@/components/ui/sidebar";
import {
  Building2,
  Settings,
  LogOut,
  Tags,
  PlusCircle,
  Image as ImageIcon,
  Users,
} from "lucide-react";
import { Logo } from "../Logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "../ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useUser } from "@/contexts/AuthContext";
import { signOut } from "@/lib/actions/auth";
import { useToast } from "@/hooks/use-toast";
import { UserNav } from "@/components/auth/UserNav";

const menuItems = [
  {
    href: "/admin",
    label: "KTVs",
    icon: Building2,
  },
  {
    href: "/admin/ktvs/new",
    label: "Add KTV",
    icon: PlusCircle,
  },
  {
    href: "/admin/media",
    label: "Media",
    icon: ImageIcon,
  },
  {
    href: "/admin/categories",
    label: "Categories",
    icon: Tags,
  },
  {
    href: "/admin/users",
    label: "Users",
    icon: Users,
  },
  {
    href: "/admin/settings",
    label: "Settings",
    icon: Settings,
  },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const { user, loading } = useUser();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      // Redirect sẽ được xử lý tự động bởi signOut()
    } catch (error) {
      // Chỉ hiển thị lỗi nếu KHÔNG phải redirect error
      if (error && typeof error === "object" && "digest" in error) {
        // Next.js redirect error - bỏ qua (đây là hành vi bình thường)
        return;
      }
      toast({
        title: "Sign out error",
        description: "Unable to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getPageTitle = () => {
    if (pathname.endsWith("/edit")) {
      return "Edit KTV";
    }
    if (pathname.startsWith("/admin/ktvs/new")) {
      return "Add New KTV";
    }
    const menuItem = menuItems.find(
      (item) =>
        pathname === item.href ||
        (item.href !== "/admin" && pathname.startsWith(item.href))
    );
    return menuItem?.label || "KTVs";
  };

  const pageTitle = getPageTitle();

  const userEmail = user?.email || "";
  const userName = user?.user_metadata?.full_name || userEmail.split("@")[0];
  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <SidebarProvider
      defaultOpen={!isMobile}
      collapsible={isMobile ? "offcanvas" : "icon"}
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
                    isActive={
                      pathname === href ||
                      (href !== "/admin" &&
                        pathname.startsWith(href) &&
                        href !== "/admin/ktvs/new") ||
                      (href === "/admin/ktvs/new" &&
                        pathname === "/admin/ktvs/new")
                    }
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
                <AvatarImage
                  src={user?.user_metadata?.avatar_url}
                  alt={userName}
                />
                <AvatarFallback>
                  {loading ? "..." : userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col text-sm group-data-[collapsible=icon]:hidden">
                <span className="font-semibold">
                  {loading ? "Loading..." : userName}
                </span>
                <span className="text-muted-foreground text-xs">
                  {loading ? "" : userEmail}
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              className="justify-start gap-2"
              onClick={handleSignOut}
              disabled={loading}
            >
              <LogOut />
              <span className="group-data-[collapsible=icon]:hidden">
                Sign out
              </span>
            </Button>
          </SidebarFooter>
        </SidebarContent>
      </Sidebar>

      <SidebarInset>
        <div className="flex flex-col h-screen">
          <header className="flex h-14 items-center justify-between border-b bg-background px-4 shrink-0">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <div className="flex items-center gap-2 text-lg font-semibold">
                <h1>{pageTitle}</h1>
              </div>
            </div>
            <UserNav />
          </header>
          <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
