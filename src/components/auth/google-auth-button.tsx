"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Button } from "../ui/button";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebase";


const GoogleIcon = () => (
    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
        <path
            fill="currentColor"
            d="M21.35 11.1H12.18V13.83H18.69C18.36 17.64 15.19 19.27 12.19 19.27C8.36 19.27 5.03 16.25 5.03 12.5C5.03 8.75 8.36 5.73 12.19 5.73C15.22 5.73 17.02 7.55 17.02 7.55L19.25 5.32C19.25 5.32 16.56 3 12.19 3C6.42 3 2.03 7.8 2.03 12.5C2.03 17.2 6.42 22 12.19 22C17.6 22 21.5 18.33 21.5 12.91C21.5 11.91 21.35 11.1 21.35 11.1Z"
        />
    </svg>
);


export function GoogleAuthButton() {
    const router = useRouter();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    const handleGoogleSignIn = async () => {
        setLoading(true);
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);

            toast({
                title: "Login Successful",
                description: `Welcome, ${result.user.displayName || "User"}!`,
            });
            router.push('/dashboard');
        } catch (error: any) {
            console.error("Google Sign-In Error:", error);
            toast({
                variant: "destructive",
                title: "Google Sign-In Failed",
                description: error.message || "An unknown error occurred.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
         <Button variant="outline" type="button" disabled={loading} onClick={handleGoogleSignIn} className="w-full">
            {loading ? (
                <span>Signing in...</span>
            ) : (
                <>
                    <GoogleIcon />
                    Google
                </>
            )}
        </Button>
    );
}
