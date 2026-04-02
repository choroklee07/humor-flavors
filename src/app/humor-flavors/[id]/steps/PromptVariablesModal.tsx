'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';

const VARIABLES: { placeholder: string; description: string }[] = [
  { placeholder: '${stepNOutput}',                  description: 'Output from a previous step (replace N with step number)' },
  { placeholder: '${imageDescription}',             description: 'AI-generated description of the image' },
  { placeholder: '${imageAdditionalContext}',        description: 'Additional context attached to the image' },
  { placeholder: '${allCommunityContexts}',          description: 'All community context entries' },
  { placeholder: '${tenRandomCommunityContexts}',    description: '10 randomly selected community contexts' },
  { placeholder: '${fiveRelevantCommunityContexts}', description: '5 community contexts most relevant to the image' },
  { placeholder: '${allTerms}',                      description: 'All glossary terms' },
  { placeholder: '${tenRandomTerms}',                description: '10 randomly selected terms' },
  { placeholder: '${allCaptionExamples}',            description: 'All caption examples' },
  { placeholder: '${tenRandomCaptionExamples}',      description: '10 randomly selected caption examples' },
  { placeholder: '${startRandomizeLines}',           description: 'Start of a randomized line-selection block' },
  { placeholder: '${endRandomizeLines}',             description: 'End of a randomized line-selection block' },
];

export function PromptVariablesModal() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  function handleCopy(placeholder: string) {
    navigator.clipboard.writeText(placeholder);
    setCopied(placeholder);
    setTimeout(() => setCopied(null), 1500);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="cyber-btn rounded px-3 py-1 text-[0.6rem]"
        style={{ borderColor: '#bf00ff', color: '#bf00ff' }}
      >
        {'{ } PROMPT VARIABLES'}
      </button>

      {open && createPortal(
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onMouseDown={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div
            className="cyber-card cyber-corner rounded w-full max-w-2xl max-h-[85vh] flex flex-col font-mono"
            onMouseDown={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-[rgba(0,212,255,0.15)]">
              <div>
                <p className="cyber-label text-[0.6rem] tracking-[0.2em] mb-1">{`// REFERENCE`}</p>
                <h2 className="cyber-text text-lg font-bold">PROMPT VARIABLES</h2>
                <p className="text-[rgba(200,240,255,0.5)] text-[0.65rem] mt-1">
                  Use these placeholders to pull in pipeline outputs, image details, and community context.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="cyber-btn rounded px-3 py-1 text-xs shrink-0 ml-4"
              >
                ✕ CLOSE
              </button>
            </div>

            {/* Table */}
            <div className="overflow-y-auto flex-1">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-[rgba(0,212,255,0.15)]">
                    <th className="cyber-label px-6 py-2 text-left font-normal text-[0.6rem]">TYPE</th>
                    <th className="cyber-label px-6 py-2 text-left font-normal text-[0.6rem]">VARIABLE</th>
                    <th className="cyber-label px-6 py-2 text-left font-normal text-[0.6rem]">DESCRIPTION</th>
                    <th className="px-4 py-2" />
                  </tr>
                </thead>
                <tbody>
                  {VARIABLES.map(({ placeholder, description }) => (
                    <tr
                      key={placeholder}
                      className="border-b border-[rgba(0,212,255,0.06)] hover:bg-[rgba(0,212,255,0.03)] transition-colors"
                    >
                      <td className="px-6 py-3">
                        <span className="cyber-label text-[0.6rem]">Variable</span>
                      </td>
                      <td className="px-6 py-3">
                        <code
                          className="text-[0.7rem] cursor-pointer select-all"
                          style={{ color: '#bf00ff' }}
                          onClick={() => handleCopy(placeholder)}
                          title="Click to copy"
                        >
                          {placeholder}
                        </code>
                      </td>
                      <td className="px-6 py-3 text-[rgba(200,240,255,0.55)] text-[0.65rem]">
                        {description}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => handleCopy(placeholder)}
                          className="cyber-label text-[0.55rem] hover:opacity-100 transition-opacity whitespace-nowrap"
                          style={{ color: copied === placeholder ? '#00ff88' : undefined }}
                        >
                          {copied === placeholder ? '✓ COPIED' : 'COPY'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
