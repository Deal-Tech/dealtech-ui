import type { CSSProperties } from 'react';
import { Check, ServerCog, Wrench } from 'lucide-react';

import './maintenance-art.css';

// Lapisan tebal lempeng server
const TEBAL = [1, 2, 3, 4, 5];

const RAK = [
  { nama: 72, beban: 0.92 },
  { nama: 54, beban: 0.78 },
  { nama: 84, beban: 0.86 },
];

const VENTILASI = [0, 1, 2, 3, 4];

const PARTIKEL = [
  { x: 14, y: 40, z: 40, s: 5 },
  { x: 210, y: 6, z: 90, s: 4 },
  { x: 30, y: 226, z: 110, s: 3 },
  { x: 180, y: 238, z: 30, s: 6 },
  { x: 120, y: 2, z: 70, s: 3 },
  { x: 2, y: 176, z: -30, s: 7 },
];

const vars = (v: Record<string, string | number>) => v as CSSProperties;

// Gigi dari garis putus-putus
function Gir({ gigi, className }: { gigi: number; className: string }) {
  const jarak = (2 * Math.PI * 24) / gigi;
  return (
    <span className={`mt-gir ${className}`}>
      <svg viewBox="0 0 60 60" aria-hidden="true">
        <circle
          cx="30"
          cy="30"
          r="24"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          strokeDasharray={`${jarak / 2} ${jarak / 2}`}
        />
        <circle cx="30" cy="30" r="21" fill="currentColor" />
        <circle cx="30" cy="30" r="12" fill="none" stroke="var(--mt-gir-garis)" strokeWidth="2" />
        <circle cx="30" cy="30" r="6" fill="var(--mt-gir-poros)" />
      </svg>
    </span>
  );
}

function Lempeng() {
  return (
    <div className="mt-lempeng">
      <span className="mt-kepala__chip">
        <ServerCog strokeWidth={2.4} />
      </span>
      <span className="mt-kepala__judul" />
      <span className="mt-kepala__sub" />
      <span className="mt-pil">
        <span className="mt-pil__perbaikan">Perbaikan</span>
        <span className="mt-pil__optimal">Optimal</span>
      </span>

      {RAK.map((r, i) => (
        <span
          key={i}
          className="mt-rak"
          style={{ top: 40 + i * 30, ...vars({ '--beban': r.beban, '--tunda': `${i * 0.25}s` }) }}
        >
          <span className="mt-led mt-led--daya" />
          <span className="mt-led mt-led--status" />
          {VENTILASI.map((v) => (
            <span key={v} className="mt-ventilasi" style={{ left: 30 + v * 5 }} />
          ))}
          <span className="mt-rak__nama" style={{ width: r.nama }} />
          <span className="mt-beban">
            <span className="mt-beban__isi" />
          </span>
        </span>
      ))}
      <span className="mt-pindai" />

      <span className="mt-progres__label">Optimasi</span>
      <span className="mt-persen" />
      <span className="mt-progres">
        <span className="mt-progres__isi" />
      </span>
      <span className="mt-progres__sub" />
    </div>
  );
}

function Melayang() {
  return (
    <>
      <Gir gigi={12} className="mt-gir--besar" />
      <Gir gigi={8} className="mt-gir--kecil" />

      <span className="mt-kartu mt-kunci" style={vars({ '--z': '44px', '--tunda': '-1.2s' })}>
        <Wrench strokeWidth={2.4} />
      </span>

      <div className="mt-kartu mt-gauge" style={vars({ '--z': '36px', '--tunda': '-2.6s' })}>
        <svg viewBox="0 0 68 36" fill="none" aria-hidden="true">
          <defs>
            <linearGradient id="mt-gauge-warna" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#ef4444" />
              <stop offset=".5" stopColor="#f59e0b" />
              <stop offset="1" stopColor="#22c55e" />
            </linearGradient>
          </defs>
          <path d="M8 32a26 26 0 0 1 52 0" stroke="url(#mt-gauge-warna)" strokeWidth="5" strokeLinecap="round" />
          <line className="mt-gauge__jarum" x1="34" y1="32" x2="34" y2="13" stroke="#0f172a" strokeWidth="2.4" strokeLinecap="round" />
          <circle cx="34" cy="32" r="3.5" fill="#0f172a" />
        </svg>
        <span className="mt-gauge__label" />
      </div>

      <div className="mt-kartu mt-toast">
        <span className="mt-toast__ikon">
          <Check strokeWidth={3.4} />
        </span>
        <span>
          <span className="mt-toast__judul">Sistem optimal</span>
          <span className="mt-toast__sub" />
        </span>
      </div>
    </>
  );
}

/** Ilustrasi: server diperbaiki dan dioptimalkan */
export default function MaintenanceArt() {
  return (
    <div
      className="mt-art"
      role="img"
      aria-label="Ilustrasi 3D server yang sedang diperbaiki dan dioptimalkan sampai performanya optimal"
    >
      <div className="mt-panggung">
        <span className="mt-cahaya" />
        <span className="mt-lantai" />
        {TEBAL.map((i) => (
          <span key={i} className="mt-tebal" style={vars({ '--i': i })} />
        ))}
        <Lempeng />
        <Melayang />
        {PARTIKEL.map((p, i) => (
          <span
            key={i}
            className="mt-partikel"
            style={{
              left: p.x,
              top: p.y,
              width: p.s,
              height: p.s,
              ...vars({ '--z': `${p.z}px`, '--tunda': `${-i * 1.3}s` }),
            }}
          />
        ))}
      </div>
    </div>
  );
}
