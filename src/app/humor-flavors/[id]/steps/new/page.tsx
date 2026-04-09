import { createClient, createAdminClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/AdminShell";
import { createHumorFlavorStep } from "../../../actions";
import { StepForm } from "../StepForm";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function NewStepPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sessionClient = await createClient();
  const { data: { user } } = await sessionClient.auth.getUser();

  const supabase = createAdminClient();

  const [{ data: flavor }, { data: models }, { data: stepTypes }, { data: inputTypes }, { data: outputTypes }] = await Promise.all([
    (supabase as any).from("humor_flavors").select("id, slug").eq("id", parseInt(id)).single(),
    (supabase as any).from("llm_models").select("id, name, is_temperature_supported").order("name"),
    (supabase as any).from("humor_flavor_step_types").select("id, slug, description").order("id"),
    (supabase as any).from("llm_input_types").select("id, slug, description").order("id"),
    (supabase as any).from("llm_output_types").select("id, slug, description").order("id"),
  ]);

  if (!flavor) notFound();

  return (
    <AdminShell user={{ email: user?.email }}>
      <div className="p-8 max-w-5xl space-y-6">
        <div>
          <p className="cyber-label tracking-[0.2em] text-[0.6rem]">
            <Link href="/humor-flavors" className="hover:opacity-70">HUMOR FLAVORS</Link>
            {` // `}
            <Link href={`/humor-flavors/${id}`} className="hover:opacity-70">{flavor.slug.toUpperCase()}</Link>
            {` // NEW STEP`}
          </p>
          <h1 className="cyber-text font-mono text-3xl font-bold mt-1">ADD STEP</h1>
        </div>

        <div className="cyber-card cyber-corner rounded p-6">
          <StepForm
            action={createHumorFlavorStep}
            hiddenFields={{ humorFlavorId: id }}
            models={models ?? []}
            stepTypes={stepTypes ?? []}
            inputTypes={inputTypes ?? []}
            outputTypes={outputTypes ?? []}
            cancelHref={`/humor-flavors/${id}`}
            submitLabel="SAVE"
          />
        </div>
      </div>
    </AdminShell>
  );
}
