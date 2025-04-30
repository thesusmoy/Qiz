import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAuthPage =
    req.nextUrl.pathname.startsWith('/login') ||
    req.nextUrl.pathname.startsWith('/register');

  // Redirect authenticated users away from auth pages
  if (isAuthPage) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/', req.nextUrl));
    }
    return null;
  }

  // Protect admin routes
  if (req.nextUrl.pathname.startsWith('/admin')) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/login', req.nextUrl));
    }

    if (req.auth?.user?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', req.nextUrl));
    }
  }

  // Protect template routes
  if (req.nextUrl.pathname.startsWith('/templates')) {
    if (!isLoggedIn) {
      return NextResponse.redirect(
        new URL(
          `/login?returnTo=${req.nextUrl.pathname}${req.nextUrl.search}`,
          req.nextUrl
        )
      );
    }
  }

  // Protect form routes
  if (req.nextUrl.pathname.startsWith('/forms')) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/login', req.nextUrl));
    }
  }

  return null;
});

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
