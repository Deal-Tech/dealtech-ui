import { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';

import './tema-gelap.css';

export type TemaLydia = 'terang' | 'gelap';

const KUNCI_SIMPAN = 'lydia:tema';
const DURASI_REVEAL_MS = 500;

function bacaTema(): TemaLydia {
  try {
    return localStorage.getItem(KUNCI_SIMPAN) === 'gelap' ? 'gelap' : 'terang';
  } catch {
    return 'terang';
  }
}

function terapkan(tema: TemaLydia) {
  const html = document.documentElement;
  if (tema === 'gelap') html.dataset.tema = 'gelap';
  else delete html.dataset.tema;
  try {
    localStorage.setItem(KUNCI_SIMPAN, tema);
  } catch {
    // Penyimpanan diblokir.
  }
}

const gerakDikurangi = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Lingkaran membesar dari titik klik
function revealMelingkar(x: number, y: number, ubah: () => void) {
  if (!document.startViewTransition || gerakDikurangi()) return ubah();
  const transisi = document.startViewTransition(ubah);
  const jari = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  void transisi.ready.then(() => {
    document.documentElement.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${jari}px at ${x}px ${y}px)`] },
      { duration: DURASI_REVEAL_MS, easing: 'ease-in-out', pseudoElement: '::view-transition-new(root)' },
    );
  });
}

// Atribut dilepas saat halaman ditutup
export function useTemaLydia() {
  const [tema, setTema] = useState<TemaLydia>(bacaTema);

  useEffect(() => {
    terapkan(tema);
  }, [tema]);

  useEffect(
    () => () => {
      delete document.documentElement.dataset.tema;
    },
    [],
  );

  const gantiTema = (asal?: HTMLElement) => {
    const next: TemaLydia = tema === 'gelap' ? 'terang' : 'gelap';
    const kotak = asal?.getBoundingClientRect();
    const x = kotak ? kotak.left + kotak.width / 2 : innerWidth / 2;
    const y = kotak ? kotak.top + kotak.height / 2 : 0;
    revealMelingkar(x, y, () => {
      terapkan(next);
      flushSync(() => setTema(next));
    });
  };

  return { tema, gantiTema };
}
