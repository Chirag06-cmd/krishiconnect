"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, MessageSquare, Sprout, MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin, AlertCircle, User } from "lucide-react";
import { LandingHeader } from "@/components/landing/header";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { saveContactMessage } from "@/ai/flows/save-contact-message";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


const faqItems = [
    {
        question: "How does the AI Fasal Salahkaar (Crop Advisor) work?",
        answer: "The AI Crop Advisor uses your location, soil type, farm size, and budget to analyze climate data and market trends. It then recommends the most profitable and suitable crops for your specific conditions."
    },
    {
        question: "Is the Disease & Pest Identification accurate?",
        answer: "Our AI model is trained on thousands of images of plant diseases and pests to provide a highly accurate diagnosis. For best results, please upload a clear, well-lit image of the affected area of the plant."
    },
    {
        question: "How is the Smart Irrigation Schedule generated?",
        answer: "The schedule is created by combining your crop type's water requirements with real-time weather forecast data for your location. This ensures your crops get the right amount of water, saving you resources and improving yield."
    },
    {
        question: "Is my data secure?",
        answer: "Yes, we take data privacy very seriously. All your farm data is encrypted and securely stored. We do not share your personal information with third parties without your consent."
    }
];

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


export default function ContactPage() {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
        const result = await saveContactMessage({ name, email, subject, message });

        if (result.success) {
            toast({
            title: "Message Sent Successfully!",
            description: "Thank you for contacting us. We will get back to you shortly.",
            });
            // Clear the form
            setName('');
            setEmail('');
            setSubject('');
            setMessage('');
        } else {
             throw new Error("Failed to save the message.");
        }
    } catch (err) {
        console.error("Contact form error:", err);
        setError("Sorry, there was an issue sending your message. Please try again later.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="bg-green-50">
        <LandingHeader />
        <main className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Support & Help Center</h1>
                <p className="text-muted-foreground">
                Find answers to your questions or get in touch with us.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-start">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><HelpCircle /> Frequently Asked Questions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Accordion type="single" collapsible className="w-full">
                            {faqItems.map((item, index) => (
                                <AccordionItem value={`item-${index}`} key={index}>
                                    <AccordionTrigger>{item.question}</AccordionTrigger>
                                    <AccordionContent>
                                        {item.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><MessageSquare /> Contact Us</CardTitle>
                        <CardDescription>If you can't find an answer, send us a message.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                             {error && (
                                <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input id="name" placeholder="Your Name" value={name} onChange={e => setName(e.target.value)} required disabled={loading} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input id="email" type="email" placeholder="Your Email" value={email} onChange={e => setEmail(e.target.value)} required disabled={loading}/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="subject">Subject</Label>
                                <Input id="subject" placeholder="How can we help?" value={subject} onChange={e => setSubject(e.target.value)} required disabled={loading}/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="message">Message</Label>
                                <Textarea id="message" placeholder="Describe your issue or question..." className="min-h-[120px]" value={message} onChange={e => setMessage(e.target.value)} required disabled={loading}/>
                            </div>
                            <Button type="submit" className="w-full" disabled={loading}>{loading ? "Sending..." : "Send Message"}</Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
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