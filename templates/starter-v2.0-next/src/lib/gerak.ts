/**
 * Bentuk dasar pergerakan stok — dipakai bahan baku maupun sepatu jadi.
 *
 * Di lib/, bukan service, supaya tidak ada siklus impor.
 */

export type JenisGerak = 'awal' | 'masuk' | 'keluar' | 'koreksi_tambah' | 'koreksi_kurang';

/** Arah tiap jenis. `jumlah` SELALU positif — arah datang dari sini, bukan tandanya. */
export const ARAH_GERAK: Record<JenisGerak, 1 | -1> = {
  awal: 1,
  masuk: 1,
  keluar: -1,
  koreksi_tambah: 1,
  koreksi_kurang: -1,
};

export const LABEL_GERAK: Record<JenisGerak, string> = {
  awal: 'Stok Awal',
  masuk: 'Masuk',
  keluar: 'Keluar',
  koreksi_tambah: 'Koreksi Tambah',
  koreksi_kurang: 'Koreksi Kurang',
};

export interface GerakDasar {
  /** UUID dari perangkat — kunci anti-ganda saat sinyal putus. */
  id: string;
  jenis: JenisGerak;
  /** Selalu > 0. Arahnya ditentukan `jenis`, bukan tanda angka. */
  jumlah: number;
  /** Asal barang (masuk) atau tujuan/penerima (keluar). Teks bebas. */
  sumber: string;
  catatan: string;
  /** Nomor batch pemicu, mis. "BP-2026-001". Kosong untuk pencatatan manual. */
  batch: string;
  /** Waktu server, bukan jam ponsel. ISO 8601. */
  dicatat_pada: string;
  pengguna_id: number;
  pengguna_nama: string;
}

/** Pergerakan stok bahan baku. */
export interface GerakStok extends GerakDasar {
  bahan_id: number;
}

/** Pergerakan stok sepatu jadi — menempel di varian, bukan di model. */
export interface GerakVarian extends GerakDasar {
  varian_id: number;
}

/** Menjumlahkan pergerakan jadi saldo. Satu-satunya cara saldo boleh lahir. */
export function hitungSaldo(daftar: GerakDasar[]): number {
  const total = daftar.reduce((jml, x) => jml + ARAH_GERAK[x.jenis] * x.jumlah, 0);
  // Bulatkan sisa floating point (0.1 + 0.2).
  return Math.round(total * 1000) / 1000;
}
