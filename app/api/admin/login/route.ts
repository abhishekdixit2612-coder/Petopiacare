import { NextRequest, NextResponse } from 'next/server';
import { generateSessionToken } from '@/lib/auth';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const SESSIONS = new Map<string, { expiresAt: number }>();

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();

    if (!password) {
      return NextResponse.json(
        { error: 'Password required' },
        { status: 400 }
      );
    }

    // Check password (using plain text for simplicity, use bcrypt in production)
    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    // Generate session token
    const token = generateSessionToken();
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    SESSIONS.set(token, { expiresAt });

    // Return token (set in cookie via middleware)
    const response = NextResponse.json({ success: true });
    response.cookies.set('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24 hours
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}

// Helper function to verify session
export function isValidSession(token: string): boolean {
  const session = SESSIONS.get(token);
  if (!session) return false;
  if (session.expiresAt < Date.now()) {
    SESSIONS.delete(token);
    return false;
  }
  return true;
}
