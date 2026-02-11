// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value; // ✅ الصحيح
  const { pathname } = request.nextUrl;

  const publicRoutes = ["/sign-in"];

  // لو مش عامل login ومحاول يدخل صفحة محمية
  if (!accessToken && !publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // لو عامل login وداخل sign-in
  if (accessToken && publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url)); // ✅
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
