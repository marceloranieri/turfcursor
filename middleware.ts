import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const protectedRoutes = ['/chat', '/profile', '/settings'];
  const isProtected = protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route));

  const token = request.cookies.get('sb-access-token')?.value;

  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/chat/:path*', '/profile/:path*', '/settings/:path*'],
}; 