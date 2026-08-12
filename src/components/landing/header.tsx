
"use client"

import * as React from "react"
import Link from "next/link"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import {
  Sprout,
  FlaskConical,
  Bug,
  Landmark,
  Lightbulb,
  Droplets,
  Menu
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"

const components: { title: string; href: string; description: string, icon: React.ElementType }[] = [
  {
    title: "Diagnostics",
    href: "/login?redirect_to=/dashboard/diagnostics",
    description: "Identify crop diseases and pests by uploading an image.",
    icon: Sprout,
  },
  {
    title: "Soil Analysis",
    href: "/login?redirect_to=/dashboard/soil-analysis",
    description: "Get detailed soil health reports from a single picture.",
    icon: FlaskConical,
  },
  {
    title: "Pest Prediction",
    href: "/login?redirect_to=/dashboard/pest-prediction",
    description: "Forecast pest and disease risks based on weather data.",
    icon: Bug,
  },
  {
    title: "Crop Advisor",
    href: "/login?redirect_to=/dashboard/crop-advisor",
    description: "Receive AI-powered recommendations for profitable crops.",
    icon: Lightbulb,
  },
  {
    title: "Market Prices",
    href: "/login?redirect_to=/dashboard/market",
    description: "Track real-time prices for your crops from various markets.",
    icon: Landmark,
  },
  {
    title: "Irrigation Schedule",
    href: "/login?redirect_to=/dashboard/irrigation-schedule",
    description: "Optimize water usage with a smart, weather-based schedule.",
    icon: Droplets,
  },
]

export function LandingHeader() {
  const navLinks = [
      { href: "/", label: "Home" },
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
  ]
  return (
    <header className="sticky top-0 z-50 w-full border-b border-green-100/40 bg-white/80 shadow-[0_2px_20px_-4px_rgba(5,150,105,0.05)] backdrop-blur-md supports-[backdrop-filter]:bg-white/70 transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-20 items-center justify-between">
        <div className="flex items-center">
            <Logo />
        </div>
        
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList className="gap-1">
             {navLinks.map(link => (
                  <NavigationMenuItem key={link.label}>
                    <NavigationMenuLink asChild>
                      <Link href={link.href} className={cn(
                        navigationMenuTriggerStyle(), 
                        "font-medium text-gray-600 hover:text-primary hover:bg-green-50/50 rounded-lg transition-all duration-200"
                      )}>
                        {link.label}
                      </Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
             ))}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="font-medium text-gray-600 hover:text-primary hover:bg-green-50/50 rounded-lg transition-all duration-200">Features</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] rounded-xl shadow-xl border border-green-50/50 bg-white">
                    {components.map((component) => (
                      <ListItem
                        key={component.title}
                        title={component.title}
                        href={component.href}
                        icon={component.icon}
                      >
                        {component.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="hidden items-center gap-3 md:flex">
            <Button variant="ghost" className="font-medium text-gray-600 hover:text-primary hover:bg-green-50/50 rounded-lg transition-all duration-200" asChild>
                <Link href="/login">Login</Link>
            </Button>
            <Button className="font-medium bg-primary hover:bg-primary/90 text-white rounded-lg shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200" asChild>
                <Link href="/signup">Sign Up</Link>
            </Button>
        </div>

        <div className="md:hidden">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-lg border-green-100 hover:bg-green-50/50 hover:text-primary transition-all">
                        <Menu className="h-5 w-5" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[350px] border-l border-green-50 bg-white p-6">
                    <div className="flex flex-col gap-6 py-8">
                        <div className="flex items-center pb-4 border-b border-gray-100">
                            <Logo />
                        </div>
                        <nav className="flex flex-col gap-4">
                            {navLinks.map(link => (
                                <Link 
                                  key={link.label} 
                                  href={link.href} 
                                  className="text-base font-medium text-gray-600 hover:text-primary px-2 py-1.5 rounded-md hover:bg-green-50/50 transition-all"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                        <div className="h-px bg-gray-100 my-2" />
                        <div className="flex flex-col gap-3">
                             <Button variant="outline" className="w-full justify-center border-green-100 text-gray-600 hover:text-primary hover:bg-green-50/50 rounded-lg" asChild>
                                <Link href="/login">Login</Link>
                            </Button>
                            <Button className="w-full justify-center bg-primary hover:bg-primary/90 text-white rounded-lg" asChild>
                                <Link href="/signup">Sign Up</Link>
                            </Button>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
      </div>
    </header>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { icon: React.ElementType }
>(({ className, title, children, icon: Icon, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-all duration-200 hover:bg-green-50/40 hover:text-primary focus:bg-green-50/40 focus:text-primary",
            className
          )}
          {...props}
        >
          <div className="flex items-center gap-2 mb-1">
             <Icon className="h-4 w-4 text-primary"/>
            <div className="text-sm font-semibold text-gray-900 leading-none">{title}</div>
          </div>
          <p className="line-clamp-2 text-xs leading-normal text-gray-500">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"
