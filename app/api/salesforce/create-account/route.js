import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import salesforceApiService from '@/lib/services/salesforce-api';

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const data = await request.json();
    const { userId } = data;

    if (session.user.id !== userId && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'You do not have permission to perform this action' },
        { status: 403 }
      );
    }

    const result = await salesforceApiService.createAccountWithContact(
      session.user.id,
      data
    );

    return NextResponse.json({
      success: true,
      message: 'Successfully created Salesforce records',
      accountId: result.accountId,
      contactId: result.contactId,
      isDuplicate: result.isDuplicate || false,
    });
  } catch (error) {
    console.error('Error creating Salesforce records:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create Salesforce records' },
      { status: 500 }
    );
  }
}
