'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';

interface Props {
  name: string;
  label: string;
  placeholder?: string;
  defaultValue?: string;
  rows?: number;
  className?: string;
}

export function ExpandableTextarea({ name, label, placeholder, defaultValue = '', rows = 5, className }: Props) {
  const [value, setValue] = useState(defaultValue);
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between mb-1">
        <label className="cyber-label text-[0.6rem]">{label}</label>
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="cyber-label text-[0.6rem] transition-opacity hover:opacity-70"
          style={{ color: '#00d4ff' }}
        >
          ⤢ EXPAND
        </button>
      </div>
      <textarea
        name={name}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className={className}
      />

      {expanded &&
        createPortal(
          <div className="fixed inset-0 z-50 flex flex-col bg-[var(--background)] p-6 font-mono">
            <div className="flex items-center justify-between mb-3">
              <p className="cyber-label text-[0.6rem] tracking-[0.2em]">{`// ${label}`}</p>
              <button
                type="button"
                onClick={() => setExpanded(false)}
                className="cyber-btn rounded px-4 py-1 text-xs"
              >
                ✕ CLOSE
              </button>
            </div>
            <textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              className="flex-1 w-full bg-transparent border border-[rgba(0,212,255,0.3)] rounded px-4 py-3 font-mono text-sm text-[var(--foreground)] focus:outline-none focus:border-[#00d4ff] focus:shadow-[0_0_8px_rgba(0,212,255,0.4)] resize-none"
            />
          </div>,
          document.body
        )}
    </>
  );
}
