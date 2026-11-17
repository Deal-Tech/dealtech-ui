import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Eye, Pencil, Plus, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button/Button';
import { PageTitle } from '@/components/ui/pagetitle/PageTitle';
import { TableToolbar } from '@/components/ui/table-toolbar/TableToolbar';
import { AksiBaris, TableListV1 } from '@/components/ui/tablelist-v1/TableListV1';
import { PER_HALAMAN_BAWAAN, usePilihan } from '@/lib/daftar';
import { ambilProduk, hapusProduk, rupiah, type Produk } from '@/services/produk';

const KOLOM = [
  { key: 'kode', label: 'Kode Produk', width: '140px' },
  { key: 'nama', label: 'Nama Produk' },
  { key: 'kategori', label: 'Kategori', width: '150px' },
  { key: 'harga', label: 'Harga', align: 'right' as const, width: '150px' },
  { key: 'stok', label: 'Stok', align: 'right' as const, width: '100px' },
  { key: 'aksi', label: 'Aksi', align: 'right' as const, width: '64px', skeleton: 'ikon' as const },
];

export default function ProdukPage() {
  const navigate = useNavigate();

  const [produk, setProduk] = useState<Produk[]>([]);
  const [memuat, setMemuat] = useState(true);
  const [cari, setCari] = useState('');
  const [perHalaman, setPerHalaman] = useState(PER_HALAMAN_BAWAAN);
  const [halaman, setHalaman] = useState(1);

  useEffect(() => {
    let hidup = true;
    ambilProduk()
      .then((d) => {
        if (hidup) setProduk(d);
      })
      .finally(() => {
        if (hidup) setMemuat(false);
      });
    return () => {
      hidup = false;
    };
  }, []);

  const cocok = useMemo(() => {
    const k = cari.trim().toLowerCase();
    if (!k) return produk;
    return produk.filter((d) =>
      [d.kode, d.nama, d.kategori].some((nilai) => nilai.toLowerCase().includes(k)),
    );
  }, [produk, cari]);

  // perHalaman 0 = "Semua" pada TableToolbar.
  const ukuran = perHalaman > 0 ? perHalaman : cocok.length || 1;
  const totalHalaman = Math.max(1, Math.ceil(cocok.length / ukuran));
  const halamanAman = Math.min(halaman, totalHalaman);
  const mulai = (halamanAman - 1) * ukuran;
  const terlihat = cocok.slice(mulai, mulai + ukuran);

  const pilihan = usePilihan(terlihat.map((d) => d.kode));

  const buang = async (kode: string[]) => {
    await hapusProduk(kode);
    const dibuang = new Set(kode);
    setProduk((s) => s.filter((p) => !dibuang.has(p.kode)));
    pilihan.onBersihkan();
  };

  const baris = terlihat.map((d) => ({
    kode: d.kode,
    nama: d.nama,
    kategori: d.kategori,
    harga: rupiah(d.harga),
    stok: d.stok,
    aksi: (
      <AksiBaris
        nama={d.nama}
        item={[
          {
            kunci: 'lihat',
            label: 'Lihat Detail',
            ikon: Eye,
            onClick: () => navigate(`/dashboard/produk/${encodeURIComponent(d.kode)}`),
          },
          {
            kunci: 'ubah',
            label: 'Ubah',
            ikon: Pencil,
            onClick: () => navigate(`/dashboard/produk/${encodeURIComponent(d.kode)}/ubah`),
          },
          {
            kunci: 'hapus',
            label: 'Hapus',
            ikon: Trash2,
            bahaya: true,
            onClick: () => void buang([d.kode]),
          },
        ]}
      />
    ),
  }));

  return (
    <div className="space-y-6">
      <PageTitle
        title="Daftar Produk"
        subtitle="Semua produk dan layanan yang dijual."
        action={
          <Button icon={Plus} onClick={() => navigate('/dashboard/produk/tambah')}>
            Tambah Produk
          </Button>
        }
      />

      <TableListV1
        columns={KOLOM}
        rows={baris}
        rowKey={(row) => String(row.kode)}
        pilihan={pilihan}
        aksiMassal={
          <>
            <Button variant="ghost" icon={Download}>
              Ekspor
            </Button>
            <Button icon={Trash2} onClick={() => void buang(pilihan.terpilih)}>
              Hapus
            </Button>
          </>
        }
        toolbar={
          <TableToolbar
            cari={cari}
            onCari={(v) => {
              setCari(v);
              setHalaman(1);
            }}
            perHalaman={perHalaman}
            onPerHalaman={(v) => {
              setPerHalaman(v);
              setHalaman(1);
            }}
            placeholderCari="Cari kode, nama, atau kategori…"
          />
        }
        paginasi={{
          halaman: halamanAman,
          totalHalaman,
          info: `Menampilkan ${cocok.length === 0 ? 0 : mulai + 1}–${mulai + terlihat.length} dari ${
            cocok.length
          } produk`,
          onNavigasi: setHalaman,
        }}
        memuat={memuat}
        emptyText="Tidak ada produk yang cocok."
      />
    </div>
  );
}
