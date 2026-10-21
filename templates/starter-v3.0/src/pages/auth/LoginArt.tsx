import type { CSSProperties } from 'react';
import {
  Bell,
  Check,
  LayoutDashboard,
  Package,
  Search,
  Settings,
  ShoppingCart,
  Users,
  type LucideIcon,
} from 'lucide-react';

import './login-art.css';

const MENU: LucideIcon[] = [LayoutDashboard, Package, ShoppingCart, Users, Settings];

const STAT: { ikon: LucideIcon; nilai: number; x: number; label: number }[] = [
  { ikon: Package, nilai: 248, x: 88, label: 24 },
  { ikon: ShoppingCart, nilai: 186, x: 156, label: 30 },
  { ikon: Users, nilai: 92, x: 224, label: 20 },
];

const BARIS = [
  { nama: 52, jumlah: 30, warna: 'var(--color-primary)' },
  { nama: 40, jumlah: 24, warna: '#38bdf8' },
  { nama: 46, jumlah: 28, warna: '#a78bfa' },
];

// Lapisan tebal lempeng dashboard
const TEBAL = [1, 2, 3, 4, 5];

const PARTIKEL = [
  { x: 10, y: 58, z: 40, s: 5 },
  { x: 304, y: 72, z: 90, s: 4 },
  { x: 36, y: 214, z: 110, s: 3 },
  { x: 290, y: 222, z: 30, s: 6 },
  { x: 150, y: 6, z: 70, s: 3 },
  { x: 214, y: 242, z: 60, s: 4 },
  { x: 2, y: 132, z: -30, s: 7 },
  { x: 314, y: 150, z: -20, s: 5 },
];

const GARIS = 'M2 30L16 24L30 27L44 17L58 20L72 10L86 14L100 6L110 8';
const AREA = `${GARIS}L110 36L2 36Z`;

const vars = (v: Record<string, string | number>) => v as CSSProperties;

function Jendela() {
  return (
    <div className="la-jendela">
      <div className="la-sidebar">
        <span className="la-merek" />
        <span className="la-merek-teks" />
        <span className="la-menu-aktif" />
        {MENU.map((Ikon, i) => (
          <span key={i} className="la-menu" style={{ top: 38 + i * 18 }}>
            <Ikon className="la-menu__ikon" strokeWidth={2.4} />
            <span className="la-menu__teks" />
          </span>
        ))}
        <span className="la-profil" />
      </div>

      <div className="la-kepala">
        <span className="la-kepala__judul" />
        <span className="la-kepala__cari">
          <Search strokeWidth={2.8} />
        </span>
        <Bell className="la-kepala__lonceng" strokeWidth={2.4} />
        <span className="la-kepala__avatar" />
      </div>

      {/* Slot tempat kartu melayang */}
      {STAT.map((s) => (
        <span key={s.x} className="la-slot" style={{ left: s.x - 24, top: 32, width: 62, height: 30 }} />
      ))}
      <span className="la-slot" style={{ left: 64, top: 70, width: 128, height: 56 }} />
      <span className="la-slot" style={{ left: 200, top: 70, width: 62, height: 56 }} />

      <div className="la-tabel">
        <span className="la-sorot" />
        {BARIS.map((b, i) => (
          <span key={i} className="la-baris" style={{ top: 5 + i * 12 }}>
            <span className="la-baris__avatar" style={{ background: b.warna }} />
            <span className="la-baris__nama" style={{ width: b.nama }} />
            <span className="la-baris__jumlah" style={{ width: b.jumlah }} />
            <span className={`la-baris__status la-baris__status--${i + 1}`} />
          </span>
        ))}
        <span className="la-lencana">
          <Check strokeWidth={4} />
        </span>
      </div>
    </div>
  );
}

function KartuStat() {
  return (
    <>
      {STAT.map(({ ikon: Ikon, nilai, x, label }, i) => (
        <div
          key={x}
          className="la-kartu la-stat"
          style={{ left: x, ...vars({ '--z': '26px', '--tunda': `${-i * 0.7}s` }) }}
        >
          <span className="la-stat__chip">
            <Ikon strokeWidth={2.4} />
          </span>
          <span className="la-stat__isi">
            <span className="la-stat__label" style={{ width: label }} />
            <span className="la-angka" style={vars({ '--la-target': nilai })} />
          </span>
        </div>
      ))}
    </>
  );
}

function KartuGrafik() {
  return (
    <div className="la-kartu la-grafik" style={vars({ '--z': '34px', '--tunda': '-1.6s' })}>
      <span className="la-grafik__judul" />
      <span className="la-grafik__legenda" />
      <svg className="la-grafik__svg" viewBox="0 0 112 38" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="la-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--color-accent)" stopOpacity=".35" />
            <stop offset="1" stopColor="var(--color-accent)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M2 12h108M2 24h108M2 36h108" stroke="#eef2f7" strokeWidth="1" />
        <path className="la-area" d={AREA} fill="url(#la-area)" />
        <path
          className="la-garis"
          d={GARIS}
          pathLength={100}
          stroke="var(--color-primary)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle className="la-titik" cx="110" cy="8" r="2.6" fill="#ffffff" stroke="var(--color-primary)" strokeWidth="1.8" />
      </svg>
    </div>
  );
}

function KartuDonat() {
  return (
    <div className="la-kartu la-donat" style={vars({ '--z': '30px', '--tunda': '-2.4s' })}>
      <svg className="la-donat__svg" viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <circle cx="20" cy="20" r="15" stroke="#eef2f7" strokeWidth="6" />
        <circle
          className="la-busur"
          cx="20"
          cy="20"
          r="15"
          pathLength={100}
          stroke="var(--color-accent)"
          strokeWidth="6"
          transform="rotate(-90 20 20)"
        />
      </svg>
      <span className="la-angka la-angka--persen" style={vars({ '--la-target': 68 })} />
      <span className="la-donat__label" />
    </div>
  );
}

function Melayang() {
  return (
    <>
      <div className="la-tooltip">+12%</div>

      <div className="la-kartu la-saklar">
        <span className="la-saklar__label" />
        <span className="la-saklar__sub" />
        <span className="la-saklar__trek">
          <span className="la-saklar__nyala" />
          <span className="la-saklar__tombol" />
        </span>
      </div>

      <div className="la-kartu la-toast">
        <span className="la-toast__ikon">
          <Check strokeWidth={3.4} />
        </span>
        <span className="la-toast__isi">
          <span className="la-toast__judul">Tersimpan</span>
          <span className="la-toast__sub" />
        </span>
      </div>
    </>
  );
}

/** Ilustrasi: dashboard starter 3D */
export default function LoginArt() {
  return (
    <div
      className="login-art"
      role="img"
      aria-label="Ilustrasi dashboard admin 3D: ringkasan angka, grafik, dan tabel yang diperbarui"
    >
      <div className="la-panggung">
        <span className="la-cahaya" />
        <span className="la-lantai" />
        {TEBAL.map((i) => (
          <span key={i} className="la-tebal" style={vars({ '--i': i })} />
        ))}
        <Jendela />
        <KartuStat />
        <KartuGrafik />
        <KartuDonat />
        <Melayang />

        <span className="la-riak la-riak--menu" />
        <span className="la-riak la-riak--saklar" />
        {PARTIKEL.map((p, i) => (
          <span
            key={i}
            className="la-partikel"
            style={{
              left: p.x,
              top: p.y,
              width: p.s,
              height: p.s,
              ...vars({ '--z': `${p.z}px`, '--tunda': `${-i * 1.3}s` }),
            }}
          />
        ))}

        <svg className="la-kursor" viewBox="0 0 14 20" fill="none" aria-hidden="true">
          <path
            d="M1 1v15.5l4.3-3.9 3 6.6 2.6-1.2-3-6.4h5.9Z"
            fill="#ffffff"
            stroke="#0f172a"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}
