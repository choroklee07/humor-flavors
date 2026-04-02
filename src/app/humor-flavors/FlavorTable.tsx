'use client';

import { useState } from 'react';
import Link from 'next/link';
import { DuplicateModal } from './DuplicateModal';

interface Flavor {
  id: number;
  slug: string;
  description: string | null;
  created_datetime_utc: string;
}

interface Props {
  flavors: Flavor[];
  countMap: Record<number, number>;
}

export function FlavorTable({ flavors, countMap }: Props) {
  const [query, setQuery] = useState('');

  const filtered = query.trim()
    ? flavors.filter(
        (f) =>
          f.slug.toLowerCase().includes(query.toLowerCase()) ||
          (f.description ?? '').toLowerCase().includes(query.toLowerCase())
      )
    : flavors;

  return (
    <div className="cyber-card rounded overflow-hidden">
      {/* Search bar */}
      <div className="px-4 pt-4 pb-3 border-b border-[rgba(0,212,255,0.15)]">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by slug or description..."
          className="w-full bg-transparent border border-[rgba(0,212,255,0.3)] rounded px-3 py-2 font-mono text-xs text-[var(--foreground)] focus:outline-none focus:border-[#00d4ff] focus:shadow-[0_0_8px_rgba(0,212,255,0.4)] placeholder:opacity-30"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs font-mono">
          <thead>
            <tr className="border-b border-[rgba(0,212,255,0.15)]">
              {['ID', 'SLUG', 'DESCRIPTION', 'STEPS', 'CREATED', 'ACTIONS'].map((h) => (
                <th key={h} className="cyber-label px-4 py-3 text-left font-normal">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((flavor) => (
              <tr key={flavor.id} className="border-b border-[rgba(0,212,255,0.06)] hover:bg-[rgba(0,212,255,0.03)] transition-colors">
                <td className="px-4 py-3 cyber-label">{flavor.id}</td>
                <td className="px-4 py-3">
                  <Link href={`/humor-flavors/${flavor.id}`} className="text-[#00d4ff] font-bold tracking-wider hover:opacity-70 transition-opacity">
                    {flavor.slug}
                  </Link>
                </td>
                <td className="px-4 py-3 max-w-[300px]">
                  <span className="text-[rgba(200,240,255,0.7)] block truncate" title={flavor.description ?? ''}>
                    {flavor.description ?? <span className="opacity-30">—</span>}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="cyber-value font-mono">{countMap[flavor.id] ?? 0}</span>
                </td>
                <td className="px-4 py-3 text-[rgba(200,240,255,0.4)]">
                  {new Date(flavor.created_datetime_utc).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Link href={`/humor-flavors/${flavor.id}`} className="cyber-btn rounded px-2 py-1 text-[0.6rem]">VIEW</Link>
                    <Link href={`/humor-flavors/${flavor.id}/test`} className="cyber-btn rounded px-2 py-1 text-[0.6rem]" style={{ borderColor: '#00ff88', color: '#00ff88' }}>TEST</Link>
                    <DuplicateModal flavorId={flavor.id} flavorSlug={flavor.slug} />
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center cyber-label opacity-40">
                  {query.trim() ? 'NO RESULTS FOUND' : 'NO FLAVORS FOUND · CREATE ONE ABOVE'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
