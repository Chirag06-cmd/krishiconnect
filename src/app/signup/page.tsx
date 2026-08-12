"use client";

import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { SignupForm } from '@/components/auth/signup-form';
import { Logo } from '@/components/logo';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

export default function SignupPage() {
  const loginBg = PlaceHolderImages.find(p => p.id === 'login-background');

  return (
    <div className="relative flex h-screen w-full items-center justify-center">
        {loginBg && (
          <div className="absolute -z-10 h-full w-full">
            <Image
              src={loginBg.imageUrl}
              alt=""
              fill
              className="object-cover brightness-50"
              data-ai-hint={loginBg.imageHint}
              priority
            />
          </div>
        )}
      <Card className="mx-auto w-[380px] space-y-6 rounded-lg bg-card/90 p-8 shadow-lg backdrop-blur-sm">
        <CardContent className="p-0">
          <div className="flex justify-center mb-4">
              <Logo />
          </div>
          <SignupForm />
           <p className="mt-4 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="underline underline-offset-4 hover:text-primary">
                Login
              </Link>
            </p>
        </CardContent>
      </Card>
    </div>
  );
}
