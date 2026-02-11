import type { Metadata } from "next";
import { Alexandria } from "next/font/google";
import "../globals.css";
import { AppSidebar } from "@/components/blocks/app-sidebar";
import { SiteHeader } from "@/components/blocks/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ClientOnly } from "@/components/providers/mount-check";
import { AppProvider } from "@/components/providers/app-provider";

const geistSans = Alexandria({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "erp | برنامج المبيعات والحسابات",
  description: "Dashboard",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${geistSans.variable} antialiased font-sans`}>
        <ClientOnly>
          <AppProvider>
            <SidebarProvider
              style={
                {
                  "--sidebar-width": "calc(var(--spacing) * 72)",
                  "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
              }
            >
              <AppSidebar variant="inset" className="print:hidden" />
              <SidebarInset>
                <SiteHeader />
                <div className="flex flex-1 flex-col">
                  <div className="font-sans p-6">
                    {children}
                  </div>
                </div>
              </SidebarInset>
            </SidebarProvider>
          </AppProvider>
        </ClientOnly>
      </body>
    </html>
  );
}