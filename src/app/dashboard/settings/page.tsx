"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bell, User, Palette, Languages } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, updateProfile, updateEmail } from "firebase/auth";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const { locale, setLocale } = useTranslation();
  const { toast } = useToast();
  const [name, setName] = useState("Default Farmer");
  const [email, setEmail] = useState("farmer@example.com");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Load local storage values if they exist
    const savedName = localStorage.getItem("user_profile_name");
    const savedEmail = localStorage.getItem("user_profile_email");
    if (savedName) setName(savedName);
    if (savedEmail) setEmail(savedEmail);

    // Subscribe to Firebase Auth
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // If logged in via Google/Firebase, use those values
        setName(user.displayName || savedName || "Default Farmer");
        setEmail(user.email || savedEmail || "farmer@example.com");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSaveChanges = async () => {
    setSaving(true);
    // Persist to local storage
    localStorage.setItem("user_profile_name", name);
    localStorage.setItem("user_profile_email", email);

    try {
      const user = auth.currentUser;
      if (user) {
        await updateProfile(user, { displayName: name });
        try {
          if (email !== user.email) {
            await updateEmail(user, email);
          }
        } catch (emailErr) {
          console.warn("Could not update email in Firebase auth provider:", emailErr);
        }
      }
      toast({
        title: "Profile Updated",
        description: "Your settings have been saved successfully.",
      });
    } catch (err: any) {
      console.error("Save profile error:", err);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: err.message || "Could not update Firebase profile.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and application preferences.
        </p>
      </div>

      <div className="grid gap-8">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><User /> Profile Information</CardTitle>
                <CardDescription>Update your personal details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input 
                          id="name" 
                          value={name} 
                          onChange={(e) => setName(e.target.value)} 
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          value={email} 
                          onChange={(e) => setEmail(e.target.value)} 
                        />
                    </div>
                </div>
                 <Button onClick={handleSaveChanges} disabled={saving}>
                   {saving ? "Saving..." : "Save Changes"}
                 </Button>
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Palette/> Appearance</CardTitle>
                <CardDescription>Customize the look and feel of the app.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
                 <div className="space-y-2">
                    <Label>Theme</Label>
                     <p className="text-sm text-muted-foreground">The application is currently in light mode.</p>
                 </div>
                 <div className="space-y-2">
                    <Label htmlFor="language" className="flex items-center gap-2"><Languages /> Language</Label>
                     <Select value={locale} onValueChange={setLocale}>
                        <SelectTrigger id="language">
                            <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="hi">हिन्दी (Hindi)</SelectItem>
                            <SelectItem value="ml">മലയാളം (Malayalam)</SelectItem>
                            <SelectItem value="desi">Hinglish (देसी)</SelectItem>
                        </SelectContent>
                    </Select>
                 </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Bell /> Notifications</CardTitle>
                <CardDescription>Choose how you want to be notified.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                        <h3 className="font-medium">Pest & Disease Alerts</h3>
                        <p className="text-sm text-muted-foreground">Receive alerts for potential risks in your area.</p>
                    </div>
                    <Switch defaultChecked />
                </div>
                 <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                        <h3 className="font-medium">Irrigation Reminders</h3>
                        <p className="text-sm text-muted-foreground">Get reminders based on your smart irrigation schedule.</p>
                    </div>
                    <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                        <h3 className="font-medium">Market Price Changes</h3>
                        <p className="text-sm text-muted-foreground">Notify me about significant price fluctuations for my crops.</p>
                    </div>
                    <Switch />
                </div>
                 <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                        <h3 className="font-medium">Weekly Summary</h3>
                        <p className="text-sm text-muted-foreground">Receive a weekly summary report via email.</p>
                    </div>
                    <Switch />
                </div>
            </CardContent>
        </Card>
      </div>

    </div>
  );
}
