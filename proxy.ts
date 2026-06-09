import { NextResponse, type NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

import { SESSION_COOKIE_NAME } from '@/lib/auth-constants';

const secret = new TextEncoder().encode(process.env.JWT_SECRET ?? '');

async function isAuthenticated(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (!token || !process.env.JWT_SECRET) {
    return false;
  }

  try {
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authenticated = await isAuthenticated(request);

  if (pathname.startsWith('/dashboard') && !authenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if ((pathname === '/login' || pathname === '/register') && authenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
};
