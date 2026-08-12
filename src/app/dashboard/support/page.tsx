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
import { HelpCircle, MessageSquare, AlertCircle } from "lucide-react";
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

export default function SupportPage() {
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
          description: "Thank you for your feedback. We will get back to you soon.",
        });
        // Clear form fields
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
      } else {
        throw new Error("Failed to save message to database.");
      }
    } catch (err) {
      console.error(err);
      setError("Sorry, there was an issue sending your message. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
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
                          <Input id="name" placeholder="Your Name" value={name} onChange={e => setName(e.target.value)} required disabled={loading}/>
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
  );
}