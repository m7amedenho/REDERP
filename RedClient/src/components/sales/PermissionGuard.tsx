"use client";

import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { IconLock } from "@tabler/icons-react";
import {
  hasPermission,
  hasAllPermissions,
  hasAnyPermission,
  Permission,
  UserRole,
} from "@/lib/permissions/salesPermissions";

interface PermissionGuardProps {
  children: React.ReactNode;
  userRole: UserRole;
  requiredPermission?: Permission;
  requiredPermissions?: Permission[];
  requireAll?: boolean; // true = يحتاج كل الصلاحيات، false = يحتاج أي صلاحية
  fallback?: React.ReactNode;
  showAlert?: boolean;
}

/**
 * مكون لحماية المحتوى بناءً على الصلاحيات
 * Permission Guard Component
 */
export function PermissionGuard({
  children,
  userRole,
  requiredPermission,
  requiredPermissions,
  requireAll = true,
  fallback,
  showAlert = true,
}: PermissionGuardProps) {
  let hasAccess = false;

  // التحقق من صلاحية واحدة
  if (requiredPermission) {
    hasAccess = hasPermission(userRole, requiredPermission);
  }
  // التحقق من صلاحيات متعددة
  else if (requiredPermissions && requiredPermissions.length > 0) {
    if (requireAll) {
      hasAccess = hasAllPermissions(userRole, requiredPermissions);
    } else {
      hasAccess = hasAnyPermission(userRole, requiredPermissions);
    }
  }
  // إذا لم يتم تحديد صلاحيات، السماح بالوصول
  else {
    hasAccess = true;
  }

  // إذا لم يكن لديه صلاحية
  if (!hasAccess) {
    // إذا تم تحديد fallback مخصص
    if (fallback !== undefined) {
      return <>{fallback}</>;
    }

    // إذا تم طلب عدم عرض تنبيه
    if (!showAlert) {
      return null;
    }

    // عرض رسالة التنبيه الافتراضية
    return (
      <Alert variant="destructive" className="my-4">
        <IconLock className="h-4 w-4" />
        <AlertTitle>غير مصرح</AlertTitle>
        <AlertDescription>
          ليس لديك صلاحية للوصول إلى هذا المحتوى. يرجى التواصل مع المدير.
        </AlertDescription>
      </Alert>
    );
  }

  // عرض المحتوى إذا كان لديه صلاحية
  return <>{children}</>;
}

/**
 * Hook للتحقق من الصلاحيات
 */
export function usePermission(userRole: UserRole) {
  return {
    hasPermission: (permission: Permission) =>
      hasPermission(userRole, permission),
    hasAllPermissions: (permissions: Permission[]) =>
      hasAllPermissions(userRole, permissions),
    hasAnyPermission: (permissions: Permission[]) =>
      hasAnyPermission(userRole, permissions),
  };
}

/**
 * مكون Button محمي بالصلاحيات
 */
interface PermissionButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  userRole: UserRole;
  requiredPermission: Permission;
  children: React.ReactNode;
  hideIfNoPermission?: boolean;
}

export function PermissionButton({
  userRole,
  requiredPermission,
  children,
  hideIfNoPermission = false,
  disabled,
  ...props
}: PermissionButtonProps) {
  const hasAccess = hasPermission(userRole, requiredPermission);

  if (!hasAccess && hideIfNoPermission) {
    return null;
  }

  return (
    <button {...props} disabled={disabled || !hasAccess}>
      {children}
    </button>
  );
}
