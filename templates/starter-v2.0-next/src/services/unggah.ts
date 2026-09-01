import { api } from '@/lib/api';

export const TIPE_GAMBAR = ['image/jpeg', 'image/png', 'image/webp'] as const;

export const MAKS_UKURAN_GAMBAR = 5 * 1024 * 1024;

const TIMEOUT_UNGGAH_MS = 60_000;

export interface HasilUnggah {
  url: string;
}

export function periksaGambar(file: File): string | null {
  if (!(TIPE_GAMBAR as readonly string[]).includes(file.type)) {
    return 'Gambar harus berformat JPG, PNG, atau WebP.';
  }
  if (file.size > MAKS_UKURAN_GAMBAR) {
    return 'Ukuran gambar melebihi 5 MB. Perkecil dulu gambarnya, lalu unggah lagi.';
  }
  return null;
}

export async function unggahGambar(file: File, signal?: AbortSignal): Promise<string> {
  const data = new FormData();
  data.append('berkas', file);

  const hasil = await api<HasilUnggah>('/api/v1/unggah/gambar', {
    method: 'POST',
    body: data,
    signal,
    timeoutMs: TIMEOUT_UNGGAH_MS,
  });
  return hasil.url;
}
