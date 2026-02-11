"use client";

import { useState } from "react";
import Image from "next/image";
import { Alexandria } from "next/font/google";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/auth-context"; // استيراد الهوك الجديد
import { api } from "@/lib/axios";
import { toast } from "sonner"; // Assuming you use Sonner
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const alexandriaFont = Alexandria({
  variable: "--font-alexandria",
  subsets: ["latin"],
});

export default function SignInPage() {
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/auth/login", { identifier, password });
      await login(res.data); 
      toast.success("تم تسجيل الدخول بنجاح");
      router.push("/dashboard");
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data || "حدث خطأ أثناء تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`relative flex min-h-screen w-full items-center justify-center overflow-hidden px-4 ${alexandriaFont.className}`}
      dir="rtl"
    >
      {/* الخلفية كما هي في تصميمك */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <svg
          className="absolute top-0 left-1/2 h-[150%] w-[150%] -translate-x-1/2 blur-[120px] opacity-40"
          viewBox="0 0 800 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="400" cy="400" r="400" fill="#22c55e" />
          <circle cx="200" cy="600" r="200" fill="#16a34a" />
          <circle cx="600" cy="200" r="180" fill="#15803d" />
        </svg>
      </div>

      <div className="w-full sm:w-96 space-y-6 rounded-2xl px-6 py-10 shadow-xl border border-zinc-200 dark:border-zinc-800 backdrop-blur-md bg-zinc-100/85 dark:bg-zinc-900/85 transition">
        <header className="text-center border-b border-zinc-200 dark:border-zinc-800 pb-4 mb-4">
          <div className="flex justify-center items-center gap-3">
            <Image
              src="https://alexasfor.com/wp-content/uploads/2023/03/Alex.png"
              alt="logo"
              width={100}
              height={100}
            />
            <div className="flex flex-col text-right">
              <p className="text-sm font-bold text-green-700 dark:text-green-400">
                أليكس للمستلزمات الزراعية
              </p>
              <p className="text-sm text-muted-foreground">
                Alex for Agriculture Tools
              </p>
              <p className="text-sm text-muted-foreground">نظام إدارة الشركة</p>
            </div>
          </div>
          <h1 className="mt-4 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            تسجيل الدخول
          </h1>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
              اسم المستخدم أو البريد
            </label>
            <Input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              className="bg-white dark:bg-zinc-800 focus:ring-green-600"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
              كلمة المرور
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-white dark:bg-zinc-800 focus:ring-green-600 pl-10" // مسافة للأيقونة
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-green-800 hover:bg-green-600 text-white"
          >
            {loading ? (
              <Loader2 className="animate-spin ml-2 h-4 w-4" />
            ) : (
              "تسجيل الدخول"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
