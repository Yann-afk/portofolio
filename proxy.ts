import { NextResponse, type NextRequest } from "next/server";
import { verifySessionToken } from "@/lib/db/session";
import { SESSION_COOKIE } from "@/lib/db/constants";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLogin = pathname.startsWith("/admin/login");
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = await verifySessionToken(token);

  if (pathname.startsWith("/admin") && !isLogin && !session) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (isLogin && session) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
