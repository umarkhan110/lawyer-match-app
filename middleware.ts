import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const authStorage = request.cookies.get('auth-storage');
console.log(authStorage)
  if (!authStorage) {
    if (url.pathname === "/") return NextResponse.next();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  try {
    const { isAuthenticated } = JSON.parse(authStorage.value);

    if (!isAuthenticated) {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  } catch {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: [
    '/((?!api|_next|static|favicon.ico).*)', // Protect all routes except API, static files, and root.
  ],
};
