import { useCallback, useState, type KeyboardEvent, type PointerEvent as ReactPointerEvent, type RefObject } from 'react';

// Sama dengan sipekum: lebar mobile
export const LEBAR_MIN = 390;
// Sama dengan --lydia-tepi di CSS
const TEPI_PX = 12;
const LANGKAH_PANAH_PX = 16;
const KUNCI_SIMPAN = 'lydia:lebar-panel';

// Panel dan chat ≥ mobile
function jepitLebar(lebar: number, lebarBadan: number) {
  const maks = Math.max(LEBAR_MIN, lebarBadan - TEPI_PX * 3 - LEBAR_MIN);
  return Math.round(Math.min(Math.max(lebar, LEBAR_MIN), maks));
}

function bacaLebar() {
  try {
    const v = Number(localStorage.getItem(KUNCI_SIMPAN));
    return Number.isFinite(v) && v >= LEBAR_MIN ? v : LEBAR_MIN;
  } catch {
    return LEBAR_MIN;
  }
}

function simpanLebar(lebar: number) {
  try {
    localStorage.setItem(KUNCI_SIMPAN, String(lebar));
  } catch {
    // Penyimpanan diblokir.
  }
}

export function useLebarPanel(badanRef: RefObject<HTMLElement | null>) {
  const [lebar, setLebar] = useState(bacaLebar);
  const [menggeser, setMenggeser] = useState(false);

  const mulaiGeser = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      const badan = badanRef.current;
      if (!badan || e.button !== 0) return;
      e.preventDefault();
      const pegangan = e.currentTarget;
      const kiri = badan.getBoundingClientRect().left;
      const lebarBadan = badan.clientWidth;
      let terakhir = lebar;
      pegangan.setPointerCapture(e.pointerId);
      setMenggeser(true);
      const gerak = (ev: PointerEvent) => {
        terakhir = jepitLebar(ev.clientX - kiri - TEPI_PX, lebarBadan);
        setLebar(terakhir);
      };
      const lepas = () => {
        pegangan.removeEventListener('pointermove', gerak);
        pegangan.removeEventListener('pointerup', lepas);
        pegangan.removeEventListener('pointercancel', lepas);
        setMenggeser(false);
        simpanLebar(terakhir);
      };
      pegangan.addEventListener('pointermove', gerak);
      pegangan.addEventListener('pointerup', lepas);
      pegangan.addEventListener('pointercancel', lepas);
    },
    [badanRef, lebar],
  );

  const geserPanah = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      const arah = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      const badan = badanRef.current;
      if (!arah || !badan) return;
      e.preventDefault();
      const next = jepitLebar(lebar + arah * LANGKAH_PANAH_PX, badan.clientWidth);
      setLebar(next);
      simpanLebar(next);
    },
    [badanRef, lebar],
  );

  return { lebar, menggeser, mulaiGeser, geserPanah };
}

export function PembagiPanel({
  lebar,
  menggeser,
  onPointerDown,
  onKeyDown,
}: {
  lebar: number;
  menggeser: boolean;
  onPointerDown: (e: ReactPointerEvent<HTMLDivElement>) => void;
  onKeyDown: (e: KeyboardEvent<HTMLDivElement>) => void;
}) {
  return (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label="Geser untuk mengubah lebar riwayat"
      aria-valuenow={lebar}
      aria-valuemin={LEBAR_MIN}
      tabIndex={0}
      title="Tahan & geser untuk mengubah lebar"
      className={`lydia-pembagi ${menggeser ? 'is-geser' : ''}`}
      onPointerDown={onPointerDown}
      onKeyDown={onKeyDown}
    />
  );
}
