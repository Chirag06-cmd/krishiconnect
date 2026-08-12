
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, Mail, Phone, GraduationCap, Building, User } from "lucide-react";
import { LandingHeader } from "@/components/landing/header";
import { Sprout, MapPin } from "lucide-react";
import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const features = [
  {
    name: 'AI Diagnostics',
    href: '/dashboard/diagnostics',
  },
  {
    name: 'Soil Analysis',
    href: '/dashboard/soil-analysis',
  },
  {
    name: 'Pest Prediction',
    href: '/dashboard/pest-prediction',
  },
];


export default function AboutPage() {
  return (
    <div className="bg-green-50">
        <LandingHeader />
        <main className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">About KrishiConnect</h1>
                <p className="text-muted-foreground">
                AI-powered agricultural diagnostics and crop health monitoring.
                </p>
            </div>
            
            <Card>
                <CardHeader>
                <CardTitle>Project Overview</CardTitle>
                <CardDescription className="flex items-center gap-2 pt-2">
                    <Building className="h-4 w-4" />
                    Focus: Precision Agriculture & AI Insights
                </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <h3 className="font-semibold text-lg">AI-powered monitoring of crop health, soil condition, and pest risks using multispectral/hyperspectral imaging and sensor data.</h3>
                    <p className="text-muted-foreground">
                    Agriculture faces growing threats from soil degradation, unpredictable weather, and pest outbreaks, leading to reduced yields and economic losses. Traditional monitoring methods are often delayed, labor-intensive, and lack precision. There is a need for a unified software platform that integrates remote sensing and sensor data to provide timely, field-level insights on crop health, soil conditions, and pest risks using AI-driven analysis.
                    </p>
                </CardContent>
            </Card>
            </div>
        </main>
        {/* Footer */}
        <footer className="bg-dark text-white">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    <div>
                        <div className="flex items-center">
                            <Link href="/" className="flex items-center gap-2">
                                <Sprout className="h-8 w-8 text-primary" />
                                <span className="text-2xl font-bold text-white">
                                    Krishi<span className="text-accent">Connect</span>
                                </span>
                            </Link>
                        </div>
                        <p className="mt-4 text-gray-400">
                            Empowering farmers with technology to grow their agricultural business and improve their livelihoods.
                        </p>
                         <div className="mt-6 flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-white"><Facebook /></a>
                            <a href="#" className="text-gray-400 hover:text-white"><Twitter /></a>
                            <a href="#" className="text-gray-400 hover:text-white"><Instagram /></a>
                            <a href="#" className="text-gray-400 hover:text-white"><Linkedin /></a>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">Solutions</h3>
                        <ul className="mt-4 space-y-2">
                            {features.map(f => (
                               <li key={f.name}><a href={f.href} className="text-gray-400 hover:text-white">{f.name}</a></li>
                            ))}
                        </ul>
                    </div>
                     <div>
                        <h3 className="text-lg font-semibold">Company</h3>
                        <ul className="mt-4 space-y-2">
                            <li><a href="/about" className="text-gray-400 hover:text-white">About Us</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white">Careers</a></li>
                            <li><a href="/contact" className="text-gray-400 hover:text-white">Contact</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold">Contact</h3>
                        <ul className="mt-4 space-y-3 text-gray-400">
                            <li className="flex items-start">
                                <MapPin className="h-5 w-5 mr-2 mt-1 flex-shrink-0" />
                                <span>RKGIT Ghaziabad</span>
                            </li>
                            <li className="flex items-center">
                                <User className="h-5 w-5 mr-2" />
                                <span>Chirag Sharma</span>
                            </li>
                            <li className="flex items-center">
                                <Mail className="h-5 w-5 mr-2" />
                                <span>cp707802@gmail.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 border-t border-gray-700 pt-8 text-center text-gray-400">
                    <p>&copy; {new Date().getFullYear()} KrishiConnect. All rights reserved.</p>
                </div>
            </div>
        </footer>
    </div>
  );
}
