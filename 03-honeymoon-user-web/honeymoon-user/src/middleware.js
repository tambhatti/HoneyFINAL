import { NextResponse } from 'next/server';

const PUBLIC = [
  '/login', '/signup', '/forgot-password', '/reset-password', '/otp',
  '/contact', '/about', '/_next', '/favicon', '/logo',
  '/vendors', '/services',
];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  if (pathname === '/' || PUBLIC.some(p => pathname.startsWith(p))) return NextResponse.next();
  if (!pathname.startsWith('/dashboard') && !pathname.startsWith('/my-') &&
      !pathname.startsWith('/wishlist') && !pathname.startsWith('/my-bookings') &&
      !pathname.startsWith('/my-budgets') && !pathname.startsWith('/loyalty') &&
      !pathname.startsWith('/notifications') && !pathname.startsWith('/meeting-requests') &&
      !pathname.startsWith('/reported-bookings') && !pathname.startsWith('/onboarding') &&
      !pathname.startsWith('/request-meeting')) {
    return NextResponse.next();
  }
  const token = request.cookies.get('user_access_token')?.value;
  if (!token) {
    const url = new URL('/login', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/my-:path*',
    '/wishlist',
    '/loyalty',
    '/notifications',
    '/meeting-requests',
    '/reported-bookings/:path*',
    '/onboarding',
    '/request-meeting',
  ],
};
