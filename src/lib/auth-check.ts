import { auth } from '@/auth';
import { NextResponse } from 'next/server';

/**
 * Check if the user is authenticated
 * Returns the session if authenticated, or a 401 response if not
 */
export async function checkAuth() {
  const session = await auth();

  if (!session || !session.user) {
    return {
      authenticated: false,
      response: NextResponse.json(
        { error: 'Unauthorized - Authentication required' },
        { status: 401 }
      )
    };
  }

  return {
    authenticated: true,
    session,
  };
}
