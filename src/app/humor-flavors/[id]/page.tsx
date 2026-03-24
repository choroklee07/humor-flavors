import { createClient, createAdminClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/AdminShell";
import { deleteHumorFlavor, deleteHumorFlavorStep, moveStepUp, moveStepDown } from "../actions";
import { ConfirmButton } from "@/components/ConfirmButton";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function FlavorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sessionClient = await createClient();
  const { data: { user } } = await sessionClient.auth.getUser();

  const supabase = createAdminClient();

  const [{ data: flavor }, { data: steps }] = await Promise.all([
    (supabase as any)
      .from("humor_flavors")
      .select("id, slug, description, created_datetime_utc")
      .eq("id", parseInt(id))
      .single(),
    (supabase as any)
      .from("humor_flavor_steps")
      .select("id, order_by, description, llm_temperature, llm_system_prompt, llm_user_prompt, llm_models(name), humor_flavor_step_types(slug)")
      .eq("humor_flavor_id", parseInt(id))
      .order("order_by", { ascending: true }),
  ]);

  if (!flavor) notFound();

  return (
    <AdminShell user={{ email: user?.email }}>
      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <p className="cyber-label tracking-[0.2em] text-[0.6rem]">
              <Link href="/humor-flavors" className="hover:opacity-70">HUMOR FLAVORS</Link>
              {` // ${flavor.slug.toUpperCase()}`}
            </p>
            <h1 className="cyber-text font-mono text-3xl font-bold mt-1">{flavor.slug}</h1>
            {flavor.description && <p className="cyber-label mt-1 text-[0.7rem]">{flavor.description}</p>}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Link href={`/humor-flavors/${id}/edit`} className="cyber-btn rounded px-4 py-2">EDIT FLAVOR</Link>
            <Link href={`/humor-flavors/${id}/steps/new`} className="cyber-btn rounded px-4 py-2">+ ADD STEP</Link>
            <Link href={`/humor-flavors/${id}/test`} className="cyber-btn rounded px-4 py-2" style={{ borderColor: "#00ff88", color: "#00ff88" }}>▶ TEST</Link>
            <Link href={`/humor-flavors/${id}/captions`} className="cyber-btn rounded px-4 py-2">CAPTIONS</Link>
            <form action={deleteHumorFlavor}>
              <input type="hidden" name="id" value={id} />
              <ConfirmButton message="Delete this flavor and all its steps?" className="cyber-btn cyber-btn-danger rounded px-4 py-2">
                DELETE
              </ConfirmButton>
            </form>
          </div>
        </div>

        {/* Steps */}
        <div>
          <p className="cyber-label mb-3 tracking-[0.2em] text-[0.6rem]">{`// PROMPT CHAIN STEPS (${steps?.length ?? 0})`}</p>
          <div className="space-y-3">
            {steps?.map((step: any, idx: number) => (
              <div key={step.id} className="cyber-card rounded p-4">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="shrink-0 text-center">
                      <span className="cyber-value font-mono text-2xl font-bold">{step.order_by}</span>
                    </div>
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        {step.humor_flavor_step_types?.slug && (
                          <span className="cyber-label text-[0.6rem] border border-[rgba(0,212,255,0.3)] rounded px-2 py-0.5">
                            {step.humor_flavor_step_types.slug}
                          </span>
                        )}
                        {step.llm_models?.name && (
                          <span className="font-mono text-[0.65rem] text-[rgba(0,255,136,0.7)]">{step.llm_models.name}</span>
                        )}
                        {step.llm_temperature != null && (
                          <span className="cyber-label text-[0.6rem]">TEMP: {step.llm_temperature}</span>
                        )}
                      </div>
                      {step.description && (
                        <p className="font-mono text-xs text-[rgba(200,240,255,0.7)]">{step.description}</p>
                      )}
                      {step.llm_system_prompt && (
                        <details className="group">
                          <summary className="cyber-label text-[0.6rem] cursor-pointer hover:opacity-70">SYSTEM PROMPT ▾</summary>
                          <pre className="mt-2 text-[0.65rem] font-mono text-[rgba(200,240,255,0.6)] whitespace-pre-wrap bg-[rgba(0,0,0,0.3)] rounded p-3">
                            {step.llm_system_prompt}
                          </pre>
                        </details>
                      )}
                      {step.llm_user_prompt && (
                        <details className="group">
                          <summary className="cyber-label text-[0.6rem] cursor-pointer hover:opacity-70">USER PROMPT ▾</summary>
                          <pre className="mt-2 text-[0.65rem] font-mono text-[rgba(200,240,255,0.6)] whitespace-pre-wrap bg-[rgba(0,0,0,0.3)] rounded p-3">
                            {step.llm_user_prompt}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <form action={moveStepUp}>
                      <input type="hidden" name="stepId" value={step.id} />
                      <input type="hidden" name="humorFlavorId" value={id} />
                      <button type="submit" disabled={idx === 0}
                        className="cyber-btn rounded px-2 py-1 text-[0.6rem] disabled:opacity-20 disabled:cursor-not-allowed">▲</button>
                    </form>
                    <form action={moveStepDown}>
                      <input type="hidden" name="stepId" value={step.id} />
                      <input type="hidden" name="humorFlavorId" value={id} />
                      <button type="submit" disabled={idx === (steps?.length ?? 0) - 1}
                        className="cyber-btn rounded px-2 py-1 text-[0.6rem] disabled:opacity-20 disabled:cursor-not-allowed">▼</button>
                    </form>
                    <Link href={`/humor-flavors/${id}/steps/${step.id}/edit`} className="cyber-btn rounded px-2 py-1 text-[0.6rem]">EDIT</Link>
                    <form action={deleteHumorFlavorStep}>
                      <input type="hidden" name="stepId" value={step.id} />
                      <input type="hidden" name="humorFlavorId" value={id} />
                      <ConfirmButton message="Delete this step?" className="cyber-btn cyber-btn-danger rounded px-2 py-1 text-[0.6rem]">✕</ConfirmButton>
                    </form>
                  </div>
                </div>
              </div>
            ))}
            {(!steps || steps.length === 0) && (
              <div className="cyber-card rounded p-8 text-center">
                <p className="cyber-label opacity-40">NO STEPS YET</p>
                <Link href={`/humor-flavors/${id}/steps/new`} className="cyber-btn rounded px-4 py-2 mt-4 inline-block">
                  + ADD FIRST STEP
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
