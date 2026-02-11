import { type Metadata } from "next";
import { Alexandria } from "next/font/google";
import "./globals.css";
import { ClientOnly } from "@/components/providers/mount-check";
import { AppProvider } from "@/components/providers/app-provider"; // استدعاء الملف الجديد

const geistSans = Alexandria({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Alex Agri | Login",
  description: "ERP System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head></head>
      <body className={`${geistSans.variable} antialiased`}>
        <ClientOnly>
          <AppProvider>
             {children}
          </AppProvider>
        </ClientOnly>
      </body>
    </html>
  );
}