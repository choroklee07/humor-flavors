import { createClient, createAdminClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/AdminShell";
import { updateHumorFlavor } from "../../actions";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function EditFlavorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sessionClient = await createClient();
  const { data: { user } } = await sessionClient.auth.getUser();

  const supabase = createAdminClient();
  const { data: flavor } = await (supabase as any)
    .from("humor_flavors")
    .select("id, slug, description")
    .eq("id", parseInt(id))
    .single();

  if (!flavor) notFound();

  return (
    <AdminShell user={{ email: user?.email }}>
      <div className="p-8 max-w-2xl space-y-6">
        <div>
          <p className="cyber-label tracking-[0.2em] text-[0.6rem]">
            <Link href="/humor-flavors" className="hover:opacity-70">HUMOR FLAVORS</Link>
            {` // `}
            <Link href={`/humor-flavors/${id}`} className="hover:opacity-70">{flavor.slug.toUpperCase()}</Link>
            {` // EDIT`}
          </p>
          <h1 className="cyber-text font-mono text-3xl font-bold mt-1">EDIT FLAVOR</h1>
        </div>

        <div className="cyber-card cyber-corner rounded p-6">
          <form action={updateHumorFlavor} className="space-y-4">
            <input type="hidden" name="id" value={id} />
            <div>
              <label className="cyber-label text-[0.6rem] block mb-1">SLUG *</label>
              <input name="slug" required defaultValue={flavor.slug}
                className="w-full bg-transparent border border-[rgba(0,212,255,0.3)] rounded px-3 py-2 font-mono text-sm text-[var(--foreground)] focus:outline-none focus:border-[#00d4ff] focus:shadow-[0_0_8px_rgba(0,212,255,0.4)]" />
            </div>
            <div>
              <label className="cyber-label text-[0.6rem] block mb-1">DESCRIPTION</label>
              <textarea name="description" rows={3} defaultValue={flavor.description ?? ""}
                className="w-full bg-transparent border border-[rgba(0,212,255,0.3)] rounded px-3 py-2 font-mono text-sm text-[var(--foreground)] focus:outline-none focus:border-[#00d4ff] focus:shadow-[0_0_8px_rgba(0,212,255,0.4)] resize-none" />
            </div>
            <div className="flex gap-3">
              <button type="submit" className="cyber-btn rounded px-6 py-2">SAVE CHANGES</button>
              <Link href={`/humor-flavors/${id}`} className="cyber-btn rounded px-6 py-2 text-center">CANCEL</Link>
            </div>
          </form>
        </div>
      </div>
    </AdminShell>
  );
}
