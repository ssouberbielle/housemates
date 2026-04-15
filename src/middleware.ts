import { NextResponse, type NextRequest } from 'next/server';
import { getIronSession } from 'iron-session';
import { GATE_COOKIE, GATE_TTL_SECONDS, type GateSession } from '@/lib/auth/gate';

const PUBLIC_PATHS = ['/access', '/api/gate'];

function isPublic(pathname: string) {
  if (pathname.startsWith('/_next')) return true;
  if (pathname === '/favicon.ico' || pathname === '/robots.txt') return true;
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (isPublic(pathname)) return NextResponse.next();

  const secret = process.env.GATE_COOKIE_SECRET;
  if (!secret || secret.length < 32) {
    return NextResponse.redirect(new URL('/access', request.url));
  }

  const response = NextResponse.next();
  const session = await getIronSession<GateSession>(request, response, {
    cookieName: GATE_COOKIE,
    password: secret,
    ttl: GATE_TTL_SECONDS,
    cookieOptions: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: GATE_TTL_SECONDS,
    },
  });

  if (!session.granted) {
    return NextResponse.redirect(new URL('/access', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
