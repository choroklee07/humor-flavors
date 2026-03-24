"use client";
import { useActionState } from "react";
import { testHumorFlavor } from "../../actions";

interface Props {
  flavorId: number;
  flavorSlug: string;
}

export function TestForm({ flavorId, flavorSlug }: Props) {
  const [state, formAction, isPending] = useActionState(testHumorFlavor, null);

  return (
    <div className="space-y-6">
      <div className="cyber-card cyber-corner rounded p-6">
        <p className="cyber-label mb-4 tracking-[0.2em] text-[0.6rem]">{`// TEST INPUT`}</p>
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="humorFlavorId" value={flavorId} />
          <div>
            <label className="cyber-label text-[0.6rem] block mb-1">IMAGE URL *</label>
            <input
              name="imageUrl"
              required
              type="url"
              placeholder="https://example.com/image.jpg"
              className="w-full bg-transparent border border-[rgba(0,212,255,0.3)] rounded px-3 py-2 font-mono text-sm text-[var(--foreground)] focus:outline-none focus:border-[#00d4ff] focus:shadow-[0_0_8px_rgba(0,212,255,0.4)] placeholder:opacity-30"
            />
            <p className="cyber-label text-[0.55rem] mt-1 opacity-50">
              Enter a public image URL to generate captions using the {flavorSlug} flavor
            </p>
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="cyber-btn rounded px-6 py-2"
            style={{ borderColor: "#00ff88", color: "#00ff88" }}
          >
            {isPending ? "GENERATING..." : "▶ GENERATE CAPTIONS"}
          </button>
        </form>
      </div>

      {isPending && (
        <div className="cyber-card rounded p-6 text-center">
          <p className="cyber-text font-mono text-sm tracking-widest">PROCESSING PROMPT CHAIN...</p>
          <div className="mt-3 flex justify-center gap-1">
            {[0,1,2].map((i) => (
              <span key={i} className="inline-block w-2 h-2 rounded-full bg-[#00d4ff] animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
            ))}
          </div>
        </div>
      )}

      {state?.error && (
        <div className="cyber-card rounded p-5 border-[rgba(255,0,60,0.4)]" style={{ boxShadow: "0 0 12px rgba(255,0,60,0.2)" }}>
          <p className="cyber-label text-[0.6rem] text-[#ff003c] mb-2">⚠ ERROR</p>
          <p className="font-mono text-xs text-[#ff003c]">{state.error}</p>
        </div>
      )}

      {state?.captions && (
        <div className="cyber-card cyber-corner rounded p-6 space-y-4">
          <div className="flex items-center justify-between">
            <p className="cyber-label tracking-[0.2em] text-[0.6rem]">{`// GENERATED CAPTIONS (${state.captions.length})`}</p>
            {state.imageId && <p className="cyber-label text-[0.55rem]">IMAGE ID: {state.imageId}</p>}
          </div>
          <div className="space-y-3">
            {state.captions.map((caption: string, i: number) => (
              <div key={i} className="flex gap-3 p-3 border border-[rgba(0,212,255,0.1)] rounded bg-[rgba(0,0,0,0.2)]">
                <span className="cyber-value font-mono text-sm shrink-0">{i + 1}.</span>
                <p className="font-mono text-sm text-[rgba(200,240,255,0.85)] leading-relaxed">{caption}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
