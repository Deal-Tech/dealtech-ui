import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import './kepala-publik.css';

export interface KepalaPublikProps {
  remah: string;
  judul: string;
  deskripsi?: string;
  children?: ReactNode;
}

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
