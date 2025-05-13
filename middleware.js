import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAuthPage =
    req.nextUrl.pathname.startsWith('/login') ||
    req.nextUrl.pathname.startsWith('/register');

  if (isAuthPage) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/', req.nextUrl));
    }
    return null;
  }

  if (req.nextUrl.pathname.startsWith('/admin')) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/login', req.nextUrl));
    }

    if (req.auth?.user?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', req.nextUrl));
    }
  }

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

  if (req.nextUrl.pathname.startsWith('/forms')) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/login', req.nextUrl));
    }
  }

  return null;
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
