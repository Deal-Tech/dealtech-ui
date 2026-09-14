import { api } from '@/lib/api';
import { MODE_DEMO, bacaData, jeda, simpanData } from '@/lib/demo';

export interface Produk {
  kode: string;
  nama: string;
  kategori: string;
  harga: number;
  stok: number;
}

export const KATEGORI = ['Langganan', 'Penyimpanan', 'Dukungan', 'Perangkat'];

/*
 * Halaman tambah berdiri sendiri, bukan modal di atas daftarnya — begitu pindah
 * halaman, keadaan React-nya hilang. Jadi daftarnya dititipkan ke penyimpanan
 * demo, sama seperti sesi: produk yang baru disimpan masih ada saat kembali ke
 * daftar.
 */
const KUNCI = 'dealtech_produk_demo';

const AWAL: Produk[] = [
  { kode: 'PRD-2001', nama: 'Paket Langganan Dasar', kategori: 'Langganan', harga: 150000, stok: 120 },
  { kode: 'PRD-2002', nama: 'Paket Langganan Pro', kategori: 'Langganan', harga: 450000, stok: 86 },
  { kode: 'PRD-2003', nama: 'Tambahan Penyimpanan 50GB', kategori: 'Penyimpanan', harga: 75000, stok: 240 },
  { kode: 'PRD-2004', nama: 'Tambahan Penyimpanan 200GB', kategori: 'Penyimpanan', harga: 240000, stok: 95 },
  { kode: 'PRD-2005', nama: 'Dukungan Prioritas', kategori: 'Dukungan', harga: 320000, stok: 40 },
  { kode: 'PRD-2006', nama: 'Pendampingan Migrasi', kategori: 'Dukungan', harga: 1250000, stok: 12 },
  { kode: 'PRD-2007', nama: 'Pemindai Barcode', kategori: 'Perangkat', harga: 890000, stok: 33 },
  { kode: 'PRD-2008', nama: 'Printer Label Termal', kategori: 'Perangkat', harga: 1750000, stok: 18 },
];

export async function ambilProduk(): Promise<Produk[]> {
  if (MODE_DEMO) {
    await jeda(200);
    return bacaData<Produk[]>(KUNCI, AWAL);
  }
  return api<Produk[]>('/api/v1/produk');
}

export async function ambilProdukSatu(kode: string): Promise<Produk | null> {
  if (MODE_DEMO) {
    await jeda(200);
    return bacaData<Produk[]>(KUNCI, AWAL).find((p) => p.kode === kode) ?? null;
  }
  return api<Produk>(`/api/v1/produk/${encodeURIComponent(kode)}`);
}

export async function tambahProduk(baru: Produk): Promise<Produk> {
  if (MODE_DEMO) {
    await jeda();
    simpanData(KUNCI, [baru, ...bacaData<Produk[]>(KUNCI, AWAL)]);
    return baru;
  }
  return api<Produk>('/api/v1/produk', { method: 'POST', body: baru });
}

export async function ubahProduk(kode: string, data: Produk): Promise<Produk> {
  if (MODE_DEMO) {
    await jeda();
    simpanData(
      KUNCI,
      bacaData<Produk[]>(KUNCI, AWAL).map((p) => (p.kode === kode ? data : p)),
    );
    return data;
  }
  return api<Produk>(`/api/v1/produk/${encodeURIComponent(kode)}`, { method: 'PUT', body: data });
}

export async function hapusProduk(kode: string[]): Promise<void> {
  if (MODE_DEMO) {
    await jeda(200);
    const buang = new Set(kode);
    simpanData(
      KUNCI,
      bacaData<Produk[]>(KUNCI, AWAL).filter((p) => !buang.has(p.kode)),
    );
    return;
  }
  await api<void>('/api/v1/produk', { method: 'DELETE', body: { kode } });
}

/* Nomor urut berikutnya diambil dari kode tertinggi yang sudah ada, bukan dari
   jumlah barisnya — kalau ada yang dihapus, jumlahnya menyusut dan kodenya akan
   bentrok dengan yang masih terpakai. */
export function kodeBerikutnya(daftar: Produk[]): string {
  const tertinggi = daftar.reduce((maks, p) => {
    const angka = Number.parseInt(p.kode.replace(/\D/g, ''), 10);
    return Number.isNaN(angka) ? maks : Math.max(maks, angka);
  }, 2000);
  return `PRD-${tertinggi + 1}`;
}

export const rupiah = (n: number): string =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(n);
