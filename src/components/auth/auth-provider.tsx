"use client";

import { createContext, useEffect, useState } from 'react';
import { auth, onAuthStateChanged, type User } from '@/lib/firebase';
import { Skeleton } from '../ui/skeleton';

export const AuthContext = createContext<{ user: User | null; loading: boolean }>({
  user: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user: any) => {
            setUser(user);
            setLoading(false);
            if (user) {
                // Set secure auth cookie for middleware routing
                document.cookie = "mock-auth=true; path=/; max-age=86400; SameSite=Lax; Secure";
            } else {
                // Clear auth cookie
                document.cookie = "mock-auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
            }
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Skeleton className="h-20 w-20 rounded-full" />
            </div>
        )
    }

  return (
    <AuthContext.Provider value={{ user, loading }}>
        {children}
    </AuthContext.Provider>
  );
}
