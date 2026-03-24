import { createClient, createAdminClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/AdminShell";
import { createHumorFlavorStep } from "../../../actions";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function NewStepPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sessionClient = await createClient();
  const { data: { user } } = await sessionClient.auth.getUser();

  const supabase = createAdminClient();

  const [{ data: flavor }, { data: models }, { data: stepTypes }] = await Promise.all([
    (supabase as any).from("humor_flavors").select("id, slug").eq("id", parseInt(id)).single(),
    (supabase as any).from("llm_models").select("id, name").order("name"),
    (supabase as any).from("humor_flavor_step_types").select("id, slug, description").order("id"),
  ]);

  if (!flavor) notFound();

  const inputClass = "w-full bg-transparent border border-[rgba(0,212,255,0.3)] rounded px-3 py-2 font-mono text-sm text-[var(--foreground)] focus:outline-none focus:border-[#00d4ff] focus:shadow-[0_0_8px_rgba(0,212,255,0.4)]";
  const textareaClass = `${inputClass} resize-y`;

  return (
    <AdminShell user={{ email: user?.email }}>
      <div className="p-8 max-w-3xl space-y-6">
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
          <form action={createHumorFlavorStep} className="space-y-5">
            <input type="hidden" name="humorFlavorId" value={id} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="cyber-label text-[0.6rem] block mb-1">STEP TYPE</label>
                <select name="stepTypeId" className={inputClass}>
                  <option value="">— None —</option>
                  {stepTypes?.map((t: any) => (
                    <option key={t.id} value={t.id}>{t.slug}{t.description ? ` · ${t.description}` : ""}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="cyber-label text-[0.6rem] block mb-1">LLM MODEL</label>
                <select name="llmModelId" className={inputClass}>
                  <option value="">— None —</option>
                  {models?.map((m: any) => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="cyber-label text-[0.6rem] block mb-1">TEMPERATURE (0.0 – 2.0)</label>
              <input name="llmTemperature" type="number" min="0" max="2" step="0.1" placeholder="e.g. 0.8"
                className={inputClass} />
            </div>

            <div>
              <label className="cyber-label text-[0.6rem] block mb-1">DESCRIPTION</label>
              <input name="description" placeholder="Brief description of what this step does..."
                className={inputClass} />
            </div>

            <div>
              <label className="cyber-label text-[0.6rem] block mb-1">SYSTEM PROMPT</label>
              <textarea name="llmSystemPrompt" rows={5} placeholder="You are a helpful assistant..."
                className={textareaClass} />
            </div>

            <div>
              <label className="cyber-label text-[0.6rem] block mb-1">USER PROMPT</label>
              <textarea name="llmUserPrompt" rows={5} placeholder="Analyze this image and describe what you see..."
                className={textareaClass} />
            </div>

            <div className="flex gap-3">
              <button type="submit" className="cyber-btn rounded px-6 py-2">+ ADD STEP</button>
              <Link href={`/humor-flavors/${id}`} className="cyber-btn rounded px-6 py-2 text-center">CANCEL</Link>
            </div>
          </form>
        </div>
      </div>
    </AdminShell>
  );
}
