'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { duplicateHumorFlavor } from './actions';

interface Props {
  flavorId: number;
  flavorSlug: string;
}

export function DuplicateModal({ flavorId, flavorSlug }: Props) {
  const [open, setOpen] = useState(false);
  const [slug, setSlug] = useState('');

  function handleOpen() {
    setSlug(`Copy of ${flavorSlug}`);
    setOpen(true);
  }

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="cyber-btn rounded px-2 py-1 text-[0.6rem]"
        style={{ borderColor: '#ff9900', color: '#ff9900' }}
      >
        COPY
      </button>

      {open && createPortal(
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div
            className="cyber-card cyber-corner rounded p-6 w-full max-w-md mx-4 font-mono"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <p className="cyber-label text-[0.6rem] tracking-[0.2em] mb-1">{`// DUPLICATE FLAVOR`}</p>
            <h2 className="cyber-text text-lg font-bold mb-6">
              DUPLICATE FLAVOR
            </h2>

            <form action={duplicateHumorFlavor}>
              <input type="hidden" name="sourceId" value={flavorId} />

              <div className="mb-6">
                <label className="cyber-label text-[0.6rem] block mb-2">
                  SLUG
                </label>
                <input
                  name="newSlug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  required
                  className="w-full bg-transparent border border-[rgba(0,212,255,0.3)] rounded px-3 py-2 font-mono text-xs text-[var(--foreground)] focus:outline-none focus:border-[#00d4ff] focus:shadow-[0_0_8px_rgba(0,212,255,0.4)]"
                />
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="cyber-btn rounded px-4 py-2 text-xs"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="cyber-btn rounded px-4 py-2 text-xs"
                  style={{ borderColor: '#ff9900', color: '#ff9900' }}
                >
                  DUPLICATE
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
