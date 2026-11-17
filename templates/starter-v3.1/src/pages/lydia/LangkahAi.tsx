import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';

// Glyph berputar ala Claude Code
const GLYPH = ['·', '✢', '✳', '✶', '✻', '✽', '✻', '✶', '✳', '✢'];
const JEDA_GLYPH_MS = 120;
const JEDA_DETIK_MS = 1000;
const DETIK_SEMENIT = 60;

export interface LangkahProses {
  teks: string;
  // Muncul sesudah sekian ms
  mulaiMs: number;
}

function Pemutar() {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const timer = window.setInterval(() => setI((n) => (n + 1) % GLYPH.length), JEDA_GLYPH_MS);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <span className="langkah-ai__pemutar" aria-hidden="true">
      {GLYPH[i]}
    </span>
  );
}

// 75 → "1 mnt 15 dtk"
function lama(detik: number): string {
  if (detik < DETIK_SEMENIT) return `${detik} dtk`;
  return `${Math.floor(detik / DETIK_SEMENIT)} mnt ${detik % DETIK_SEMENIT} dtk`;
}

/** Langkah AI selama menunggu. */
export function LangkahAi({ langkah }: { langkah: LangkahProses[] }) {
  const [awal] = useState(() => Date.now());
  const [kini, setKini] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setKini(Date.now()), JEDA_DETIK_MS / 4);
    return () => window.clearInterval(timer);
  }, []);

  const ms = Math.max(0, kini - awal);
  const tampil = langkah.filter((l) => l.mulaiMs <= ms);

  return (
    <ol className="langkah-ai" role="status" aria-live="polite">
      {tampil.map((l, i) => {
        const jalan = i === tampil.length - 1;
        return (
          <li key={l.teks} className={`langkah-ai__langkah ${jalan ? 'is-jalan' : ''}`}>
            {jalan ? <Pemutar /> : <Check className="langkah-ai__centang" aria-hidden="true" />}
            <span className="langkah-ai__teks">{l.teks}…</span>
            {jalan ? <span className="langkah-ai__detik">({lama(Math.floor(ms / JEDA_DETIK_MS))})</span> : null}
          </li>
        );
      })}
    </ol>
  );
}
