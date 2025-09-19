// app/api/lin/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getStore } from '@netlify/blobs';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const STORE = 'boss-state';         // 也可以改成 'lin-state'，两种都行
const KEY = 'lin';                  // ✅ 与 boss 区分

const noStoreHeaders = {
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
  Pragma: 'no-cache',
  Expires: '0',
  // 可选：Netlify CDN
  'Netlify-CDN-Cache-Control': 'no-store',
};

export async function GET() {
  const store = getStore(STORE);
  const data =
    (await store.get(KEY, { type: 'json' })) ?? { boss: false, updatedAt: null };
  return new NextResponse(JSON.stringify(data), { headers: noStoreHeaders });
}

export async function POST(req: NextRequest) {
  const { boss } = await req.json().catch(() => ({ boss: false }));
  const store = getStore(STORE);
  const payload = { boss: Boolean(boss), updatedAt: new Date().toISOString() };
  await store.set(KEY, JSON.stringify(payload));
  return new NextResponse(JSON.stringify(payload), { headers: noStoreHeaders });
}
