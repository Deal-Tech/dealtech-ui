
export type JenisGerak = 'awal' | 'masuk' | 'keluar' | 'koreksi_tambah' | 'koreksi_kurang';

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
  id: string;
  jenis: JenisGerak;
  jumlah: number;
  sumber: string;
  catatan: string;
  batch: string;
  dicatat_pada: string;
  pengguna_id: number;
  pengguna_nama: string;
}

/** Pergerakan stok bahan baku. */
export interface GerakStok extends GerakDasar {
  bahan_id: number;
}

export interface GerakVarian extends GerakDasar {
  varian_id: number;
}

export function hitungSaldo(daftar: GerakDasar[]): number {
  const total = daftar.reduce((jml, x) => jml + ARAH_GERAK[x.jenis] * x.jumlah, 0);
  return Math.round(total * 1000) / 1000;
}
