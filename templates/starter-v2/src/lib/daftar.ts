import { useEffect, useMemo, useState } from 'react';

/**
 * Pilihan jumlah baris per halaman — sama di semua halaman daftar.
 * 0 = tampilkan semua.
 */
export const PER_HALAMAN_OPSI = [
  { value: '25', label: '25 baris' },
  { value: '50', label: '50 baris' },
  { value: '100', label: '100 baris' },
  { value: '500', label: '500 baris' },
  { value: '0', label: 'Semua' },
];

export const PER_HALAMAN_BAWAAN = 25;

export interface OpsiDaftar<T> {
  /** Kunci unik baris — dipakai untuk pemilihan massal. */
  kunci: (item: T) => string;
  /** Teks yang ikut dicari. Pencarian tidak peka huruf besar/kecil. */
  teksCari: (item: T) => Array<string | number | null | undefined>;
}

/**
 * Mesin bersama halaman daftar: pencarian, paginasi, pemilihan massal.
 *
 * Penyaringan per domain dikerjakan halamannya sendiri sebelum data masuk sini.
 * Semua diproses di klien; bentuk kembaliannya sengaja mirip `HasilDaftar` di
 * lib/api.ts supaya pindah ke server nanti tidak mengubah halaman.
 */
export function useDaftar<T>(sumber: T[], opsi: OpsiDaftar<T>) {
  const { kunci, teksCari } = opsi;

  const [cari, setCari] = useState('');
  const [perHalaman, setPerHalaman] = useState(PER_HALAMAN_BAWAAN);
  const [halaman, setHalaman] = useState(1);
  const [terpilih, setTerpilih] = useState<string[]>([]);

  const tersaring = useMemo(() => {
    const q = cari.trim().toLowerCase();
    if (!q) return sumber;
    return sumber.filter((item) =>
      teksCari(item).some((t) => t != null && String(t).toLowerCase().includes(q)),
    );
    // teksCari di luar dependensi: halaman menuliskannya inline, jadi identitasnya
    // berubah tiap render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sumber, cari]);

  const total = tersaring.length;
  const totalHalaman = perHalaman === 0 ? 1 : Math.max(1, Math.ceil(total / perHalaman));

  // Hasil menyusut bisa membuat halaman sekarang kosong — tarik balik.
  useEffect(() => {
    if (halaman > totalHalaman) setHalaman(totalHalaman);
  }, [halaman, totalHalaman]);

  const hasil = useMemo(() => {
    if (perHalaman === 0) return tersaring;
    const mulai = (halaman - 1) * perHalaman;
    return tersaring.slice(mulai, mulai + perHalaman);
  }, [tersaring, halaman, perHalaman]);

  const kunciHalaman = useMemo(() => hasil.map(kunci), [hasil, kunci]);

  // Buang pilihan yang barisnya sudah tidak ada lagi di data.
  useEffect(() => {
    const tersedia = new Set(sumber.map(kunci));
    setTerpilih((p) => {
      const bersih = p.filter((k) => tersedia.has(k));
      return bersih.length === p.length ? p : bersih;
    });
  }, [sumber, kunci]);

  const infoHalaman =
    total === 0
      ? 'Tidak ada data'
      : perHalaman === 0
        ? `Menampilkan semua ${total} data`
        : `${(halaman - 1) * perHalaman + 1}–${Math.min(halaman * perHalaman, total)} dari ${total}`;

  const gantiPerHalaman = (nilai: number) => {
    setPerHalaman(nilai);
    setHalaman(1);
  };

  const gantiCari = (nilai: string) => {
    setCari(nilai);
    setHalaman(1);
  };

  const togglePilih = (k: string) =>
    setTerpilih((p) => (p.includes(k) ? p.filter((x) => x !== k) : [...p, k]));

  /** Pilih/lepas seluruh baris di halaman yang sedang tampil saja. */
  const toggleSemuaHalaman = () =>
    setTerpilih((p) => {
      const semuaTerpilih = kunciHalaman.length > 0 && kunciHalaman.every((k) => p.includes(k));
      if (semuaTerpilih) return p.filter((k) => !kunciHalaman.includes(k));
      return [...new Set([...p, ...kunciHalaman])];
    });

  const bersihkanPilihan = () => setTerpilih([]);

  return {
    cari,
    setCari: gantiCari,
    perHalaman,
    setPerHalaman: gantiPerHalaman,
    halaman,
    setHalaman,
    hasil,
    total,
    totalHalaman,
    infoHalaman,
    terpilih,
    kunciHalaman,
    togglePilih,
    toggleSemuaHalaman,
    bersihkanPilihan,
  };
}
