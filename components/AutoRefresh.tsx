// components/AutoRefresh.tsx
'use client';

import { useEffect } from 'react';

export default function AutoRefresh({ intervalMs = 10000 }: { intervalMs?: number }) {
  useEffect(() => {
    const id = setInterval(() => {
      // 强制整页刷新（绕开各种缓存层最省事）
      window.location.reload();
    }, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return null;
}
