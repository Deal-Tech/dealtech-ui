import { ArrowRight, Check } from 'lucide-react';

import './kartu-paket.css';

export interface PaketItem {
  kunci: string;
  nama: string;
  /** Penanda kecil di samping nama, mis. "Paling populer". */
  badge?: string;
  /** Teks kecil di atas harga, mis. "Mulai dari". */
  hargaLabel?: string;
  harga: string;
  /** Satuan di belakang harga, mis. "/bulan". */
  satuan?: string;
  deskripsi: string;
  fiturTitle: string;
  fitur: string[];
  /** Label tombol saat belum berlangganan. */
  ctaLabel?: string;
}

export interface KartuPaketProps {
  paket: PaketItem[];
  /**
   * Kunci paket yang sedang dipakai. Kosong berarti belum berlangganan, sehingga
   * semua tombol tampil sebagai pilihan biasa.
   */
  aktif?: string | null;
  onPilih?: (kunci: string) => void;
  className?: string;
}

interface KeadaanTombol {
  label: string;
  varian: 'pilih' | 'sekarang' | 'upgrade' | 'turun';
  mati: boolean;
}

/*
 * Tombol dibaca dari posisi paket terhadap paket aktif, bukan dari flag per
 * butir: urutan larik sudah menyatakan jenjangnya, jadi satu sumber kebenaran.
 */
function keadaanTombol(indeks: number, indeksAktif: number, item: PaketItem): KeadaanTombol {
  if (indeksAktif < 0) {
    return { label: item.ctaLabel ?? `Pilih ${item.nama}`, varian: 'pilih', mati: false };
  }
  if (indeks === indeksAktif) {
    return { label: 'Paket anda saat ini', varian: 'sekarang', mati: true };
  }
  if (indeks < indeksAktif) {
    return { label: `Paket ${item.nama}`, varian: 'turun', mati: true };
  }
  return { label: 'Upgrade', varian: 'upgrade', mati: false };
}

export function KartuPaket({ paket, aktif = null, onPilih, className = '' }: KartuPaketProps) {
  const indeksAktif = aktif ? paket.findIndex((p) => p.kunci === aktif) : -1;

  return (
    <div className={`kartu-paket ${className}`}>
      {paket.map((p, i) => {
        const tombol = keadaanTombol(i, indeksAktif, p);
        /* Yang disorot: paket aktif kalau sudah berlangganan, kalau belum yang
           ditandai badge. */
        const sorot = indeksAktif >= 0 ? i === indeksAktif : Boolean(p.badge);

        return (
          <article
            key={p.kunci}
            className={`kartu-paket__item${sorot ? ' kartu-paket__item--sorot' : ''}`}
          >
            <div className="kartu-paket__kepala">
              <h3 className="kartu-paket__nama">{p.nama}</h3>
              {p.badge ? <span className="kartu-paket__badge">{p.badge}</span> : null}
            </div>

            {p.hargaLabel ? <p className="kartu-paket__harga-label">{p.hargaLabel}</p> : null}

            <p className="kartu-paket__harga">
              {p.harga}
              {p.satuan ? <span className="kartu-paket__harga-satuan">{p.satuan}</span> : null}
            </p>

            <p className="kartu-paket__deskripsi">{p.deskripsi}</p>

            <button
              type="button"
              className={`kartu-paket__cta kartu-paket__cta--${tombol.varian}`}
              disabled={tombol.mati}
              onClick={() => onPilih?.(p.kunci)}
            >
              <span>{tombol.label}</span>
              {tombol.varian === 'pilih' || tombol.varian === 'upgrade' ? (
                <ArrowRight size={16} strokeWidth={2.4} aria-hidden="true" />
              ) : null}
            </button>

            <p className="kartu-paket__fitur-judul">{p.fiturTitle}</p>

            <ul className="kartu-paket__fitur">
              {p.fitur.map((f) => (
                <li key={f}>
                  <span className="kartu-paket__centang" aria-hidden="true">
                    <Check size={11} strokeWidth={3.5} />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </article>
        );
      })}
    </div>
  );
}

export default KartuPaket;
