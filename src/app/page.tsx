import { createClient, createAdminClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/AdminShell";
import Link from "next/link";

export default async function DashboardPage() {
  const sessionClient = await createClient();
  const { data: { user } } = await sessionClient.auth.getUser();

  const supabase = createAdminClient();

  const [
    { count: flavorsCount },
    { count: captionsCount },
    { data: recentFlavors },
  ] = await Promise.all([
    supabase.from("humor_flavors").select("*", { count: "exact", head: true }),
    supabase.from("captions").select("*", { count: "exact", head: true }),
    (supabase as any)
      .from("humor_flavors")
      .select("id, slug, description, created_datetime_utc")
      .order("id", { ascending: false })
      .limit(5),
  ]);

  const stats = [
    { label: "FLAVORS", icon: "◈", value: flavorsCount ?? 0, href: "/humor-flavors", desc: "humor flavors" },
    { label: "CAPTIONS", icon: "❝", value: captionsCount ?? 0, href: "/humor-flavors", desc: "generated captions" },
  ];

  const now = new Date();
  const timestamp = now.toISOString().replace("T", " ").slice(0, 19) + " UTC";

  return (
    <AdminShell user={{ email: user?.email }}>
      <div className="p-8 space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <p className="cyber-label tracking-[0.3em] text-[0.6rem]">{`// SYSTEM STATUS`}</p>
            <h1 className="cyber-text font-mono text-4xl font-bold mt-1 tracking-widest">DASHBOARD</h1>
          </div>
          <div className="text-right font-mono text-[0.6rem] space-y-1">
            <div className="flex items-center justify-end gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-[#00ff88]" style={{ boxShadow: "0 0 6px #00ff88, 0 0 12px #00ff8880" }} />
              <span className="cyber-text-green tracking-widest">SYSTEM ONLINE</span>
            </div>
            <p className="cyber-label">{timestamp}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat) => (
            <Link key={stat.href + stat.label} href={stat.href}
              className="cyber-card cyber-corner rounded p-5 block group transition-all duration-200 hover:bg-[rgba(0,212,255,0.05)] hover:-translate-y-0.5">
              <div className="flex items-start justify-between mb-3">
                <p className="cyber-label text-[0.6rem] tracking-[0.15em]">{stat.label}</p>
                <span className="font-mono text-base cyber-text opacity-60 group-hover:opacity-100 transition-opacity">{stat.icon}</span>
              </div>
              <p className="font-mono text-4xl font-bold cyber-text">{stat.value}</p>
              <p className="cyber-label text-[0.55rem] mt-2 opacity-60">{stat.desc}</p>
              <div className="mt-3 h-px w-full bg-[rgba(0,212,255,0.15)] group-hover:bg-[rgba(0,212,255,0.4)] transition-colors" />
              <p className="font-mono text-[0.55rem] mt-1.5 tracking-widest cyber-label group-hover:cyber-text">VIEW →</p>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="cyber-card cyber-corner rounded p-6">
            <p className="cyber-label mb-5 tracking-[0.2em] text-[0.6rem]">{`// OPERATOR INFO`}</p>
            <dl className="space-y-4 font-mono text-sm">
              {[
                { key: "EMAIL", val: user?.email },
                { key: "UID", val: user?.id, small: true },
                { key: "AUTH", val: user?.app_metadata?.provider?.toUpperCase() },
              ].map(({ key, val, small }) => (
                <div key={key} className="flex gap-4">
                  <dt className="cyber-label w-16 shrink-0 pt-px">{key}</dt>
                  <dd className={`cyber-value ${small ? "text-xs opacity-75 break-all" : ""}`}>{val}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="cyber-card cyber-corner rounded p-6">
            <p className="cyber-label mb-5 tracking-[0.2em] text-[0.6rem]">{`// RECENT FLAVORS`}</p>
            <div className="space-y-2">
              {recentFlavors?.map((f: any) => (
                <Link key={f.id} href={`/humor-flavors/${f.id}`}
                  className="flex items-center gap-3 py-2 border-b border-[rgba(0,212,255,0.08)] hover:border-[rgba(0,212,255,0.2)] transition-colors group">
                  <span className="cyber-label font-mono text-[0.55rem] w-6">{f.id}</span>
                  <span className="cyber-text font-mono text-xs font-bold group-hover:opacity-80">{f.slug}</span>
                  <span className="cyber-label text-[0.6rem] truncate flex-1 opacity-60">{f.description}</span>
                </Link>
              ))}
              {(!recentFlavors || recentFlavors.length === 0) && (
                <p className="cyber-label text-[0.65rem]">No flavors yet. <Link href="/humor-flavors" className="cyber-text underline">Create one →</Link></p>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
