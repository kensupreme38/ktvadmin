import { MicVocal } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <MicVocal className="h-6 w-6 text-primary" />
      <span className="text-xl font-bold">Aura KTV</span>
    </div>
  );
}
