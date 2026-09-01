
export const ZONA_WAKTU = 'Asia/Jakarta';
export const LABEL_ZONA = 'WIB';

const BULAN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

interface Bagian {
  tanggal: number;
  bulan: number;
  tahun: number;
  jam: string;
  menit: string;
}

const pemformat = new Intl.DateTimeFormat('en-GB', {
  timeZone: ZONA_WAKTU,
  day: 'numeric',
  month: 'numeric',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

function pecah(iso: string): Bagian | null {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;

  const bagian = Object.fromEntries(
    pemformat.formatToParts(d).map((p) => [p.type, p.value]),
  ) as Record<string, string>;

  return {
    tanggal: Number(bagian.day),
    bulan: Number(bagian.month),
    tahun: Number(bagian.year),
    jam: bagian.hour === '24' ? '00' : bagian.hour,
    menit: bagian.minute,
  };
}

/** "20 Agu 2026" */
export function fmtTanggal(iso: string): string {
  const b = pecah(iso);
  if (!b) return '—';
  return `${b.tanggal} ${BULAN[b.bulan - 1]} ${b.tahun}`;
}

/** "06:05" */
export function fmtJam(iso: string): string {
  const b = pecah(iso);
  if (!b) return '—';
  return `${b.jam}:${b.menit}`;
}

export function fmtTanggalJam(iso: string): string {
  const b = pecah(iso);
  if (!b) return '—';
  return `${b.tanggal} ${BULAN[b.bulan - 1]} ${b.tahun}, ${b.jam}:${b.menit}`;
}

export function fmtTanggalJamZona(iso: string): string {
  const teks = fmtTanggalJam(iso);
  return teks === '—' ? teks : `${teks} ${LABEL_ZONA}`;
}
