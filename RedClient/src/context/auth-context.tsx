"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { setCookie, deleteCookie, getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { api } from "@/lib/axios";

type AccessDto = {
  orgUnitId: string;
  roleNames: string[];
  permissionKeys: string[];
};

type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  expiresUtc: string;
};

export type JwtUser = {
  id: string;
  userName: string;
  email: string;
  fullName: string;
};

interface AuthContextType {
  user: JwtUser | null;
  accessToken: string | null;
  refreshToken: string | null;

  permissions: string[];
  roles: string[];
  selectedOrgUnitId: string | null;

  login: (data: LoginResponse) => Promise<void>;
  logout: () => Promise<void>;
  setSelectedOrgUnitId: (id: string | null) => void;
  loadMyAccess: (orgUnitId: string) => Promise<void>;

  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function parseJwt(token: string): any {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );
  return JSON.parse(jsonPayload);
}

function cookieOptions(maxAge: number) {
  const isProd = process.env.NODE_ENV === "production";
  return {
    maxAge,
    path: "/",
    sameSite: "lax" as const,
    secure: isProd,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [user, setUser] = useState<JwtUser | null>(null);

  const [selectedOrgUnitId, setSelectedOrgUnitId] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const hydrateUserFromToken = (token: string) => {
    const payload = parseJwt(token);
    setUser({
      id: payload.Id || payload.sub,
      userName: payload.unique_name || payload.name || "",
      email: payload.email || "",
      fullName: payload.FullName || "",
    });
  };

  const loadMyAccess = async (orgUnitId: string) => {
    setCookie("orgUnitId", orgUnitId, cookieOptions(60 * 60 * 24 * 30));
    setSelectedOrgUnitId(orgUnitId);

    const res = await api.get<AccessDto>("/access/my", { params: { orgUnitId } });
    setRoles(res.data.roleNames || []);
    setPermissions(res.data.permissionKeys || []);
  };

  const ensureDefaultOrgUnit = async () => {
    // لو orgUnitId مش موجود — هجيب ALEX root
    const existing = getCookie("orgUnitId") as string | undefined;
    if (existing) {
      setSelectedOrgUnitId(existing);
      try {
        await loadMyAccess(existing);
      } catch {
        // ignore
      }
      return;
    }

    try {
      const root = await api.get<{ id: string }>("/org/root");
      if (root.data?.id) await loadMyAccess(root.data.id);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    const at = getCookie("accessToken") as string | undefined;
    const rt = getCookie("refreshToken") as string | undefined;

    if (at) {
      setAccessToken(at);
      try {
        hydrateUserFromToken(at);
      } catch {
        // ignore
      }
    }
    if (rt) setRefreshToken(rt);

    (async () => {
      if (at) await ensureDefaultOrgUnit();
      setIsLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (data: LoginResponse) => {
    setAccessToken(data.accessToken);
    setRefreshToken(data.refreshToken);

    setCookie("accessToken", data.accessToken, cookieOptions(60 * 60 * 24 * 7));
    setCookie("refreshToken", data.refreshToken, cookieOptions(60 * 60 * 24 * 14));

    hydrateUserFromToken(data.accessToken);

    // ✅ حمّل access على ALEX root تلقائيًا
    await ensureDefaultOrgUnit();

    // ✅ reload عشان middleware يشوف الكوكي
    window.location.href = "/dashboard";
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // ignore
    }

    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    setPermissions([]);
    setRoles([]);
    setSelectedOrgUnitId(null);

    deleteCookie("accessToken", { path: "/" });
    deleteCookie("refreshToken", { path: "/" });
    deleteCookie("orgUnitId", { path: "/" });

    router.push("/sign-in");
  };

  const value = useMemo(
    () => ({
      user,
      accessToken,
      refreshToken,
      permissions,
      roles,
      selectedOrgUnitId,
      login,
      logout,
      setSelectedOrgUnitId,
      loadMyAccess,
      isLoading,
    }),
    [user, accessToken, refreshToken, permissions, roles, selectedOrgUnitId, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
