import { createClient, createAdminClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/AdminShell";
import { createHumorFlavor } from "./actions";
import Link from "next/link";

export default async function HumorFlavorsPage() {
  const sessionClient = await createClient();
  const { data: { user } } = await sessionClient.auth.getUser();

  const supabase = createAdminClient();
  const { data: flavors } = await (supabase as any)
    .from("humor_flavors")
    .select("id, slug, description, created_datetime_utc")
    .order("id", { ascending: true });

  // Get step counts per flavor
  const { data: stepCounts } = await (supabase as any)
    .from("humor_flavor_steps")
    .select("humor_flavor_id");

  const countMap: Record<number, number> = {};
  for (const s of stepCounts ?? []) {
    countMap[s.humor_flavor_id] = (countMap[s.humor_flavor_id] ?? 0) + 1;
  }

  return (
    <AdminShell user={{ email: user?.email }}>
      <div className="p-8 space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <p className="cyber-label tracking-[0.2em]">{`// PROMPT CHAIN MANAGEMENT`}</p>
            <h1 className="cyber-text font-mono text-3xl font-bold mt-1">HUMOR FLAVORS</h1>
            <p className="cyber-label mt-1">{flavors?.length ?? 0} TOTAL RECORDS</p>
          </div>
        </div>

        {/* Create form */}
        <div className="cyber-card cyber-corner rounded p-6">
          <p className="cyber-label mb-4 tracking-[0.2em] text-[0.6rem]">{`// CREATE NEW FLAVOR`}</p>
          <form action={createHumorFlavor} className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label className="cyber-label text-[0.6rem] block mb-1">SLUG</label>
              <input
                name="slug"
                required
                placeholder="e.g. dry-wit-v1"
                className="w-full bg-transparent border border-[rgba(0,212,255,0.3)] rounded px-3 py-2 font-mono text-xs text-[var(--foreground)] focus:outline-none focus:border-[#00d4ff] focus:shadow-[0_0_8px_rgba(0,212,255,0.4)] placeholder:opacity-30"
              />
            </div>
            <div className="flex-[2]">
              <label className="cyber-label text-[0.6rem] block mb-1">DESCRIPTION</label>
              <input
                name="description"
                placeholder="Brief description of this flavor..."
                className="w-full bg-transparent border border-[rgba(0,212,255,0.3)] rounded px-3 py-2 font-mono text-xs text-[var(--foreground)] focus:outline-none focus:border-[#00d4ff] focus:shadow-[0_0_8px_rgba(0,212,255,0.4)] placeholder:opacity-30"
              />
            </div>
            <button type="submit" className="cyber-btn rounded px-5 py-2 shrink-0">
              + CREATE
            </button>
          </form>
        </div>

        {/* List */}
        <div className="cyber-card rounded overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="border-b border-[rgba(0,212,255,0.15)]">
                  {["ID", "SLUG", "DESCRIPTION", "STEPS", "CREATED", "ACTIONS"].map((h) => (
                    <th key={h} className="cyber-label px-4 py-3 text-left font-normal">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {flavors?.map((flavor: any) => (
                  <tr key={flavor.id} className="border-b border-[rgba(0,212,255,0.06)] hover:bg-[rgba(0,212,255,0.03)] transition-colors">
                    <td className="px-4 py-3 cyber-label">{flavor.id}</td>
                    <td className="px-4 py-3">
                      <Link href={`/humor-flavors/${flavor.id}`} className="text-[#00d4ff] font-bold tracking-wider hover:opacity-70 transition-opacity">
                        {flavor.slug}
                      </Link>
                    </td>
                    <td className="px-4 py-3 max-w-[300px]">
                      <span className="text-[rgba(200,240,255,0.7)] block truncate" title={flavor.description ?? ""}>
                        {flavor.description ?? <span className="opacity-30">—</span>}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="cyber-value font-mono">{countMap[flavor.id] ?? 0}</span>
                    </td>
                    <td className="px-4 py-3 text-[rgba(200,240,255,0.4)]">
                      {new Date(flavor.created_datetime_utc).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link href={`/humor-flavors/${flavor.id}`} className="cyber-btn rounded px-2 py-1 text-[0.6rem]">VIEW</Link>
                        <Link href={`/humor-flavors/${flavor.id}/edit`} className="cyber-btn rounded px-2 py-1 text-[0.6rem]">EDIT</Link>
                        <Link href={`/humor-flavors/${flavor.id}/test`} className="cyber-btn rounded px-2 py-1 text-[0.6rem]" style={{ borderColor: "#00ff88", color: "#00ff88" }}>TEST</Link>
                      </div>
                    </td>
                  </tr>
                ))}
                {(!flavors || flavors.length === 0) && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center cyber-label opacity-40">
                      NO FLAVORS FOUND · CREATE ONE ABOVE
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
