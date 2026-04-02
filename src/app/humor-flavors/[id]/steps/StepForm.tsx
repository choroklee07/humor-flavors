'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ExpandableTextarea } from './ExpandableTextarea';
import { PromptVariablesModal } from './PromptVariablesModal';

interface Model {
  id: number;
  name: string;
  is_temperature_supported: boolean;
}

interface StepType {
  id: number;
  slug: string;
  description: string | null;
}

interface IoType {
  id: number;
  slug: string;
  description: string;
}

interface DefaultValues {
  stepTypeId?: number | null;
  modelId?: number | null;
  inputTypeId?: number | null;
  outputTypeId?: number | null;
  temperature?: number | null;
  description?: string | null;
  systemPrompt?: string | null;
  userPrompt?: string | null;
}

interface Props {
  action: (formData: FormData) => Promise<void>;
  hiddenFields: Record<string, string>;
  models: Model[];
  stepTypes: StepType[];
  inputTypes: IoType[];
  outputTypes: IoType[];
  cancelHref: string;
  submitLabel: string;
  defaults?: DefaultValues;
}

export function StepForm({ action, hiddenFields, models, stepTypes, inputTypes, outputTypes, cancelHref, submitLabel, defaults = {} }: Props) {
  const [selectedModelId, setSelectedModelId] = useState<string>(defaults.modelId?.toString() ?? '');

  const selectedModel = models.find((m) => m.id.toString() === selectedModelId);
  const temperatureSupported = selectedModel?.is_temperature_supported ?? true;

  const inputClass = "w-full bg-transparent border border-[rgba(0,212,255,0.3)] rounded px-3 py-2 font-mono text-sm text-[var(--foreground)] focus:outline-none focus:border-[#00d4ff] focus:shadow-[0_0_8px_rgba(0,212,255,0.4)]";
  const selectClass = "w-full bg-[var(--background)] border border-[rgba(0,212,255,0.3)] rounded px-3 py-2 font-mono text-sm text-[var(--foreground)] focus:outline-none focus:border-[#00d4ff] focus:shadow-[0_0_8px_rgba(0,212,255,0.4)]";
  const optionClass = "bg-[var(--background)] text-[var(--foreground)]";
  const textareaClass = `${inputClass} resize-y`;

  return (
    <form action={action} className="space-y-5">
      {Object.entries(hiddenFields).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="cyber-label text-[0.6rem] block mb-1">STEP TYPE</label>
          <select name="stepTypeId" defaultValue={defaults.stepTypeId?.toString() ?? ''} className={selectClass}>
            <option value="" className={optionClass}>— None —</option>
            {stepTypes.map((t) => (
              <option key={t.id} value={t.id} className={optionClass}>
                {t.slug}{t.description ? ` · ${t.description}` : ''}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="cyber-label text-[0.6rem] block mb-1">LLM MODEL</label>
          <select
            name="llmModelId"
            value={selectedModelId}
            onChange={(e) => setSelectedModelId(e.target.value)}
            className={selectClass}
          >
            <option value="" className={optionClass}>— None —</option>
            {models.map((m) => (
              <option key={m.id} value={m.id} className={optionClass}>{m.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="cyber-label text-[0.6rem] block mb-1">INPUT TYPE *</label>
          <select name="inputTypeId" required defaultValue={defaults.inputTypeId?.toString() ?? ''} className={selectClass}>
            <option value="" className={optionClass}>— Select —</option>
            {inputTypes.map((t) => (
              <option key={t.id} value={t.id} className={optionClass}>
                {t.slug} · {t.description}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="cyber-label text-[0.6rem] block mb-1">OUTPUT TYPE *</label>
          <select name="outputTypeId" required defaultValue={defaults.outputTypeId?.toString() ?? ''} className={selectClass}>
            <option value="" className={optionClass}>— Select —</option>
            {outputTypes.map((t) => (
              <option key={t.id} value={t.id} className={optionClass}>
                {t.slug} · {t.description}
              </option>
            ))}
          </select>
        </div>
      </div>

      {temperatureSupported && (
        <div>
          <label className="cyber-label text-[0.6rem] block mb-1">TEMPERATURE (0.0 – 2.0)</label>
          <input
            name="llmTemperature"
            type="number"
            min="0"
            max="2"
            step="0.1"
            placeholder="e.g. 0.8"
            defaultValue={defaults.temperature ?? ''}
            className={inputClass}
          />
        </div>
      )}

      {!temperatureSupported && selectedModelId && (
        <p className="cyber-label text-[0.6rem] opacity-50">
          ⚠ TEMPERATURE NOT SUPPORTED BY THIS MODEL
        </p>
      )}

      <div>
        <label className="cyber-label text-[0.6rem] block mb-1">DESCRIPTION</label>
        <input
          name="description"
          placeholder="Brief description of what this step does..."
          defaultValue={defaults.description ?? ''}
          className={inputClass}
        />
      </div>

      <div className="flex items-center justify-between">
        <p className="cyber-label text-[0.6rem] tracking-[0.15em]">PROMPTS</p>
        <PromptVariablesModal />
      </div>

      <div>
        <ExpandableTextarea
          name="llmSystemPrompt"
          label="SYSTEM PROMPT"
          placeholder="You are a helpful assistant..."
          defaultValue={defaults.systemPrompt ?? ''}
          rows={5}
          className={textareaClass}
        />
      </div>

      <div>
        <ExpandableTextarea
          name="llmUserPrompt"
          label="USER PROMPT"
          placeholder="Analyze this image and describe what you see..."
          defaultValue={defaults.userPrompt ?? ''}
          rows={5}
          className={textareaClass}
        />
      </div>

      <div className="flex gap-3">
        <button type="submit" className="cyber-btn rounded px-6 py-2">{submitLabel}</button>
        <Link href={cancelHref} className="cyber-btn rounded px-6 py-2 text-center">CANCEL</Link>
      </div>
    </form>
  );
}
