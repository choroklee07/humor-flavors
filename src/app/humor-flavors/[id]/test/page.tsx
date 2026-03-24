import { createClient, createAdminClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/AdminShell";
import { TestForm } from "./TestForm";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function TestFlavorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sessionClient = await createClient();
  const { data: { user } } = await sessionClient.auth.getUser();

  const supabase = createAdminClient();
  const [{ data: flavor }, { data: steps }] = await Promise.all([
    (supabase as any)
      .from("humor_flavors")
      .select("id, slug, description")
      .eq("id", parseInt(id))
      .single(),
    (supabase as any)
      .from("humor_flavor_steps")
      .select("id, order_by, description, humor_flavor_step_types(slug)")
      .eq("humor_flavor_id", parseInt(id))
      .order("order_by", { ascending: true }),
  ]);

  if (!flavor) notFound();

  return (
    <AdminShell user={{ email: user?.email }}>
      <div className="p-8 max-w-3xl space-y-6">
        <div>
          <p className="cyber-label tracking-[0.2em] text-[0.6rem]">
            <Link href="/humor-flavors" className="hover:opacity-70">HUMOR FLAVORS</Link>
            {` // `}
            <Link href={`/humor-flavors/${id}`} className="hover:opacity-70">{flavor.slug.toUpperCase()}</Link>
            {` // TEST`}
          </p>
          <h1 className="cyber-text font-mono text-3xl font-bold mt-1">TEST: {flavor.slug}</h1>
          {flavor.description && <p className="cyber-label mt-1">{flavor.description}</p>}
        </div>

        {/* Prompt chain preview */}
        {steps && steps.length > 0 && (
          <div className="cyber-card rounded p-4">
            <p className="cyber-label mb-3 text-[0.6rem] tracking-widest">{`// PROMPT CHAIN (${steps.length} STEPS)`}</p>
            <div className="flex items-center gap-2 flex-wrap">
              {steps.map((step: any, i: number) => (
                <div key={step.id} className="flex items-center gap-2">
                  <span className="font-mono text-[0.65rem] text-[rgba(200,240,255,0.7)] border border-[rgba(0,212,255,0.2)] rounded px-2 py-0.5">
                    {step.order_by}. {step.humor_flavor_step_types?.slug ?? step.description ?? `Step ${step.order_by}`}
                  </span>
                  {i < steps.length - 1 && <span className="cyber-label">→</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        <TestForm flavorId={flavor.id} flavorSlug={flavor.slug} />
      </div>
    </AdminShell>
  );
}
