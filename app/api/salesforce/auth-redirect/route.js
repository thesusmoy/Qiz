import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import salesforceAuthService from '@/lib/services/salesforce';

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.redirect('/login?error=Unauthorized');
  }

  const authUrl = salesforceAuthService.getAuthorizationUrl();
  return NextResponse.redirect(authUrl);
}
