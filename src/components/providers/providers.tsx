"use client";

import { SessionProvider } from "next-auth/react";
import { CombinedThemeProvider } from "@/components/shared/theme-provider";
import type { Session } from "next-auth";

interface ProvidersProps {
  children: React.ReactNode;
  session: Session | null;
}

export function Providers({ children, session }: ProvidersProps) {
  return (
    <SessionProvider session={session}>
      <CombinedThemeProvider>
        {children}
      </CombinedThemeProvider>
    </SessionProvider>
  );
}
