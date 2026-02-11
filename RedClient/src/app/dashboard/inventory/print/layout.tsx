import { Metadata } from "next";

export const metadata: Metadata = {
  title: "نظام الطباعة المخصص | المخزون",
  description: "نظام طباعة متقدم للباركود والسندات والتقارير واللاصقات",
};

export default function PrintLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
