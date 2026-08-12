"use client";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/logo";
import {
  LayoutDashboard,
  Sprout,
  FlaskConical,
  Bug,
  Landmark,
  Bot,
  Settings,
  LogOut,
  Map,
  Tractor,
  Lightbulb,
  Droplets,
  Flower,
  Info,
  LifeBuoy,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTranslation } from "@/lib/i18n";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useTranslation();

  const menuItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/analysis", label: "Analytics", icon: Tractor },
    { href: "/dashboard/diagnostics", label: "Diagnostics", icon: Sprout },
    { href: "/dashboard/soil-analysis", label: "Soil Analysis", icon: FlaskConical },
    { href: "/dashboard/pest-prediction", label: "Pest Prediction", icon: Bug },
    { href: "/dashboard/health-map", label: "Health Map", icon: Map },
    { href: "/dashboard/market", label: "Market", icon: Landmark },
    { href: "/dashboard/crop-advisor", label: "Crop Advisor", icon: Lightbulb },
    { href: "/dashboard/irrigation-schedule", label: "Irrigation", icon: Droplets },
    { href: "/dashboard/weed-identification", label: "Weed ID", icon: Flower },
    { href: "/dashboard/voice-assistant", label: "Assistant", icon: Bot },
  ];
  
  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  const bottomMenuItems = [
      { key: "About Us", href: "/dashboard/about", label: "About Us", icon: Info },
      { key: "Support", href: "/dashboard/support", label: "Support", icon: LifeBuoy },
      { key: "Settings", href: "/dashboard/settings", label: "Settings", icon: Settings },
  ]

  return (
    <Sidebar collapsible="icon" className="bg-card border-r">
      <SidebarHeader className="h-14 flex items-center px-4 lg:px-6">
        <Logo href="/dashboard" />
      </SidebarHeader>
      <SidebarContent className="flex-1 p-2">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))}
                className="justify-start"
                variant="ghost"
                tooltip={t(item.label)}
              >
                <Link href={item.href}>
                  <item.icon className="h-5 w-5" />
                  <span>{t(item.label)}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <SidebarMenu>
          {bottomMenuItems.map((item) => (
             <SidebarMenuItem key={item.key}>
              <SidebarMenuButton
                isActive={pathname.startsWith(item.href)}
                className="justify-start"
                variant="ghost"
                tooltip={t(item.label)}
                asChild
              >
                <Link href={item.href}>
                    <item.icon className="h-5 w-5" />
                    <span>{t(item.label)}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
            <SidebarMenuItem>
                 <SidebarMenuButton
                    onClick={handleLogout}
                    className="justify-start"
                    variant="ghost"
                    tooltip={t("Log Out")}
                >
                    <LogOut className="h-5 w-5" />
                    <span>{t("Log Out")}</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
