import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "./app/lib/session";

export default async function middleware(request: NextRequest) {
  const session = request.cookies.get("session")?.value || "";
  const payload = await decrypt(session);
  if (!payload?.userId) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/protected/:path*"], // adjust routes as needed
  //   matcher: ["/profile", "/dashboard"], use it like this
};
