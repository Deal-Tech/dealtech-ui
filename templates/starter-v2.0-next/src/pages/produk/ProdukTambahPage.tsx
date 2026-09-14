import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';

import { BadgeInfo } from '@/components/ui/badgeinfo/BadgeInfo';
import { Button } from '@/components/ui/button/Button';
import { InputNumber } from '@/components/ui/inputnumber/InputNumber';
import { InputText } from '@/components/ui/inputtext/InputText';
import { PageTitle } from '@/components/ui/pagetitle/PageTitle';
import { Select } from '@/components/ui/select/Select';
import {
  KATEGORI,
  ambilProduk,
  kodeBerikutnya,
  tambahProduk,
  ubahProduk,
  type Produk,
} from '@/services/produk';
import './produk.css';

interface Isian {
  kode: string;
  nama: string;
  kategori: string;
  harga: string;
  stok: string;
}

const KOSONG: Isian = { kode: '', nama: '', kategori: '', harga: '', stok: '' };

const OPSI_KATEGORI = KATEGORI.map((k) => ({ value: k, label: k }));

function periksa(isian: Isian, terpakai: string[]): Partial<Record<keyof Isian, string>> {
  const galat: Partial<Record<keyof Isian, string>> = {};

  if (!isian.kode.trim()) galat.kode = 'Kode produk wajib diisi.';
  else if (terpakai.some((k) => k.toLowerCase() === isian.kode.trim().toLowerCase()))
    galat.kode = 'Kode produk ini sudah dipakai.';

  if (!isian.nama.trim()) galat.nama = 'Nama produk wajib diisi.';
  if (!isian.kategori) galat.kategori = 'Kategori wajib dipilih.';

  if (!isian.harga.trim()) galat.harga = 'Harga wajib diisi.';
  else if (Number(isian.harga) <= 0) galat.harga = 'Harga harus lebih dari nol.';

  if (!isian.stok.trim()) galat.stok = 'Stok wajib diisi.';
  else if (!Number.isInteger(Number(isian.stok)) || Number(isian.stok) < 0)
    galat.stok = 'Stok harus bilangan bulat, minimal nol.';

  return galat;
}

/* Satu halaman untuk dua peran. Rute `produk/tambah` datang tanpa kode, rute
   `produk/:kode/ubah` membawanya — form, aturan, dan pesan galatnya sama persis,
   jadi memisahkannya jadi dua berkas cuma menggandakan yang harus dirawat. */
export default function ProdukTambahPage() {
  const navigate = useNavigate();
  const { kode: kodeAwal } = useParams();
  const modeUbah = Boolean(kodeAwal);

  const [isian, setIsian] = useState<Isian>(KOSONG);
  const [galat, setGalat] = useState<Partial<Record<keyof Isian, string>>>({});
  const [terpakai, setTerpakai] = useState<string[]>([]);
  const [proses, setProses] = useState(false);
  const [gagal, setGagal] = useState('');

  /* Kode yang sudah ada dipakai dua kali: untuk mengusulkan nomor berikutnya,
     dan untuk menolak kode kembar saat disimpan. */
  useEffect(() => {
    let hidup = true;
    ambilProduk().then((daftar: Produk[]) => {
      if (!hidup) return;

      /* Saat mengubah, kode miliknya sendiri dikeluarkan dari daftar terpakai —
         kalau tidak, menyimpan tanpa mengganti kode akan ditolak sebagai kembar. */
      setTerpakai(daftar.filter((p) => p.kode !== kodeAwal).map((p) => p.kode));

      if (modeUbah) {
        const ada = daftar.find((p) => p.kode === kodeAwal);
        if (ada) {
          setIsian({
            kode: ada.kode,
            nama: ada.nama,
            kategori: ada.kategori,
            harga: String(ada.harga),
            stok: String(ada.stok),
          });
        } else {
          setGagal(`Produk ${kodeAwal} tidak ditemukan.`);
        }
        return;
      }

      setIsian((s) => (s.kode ? s : { ...s, kode: kodeBerikutnya(daftar) }));
    });
    return () => {
      hidup = false;
    };
  }, [kodeAwal, modeUbah]);

  const ubah = (kunci: keyof Isian, nilai: string) => {
    setIsian((s) => ({ ...s, [kunci]: nilai }));
    setGalat((g) => ({ ...g, [kunci]: undefined }));
  };

  const simpan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (proses) return;

    const hasil = periksa(isian, terpakai);
    if (Object.keys(hasil).length > 0) {
      setGalat(hasil);
      return;
    }

    setProses(true);
    setGagal('');
    try {
      const data: Produk = {
        kode: isian.kode.trim(),
        nama: isian.nama.trim(),
        kategori: isian.kategori,
        harga: Number(isian.harga),
        stok: Number(isian.stok),
      };
      if (modeUbah && kodeAwal) await ubahProduk(kodeAwal, data);
      else await tambahProduk(data);
      /* Sesudah mengubah, kembali ke detailnya — kodenya bisa saja ikut berganti,
         jadi yang dipakai kode baru, bukan kode rutenya. */
      navigate(modeUbah ? `/dashboard/produk/${encodeURIComponent(data.kode)}` : '/dashboard/produk');
    } catch {
      setGagal('Produk tidak bisa disimpan. Coba lagi sebentar lagi.');
      setProses(false);
    }
  };

  return (
    <div className="produk-page space-y-6">
      <PageTitle
        title={modeUbah ? 'Ubah Produk' : 'Tambah Produk'}
        subtitle={modeUbah ? isian.nama || kodeAwal : 'Isi rincian produk baru, lalu simpan.'}
        action={
          <Button variant="ghost" icon={ArrowLeft} onClick={() => navigate('/dashboard/produk')}>
            Kembali
          </Button>
        }
      />

      <section className="app-section-card">
        <div className="app-section-body">
          <form onSubmit={simpan} className="produk-form">
            {gagal ? <BadgeInfo variant="error">{gagal}</BadgeInfo> : null}

            <InputText
              label="Kode Produk"
              name="kode"
              value={isian.kode}
              onChange={(e) => ubah('kode', e.target.value)}
              error={galat.kode}
              hint={
                modeUbah
                  ? 'Mengganti kode akan mengubah alamat halaman detailnya.'
                  : 'Terisi otomatis dari nomor terakhir; boleh diganti.'
              }
              required
            />

            <InputText
              label="Nama Produk"
              name="nama"
              value={isian.nama}
              onChange={(e) => ubah('nama', e.target.value)}
              placeholder="Paket Langganan Pro"
              error={galat.nama}
              required
            />

            {/* Select tidak punya prop label sendiri, jadi labelnya dipasang di sini
                memakai token ukuran dan bobot yang sama dengan isian lain. */}
            <div className="produk-form__field">
              <span className="produk-form__label">
                Kategori<span className="produk-form__wajib">*</span>
              </span>
              <Select
                value={isian.kategori}
                onValueChange={(v) => ubah('kategori', v)}
                options={OPSI_KATEGORI}
                placeholder="Pilih kategori"
              />
              {galat.kategori ? <span className="produk-form__galat">{galat.kategori}</span> : null}
            </div>

            <InputNumber
              label="Harga"
              name="harga"
              currency
              value={isian.harga}
              onChange={(e) => ubah('harga', e.target.value)}
              placeholder="450.000"
              error={galat.harga}
              required
            />

            <InputNumber
              label="Stok"
              name="stok"
              value={isian.stok}
              onChange={(e) => ubah('stok', e.target.value)}
              placeholder="0"
              error={galat.stok}
              required
            />

            <div className="produk-form__aksi">
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate('/dashboard/produk')}
                disabled={proses}
              >
                Batal
              </Button>
              <Button type="submit" icon={Save} loading={proses}>
                {proses ? 'Menyimpan…' : modeUbah ? 'Simpan Perubahan' : 'Simpan Produk'}
              </Button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
