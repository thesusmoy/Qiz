import { NextResponse } from 'next/server';
import middleware from '../middleware';

describe('middleware', () => {
  const getMockReq = (overrides = {}) => ({
    nextUrl: {
      pathname: '/',
      search: '',
      ...overrides.nextUrl,
    },
    auth: undefined,
    ...overrides,
  });

  it('redirects logged-in users away from /login', () => {
    const req = getMockReq({
      nextUrl: { pathname: '/login' },
      auth: { user: { id: 1 } },
    });
    const res = middleware(req);
    expect(res?.status).toBe(307);
    expect(res?.headers.get('location')).toBe('http://localhost/');
  });

  it('allows unauthenticated users to access /login', () => {
    const req = getMockReq({ nextUrl: { pathname: '/login' } });
    expect(middleware(req)).toBeNull();
  });

  it('redirects unauthenticated users from /admin', () => {
    const req = getMockReq({ nextUrl: { pathname: '/admin' } });
    const res = middleware(req);
    expect(res?.status).toBe(307);
    expect(res?.headers.get('location')).toBe('http://localhost/login');
  });

  it('redirects non-admin users from /admin', () => {
    const req = getMockReq({
      nextUrl: { pathname: '/admin' },
      auth: { user: { role: 'USER' } },
    });
    const res = middleware(req);
    expect(res?.status).toBe(307);
    expect(res?.headers.get('location')).toBe('http://localhost/');
  });

  it('allows admin users to access /admin', () => {
    const req = getMockReq({
      nextUrl: { pathname: '/admin' },
      auth: { user: { role: 'ADMIN' } },
    });
    expect(middleware(req)).toBeNull();
  });

  it('redirects unauthenticated users from /templates', () => {
    const req = getMockReq({
      nextUrl: { pathname: '/templates', search: '?foo=bar' },
    });
    const res = middleware(req);
    expect(res?.status).toBe(307);
    expect(res?.headers.get('location')).toBe(
      'http://localhost/login?returnTo=/templates?foo=bar'
    );
  });

  it('redirects unauthenticated users from /forms', () => {
    const req = getMockReq({ nextUrl: { pathname: '/forms' } });
    const res = middleware(req);
    expect(res?.status).toBe(307);
    expect(res?.headers.get('location')).toBe('http://localhost/login');
  });
});
