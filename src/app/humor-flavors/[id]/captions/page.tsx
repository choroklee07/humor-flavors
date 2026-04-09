import { createClient, createAdminClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/AdminShell";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function FlavorCaptionsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sessionClient = await createClient();
  const { data: { user } } = await sessionClient.auth.getUser();

  const supabase = createAdminClient();

  const [{ data: flavor }, { data: captions, error: captionsError }] = await Promise.all([
    (supabase as any)
      .from("humor_flavors")
      .select("id, slug")
      .eq("id", parseInt(id))
      .single(),
    (supabase as any)
      .from("captions")
      .select("id, content, is_public, is_featured, created_datetime_utc, profiles!captions_profile_id_fkey(first_name, last_name, email), images!captions_image_id_fkey(url)")
      .eq("humor_flavor_id", parseInt(id))
      .order("created_datetime_utc", { ascending: false })
      .limit(100),
  ]);

  if (!flavor) notFound();
  if (captionsError) console.error("captions query error:", captionsError.message);

  return (
    <AdminShell user={{ email: user?.email }}>
      <div className="p-8 space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <p className="cyber-label tracking-[0.2em] text-[0.6rem]">
              <Link href="/humor-flavors" className="hover:opacity-70">HUMOR FLAVORS</Link>
              {` // `}
              <Link href={`/humor-flavors/${id}`} className="hover:opacity-70">{flavor.slug.toUpperCase()}</Link>
              {` // CAPTIONS`}
            </p>
            <h1 className="cyber-text font-mono text-3xl font-bold mt-1">CAPTIONS</h1>
            <p className="cyber-label mt-1">{captions?.length ?? 0} RECORDS (latest 100)</p>
          </div>
          <Link href={`/humor-flavors/${id}/test`} className="cyber-btn rounded px-4 py-2" style={{ borderColor: "#00ff88", color: "#00ff88" }}>
            ▶ GENERATE MORE
          </Link>
        </div>

        <div className="cyber-card rounded overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="border-b border-[rgba(0,212,255,0.15)]">
                  {["ID", "IMAGE", "CAPTION", "PUBLIC", "USER", "CREATED"].map((h) => (
                    <th key={h} className="cyber-label px-4 py-3 text-left font-normal">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {captions?.map((c: any) => (
                  <tr key={c.id} className="border-b border-[rgba(0,212,255,0.06)] hover:bg-[rgba(0,212,255,0.03)] transition-colors">
                    <td className="px-4 py-3 cyber-label">{c.id}</td>
                    <td className="px-4 py-3">
                      {c.images?.url ? (
                        <img src={c.images.url} alt="" className="w-16 h-16 object-cover rounded border border-[rgba(0,212,255,0.2)]" />
                      ) : (
                        <span className="opacity-20 cyber-label">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 max-w-[400px]">
                      <span className="text-[rgba(200,240,255,0.8)] block" title={c.content}>
                        {c.content}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={c.is_public ? "cyber-text-green" : "opacity-30"}>
                        {c.is_public ? "✓" : "✕"}
                      </span>
                    </td>
<td className="px-4 py-3 text-[rgba(200,240,255,0.4)] text-[0.65rem]">
                      {c.profiles
                        ? [c.profiles.first_name, c.profiles.last_name].filter(Boolean).join(" ") || c.profiles.email || "—"
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-[rgba(200,240,255,0.4)]">
                      {new Date(c.created_datetime_utc).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {(!captions || captions.length === 0) && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center cyber-label opacity-40">
                      NO CAPTIONS YET · <Link href={`/humor-flavors/${id}/test`} className="cyber-text underline">TEST THIS FLAVOR →</Link>
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
