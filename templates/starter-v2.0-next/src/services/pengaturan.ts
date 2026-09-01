import { api } from '@/lib/api';
import { MODE_DEMO, bacaData, jeda, simpanData } from '@/lib/demo';

export interface Kontak {
  whatsapp: string;
  /** Diturunkan server. */
  whatsapp_nomor: string;
  email: string;
  lokasi: string;
  jam_buka: string;
  /** Kosong = ikon disembunyikan. */
  sosial_whatsapp: string;
  sosial_instagram: string;
  sosial_tiktok: string;
  /** Titik peta "lintang,bujur". */
  maps: string;
}

/** `whatsapp_nomor` tidak dikirim klien. */
export interface InputKontak {
  whatsapp: string;
  email: string;
  lokasi: string;
  jam_buka: string;
  sosial_whatsapp: string;
  sosial_instagram: string;
  sosial_tiktok: string;
  maps: string;
}

const KUNCI_DEMO = 'dealtech_kontak_demo';

const KONTAK_DEMO: Kontak = {
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
