import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent as KeyboardEventReact,
} from 'react';
import { useLocation } from 'react-router-dom';
import {
  AlignLeft,
  ChevronDown,
  CircleAlert,
  LogOut,
  MessageCircle,
  UserRound,
} from 'lucide-react';

import { judulHalaman } from '@/layout/judul-halaman';
import { waktuZona, type WaktuTampil, type ZonaWaktu } from '@/layout/jam-zona';

/** Portal dukungan DealTech — dipakai tombol chat dan tombol bantuan. */
const TAUTAN_DUKUNGAN = 'https://tech.mudahdeal.com/';

function JamBerjalan({ zona }: { zona: ZonaWaktu }) {
  const [waktu, setWaktu] = useState<WaktuTampil>(() => waktuZona(new Date(), zona));

  useEffect(() => {
    setWaktu(waktuZona(new Date(), zona));
    const detak = window.setInterval(() => setWaktu(waktuZona(new Date(), zona)), 1000);
    return () => window.clearInterval(detak);
  }, [zona]);

  return (
    <time className="app-topbar__jam" dateTime={waktu.iso} title={`Waktu ${waktu.zona}`}>
      <span className="app-topbar__jam-angka">{waktu.jam}</span>
      <span className="app-topbar__jam-tanggal">| {waktu.tanggal}</span>
      <span className="app-topbar__jam-zona">{waktu.zona}</span>
    </time>
  );
}

interface MenuProfilProps {
  nama: string;
  inisial: string;
  onKeluar: () => void;
}

interface PosisiPanel {
  top: number;
  right: number;
  minWidth: number;
}

function MenuProfil({ nama, inisial, onKeluar }: MenuProfilProps) {
  const [terbuka, setTerbuka] = useState(false);
  const [posisi, setPosisi] = useState<PosisiPanel | null>(null);
  const wadahRef = useRef<HTMLDivElement>(null);
  const pemicuRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const daftarItem = () =>
    Array.from(panelRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? []);

  const tutup = (kembalikanFokus = false) => {
    setTerbuka(false);
    if (kembalikanFokus) pemicuRef.current?.focus();
  };

  /** Panel dipasang `fixed` supaya tidak terpotong `overflow-hidden` layout. */
  const tempatkan = () => {
    const kotak = pemicuRef.current?.getBoundingClientRect();
    if (!kotak) return;
    setPosisi({
      top: kotak.bottom + 6,
      right: Math.max(8, window.innerWidth - kotak.right),
      minWidth: Math.max(kotak.width, 200),
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
    return () => {
      document.removeEventListener('mousedown', padaKlik);
      document.removeEventListener('keydown', padaTombol);
      window.removeEventListener('resize', aturUlang);
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

  return (
    <div className="app-topbar__profil" ref={wadahRef}>
      <button
        ref={pemicuRef}
        type="button"
        className="app-topbar__profil-tombol"
        aria-haspopup="menu"
        aria-expanded={terbuka}
        aria-label={`Menu akun ${nama}`}
        title={nama}
        onClick={() => (terbuka ? tutup() : setTerbuka(true))}
      >
        <span className="app-topbar__profil-avatar" aria-hidden="true">
          {inisial ? inisial : <UserRound className="h-4 w-4" />}
        </span>
        <ChevronDown
          className={`app-topbar__profil-chevron ${terbuka ? 'app-topbar__profil-chevron--buka' : ''}`}
        />
      </button>

      {terbuka ? (
        <div
          ref={panelRef}
          role="menu"
          aria-label="Menu akun"
          className="app-topbar__panel"
          style={{ top: posisi?.top, right: posisi?.right, minWidth: posisi?.minWidth }}
          onKeyDown={padaTombolPanel}
        >
          <button
            type="button"
            role="menuitem"
            className="app-topbar__panel-item"
            onClick={() => {
              tutup();
              onKeluar();
            }}
          >
            <LogOut className="app-topbar__panel-ikon" aria-hidden="true" />
            <span>Keluar Sekarang</span>
          </button>
        </div>
      ) : null}
    </div>
  );
}

export interface AdminHeaderProps {
  nama: string;
  inisial: string;
  zona: ZonaWaktu;
  onBukaSidebar: () => void;
  onKeluar: () => void;
}

export default function AdminHeader({ nama, inisial, zona, onBukaSidebar, onKeluar }: AdminHeaderProps) {
  const { pathname } = useLocation();
  const halaman = judulHalaman(pathname);

  return (
    <header className="app-topbar flex items-center justify-between gap-3 px-3 md:px-5">
      <div className="app-topbar__kiri">
        <button
          type="button"
          onClick={onBukaSidebar}
          className="app-topbar__burger md:hidden"
          aria-label="Buka menu"
          title="Buka menu"
        >
          <AlignLeft className="h-4 w-4" strokeWidth={2} />
        </button>

        <span className="app-topbar__merek">DEALTECH UI 2.0 NEXT</span>

        {halaman ? (
          <>
            <span className="app-topbar__pemisah" aria-hidden="true" />
            <span className="app-topbar__halaman">
              {halaman.label}
              {halaman.segmen ? (
                <span className="app-topbar__halaman-kode"> / {halaman.segmen}</span>
              ) : null}
            </span>
          </>
        ) : null}
      </div>

      <div className="app-topbar__kanan">
        <JamBerjalan zona={zona} />

        <div className="app-topbar__ikon-grup">
          <a
            href={TAUTAN_DUKUNGAN}
            target="_blank"
            rel="noopener noreferrer"
            className="app-topbar__ikon"
            aria-label="Informasi & bantuan (buka di tab baru)"
            title="Informasi & bantuan"
          >
            <CircleAlert className="app-topbar__ikon-gambar" />
          </a>

          <a
            href={TAUTAN_DUKUNGAN}
            target="_blank"
            rel="noopener noreferrer"
            className="app-topbar__ikon"
            aria-label="Chat dukungan (buka di tab baru)"
            title="Chat dukungan"
          >
            <MessageCircle className="app-topbar__ikon-gambar" />
          </a>
        </div>

        <MenuProfil nama={nama} inisial={inisial} onKeluar={onKeluar} />
      </div>
    </header>
  );
}
