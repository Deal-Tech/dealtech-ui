import { ZONA_WAKTU_BAWAAN, type ZonaWaktu } from '@/services/auth';

export const OFFSET_ZONA: Record<ZonaWaktu, number> = { WIB: 7, WITA: 8, WIT: 9 };

export type { ZonaWaktu };

const HARI = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
const BULAN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

const dua = (n: number) => String(n).padStart(2, '0');

export function zonaPengguna(pengguna: { zona_waktu?: ZonaWaktu } | null | undefined): ZonaWaktu {
  const nilai = pengguna?.zona_waktu;
  return nilai && nilai in OFFSET_ZONA ? nilai : ZONA_WAKTU_BAWAAN;
}

export interface WaktuTampil {
  /** "14:32:05" */
  jam: string;
  /** "Sen, 25 Agu 2026" */
  tanggal: string;
  zona: ZonaWaktu;
  /** Untuk atribut `dateTime` pada <time>. */
  iso: string;
}

export function waktuZona(saat: Date, zona: ZonaWaktu): WaktuTampil {
  const offset = OFFSET_ZONA[zona];
  const geser = new Date(saat.getTime() + offset * 3_600_000);

  const jam = `${dua(geser.getUTCHours())}:${dua(geser.getUTCMinutes())}:${dua(geser.getUTCSeconds())}`;
  const tanggal = `${HARI[geser.getUTCDay()]}, ${geser.getUTCDate()} ${BULAN[geser.getUTCMonth()]} ${geser.getUTCFullYear()}`;
  const tgl = `${geser.getUTCFullYear()}-${dua(geser.getUTCMonth() + 1)}-${dua(geser.getUTCDate())}`;

  return { jam, tanggal, zona, iso: `${tgl}T${jam}+${dua(offset)}:00` };
}

export default waktuZona;
