import { MicVocal } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center space-x-2", className)}>
      <MicVocal className="h-6 w-6 text-primary" />
      <span className="font-headline text-xl font-bold">Aura KTV</span>
    </Link>
  );
}
