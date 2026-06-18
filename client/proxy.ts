import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicRoutes = ["/", "/admin", "/vendorLogin"];

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const isPublic = publicRoutes.some(
        (route) => pathname === route || pathname.startsWith(`${route}/`)
    );

    if (isPublic) {
        return NextResponse.next();
    }

    const token = request.cookies.get("token")?.value;

    if (!token) {
        const url = new URL("/", request.url);
        url.searchParams.set("redirect", pathname);
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};