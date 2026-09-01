import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import './kepala-publik.css';

export interface KepalaPublikProps {
  /** Nama halaman di remah roti — ruas terakhir, bukan tautan. */
  remah: string;
  judul: string;
  deskripsi?: string;
  /** Isi tambahan di bawah kalimat: saringan, tombol, keterangan jumlah. */
  children?: ReactNode;
}

/**
 * Kepala halaman sisi publik. Satu bentuk untuk semua halaman (Bos 2026-08-28)
 * — sebelumnya tiap halaman memakai kartu sambutan admin dengan isi berbeda,
 * dan hasilnya empat halaman yang terlihat dari empat situs.
 */
export function KepalaPublik({ remah, judul, deskripsi, children }: KepalaPublikProps) {
  return (
    <div className="kepala-publik">
      <div className="kepala-publik__wadah">
        <nav className="kepala-publik__remah" aria-label="Breadcrumb">
          <Link to="/" className="kepala-publik__remah-tautan">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{remah}</span>
        </nav>

        <h1 className="kepala-publik__judul">{judul}</h1>
        {deskripsi ? <p className="kepala-publik__teks">{deskripsi}</p> : null}

        {children}
      </div>
    </div>
  );
}

export default KepalaPublik;
