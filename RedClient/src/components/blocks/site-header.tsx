"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "../ui/ThemeToggle";
import UserMenu from "./user-menu";
import { useAuth } from "@/context/auth-context";
import { Skeleton } from "@/components/ui/skeleton";
import { OrgSelector } from "@/components/org/org-selector";

function roleLabel(role?: string) {
  if (!role) return "موظف";
  switch (role) {
    case "Admin":
      return "مسؤول النظام";
    case "CEO":
      return "مدير الشركة";
    case "AreaManager":
      return "مدير منطقة";
    case "BranchManager":
      return "مدير فرع";
    case "AccountManager":
      return "مدير حسابات";
    case "SalesDelegate":
      return "مندوب مبيعات";
    case "Accountant":
      return "محاسب";
    default:
      return role;
  }
}

function HeaderSkeleton() {
  return (
    <header className="print:hidden flex h-(--header-height) shrink-0 items-center gap-2 border-b px-4 lg:px-6">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-9 rounded-md" />
          <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3 w-64" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-9 rounded-full" />
          <Skeleton className="h-9 w-9 rounded-md" />
        </div>
      </div>
    </header>
  );
}

export function SiteHeader() {
  const { user, roles, isLoading } = useAuth();

  // Loading أول فتحه
  if (isLoading) return <HeaderSkeleton />;

  // حماية: لو مش authenticated لأي سبب
  if (!user) {
    return (
      <header className="print:hidden flex h-(--header-height) shrink-0 items-center gap-2 border-b px-4 lg:px-6">
        <div className="flex w-full items-center justify-between">
          <div className="text-sm text-muted-foreground">غير مسجل دخول</div>
          <div className="flex items-center gap-2">
            <ModeToggle />
          </div>
        </div>
      </header>
    );
  }

  const displayName = user?.fullName || user?.userName || "مستخدم";
  const email = user?.email || "";
  const primaryRole = roles?.[0]; // بيتحدد بعد loadMyAccess
  const secondaryText =
    roles && roles.length > 0
      ? `${roleLabel(primaryRole)}${email ? ` • ${email}` : ""}`
      : email
      ? `موظف • ${email}`
      : "موظف";

  return (
    <header className="print:hidden flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6 justify-between">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />

          <div className="flex flex-col items-start leading-tight">
            <h1 className="text-sm font-semibold">مرحباً بك، {displayName}!</h1>
            <p className="text-sm text-muted-foreground">{secondaryText}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <OrgSelector />
          <UserMenu />
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
