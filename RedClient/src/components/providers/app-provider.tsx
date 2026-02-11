"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/context/auth-context"; // تأكد من المسار
import { ThemeProvider } from "@/components/providers/theme-provider"; // تأكد من المسار
import { Toaster } from "@/components/ui/sonner";

export function AppProvider({ children }: { children: React.ReactNode }) {
  // إنشاء QueryClient مرة واحدة
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster 
             expand={false} 
             richColors 
             position="bottom-center" 
             closeButton 
          />
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}