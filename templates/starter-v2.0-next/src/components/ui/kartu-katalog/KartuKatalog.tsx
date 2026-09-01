import { Link } from 'react-router-dom';
import { Clock, MapPin } from 'lucide-react';

import './kartu-katalog.css';

function rupiah(n: number): string {
  return `Rp ${n.toLocaleString('id-ID')}`;
}

export interface KartuKatalogProps {
  ke: string;
  nama: string;
  gambar: string;
  /** Lencana kiri atas — nama kategori. */
  kategori?: string;
  /** Lencana kiri bawah gambar. */
  durasi?: string;
  lokasi?: string;
  keterangan?: string;
  harga: number | null;
  hargaAwalan?: string;
  tombolLabel?: string;
}

export function KartuKatalog({
  ke,
  nama,
  gambar,
  kategori,
  durasi,
  lokasi,
  keterangan,
  harga,
  hargaAwalan = 'From',
  tombolLabel = 'View Details',
}: KartuKatalogProps) {
  return (
    <article className="kartu-katalog">
      <div className="kartu-katalog__gambar-wadah">
        {gambar ? (
          <img className="kartu-katalog__gambar" src={gambar} alt="" aria-hidden="true" />
        ) : (
          <div className="kartu-katalog__gambar kartu-katalog__gambar--kosong" aria-hidden="true" />
        )}

        {/* Lencana kiri atas diisi KATEGORI — data sungguhan. Rancangan klien
            memakai label pemasaran ("Best Seller"), dan kita belum punya
            satu pun penanda seperti itu. */}
        {kategori ? <span className="kartu-katalog__kategori">{kategori}</span> : null}

        {durasi ? (
          <span className="kartu-katalog__durasi">
            <Clock className="kartu-katalog__durasi-ikon" aria-hidden="true" />
            {durasi}
          </span>
        ) : null}
      </div>

      <div className="kartu-katalog__isi">
        <h3 className="kartu-katalog__nama">
          {/* Tautan membungkus judulnya saja, tapi ::after-nya melebar ke seluruh
              kartu — seluruh kartu bisa diklik tanpa menelan tombol di kakinya. */}
          <Link className="kartu-katalog__tautan" to={ke}>
            {nama}
          </Link>
        </h3>

        {lokasi ? (
          <p className="kartu-katalog__lokasi">
            <MapPin className="kartu-katalog__lokasi-ikon" aria-hidden="true" />
            <span className="kartu-katalog__lokasi-teks">{lokasi}</span>
          </p>
        ) : null}

        {/* title= supaya nama yang terpotong tetap bisa dibaca utuh saat
            disentuh kursor — potongannya cuma soal ruang, bukan soal isi. */}
        {keterangan ? (
          <p className="kartu-katalog__keterangan" title={keterangan}>
            {keterangan}
          </p>
        ) : null}

        <div className="kartu-katalog__kaki">
          <p className="kartu-katalog__harga">
            {harga === null ? (
              <span className="kartu-katalog__harga-kosong">Ask for price</span>
            ) : (
              <>
                {hargaAwalan ? (
                  <span className="kartu-katalog__harga-awalan">{hargaAwalan}</span>
                ) : null}
                <span className="kartu-katalog__harga-baris">
                  <span className="kartu-katalog__harga-nilai">{rupiah(harga)}</span>
                  <span className="kartu-katalog__harga-satuan">/ person</span>
                </span>
              </>
            )}
          </p>

          <span className="kartu-katalog__tombol" aria-hidden="true">
            {tombolLabel}
          </span>
        </div>
      </div>
    </article>
  );
}

export default KartuKatalog;
