import BossToggle from 'components/BossToggle';
import { Card } from 'components/card';

export default function Page() {
  return (
    <div className="flex flex-col gap-10 sm:gap-12">
      {/* <section>
        <h1 className="mb-3 text-2xl font-semibold">酷酷来了 · 开关</h1>
        <p className="mb-6 text-base text-zinc-600">
          无登录、无数据库。状态保存在 Netlify（Blobs），全站共享。
        </p>
      </section> */}

      <section className="max-w-xl">
        <Card title="当前状态">
          <BossToggle />
        </Card>
      </section>
    </div>
  );
}
