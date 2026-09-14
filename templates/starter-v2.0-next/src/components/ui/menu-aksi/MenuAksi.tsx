import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent as KeyboardEventReact,
} from 'react';
import { ChevronDown, MoreHorizontal, type LucideIcon } from 'lucide-react';

import './menu-aksi.css';

export interface ItemAksi {
  kunci: string;
  label: string;
  ikon?: LucideIcon;
  onClick: () => void;
  /** Merah untuk aksi yang menghapus atau tak bisa dibatalkan. */
  bahaya?: boolean;
  nonaktif?: boolean;
}

export interface MenuAksiProps {
  item: ItemAksi[];
  /** Teks di tombol pemicu. Kosongkan untuk tombol ikon saja. */
  label?: string;
  ikon?: LucideIcon;
  /** Dibaca pembaca layar saat tombolnya tanpa teks. */
  ariaLabel?: string;
  className?: string;
}

interface Posisi {
  top: number;
  right: number;
  minWidth: number;
}

/**
 * MenuAksi — satu tombol yang membuka daftar aksi.
 *
 * Dipakai saat sebuah bagian punya lebih dari satu aksi: deretan tombol yang
 * berjajar akan menenggelamkan isi yang seharusnya jadi pusat perhatian.
 *
 * Panelnya `position: fixed` dan ditempatkan dari kotak pemicunya, bukan
 * digantung di induknya: kalau tidak, ia akan terpotong oleh kartu mana pun yang
 * punya `overflow: hidden` — dan semua kartu di starter ini punya.
 */
export function MenuAksi({ item, label, ikon: Ikon, ariaLabel, className = '' }: MenuAksiProps) {
  const [terbuka, setTerbuka] = useState(false);
  const [posisi, setPosisi] = useState<Posisi | null>(null);
  const wadahRef = useRef<HTMLDivElement>(null);
  const pemicuRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const daftarItem = () =>
    Array.from(panelRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? []);

  const tutup = (kembalikanFokus = false) => {
    setTerbuka(false);
    if (kembalikanFokus) pemicuRef.current?.focus();
  };

  const tempatkan = () => {
    const kotak = pemicuRef.current?.getBoundingClientRect();
    if (!kotak) return;
    setPosisi({
      top: kotak.bottom + 6,
      right: Math.max(8, window.innerWidth - kotak.right),
      minWidth: Math.max(kotak.width, 180),
    });
  };

  useLayoutEffect(() => {
    if (!terbuka) return;
    tempatkan();
    daftarItem()[0]?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [terbuka]);

  useEffect(() => {
    if (!terbuka) return;

    const padaKlik = (e: MouseEvent) => {
      if (!wadahRef.current?.contains(e.target as Node)) setTerbuka(false);
    };
    const padaTombol = (e: KeyboardEvent) => {
      if (e.key === 'Escape') tutup(true);
    };
    const aturUlang = () => tempatkan();

    document.addEventListener('mousedown', padaKlik);
    document.addEventListener('keydown', padaTombol);
    window.addEventListener('resize', aturUlang);
    /* Panelnya fixed, jadi ia tidak ikut bergulir bersama isinya — posisinya
       dihitung ulang supaya tidak tertinggal menggantung di tempat lama. */
    window.addEventListener('scroll', aturUlang, true);
    return () => {
      document.removeEventListener('mousedown', padaKlik);
      document.removeEventListener('keydown', padaTombol);
      window.removeEventListener('resize', aturUlang);
      window.removeEventListener('scroll', aturUlang, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [terbuka]);

  const padaTombolPanel = (e: KeyboardEventReact<HTMLDivElement>) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    e.preventDefault();
    const daftar = daftarItem();
    if (daftar.length === 0) return;
    const kini = daftar.indexOf(document.activeElement as HTMLElement);
    const arah = e.key === 'ArrowDown' ? 1 : -1;
    daftar[(kini + arah + daftar.length) % daftar.length]?.focus();
  };

  const IkonPemicu = Ikon ?? (label ? null : MoreHorizontal);

  return (
    <div className={`menu-aksi ${className}`} ref={wadahRef}>
      <button
        ref={pemicuRef}
        type="button"
        className={`menu-aksi__pemicu${label ? '' : ' menu-aksi__pemicu--ikon'}`}
        aria-haspopup="menu"
        aria-expanded={terbuka}
        aria-label={label ? undefined : (ariaLabel ?? 'Menu aksi')}
        onClick={() => (terbuka ? tutup() : setTerbuka(true))}
      >
        {IkonPemicu ? <IkonPemicu className="menu-aksi__ikon" aria-hidden="true" /> : null}
        {label ? <span>{label}</span> : null}
        {label ? (
          <ChevronDown
            className={`menu-aksi__chevron${terbuka ? ' menu-aksi__chevron--buka' : ''}`}
            aria-hidden="true"
          />
        ) : null}
      </button>

      {terbuka ? (
        <div
          ref={panelRef}
          role="menu"
          aria-label={ariaLabel ?? label ?? 'Menu aksi'}
          className="menu-aksi__panel"
          style={{ top: posisi?.top, right: posisi?.right, minWidth: posisi?.minWidth }}
          onKeyDown={padaTombolPanel}
        >
          {item.map((it) => {
            const IkonItem = it.ikon;
            return (
              <button
                key={it.kunci}
                type="button"
                role="menuitem"
                disabled={it.nonaktif}
                className={`menu-aksi__item${it.bahaya ? ' menu-aksi__item--bahaya' : ''}`}
                onClick={() => {
                  tutup();
                  it.onClick();
                }}
              >
                {IkonItem ? <IkonItem className="menu-aksi__item-ikon" aria-hidden="true" /> : null}
                <span>{it.label}</span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export default MenuAksi;
