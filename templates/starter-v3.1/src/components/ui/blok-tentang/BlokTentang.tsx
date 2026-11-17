import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Waves, type LucideIcon } from 'lucide-react';

import './blok-tentang.css';

export interface AngkaUsaha {
  nilai: string;
  label: string;
}

export interface FotoBlok {
  src: string;
  alt: string;
}

export interface BlokTentangProps {
  judul: string;
  isi: ReactNode;
  ikon?: LucideIcon;
  angka?: AngkaUsaha[];
  tautanLabel?: string;
  tautanKe?: string;
  id?: string;
  gambar?: FotoBlok[];
  peta?: { koordinat: string; judul: string };
}

export function BlokTentang({
  judul,
  isi,
  ikon: Ikon = Waves,
  angka,
  tautanLabel,
  tautanKe,
  id,
  gambar,
  peta,
}: BlokTentangProps) {
  const berfoto = !!gambar && gambar.length > 0;
  const berpeta = !berfoto && !!peta && peta.koordinat !== '';

  return (
    <section
      className={`blok-tentang${berfoto ? ' is-foto' : ''}${berpeta ? ' is-peta' : ''}`}
      id={id}
      aria-label={judul}
    >
      <div className="blok-tentang__wadah">
{berpeta ? (
          <div className="blok-tentang__peta">
            <iframe
              className="blok-tentang__peta-bingkai"
              title={peta.judul}
              src={`https://www.google.com/maps?q=${encodeURIComponent(peta.koordinat)}&z=17&hl=en&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer"
              allowFullScreen
            />
          </div>
        ) : berfoto ? (
          <div className="blok-tentang__foto-kisi">
            {gambar.map((f) => (
              <div className="blok-tentang__kartu-foto" key={f.src}>
                <img className="blok-tentang__foto" src={f.src} alt={f.alt} loading="lazy" />
              </div>
            ))}
          </div>
        ) : (
          <div className="blok-tentang__media" aria-hidden="true">
            <span className="blok-tentang__air" />
            <span className="blok-tentang__air blok-tentang__air--dalam" />

            <span className="blok-tentang__cincin" />
            <span className="blok-tentang__cincin blok-tentang__cincin--dua" />

            <span className="blok-tentang__ikon">
              <Ikon size={44} strokeWidth={1.6} />
            </span>

            <span className="blok-tentang__buih" />
            <span className="blok-tentang__buih" />
            <span className="blok-tentang__buih" />
            <span className="blok-tentang__buih" />
          </div>
        )}

        <div className="blok-tentang__isi">
          <h2 className="seksi-judul seksi-judul--kiri">{judul}</h2>
          {isi}

          {angka && angka.length > 0 ? (
            <dl className="blok-tentang__angka">
              {angka.map(({ nilai, label }) => (
                <div key={label}>
                  <dt className="blok-tentang__angka-nilai">{nilai}</dt>
                  <dd className="blok-tentang__angka-label">{label}</dd>
                </div>
              ))}
            </dl>
          ) : null}

          {tautanLabel && tautanKe ? (
            <Link className="blok-tentang__tautan" to={tautanKe}>
              {tautanLabel}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export default BlokTentang;
