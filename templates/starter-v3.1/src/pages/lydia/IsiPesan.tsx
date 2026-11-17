import { Fragment, useState, type ReactNode } from 'react';
import { Check, Copy } from 'lucide-react';

// Markdown ringkas, tanpa innerHTML
type Blok =
  | { jenis: 'kode'; bahasa: string; isi: string }
  | { jenis: 'judul'; isi: string }
  | { jenis: 'daftar'; urut: boolean; butir: string[] }
  | { jenis: 'kutipan'; isi: string }
  | { jenis: 'paragraf'; isi: string };

const POLA_BUTIR = /^\s*(?:[-*]|\d+[.)])\s+/;
const POLA_AWAL_BLOK = /^(```|#{1,3}\s|>)/;

function pecahBlok(teks: string): Blok[] {
  const baris = teks.split('\n');
  const hasil: Blok[] = [];
  let i = 0;
  while (i < baris.length) {
    const b = baris[i];
    const pagar = b.match(/^```(\S*)/);
    if (pagar) {
      const isi: string[] = [];
      i++;
      while (i < baris.length && !baris[i].startsWith('```')) isi.push(baris[i++]);
      i++;
      hasil.push({ jenis: 'kode', bahasa: pagar[1], isi: isi.join('\n') });
    } else if (!b.trim()) {
      i++;
    } else if (/^#{1,3}\s/.test(b)) {
      hasil.push({ jenis: 'judul', isi: b.replace(/^#{1,3}\s+/, '') });
      i++;
    } else if (b.startsWith('>')) {
      const isi: string[] = [];
      while (i < baris.length && baris[i].startsWith('>')) isi.push(baris[i++].replace(/^>\s?/, ''));
      hasil.push({ jenis: 'kutipan', isi: isi.join(' ') });
    } else if (POLA_BUTIR.test(b)) {
      const butir: string[] = [];
      const urut = /^\s*\d/.test(b);
      while (i < baris.length && POLA_BUTIR.test(baris[i])) butir.push(baris[i++].replace(POLA_BUTIR, ''));
      hasil.push({ jenis: 'daftar', urut, butir });
    } else {
      const isi: string[] = [];
      while (i < baris.length && baris[i].trim() && !POLA_AWAL_BLOK.test(baris[i]) && !POLA_BUTIR.test(baris[i])) {
        isi.push(baris[i++]);
      }
      hasil.push({ jenis: 'paragraf', isi: isi.join('\n') });
    }
  }
  return hasil;
}

// Penanda tanpa pasangan disembunyikan
function rapikanPenanda(teks: string): string {
  let hasil = teks;
  if ((hasil.match(/\*\*/g)?.length ?? 0) % 2 === 1) {
    const i = hasil.lastIndexOf('**');
    hasil = hasil.slice(0, i) + hasil.slice(i + 2);
  }
  if ((hasil.match(/`/g)?.length ?? 0) % 2 === 1) {
    const i = hasil.lastIndexOf('`');
    hasil = hasil.slice(0, i) + hasil.slice(i + 1);
  }
  return hasil;
}

// `kode` dan **tebal**
function sebaris(teks: string): ReactNode[] {
  return rapikanPenanda(teks)
    .split(/(`[^`\n]+`|\*\*[^*\n]+\*\*)/g)
    .filter(Boolean)
    .map((bagian, i) => {
      if (/^`[^`]+`$/.test(bagian)) return <code key={i}>{bagian.slice(1, -1)}</code>;
      if (/^\*\*[^*]+\*\*$/.test(bagian)) return <strong key={i}>{bagian.slice(2, -2)}</strong>;
      return <Fragment key={i}>{bagian}</Fragment>;
    });
}

function denganBaris(teks: string): ReactNode[] {
  return teks.split('\n').flatMap((baris, i) => (i === 0 ? sebaris(baris) : [<br key={`br${i}`} />, ...sebaris(baris)]));
}

function BlokKode({ bahasa, isi }: { bahasa: string; isi: string }) {
  const [tersalin, setTersalin] = useState(false);

  const salin = async () => {
    try {
      await navigator.clipboard.writeText(isi);
      setTersalin(true);
      window.setTimeout(() => setTersalin(false), 1500);
    } catch {
      // Clipboard ditolak peramban.
    }
  };

  return (
    <div className="lydia-kode">
      <div className="lydia-kode__kepala">
        <span>{bahasa || 'kode'}</span>
        <button type="button" onClick={() => void salin()} aria-label="Salin kode">
          {tersalin ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
          {tersalin ? 'Tersalin' : 'Salin'}
        </button>
      </div>
      <pre>
        <code>{isi}</code>
      </pre>
    </div>
  );
}

function RenderBlok({ blok }: { blok: Blok }) {
  switch (blok.jenis) {
    case 'kode':
      return <BlokKode bahasa={blok.bahasa} isi={blok.isi} />;
    case 'judul':
      return <p className="lydia-isi__judul">{sebaris(blok.isi)}</p>;
    case 'kutipan':
      return <blockquote>{sebaris(blok.isi)}</blockquote>;
    case 'daftar': {
      const Daftar = blok.urut ? 'ol' : 'ul';
      return (
        <Daftar>
          {blok.butir.map((b, i) => (
            <li key={i}>{sebaris(b)}</li>
          ))}
        </Daftar>
      );
    }
    default:
      return <p>{denganBaris(blok.isi)}</p>;
  }
}

/** Isi pesan; kursor saat mengalir. */
export function IsiPesan({ teks, mengalir = false }: { teks: string; mengalir?: boolean }) {
  return (
    <div className={`lydia-isi ${mengalir ? 'lydia-isi--mengalir' : ''}`}>
      {pecahBlok(teks).map((blok, i) => (
        <RenderBlok key={i} blok={blok} />
      ))}
    </div>
  );
}
