// components/LinToggle.tsx
'use client';

import { useEffect, useState } from 'react';

type Data = { boss: boolean; updatedAt: string | null };

export default function LinToggle() {
  const [data, setData] = useState<Data>({ boss: false, updatedAt: null });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(`/api/lin?t=${Date.now()}`, { cache: 'no-store' });
      const json = (await res.json()) as Data;
      setData(json);
    } finally {
      setLoading(false);
    }
  }

  async function update(next: boolean) {
    setSaving(true);
    try {
      const res = await fetch('/api/lin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ boss: next }),
      });
      const json = (await res.json()) as Data;
      setData(json);
      // 若你想“点完立刻整页刷新”，可取消下一段注释
      // setTimeout(() => window.location.reload(), 0);
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => { load(); }, []);

  const buttonLabel =
    loading ? '读取中…'
    : saving ? '保存中…'
    : data.boss ? '林老师来了（ON）'
    : '林老师溜了（OFF）';

    const btnClass = loading || saving
        ? 'rounded-xl px-4 py-3 font-semibold border bg-zinc-200 text-zinc-500 border-zinc-300 cursor-wait'
        : data.boss
            ? 'rounded-xl px-4 py-3 font-semibold border bg-red-600 text-white border-red-700'
            : 'rounded-xl px-4 py-3 font-semibold border bg-green-100 text-green-900 border-green-300';

  return (
    <div className="flex flex-col gap-3">
      <div className="text-sm text-zinc-500">
        {loading
          ? '正在读取状态…'
          : data.updatedAt
          ? `上次更新：${new Date(data.updatedAt).toLocaleString()}`
          : '尚未设置过'}
      </div>

      <button
        className={btnClass}
        onClick={() => update(!data.boss)}
        disabled={loading || saving}
        aria-pressed={!loading && !saving ? data.boss : undefined}
        aria-busy={loading || saving}
      >
        {buttonLabel}
      </button>
    </div>
  );
}
