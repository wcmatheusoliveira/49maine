import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow access to auth API routes
  if (pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  // Only check auth for admin routes
  if (pathname.startsWith('/admin')) {
    const isOnLogin = pathname.startsWith('/admin/login');

    // Allow access to login page
    if (isOnLogin) {
      return NextResponse.next();
    }

    // Get session using NextAuth
    const session = await auth();

    // Redirect to login if not authenticated
    if (!session) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/auth/:path*',
  ],
};
