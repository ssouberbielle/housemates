import { cookies } from 'next/headers';
import { getIronSession, type SessionOptions } from 'iron-session';

export const GATE_COOKIE = 'hm_access';
export const GATE_TTL_SECONDS = 60 * 60 * 24;

export type GateSession = {
  granted?: true;
  grantedAt?: number;
};

function getSecret(): string {
  const secret = process.env.GATE_COOKIE_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('GATE_COOKIE_SECRET missing or shorter than 32 chars');
  }
  return secret;
}

export function gateSessionOptions(): SessionOptions {
  return {
    cookieName: GATE_COOKIE,
    password: getSecret(),
    ttl: GATE_TTL_SECONDS,
    cookieOptions: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: GATE_TTL_SECONDS,
    },
  };
}

export async function getGateSession() {
  return getIronSession<GateSession>(cookies(), gateSessionOptions());
}
