import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Boxes, Check, FileText } from 'lucide-react';

import { Badge } from '@/components/ui/badge/Badge';
import { BilahLipat } from '@/components/ui/bilah-lipat/BilahLipat';
import { Button } from '@/components/ui/button/Button';
import { MenuAksi } from '@/components/ui/menu-aksi/MenuAksi';
import { PageTitle } from '@/components/ui/pagetitle/PageTitle';
import { Skeleton, SkeletonHalaman, SkeletonTeks } from '@/components/ui/skeleton/Skeleton';
import { TabButton } from '@/components/ui/tab-button/TabButton';
import '@/components/ui/richtext/richtext.css';
import { Keterangan } from './Keterangan';
import './produk.css';

const TAB = [{ key: 'deskripsi', label: 'Deskripsi Produk', icon: FileText }];

const tanpaAksi = () => undefined;

// Cermin ProdukDetailPage saat terbuka
export function ProdukDetailSkeleton() {
  const navigate = useNavigate();

  return (
    <SkeletonHalaman teks="Memuat detail produk…" className="produk-page space-y-6">
      <PageTitle
        title="Detail Produk"
        subtitle={<Skeleton lebar={140} />}
        action={
          <Button variant="ghost" icon={ArrowLeft} onClick={() => navigate('/dashboard/produk')}>
            Kembali
          </Button>
        }
      />

      <Skeleton bentuk="kotak" blok>
        <BilahLipat terbuka onToggle={tanpaAksi} teks="Tutup informasi produk?" aksi="Tutup Sekarang" />
      </Skeleton>

      <section className="app-section-card">
        <div className="produk-detail__kepala">
          <div className="flex min-w-0 items-center gap-3">
            <Boxes className="h-6 w-6 shrink-0" />
            <div className="min-w-0">
              <h2 className="produk-detail__judul">Informasi Produk</h2>
              <p className="produk-detail__nama">
                <Skeleton lebar={160} />
              </p>
            </div>
          </div>
          <Skeleton bentuk="kotak">
            <MenuAksi item={[]} />
          </Skeleton>
        </div>

        <div className="app-section-body produk-detail__kisi">
          <Keterangan nama="Kode Produk">
            <p className="produk-detail__isi">
              <Skeleton lebar="45%" />
            </p>
          </Keterangan>
          <Keterangan nama="Nama Produk">
            <p className="produk-detail__isi">
              <Skeleton lebar="80%" />
            </p>
          </Keterangan>
          <Keterangan nama="Kategori">
            <p className="produk-detail__isi">
              <Skeleton lebar="55%" />
            </p>
          </Keterangan>
          <Keterangan nama="Harga">
            <p className="produk-detail__isi">
              <Skeleton lebar="60%" />
            </p>
          </Keterangan>
          <Keterangan nama="Stok">
            <p className="produk-detail__isi">
              <Skeleton lebar="25%" />
            </p>
          </Keterangan>
          <Keterangan nama="Ketersediaan">
            <Skeleton bentuk="pil">
              <Badge icon={Check} variant="green">
                Tersedia
              </Badge>
            </Skeleton>
          </Keterangan>
        </div>
      </section>

      <TabButton tabs={TAB} value="deskripsi" onChange={tanpaAksi} />

      <section className="app-section-card">
        <div className="app-section-body">
          <SkeletonTeks className="richtext-isi" />
        </div>
      </section>
    </SkeletonHalaman>
  );
}

export default ProdukDetailSkeleton;
