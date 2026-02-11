"use client";

import { useAuth } from "@/context/auth-context";
import { ROLES } from "@/lib/constants";

export function usePermission() {
  const { user } = useAuth();

  const can = (permission: string) => {
    if (!user) return false;

    // 1. لو المستخدم هو الـ Admin أو CEO دايماً عنده صلاحية لكل حاجة
    // تأكد ان الرولز جاية Array في الـ User Object بتاعك
    if (user.roles?.includes(ROLES.ADMIN) || user.roles?.includes(ROLES.CEO)) {
      return true;
    }

    // 2. فحص الصلاحيات المخصصة
    if (user.permissions && user.permissions.includes(permission)) {
      return true;
    }

    return false;
  };

  return { can };
}
