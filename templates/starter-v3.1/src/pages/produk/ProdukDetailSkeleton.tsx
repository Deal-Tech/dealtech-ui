import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, FileText } from 'lucide-react';

import { Badge } from '@/components/ui/badge/Badge';
import { BilahLipat } from '@/components/ui/bilah-lipat/BilahLipat';
import { Button } from '@/components/ui/button/Button';
import { MenuAksi } from '@/components/ui/menu-aksi/MenuAksi';
import { PageTitle } from '@/components/ui/pagetitle/PageTitle';
import { Seksi } from '@/components/ui/seksi/Seksi';
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

      <Seksi
        title="Informasi Produk"
        bodyClassName="produk-detail__kisi"
        action={
          <Skeleton bentuk="kotak">
            <MenuAksi item={[]} />
          </Skeleton>
        }
      >
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
      </Seksi>

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
