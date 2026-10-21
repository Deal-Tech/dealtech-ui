import type { CSSProperties } from 'react';
import { Check, KeyRound, Lock, Mail, ShieldCheck } from 'lucide-react';

import './login-art-sandi.css';

const KODE = ['4', '8', '2', '9', '1', '3'];
const TITIK_SANDI = [0, 1, 2, 3, 4, 5, 6, 7];
const TEBAL = [1, 2, 3, 4, 5];

const PARTIKEL = [
  { x: 12, y: 50, z: 40, s: 5 },
  { x: 300, y: 80, z: 90, s: 4 },
  { x: 40, y: 216, z: 110, s: 3 },
  { x: 292, y: 226, z: 30, s: 6 },
  { x: 160, y: 8, z: 70, s: 3 },
  { x: 6, y: 136, z: -30, s: 7 },
];

const vars = (v: Record<string, string | number>) => v as CSSProperties;

function Lempeng() {
  return (
    <div className="la-jendela la-s-lempeng">
      <span className="la-s-kepala">
        <KeyRound strokeWidth={2.4} />
        <span className="la-s-kepala__judul" />
      </span>
      <span className="la-s-sub" />

      <div className="la-s-otp">
        {KODE.map((d, i) => (
          <span key={i} className="la-s-kotak" style={vars({ '--i': i })}>
            <span className="la-s-digit">{d}</span>
            <span className="la-s-kursor" />
          </span>
        ))}
      </div>

      <div className="la-s-isian">
        <Lock className="la-s-isian__ikon" strokeWidth={2.4} />
        <span className="la-s-titik-wadah">
          {TITIK_SANDI.map((i) => (
            <span key={i} className="la-s-titik" style={vars({ '--i': i })} />
          ))}
        </span>
      </div>
      <span className="la-s-tombol">
        <span className="la-s-tombol__teks" />
      </span>
    </div>
  );
}

function Surat() {
  return (
    <div className="la-kartu la-s-surat">
      <span className="la-s-surat__ikon">
        <Mail strokeWidth={2.4} />
      </span>
      <span className="la-s-surat__isi">
        <span className="la-s-surat__judul" />
        <span className="la-s-surat__kode">
          {KODE.slice(0, 3).join('')} {KODE.slice(3).join('')}
        </span>
      </span>
    </div>
  );
}

function Gembok() {
  return (
    <div className="la-kartu la-s-gembok">
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect className="la-s-gembok__badan" x="4" y="11" width="16" height="10" rx="2.5" />
        <path className="la-s-gembok__busur" d="M8 11V7a4 4 0 0 1 8 0v4" />
        <circle className="la-s-gembok__lubang" cx="12" cy="16" r="1.6" />
      </svg>
    </div>
  );
}

/** Ilustrasi 3D: kode OTP lalu sandi baru */
export default function LoginArtSandi() {
  return (
    <div
      className="login-art login-art--sandi"
      role="img"
      aria-label="Ilustrasi 3D: kode verifikasi dari email, lalu kata sandi baru tersimpan"
    >
      <div className="la-panggung">
        <span className="la-cahaya" />
        <span className="la-lantai" />
        {TEBAL.map((i) => (
          <span key={i} className="la-tebal" style={vars({ '--i': i })} />
        ))}
        <Lempeng />
        <Surat />
        <Gembok />

        <div className="la-kartu la-s-perisai">
          <ShieldCheck strokeWidth={2.4} />
        </div>

        <div className="la-kartu la-s-toast">
          <span className="la-s-toast__ikon">
            <Check strokeWidth={3.4} />
          </span>
          <span className="la-s-toast__isi">
            <span className="la-s-toast__judul">Sandi tersimpan</span>
            <span className="la-s-toast__sub" />
          </span>
        </div>

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
      </div>
    </div>
  );
}
