"use client";

import { HeroUIProvider } from "@heroui/react";
import SessionProvider from "@/components/SessionProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <HeroUIProvider>
        {children}
      </HeroUIProvider>
    </SessionProvider>
  );
}