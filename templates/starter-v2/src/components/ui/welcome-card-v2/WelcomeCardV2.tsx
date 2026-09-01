import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Sparkles, type LucideIcon } from 'lucide-react';

import './welcome-card-v2.css';

export interface WelcomeCardV2Props {
  name?: string;
  badge?: string;
  /** Menimpa kalimat sambutan bawaan. Kalau diisi, `name` tidak dipakai. */
  judul?: string;
  deskripsi?: string;
  aksiLabel?: string;
  aksiHref?: string;
  /** Rute dalam aplikasi. Kalau diisi, aksinya jadi `<Link>`, bukan tautan luar. */
  aksiKe?: string;
  aksiIkon?: LucideIcon;
  /** Mengganti tombol aksi bawaan — mis. sebuah select. */
  aksi?: ReactNode;
  className?: string;
}

export function WelcomeCardV2({
  name,
  badge = 'Dealtech UI 2.0 Next',
  judul,
  deskripsi,
  aksiLabel = 'Hubungi Pengembang',
  aksiHref = 'https://tech.mudahdeal.com/',
  aksiKe,
  aksiIkon: AksiIkon = ArrowUpRight,
  aksi,
  className = '',
}: WelcomeCardV2Props) {
  const teksJudul = judul ?? `Selamat Datang Di Dashboard Admin Anda${name ? ` ${name}` : ''}`;

  const isiAksi = (
    <>
      {aksiLabel}
      <AksiIkon className="welcome-v2__aksi-ikon" aria-hidden="true" />
    </>
  );

  return (
    <section className={`welcome-v2 ${className}`}>
      <div className="welcome-v2__isi">
        <span className="welcome-v2__badge">
          <Sparkles className="welcome-v2__badge-ikon" aria-hidden="true" />
          {badge}
        </span>

        <h2 className="welcome-v2__judul">{teksJudul}</h2>

        {deskripsi ? <p className="welcome-v2__teks">{deskripsi}</p> : null}
      </div>

      {aksi ? (
        <div className="welcome-v2__slot">{aksi}</div>
      ) : aksiKe ? (
        <Link className="welcome-v2__aksi" to={aksiKe}>
          {isiAksi}
        </Link>
      ) : (
        /* noopener+noreferrer wajib: tanpa itu halaman tujuan bisa menyetir tab ini. */
        <a className="welcome-v2__aksi" href={aksiHref} target="_blank" rel="noopener noreferrer">
          {isiAksi}
        </a>
      )}
    </section>
  );
}
