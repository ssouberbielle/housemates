import { NextResponse, type NextRequest } from 'next/server';
import { getIronSession } from 'iron-session';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { GATE_COOKIE, GATE_TTL_SECONDS, type GateSession } from '@/lib/auth/gate';

const STATIC_PREFIXES = ['/_next', '/favicon.ico', '/robots.txt'];
const GATE_PUBLIC = ['/access', '/api/gate'];
const ADMIN_PUBLIC = ['/admin/login', '/api/admin/auth/login'];

function isStatic(pathname: string) {
  return STATIC_PREFIXES.some((p) => pathname.startsWith(p));
}

function isAdminHost(request: NextRequest) {
  const host = request.headers.get('host') ?? '';
  return host.startsWith('admin.');
}

function isAdminPath(pathname: string) {
  return pathname.startsWith('/admin') || pathname.startsWith('/api/admin');
}

async function handleAdminAuth(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  if (ADMIN_PUBLIC.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Supabase middleware client — refresca tokens y propaga cookies
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    const loginUrl = new URL('/admin/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

async function handleGateAuth(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  if (GATE_PUBLIC.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return NextResponse.next();
  }

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

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isStatic(pathname)) return NextResponse.next();

  if (isAdminHost(request) || isAdminPath(pathname)) {
    return handleAdminAuth(request);
  }

  return handleGateAuth(request);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
