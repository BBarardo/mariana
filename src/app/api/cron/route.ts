import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(req: NextRequest): Promise<NextResponse> {
  if (
    req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return new NextResponse('Unauthorized', { status: 401 });
  }
  return NextResponse.json({ ok: true });
}
