import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import salesforceAuthService from '@/lib/services/salesforce';

export async function GET(request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const returnTo = searchParams.get('returnTo');

  const authUrl = salesforceAuthService.getAuthorizationUrl(returnTo);

  return NextResponse.json({ authUrl });
}
