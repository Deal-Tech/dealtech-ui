import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

import panelDealtech from '@/assets/panel-dealtechui.png';
import LoginArt from './LoginArt';
import LoginArtSandi from './LoginArtSandi';
import './login.css';

const JUMLAH_TITIK = 3;

export function TautanKembali() {
  return (
    <Link className="login-kembali" to="/login">
      <ArrowLeft aria-hidden="true" />
      Kembali ke halaman masuk
    </Link>
  );
}

interface KerangkaMasukProps {
  children: ReactNode;
  judul: string;
  teks: string;
  /** Titik aktif di panel kanan. */
  titik?: number;
  /** Adegan 3D di panel kanan. */
  tema?: 'dashboard' | 'sandi';
}

/** Kerangka halaman masuk dan pemulihan. */
export default function KerangkaMasuk({
  children,
  judul,
  teks,
  titik = JUMLAH_TITIK - 1,
  tema = 'dashboard',
}: KerangkaMasukProps) {
  return (
    <div className="login-page">
      <div className="login-shell">
        <div className="login-form-panel">
          <div className="login-brand">
            <span
              role="img"
              aria-label="ui.dealtech | Deal Tech"
              className="login-brand__logo"
              style={{
                maskImage: `url(${panelDealtech})`,
                WebkitMaskImage: `url(${panelDealtech})`,
              }}
            />
          </div>

          {children}

          <p className="login-footnote">UI Dealtech Admin - Dikembangkan tech.mudahdeal.com</p>
        </div>

        <div className="login-art-panel">
          {tema === 'sandi' ? <LoginArtSandi /> : <LoginArt />}
          <h2 className="login-art-title">{judul}</h2>
          <p className="login-art-text">{teks}</p>
          <div className="login-dots" aria-hidden="true">
            {Array.from({ length: JUMLAH_TITIK }, (_, i) => (
              <span key={i} className={i === titik ? 'is-active' : undefined} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
