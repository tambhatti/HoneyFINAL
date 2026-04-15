import { NextResponse } from 'next/server';

const PUBLIC = ['/login', '/signup', '/forgot-password', '/_next', '/favicon', '/logo'];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  if (PUBLIC.some(p => pathname.startsWith(p)) || pathname === '/') return NextResponse.next();
  if (!pathname.startsWith('/dashboard')) return NextResponse.next();
  const token = request.cookies.get('vendor_access_token')?.value;
  if (!token) {
    const url = new URL('/login', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ['/dashboard/:path*'] };
