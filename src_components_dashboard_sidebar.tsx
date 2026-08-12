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
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

const menuItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/analysis", icon: Tractor, label: "Analytics" },
  { href: "/dashboard/diagnostics", icon: Sprout, label: "Diagnostics" },
  { href: "/dashboard/soil-analysis", icon: FlaskConical, label: "Soil Analysis" },
  { href: "/dashboard/pest-prediction", icon: Bug, label: "Pest Prediction" },
  { href: "/dashboard/health-map", icon: Map, label: "Health Map" },
  { href: "/dashboard/market", icon: Landmark, label: "Market" },
  { href: "/dashboard/crop-advisor", icon: Lightbulb, label: "Crop Advisor" },
  { href: "/dashboard/irrigation-schedule", icon: Droplets, label: "Irrigation" },
  { href: "/dashboard/weed-identification", icon: Flower, label: "Weed ID" },
  { href: "/dashboard/voice-assistant", icon: Bot, label: "Assistant" },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  const bottomMenuItems = [
    { href: "/dashboard/about", icon: Info, label: "About Us", action: () => router.push('/dashboard/about') },
    { href: "/dashboard/support", icon: LifeBuoy, label: "Support", action: () => router.push('/dashboard/support') },
    { href: "/dashboard/settings", icon: Settings, label: "Settings", action: () => router.push('/dashboard/settings') },
    { href: "/", icon: LogOut, label: "Log Out", action: handleLogout },
]

  return (
    <Sidebar collapsible="icon" className="bg-card border-r">
      <SidebarHeader className="h-14 flex items-center px-4 lg:px-6">
        <Logo />
      </SidebarHeader>
      <SidebarContent className="flex-1 p-2">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={item.href === '/dashboard' ? pathname === item.href : pathname.startsWith(item.href)}
                className="justify-start"
                variant="ghost"
                tooltip={item.label}
              >
                <Link href={item.href}>
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <SidebarMenu>
          {bottomMenuItems.map((item) => (
             <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                onClick={item.action}
                isActive={pathname.startsWith(item.href) && item.href !== "/"}
                className="justify-start"
                variant="ghost"
                tooltip={item.label}
              >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
