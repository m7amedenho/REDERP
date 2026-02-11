import { Metadata } from "next";

export const metadata: Metadata = {
  title: "نظام المبيعات | ERP",
  description: "نظام إدارة المبيعات والعملاء المتكامل مع نقاط البيع",
};

export default function SalesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
