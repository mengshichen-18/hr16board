// components/BossToggle.tsx
'use client';

import { useEffect, useState } from 'react';

type Data = { boss: boolean; updatedAt: string | null };

export default function BossToggle() {
    const [data, setData] = useState<Data>({ boss: false, updatedAt: null });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    async function load() {
        setLoading(true);
        try {
            const res = await fetch(`/api/boss?t=${Date.now()}`, { cache: 'no-store' });
            const json = (await res.json()) as Data;
            setData(json);
        } finally {
            setLoading(false);
        }
    }

    async function update(next: boolean) {
        setSaving(true);
        try {
            const res = await fetch('/api/boss', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ boss: next }),
            });
            const json = (await res.json()) as Data;
            setData(json);
            if (typeof window !== 'undefined') {
                // setTimeout 让按钮文本有机会切到“保存中…”再刷新（体验更顺）
                setTimeout(() => window.location.reload(), 0);
            }
        } finally {
            setSaving(false);
        }
    }

    useEffect(() => { load(); }, []);

    // ✅ 按钮文案优先级：加载中 > 保存中 > 正常
    const buttonLabel = loading
        ? '读取中…'
        : saving
            ? '保存中…'
            : data.boss
                ? '酷酷来了（ON）'
                : '酷酷不在（OFF）';

    // ✅ 按钮样式：加载/保存中用中性样式，并禁用点击
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

            {/* <div className="text-xs text-zinc-500">任意人可修改；全站共享一个开关。</div> */}
        </div>
    );
}
