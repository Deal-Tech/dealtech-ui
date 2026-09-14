import { api } from '@/lib/api';
import { MODE_DEMO, bacaData, jeda, simpanData } from '@/lib/demo';

/*
 * Daftar sosial media yang bisa diisi. Ini satu-satunya tempat yang perlu
 * disunting untuk menambah atau membuang platform: bentuk model, isian kosong,
 * pemeriksaan, dan susunan form-nya semua diturunkan dari daftar ini.
 *
 * Urutannya urutan tampil di form, bukan abjad — yang paling sering dipakai
 * usaha di Indonesia ditaruh lebih dulu.
 */
export const SOSIAL = [
  { kunci: 'sosial_whatsapp', label: 'WhatsApp', contoh: 'https://wa.me/6281234567890' },
  { kunci: 'sosial_instagram', label: 'Instagram', contoh: 'https://instagram.com/namaakun' },
  { kunci: 'sosial_facebook', label: 'Facebook', contoh: 'https://facebook.com/namahalaman' },
  { kunci: 'sosial_tiktok', label: 'TikTok', contoh: 'https://tiktok.com/@namaakun' },
  { kunci: 'sosial_youtube', label: 'YouTube', contoh: 'https://youtube.com/@namakanal' },
  { kunci: 'sosial_x', label: 'X (Twitter)', contoh: 'https://x.com/namaakun' },
  { kunci: 'sosial_telegram', label: 'Telegram', contoh: 'https://t.me/namaakun' },
  { kunci: 'sosial_linkedin', label: 'LinkedIn', contoh: 'https://linkedin.com/company/namaperusahaan' },
  { kunci: 'sosial_threads', label: 'Threads', contoh: 'https://threads.net/@namaakun' },
  { kunci: 'sosial_pinterest', label: 'Pinterest', contoh: 'https://pinterest.com/namaakun' },
] as const;

export type KunciSosial = (typeof SOSIAL)[number]['kunci'];

/** Semua tautan sosial kosong = ikonnya disembunyikan di sisi publik. */
export interface InputKontak extends Record<KunciSosial, string> {
  whatsapp: string;
  email: string;
  lokasi: string;
  jam_buka: string;
  /** Titik peta "lintang,bujur". */
  maps: string;
}

export interface Kontak extends InputKontak {
  /** Diturunkan server, tidak pernah dikirim balik oleh klien. */
  whatsapp_nomor: string;
}

/** Buang medan turunan server sebelum isinya dipakai sebagai isian form. */
export function keInputKontak(k: Kontak): InputKontak {
  const isian = {
    whatsapp: k.whatsapp,
    email: k.email,
    lokasi: k.lokasi,
    jam_buka: k.jam_buka,
    maps: k.maps,
  } as InputKontak;
  for (const { kunci } of SOSIAL) isian[kunci] = k[kunci] ?? '';
  return isian;
}

/** Semua tautan sosial kosong — dipakai sebagai titik awal isian form. */
export const SOSIAL_KOSONG = Object.fromEntries(
  SOSIAL.map(({ kunci }) => [kunci, '']),
) as Record<KunciSosial, string>;

const KUNCI_DEMO = 'dealtech_kontak_demo';

const KONTAK_DEMO: Kontak = {
  ...SOSIAL_KOSONG,
  whatsapp: '+62 812-3456-7890',
  whatsapp_nomor: '6281234567890',
  email: 'halo@dealtech-ui.com',
  lokasi: 'Jl. Merdeka No. 10, Mataram, NTB',
  jam_buka: 'Senin–Sabtu, 08.00–17.00 WITA',
  sosial_whatsapp: 'https://wa.me/6281234567890',
  sosial_instagram: 'https://instagram.com/dealtech',
  sosial_tiktok: '#',
  maps: '-8.5833,116.1167',
};

export function ambilKontak(signal?: AbortSignal): Promise<Kontak> {
  if (MODE_DEMO) return jeda(250).then(() => bacaData(KUNCI_DEMO, KONTAK_DEMO));
  return api<Kontak>('/api/v1/pengaturan/kontak', { signal });
}

export async function simpanKontak(data: InputKontak): Promise<Kontak> {
  if (MODE_DEMO) {
    await jeda();
    const nomor = data.whatsapp.replace(/\D/g, '');
    return simpanData(KUNCI_DEMO, { ...data, whatsapp_nomor: nomor });
  }
  return api<Kontak>('/api/v1/pengaturan/kontak', { method: 'PUT', body: data });
}
