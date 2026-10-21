import type { CSSProperties } from 'react';

import './login-art.css';

const MENU_Y = [72, 90, 108, 126, 144];

const STAT = [
  { x: 94, label: 26, nilai: 30 },
  { x: 168, label: 30, nilai: 24 },
  { x: 242, label: 22, nilai: 34 },
];

const GARIS = 'M102 156L118 147L134 151L150 137L166 141L182 127L198 132L214 121L226 124';
const AREA = `${GARIS}L226 162L102 162Z`;

const BARIS = [
  { y: 190, nama: 50, jumlah: 30, pudar: 0.8 },
  { y: 208, nama: 40, jumlah: 24, pudar: 0.45 },
];

function Jendela() {
  return (
    <g clipPath="url(#la-jendela)">
      {/* Sidebar biru */}
      <rect x="22" y="34" width="62" height="192" fill="var(--color-primary-darker)" />
      <rect x="32" y="46" width="9" height="9" rx="2.5" fill="#ffffff" />
      <rect x="45" y="48" width="28" height="5" rx="2.5" fill="#ffffff" opacity=".85" />
      <rect className="la-menu" x="28" y="64" width="50" height="16" rx="5" fill="#ffffff" fillOpacity=".16" />
      {MENU_Y.map((y) => (
        <g key={y} opacity=".7">
          <rect x="34" y={y - 4} width="8" height="8" rx="2" fill="#ffffff" />
          <rect x="47" y={y - 2} width="24" height="4" rx="2" fill="#ffffff" opacity=".6" />
        </g>
      ))}

      {/* Header */}
      <path d="M84 56h234" stroke="#eef2f7" />
      <rect x="96" y="42" width="44" height="6" rx="3" fill="#cbd5e1" />
      <rect x="200" y="40" width="72" height="10" rx="5" fill="#f1f5f9" />
      <circle cx="302" cy="45" r="6" fill="var(--color-accent)" opacity=".85" />

      {/* Kartu ringkasan */}
      {STAT.map((s, i) => (
        <g key={s.x}>
          <rect x={s.x} y="64" width="66" height="32" rx="7" fill="#f1f5f9" />
          <circle cx={s.x + 12} cy="80" r="6.5" fill="var(--color-primary)" fillOpacity=".12" />
          <circle cx={s.x + 12} cy="80" r="2.6" fill="var(--color-primary)" />
          <rect x={s.x + 23} y="72" width={s.label} height="4" rx="2" fill="#cbd5e1" />
          <rect
            className="la-nilai"
            style={{ '--i': i } as CSSProperties}
            x={s.x + 23}
            y="80"
            width={s.nilai}
            height="7"
            rx="3.5"
            fill="#334155"
          />
        </g>
      ))}

      {/* Grafik garis */}
      <rect x="94.5" y="104.5" width="139" height="65" rx="8" fill="#ffffff" stroke="#e2e8f0" />
      <rect x="102" y="111" width="36" height="4" rx="2" fill="#cbd5e1" />
      <path d="M102 130h124M102 146h124M102 162h124" stroke="#f1f5f9" />
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
      <circle className="la-titik" cx="226" cy="124" r="3.2" fill="#ffffff" stroke="var(--color-primary)" strokeWidth="2" />

      {/* Donat */}
      <rect x="242.5" y="104.5" width="65" height="65" rx="8" fill="#ffffff" stroke="#e2e8f0" />
      <circle cx="275" cy="133" r="15" stroke="#eef2f7" strokeWidth="6" />
      <circle
        className="la-donat"
        cx="275"
        cy="133"
        r="15"
        pathLength={100}
        stroke="var(--color-accent)"
        strokeWidth="6"
        transform="rotate(-90 275 133)"
      />
      <rect x="258" y="157" width="34" height="4" rx="2" fill="#cbd5e1" />

      {/* Tabel */}
      <rect x="94.5" y="178.5" width="213" height="39" rx="8" fill="#ffffff" stroke="#e2e8f0" />
      <rect className="la-sorot" x="98" y="182" width="206" height="16" rx="5" fill="#eaf2fb" />
      {BARIS.map((b) => (
        <g key={b.y}>
          <circle cx="108" cy={b.y} r="4.5" fill="var(--color-primary)" opacity={b.pudar} />
          <rect x="118" y={b.y - 2.5} width={b.nama} height="5" rx="2.5" fill="#cbd5e1" />
          <rect x="206" y={b.y - 2.5} width={b.jumlah} height="5" rx="2.5" fill="#e2e8f0" />
        </g>
      ))}
      <rect x="274" y="185" width="26" height="10" rx="5" fill="#e2e8f0" />
      <g className="la-lencana">
        <rect x="274" y="185" width="26" height="10" rx="5" fill="#22c55e" />
        <path d="M283.5 190l2.4 2.4 4.6-4.6" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <rect x="274" y="203" width="26" height="10" rx="5" fill="#dcfce7" />
    </g>
  );
}

function Saklar() {
  return (
    <g>
      <g filter="url(#la-shadow)">
        <rect x="250" y="8" width="78" height="30" rx="10" fill="#ffffff" />
      </g>
      <rect x="260" y="16.5" width="28" height="5" rx="2.5" fill="#cbd5e1" />
      <rect x="260" y="25" width="18" height="4" rx="2" fill="#e2e8f0" />
      <rect x="296" y="16" width="24" height="14" rx="7" fill="#cbd5e1" />
      <rect className="la-saklar-nyala" x="296" y="16" width="24" height="14" rx="7" fill="#22c55e" />
      <circle className="la-saklar-tombol" cx="303" cy="23" r="5" fill="#ffffff" />
    </g>
  );
}

function Notifikasi() {
  return (
    <g className="la-toast">
      <g filter="url(#la-shadow)">
        <rect x="4" y="204" width="96" height="34" rx="10" fill="#ffffff" />
      </g>
      <circle cx="21" cy="221" r="8" fill="#22c55e" />
      <path d="M17.5 221l2.5 2.5 4.6-4.8" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="35" y="214" width="50" height="5" rx="2.5" fill="#334155" />
      <rect x="35" y="223" width="36" height="4" rx="2" fill="#cbd5e1" />
    </g>
  );
}

/** Ilustrasi: dashboard starter yang bekerja */
export default function LoginArt() {
  return (
    <svg
      className="login-art"
      viewBox="0 0 340 260"
      fill="none"
      role="img"
      aria-label="Ilustrasi dashboard admin: ringkasan angka, grafik, dan tabel yang diperbarui"
    >
      <defs>
        <filter id="la-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#001f3d" floodOpacity="0.28" />
        </filter>
        <clipPath id="la-jendela">
          <rect x="22" y="34" width="296" height="192" rx="14" />
        </clipPath>
        <linearGradient id="la-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--color-primary)" stopOpacity=".22" />
          <stop offset="1" stopColor="var(--color-primary)" stopOpacity="0" />
        </linearGradient>
      </defs>

      <g filter="url(#la-shadow)">
        <rect x="22" y="34" width="296" height="192" rx="14" fill="#ffffff" />
      </g>
      <Jendela />
      <Saklar />
      <Notifikasi />

      {/* Riak klik */}
      <circle className="la-riak la-riak--menu" cx="54" cy="108" r="7" stroke="#ffffff" strokeWidth="1.5" />
      <circle className="la-riak la-riak--saklar" cx="308" cy="23" r="7" stroke="var(--color-primary)" strokeWidth="1.5" />

      <g className="la-kursor">
        <path
          d="M0 0v15.5l4.3-3.9 3 6.6 2.6-1.2-3-6.4h5.9Z"
          fill="#ffffff"
          stroke="#0f172a"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}
