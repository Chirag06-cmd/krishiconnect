import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  href?: string;
}

export function Logo({ href = '/' }: LogoProps) {
  return (
    <Link href={href} className="flex items-center gap-2">
      <Image src="/logo.jpg" alt="KrishiConnect Logo" width={32} height={32} className="h-8 w-8" />
      <span className="text-2xl font-bold text-primary">
        Krishi<span className="text-accent">Connect</span>
      </span>
    </Link>
  );
}
