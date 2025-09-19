// app/api/boss/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getStore } from '@netlify/blobs';

export const dynamic = 'force-dynamic'; // 禁止静态化
export const revalidate = 0;            // 关闭 ISR

const STORE = 'boss-state';
const KEY = 'boss';

const noStoreHeaders = {
  'Content-Type': 'application/json',
  // 多重保险：禁止中间层/代理缓存
  'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
  Pragma: 'no-cache',
  Expires: '0',
};

export async function GET() {
  const store = getStore(STORE);
  const data =
    (await store.get(KEY, { type: 'json' })) ??
    { boss: false, updatedAt: null };

  // 明确禁止缓存
  return new NextResponse(JSON.stringify(data), { headers: noStoreHeaders });
}

export async function POST(req: NextRequest) {
  const { boss } = await req.json().catch(() => ({ boss: false }));
  const store = getStore(STORE);
  const payload = { boss: Boolean(boss), updatedAt: new Date().toISOString() };

  // 写入 Blobs（最终一致，跨边缘可能略有延迟）
  await store.set(KEY, JSON.stringify(payload));

  // POST 响应同样加 no-store，避免某些代理缓存 POST 响应
  return new NextResponse(JSON.stringify(payload), { headers: noStoreHeaders });
}
