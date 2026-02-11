"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/axios";
import { useAuth } from "@/context/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2, LogOut, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";

export default function HomePage() {
  const router = useRouter();
  const { user, accessToken, login, logout, isLoading } = useAuth();

  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    // لو مفيش توكن -> Sign in
    if (!accessToken) {
      router.replace("/sign-in");
      return;
    }

    // لو فيه توكن بس user مش متفكك (نادر) -> روح sign in
    if (!user) {
      router.replace("/sign-in");
      return;
    }

    // انت قررت: ما تدخلش dashboard تلقائي، لازم re-verify
  }, [isLoading, accessToken, user, router]);

  const handleVerify = async () => {
    if (!user) return;
    setBusy(true);
    setError("");

    try {
      // identifier من ال JWT
      const identifier = user.userName || user.email;

      const res = await api.post("/auth/login", {
        identifier,
        password,
      });

      // ده هيحدّث access/refresh token
      login(res.data);

      toast.success("تم التأكيد بنجاح");
      router.replace("/dashboard");
    } catch (e: any) {
      setError(e?.response?.data || "كلمة المرور غير صحيحة");
    } finally {
      setBusy(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-6 h-6 text-muted" />
      </div>
    );
  }

  if (!accessToken || !user) return null;

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center px-4" dir="rtl">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <svg className="absolute top-0 left-1/2 h-[150%] w-[150%] -translate-x-1/2 blur-[120px] opacity-40" viewBox="0 0 800 800" fill="none">
          <circle cx="400" cy="400" r="400" fill="#22c55e" />
          <circle cx="200" cy="600" r="200" fill="#16a34a" />
          <circle cx="600" cy="200" r="180" fill="#15803d" />
        </svg>
      </div>

      <Card className="w-full max-w-md shadow-md p-4 border rounded-xl bg-white/85 dark:bg-zinc-900/85">
        <CardHeader className="flex items-center justify-center space-x-1 border-b">
          <Image
            src="https://alexasfor.com/wp-content/uploads/2023/03/Alex.png"
            alt="logo"
            width={120}
            height={120}
          />
          <div className="text-center">
            <h2 className="text-lg text-green-700 dark:text-white">اليكس للمستلزمات الزراعية</h2>
            <p className="text-sm text-muted-foreground">نظام إدارة الشركة</p>
          </div>
        </CardHeader>

        <CardHeader className="text-center flex flex-col items-center">
          <Avatar className="mx-auto mb-4 size-20">
            <AvatarFallback className="rounded-lg">
              {user.fullName?.slice(0, 2) || "U"}
            </AvatarFallback>
          </Avatar>

          <CardTitle className="text-xl text-green-700 dark:text-white font-bold">
            مرحباً بعودتك، {user.fullName || user.userName}
          </CardTitle>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </CardHeader>

        <CardContent className="space-y-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleVerify();
            }}
            className="space-y-4"
          >
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                برجاء إدخال كلمة المرور للتأكيد
              </label>

              <div className="relative mt-2">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="text-right pl-10"
                  placeholder="كلمة المرور"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 left-0 px-3 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="submit"
                className="flex-1 bg-green-700 hover:bg-green-600 text-white"
                disabled={password.length < 4 || busy}
              >
                {busy ? <><Loader2 className="w-4 h-4 ml-2 animate-spin" /> جاري التحقق...</> : "تأكيد الدخول"}
              </Button>

              <Button type="button" variant="outline" onClick={logout} className="text-red-600">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="default" className="mt-4 w-full max-w-md border-red-700">
          <AlertDescription className="text-red-700 flex items-center">
            <AlertCircle className="inline ml-2" />
            {error}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
