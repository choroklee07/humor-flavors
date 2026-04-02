import { createClient, createAdminClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/AdminShell";
import { createHumorFlavor } from "./actions";
import { FlavorTable } from "./FlavorTable";

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
        <FlavorTable flavors={flavors ?? []} countMap={countMap} />
      </div>
    </AdminShell>
  );
}
