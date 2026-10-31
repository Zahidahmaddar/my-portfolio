import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

function getSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('Please define the JWT_SECRET environment variable inside .env.local');
  }
  return secret;
}

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, getSecret(), { expiresIn: '7d', algorithm: 'HS256' });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, getSecret(), { algorithms: ['HS256'] }) as TokenPayload;
  } catch {
    return null;
  }
}

export function getTokenFromRequest(request: NextRequest): string | null {
  // Check Authorization header
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Check cookies
  const token = request.cookies.get('auth-token')?.value;
  return token || null;
}

export function isAuthenticated(request: NextRequest): TokenPayload | null {
  const token = getTokenFromRequest(request);
  if (!token) return null;

  return verifyToken(token);
}
