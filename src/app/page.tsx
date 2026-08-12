import Image from 'next/image';
import {
  Sprout,
  FlaskConical,
  Bug,
  Landmark,
  Lightbulb,
  Droplets,
  Tractor,
  CheckCircle,
  MapPin,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { LandingHeader } from '@/components/landing/header';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const features = [
  {
    name: 'AI Diagnostics',
    description: 'Upload an image of a plant to identify diseases and pests, and get instant treatment advice.',
    icon: Sprout,
    href: '/login?redirect_to=/dashboard/diagnostics',
  },
  {
    name: 'Soil Analysis',
    description: 'Analyze soil health by uploading an image and receive recommendations for crops and improvements.',
    icon: FlaskConical,
    href: '/login?redirect_to=/dashboard/soil-analysis',
  },
  {
    name: 'Pest Prediction',
    description: 'Get weather-based forecasts for pest and disease risks to take timely preventative action.',
    icon: Bug,
    href: '/login?redirect_to=/dashboard/pest-prediction',
  },
  {
    name: 'Crop Advisor',
    description: 'Receive AI-powered crop recommendations based on your soil, budget, and location for maximum profitability.',
    icon: Lightbulb,
    href: '/login?redirect_to=/dashboard/crop-advisor',
  },
  {
    name: 'Market Prices',
    description: 'Stay updated with real-time market prices for various crops from different markets across India.',
    icon: Landmark,
    href: '/login?redirect_to=/dashboard/market',
  },
  {
    name: 'Smart Irrigation',
    description: 'Generate a 7-day, weather-based irrigation schedule to optimize water usage and improve crop yield.',
    icon: Droplets,
    href: '/login?redirect_to=/dashboard/irrigation-schedule',
  },
];

export default function LandingPage() {
    const heroBg = PlaceHolderImages.find(p => p.id === 'login-background');
  return (
    <div className="text-gray-900">
      <LandingHeader />

      <main>
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-emerald-950 perspective-1000">
             {heroBg && (
                <div className="absolute inset-0 z-0 opacity-40">
                    <Image
                        src={heroBg.imageUrl}
                        alt=""
                        fill
                        className="object-cover scale-105 transform transition duration-[10000ms] ease-out hover:scale-100"
                        priority
                        data-ai-hint={heroBg.imageHint}
                    />
                </div>
            )}
            
            {/* Soft background gradients and glows */}
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/95 via-emerald-900/70 to-emerald-950 z-0"></div>
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/25 rounded-full blur-[140px] pointer-events-none animate-pulse-soft z-0"></div>
            <div className="absolute -bottom-48 -right-48 w-[400px] h-[400px] bg-accent/15 rounded-full blur-[120px] pointer-events-none animate-pulse-soft delay-200 z-0"></div>

            {/* Floating visual elements (3D tilt) */}
            <div className="hidden lg:block absolute bottom-24 right-16 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.2)] animate-float max-w-xs text-left z-10 transition-all duration-500 hover:[transform:translateY(-10px)_rotateX(6deg)_rotateY(-6deg)] preserve-3d">
              <div className="flex items-center gap-3 translate-z-20">
                 <div className="bg-primary p-2.5 rounded-xl text-white shadow-[0_8px_16px_rgba(5,150,105,0.3),inset_0_1px_0_rgba(255,255,255,0.2)]">
                    <Sprout className="h-5 w-5" />
                 </div>
                 <div>
                    <h4 className="text-white font-bold text-sm">Smart Farming</h4>
                    <p className="text-emerald-100/90 text-xs mt-0.5">AI crop insights in real-time</p>
                 </div>
              </div>
            </div>

            <div className="hidden lg:block absolute top-24 left-16 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.2)] animate-float delay-300 max-w-xs text-left z-10 transition-all duration-500 hover:[transform:translateY(-10px)_rotateX(6deg)_rotateY(6deg)] preserve-3d">
              <div className="flex items-center gap-3 translate-z-20">
                 <div className="bg-accent p-2.5 rounded-xl text-emerald-950 shadow-[0_8px_16px_rgba(245,158,11,0.3),inset_0_1px_0_rgba(255,255,255,0.2)]">
                    <FlaskConical className="h-5 w-5" />
                 </div>
                 <div>
                    <h4 className="text-white font-bold text-sm">Soil Report</h4>
                    <p className="text-emerald-100/90 text-xs mt-0.5">99.4% Diagnostic Accuracy</p>
                 </div>
              </div>
            </div>

            <div className="relative z-10 mx-auto max-w-7xl px-4 py-28 text-center sm:px-6 sm:py-36 lg:px-8">
                 <div className="animate-fade-in-up">
                     <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 mb-6 shadow-sm">
                        <CheckCircle className="h-3 w-3 text-accent" /> Empowering Modern Indian Agriculture
                     </span>
                     <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl leading-tight">
                        Connecting Farmers to <span className="text-accent relative inline-block">Success<span className="absolute -bottom-1 left-0 w-full h-1.5 bg-accent/80 rounded-full"></span></span>
                    </h1>
                 </div>
                <p className="mx-auto mt-6 max-w-lg text-lg sm:text-xl text-emerald-100/90 sm:max-w-2xl md:max-w-3xl leading-relaxed animate-fade-in-up delay-100">
                    Empowering farmers with AI-driven insights, real-time data, and a connected community to revolutionize agriculture.
                </p>
                <div className="mx-auto mt-10 max-w-sm sm:flex sm:max-w-none sm:justify-center animate-fade-in-up delay-200">
                    <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/95 text-white font-bold px-8 py-6 rounded-xl shadow-[0_10px_25px_rgba(5,150,105,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] hover:shadow-[0_15px_30px_rgba(5,150,105,0.4)] hover:-translate-y-1 transition-all duration-300" asChild>
                        <Link href="/login">Get Started</Link>
                    </Button>
                </div>
            </div>
        </div>

        {/* Features Section (3D Perspective Cards) */}
        <section id="features" className="py-24 bg-gradient-to-b from-green-50/20 via-emerald-50/5 to-white relative perspective-1000">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-green-100/60 text-primary border border-green-200/30 uppercase tracking-widest">
                Our Features
              </span>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
                Everything you need to grow
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-500 leading-relaxed">
                KrishiConnect provides a suite of AI-powered tools to help you
                make smarter farming decisions.
              </p>
            </div>

            <div className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                 <div 
                   key={feature.name} 
                   className="bg-white border border-green-100/60 rounded-2xl p-8 shadow-[0_15px_30px_-15px_rgba(5,150,105,0.04),inset_0_1px_1px_rgba(255,255,255,0.8)] hover:shadow-[0_35px_60px_-20px_rgba(5,150,105,0.15)] hover:[transform:rotateX(6deg)_rotateY(-4deg)_translateZ(15px)] transition-all duration-500 group flex flex-col h-full relative preserve-3d"
                 >
                   <Link href={feature.href} className="flex flex-col h-full justify-between preserve-3d">
                      <div className="preserve-3d">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-emerald-500 text-white shadow-md shadow-primary/20 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 translate-z-20">
                          <feature.icon className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 pt-6 group-hover:text-primary transition-colors duration-200 translate-z-10">{feature.name}</h3>
                        <p className="mt-3 text-sm leading-relaxed text-gray-500">
                          {feature.description}
                        </p>
                      </div>
                      <div className="mt-6 flex items-center text-xs font-bold text-primary gap-1 group-hover:translate-x-1 transition-transform duration-200 translate-z-10">
                        Explore Feature &rarr;
                      </div>
                    </Link>
                 </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <div className="bg-white py-16 px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="mx-auto max-w-7xl">
                <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-950 via-primary to-emerald-900 px-6 py-20 text-center shadow-[0_20px_50px_rgba(5,150,105,0.15)] sm:px-12 md:py-24 border border-emerald-800/20">
                     <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(245,158,11,0.08),transparent_50%)]"></div>
                     <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(5,150,105,0.2),transparent_40%)]"></div>
                     
                     <div className="relative z-10 max-w-3xl mx-auto">
                         <h2 className="text-3xl font-black text-white sm:text-4xl md:text-5xl tracking-tight leading-tight">
                            Ready to transform your farming business?
                        </h2>
                        <p className="mx-auto mt-6 max-w-xl text-lg text-emerald-100/95 leading-relaxed">
                            Join thousands of farmers already using KrishiConnect to increase their income and grow their operations.
                        </p>
                        <div className="mt-10 flex justify-center">
                             <Button size="lg" className="bg-white text-emerald-900 hover:bg-emerald-50 hover:text-emerald-950 font-bold px-8 py-6 rounded-xl shadow-lg hover:shadow-white/10 hover:-translate-y-0.5 transition-all duration-300 border-none" asChild>
                                <Link href="/login">Get Started Today &rarr;</Link>
                             </Button>
                        </div>
                     </div>
                </div>
            </div>
        </div>
      </main>

      {/* Footer */}
        <footer className="bg-emerald-950 text-white border-t border-emerald-900 relative z-10">
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <Link href="/" className="flex items-center gap-2">
                                <Sprout className="h-8 w-8 text-primary animate-pulse-soft" />
                                <span className="text-2xl font-black text-white">
                                    Krishi<span className="text-accent">Connect</span>
                                </span>
                            </Link>
                        </div>
                        <p className="text-sm text-emerald-100/70 leading-relaxed">
                            Empowering farmers with technology to grow their agricultural business and improve their livelihoods.
                        </p>
                        <div className="flex space-x-4 pt-2">
                            <a href="#" className="p-2 rounded-lg bg-emerald-900/40 text-emerald-300 hover:text-white hover:bg-primary transition-all duration-200 hover:-translate-y-0.5"><Facebook className="h-5 w-5" /></a>
                            <a href="#" className="p-2 rounded-lg bg-emerald-900/40 text-emerald-300 hover:text-white hover:bg-primary transition-all duration-200 hover:-translate-y-0.5"><Twitter className="h-5 w-5" /></a>
                            <a href="#" className="p-2 rounded-lg bg-emerald-900/40 text-emerald-300 hover:text-white hover:bg-primary transition-all duration-200 hover:-translate-y-0.5"><Instagram className="h-5 w-5" /></a>
                            <a href="#" className="p-2 rounded-lg bg-emerald-900/40 text-emerald-300 hover:text-white hover:bg-primary transition-all duration-200 hover:-translate-y-0.5"><Linkedin className="h-5 w-5" /></a>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400">Solutions</h3>
                        <ul className="mt-4 space-y-2.5">
                            {features.map(f => (
                               <li key={f.name}>
                                 <a href={f.href} className="text-sm text-emerald-100/75 hover:text-white hover:translate-x-1 inline-block transition-all duration-200">
                                   {f.name}
                                 </a>
                               </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400">Company</h3>
                        <ul className="mt-4 space-y-2.5">
                            <li><a href="/about" className="text-sm text-emerald-100/75 hover:text-white hover:translate-x-1 inline-block transition-all duration-200">About Us</a></li>
                            <li><a href="#" className="text-sm text-emerald-100/75 hover:text-white hover:translate-x-1 inline-block transition-all duration-200">Careers</a></li>
                            <li><a href="/contact" className="text-sm text-emerald-100/75 hover:text-white hover:translate-x-1 inline-block transition-all duration-200">Contact</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400">Contact</h3>
                        <ul className="mt-4 space-y-3.5 text-sm text-emerald-100/75">
                            <li className="flex items-start">
                                <MapPin className="h-5 w-5 mr-3 text-primary flex-shrink-0" />
                                <span>RKGIT Ghaziabad</span>
                            </li>
                            <li className="flex items-center">
                                <User className="h-5 w-5 mr-3 text-primary" />
                                <span>Chirag Sharma</span>
                            </li>
                            <li className="flex items-center">
                                <Mail className="h-5 w-5 mr-3 text-primary" />
                                <span className="break-all">cp707802@gmail.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-16 border-t border-emerald-900/60 pt-8 text-center text-sm text-emerald-100/40">
                    <p>&copy; {new Date().getFullYear()} KrishiConnect. All rights reserved.</p>
                </div>
            </div>
        </footer>
    </div>
  );
}
