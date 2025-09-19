import { NextRequest, NextResponse } from 'next/server';
import { getStore } from '@netlify/blobs';

const STORE = 'boss-state';
const KEY = 'boss';

export async function GET() {
  const store = getStore(STORE);
  const data =
    (await store.get(KEY, { type: 'json' })) ??
    { boss: false, updatedAt: null };

  return NextResponse.json(data, { headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(req: NextRequest) {
  const { boss } = await req.json().catch(() => ({ boss: false }));
  const store = getStore(STORE);
  const payload = { boss: Boolean(boss), updatedAt: new Date().toISOString() };
  await store.set(KEY, JSON.stringify(payload)); // JSON 存入 Netlify Blobs
  return NextResponse.json(payload);
}
