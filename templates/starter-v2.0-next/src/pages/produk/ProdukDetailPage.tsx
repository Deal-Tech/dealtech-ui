import { useEffect, useState, type ReactNode } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Boxes, Check, Package, Pencil } from 'lucide-react';

import { Badge } from '@/components/ui/badge/Badge';
import { BadgeInfo } from '@/components/ui/badgeinfo/BadgeInfo';
import { BilahLipat } from '@/components/ui/bilah-lipat/BilahLipat';
import { Button } from '@/components/ui/button/Button';
import { PageTitle } from '@/components/ui/pagetitle/PageTitle';
import { ambilProdukSatu, rupiah, type Produk } from '@/services/produk';
import './produk.css';

function Keterangan({ nama, children }: { nama: string; children: ReactNode }) {
  return (
    <div>
      <span className="produk-detail__label">{nama}</span>
      {children}
    </div>
  );
}

export default function ProdukDetailPage() {
  const navigate = useNavigate();
  const { kode = '' } = useParams();

  const [produk, setProduk] = useState<Produk | null>(null);
  const [memuat, setMemuat] = useState(true);
  /* Terbuka sejak awal: detailnya isi utama halaman ini, bukan tambahan. Bilah
     lipatnya ada supaya bisa disingkirkan saat yang dicari ada di bawahnya. */
  const [terbuka, setTerbuka] = useState(true);

  useEffect(() => {
    let hidup = true;
    setMemuat(true);
    ambilProdukSatu(kode)
      .then((d) => {
        if (hidup) setProduk(d);
      })
      .finally(() => {
        if (hidup) setMemuat(false);
      });
    return () => {
      hidup = false;
    };
  }, [kode]);

  if (memuat) {
    return (
      <div className="produk-page space-y-6">
        <PageTitle title="Detail Produk" subtitle="Memuat…" />
      </div>
    );
  }

  if (!produk) {
    return (
      <div className="produk-page space-y-6">
        <PageTitle
          title="Detail Produk"
          subtitle={kode}
          action={
            <Button variant="ghost" icon={ArrowLeft} onClick={() => navigate('/dashboard/produk')}>
              Kembali
            </Button>
          }
        />
        <BadgeInfo variant="error">Produk {kode} tidak ditemukan.</BadgeInfo>
      </div>
    );
  }

  const habis = produk.stok === 0;

  return (
    <div className="produk-page space-y-6">
      <PageTitle
        title="Detail Produk"
        subtitle={produk.nama}
        action={
          <Button variant="ghost" icon={ArrowLeft} onClick={() => navigate('/dashboard/produk')}>
            Kembali
          </Button>
        }
      />

      {/* Saat tertutup, bilahnya yang menyimpan ringkasannya — nama dan harga
          tetap terbaca tanpa perlu dibuka lagi. */}
      <BilahLipat
        terbuka={terbuka}
        onToggle={() => setTerbuka((v) => !v)}
        teks={
          terbuka
            ? 'Tutup informasi produk?'
            : `${produk.nama} · ${rupiah(produk.harga)}. Buka informasinya?`
        }
        aksi={terbuka ? 'Tutup Sekarang' : 'Buka Sekarang'}
      />

      {terbuka ? (
        <section className="app-section-card">
          <div className="produk-detail__kepala">
            <div className="flex min-w-0 items-center gap-3">
              <Boxes className="h-6 w-6 shrink-0" />
              <div className="min-w-0">
                <h2 className="produk-detail__judul">Informasi Produk</h2>
                <p className="produk-detail__nama truncate" title={produk.nama}>
                  {produk.nama}
                </p>
              </div>
            </div>
            <Button variant="ghost" icon={Pencil}>
              Ubah
            </Button>
          </div>

          <div className="app-section-body produk-detail__kisi">
            <Keterangan nama="Kode Produk">
              <p className="produk-detail__isi">{produk.kode}</p>
            </Keterangan>

            <Keterangan nama="Nama Produk">
              <p className="produk-detail__isi truncate" title={produk.nama}>
                {produk.nama}
              </p>
            </Keterangan>

            <Keterangan nama="Kategori">
              <p className="produk-detail__isi">{produk.kategori}</p>
            </Keterangan>

            <Keterangan nama="Harga">
              <p className="produk-detail__isi">{rupiah(produk.harga)}</p>
            </Keterangan>

            <Keterangan nama="Stok">
              <p className="produk-detail__isi">{produk.stok}</p>
            </Keterangan>

            <Keterangan nama="Ketersediaan">
              <Badge icon={habis ? Package : Check} variant={habis ? 'gray' : 'green'}>
                {habis ? 'Habis' : 'Tersedia'}
              </Badge>
            </Keterangan>
          </div>
        </section>
      ) : null}
    </div>
  );
}
