const BASE_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:8080').replace(/\/$/, '');

const TIMEOUT_MS = 20_000;

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly fields?: Record<string, string>,
    readonly requestId?: string,
    readonly kode?: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

const NAMA_COOKIE_CSRF = 'sk_csrf';
let csrfMemori: string | null = null;

function csrfDariCookie(): string | null {
  const cocok = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${NAMA_COOKIE_CSRF}=([^;]*)`),
  );
  return cocok ? decodeURIComponent(cocok[1]) : null;
}

export function ambilCSRF(): string | null {
  return csrfMemori ?? csrfDariCookie();
}

export function simpanCSRF(token: string): void {
  csrfMemori = token;
}

export function hapusCSRF(): void {
  csrfMemori = null;
}

let saatSesiHabis: (() => void) | null = null;
export function pasangPenanganSesiHabis(fn: () => void): void {
  saatSesiHabis = fn;
}

let saatWajibGantiSandi: (() => void) | null = null;
export function pasangPenanganWajibGantiSandi(fn: () => void): void {
  saatWajibGantiSandi = fn;
}

export interface GangguanSistem {
  kode: string;
  pesan: string;
  status: number;
  requestId?: string;
  jalur: string;
  halaman: string;
}

let saatGangguan: ((g: GangguanSistem) => void) | null = null;
export function pasangPenanganGangguan(fn: (g: GangguanSistem) => void): void {
  saatGangguan = fn;
}

const METODE_AMAN = new Set(['GET', 'HEAD', 'OPTIONS']);

interface OpsiRequest {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  tanpaCSRF?: boolean;
  signal?: AbortSignal;
  timeoutMs?: number;
}

export async function apiMentah<T>(path: string, opsi: OpsiRequest = {}): Promise<T> {
  const { method = 'GET', body, tanpaCSRF = false, signal, timeoutMs = TIMEOUT_MS } = opsi;

  const berkas = typeof FormData !== 'undefined' && body instanceof FormData;

  const pengendali = new AbortController();
  const jedaHabis = window.setTimeout(() => pengendali.abort(), timeoutMs);
  signal?.addEventListener('abort', () => pengendali.abort(), { once: true });

  const headers: Record<string, string> = { Accept: 'application/json' };
  if (body !== undefined && !berkas) headers['Content-Type'] = 'application/json';

  if (!tanpaCSRF && !METODE_AMAN.has(method)) {
    const csrf = ambilCSRF();
    if (csrf) headers['X-CSRF-Token'] = csrf;
  }

  let respons: Response;
  try {
    respons = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : berkas ? (body as FormData) : JSON.stringify(body),
      signal: pengendali.signal,
      credentials: 'include',
    });
  } catch (e) {
    window.clearTimeout(jedaHabis);
    if ((e as Error).name === 'AbortError') {
      throw new ApiError(
        0,
        'Server terlalu lama menjawab, jadi permintaan ini dihentikan. ' +
          'Data yang Anda kerjakan belum tentu tersimpan — periksa dulu daftarnya sebelum mengisi ulang.',
      );
    }
    throw new ApiError(
      0,
      'Tidak bisa menghubungi server. Periksa koneksi internet Anda, lalu coba lagi.',
    );
  }
  window.clearTimeout(jedaHabis);

  if (respons.status === 204) return undefined as T;

  let data: unknown = null;
  const tipe = respons.headers.get('Content-Type') ?? '';
  if (tipe.includes('application/json')) {
    data = await respons.json().catch(() => null);
  }

  if (!respons.ok) {
    if ((respons.status === 401 || respons.status === 403) && !tanpaCSRF) {
      const isiAwal = (data ?? {}) as { error?: string };
      if (respons.status === 401 || /tidak aktif/i.test(isiAwal.error ?? '')) {
        hapusCSRF();
        saatSesiHabis?.();
      }
    }

    const isi = (data ?? {}) as {
      error?: string;
      fields?: Record<string, string>;
      request_id?: string;
      kode?: string;
      aksi?: string;
    };
    const pesan = isi.error || pesanBawaan(respons.status);

    if (respons.status === 403 && isi.aksi === 'ganti_sandi') {
      saatWajibGantiSandi?.();
    }

    if (isi.kode) {
      saatGangguan?.({
        kode: isi.kode,
        pesan,
        status: respons.status,
        requestId: isi.request_id,
        jalur: `${method} ${path}`,
        halaman: window.location.pathname,
      });
    }
    throw new ApiError(respons.status, pesan, isi.fields, isi.request_id, isi.kode);
  }

  return data as T;
}

export async function api<T>(path: string, opsi: OpsiRequest = {}): Promise<T> {
  const amplop = await apiMentah<{ data?: T }>(path, opsi);
  return (amplop?.data ?? amplop) as T;
}

export interface MetaPaginasi {
  page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export interface HasilDaftar<T> {
  data: T[];
  meta: MetaPaginasi;
  counts: Record<string, number>;
}

export async function apiDaftar<T>(path: string, signal?: AbortSignal): Promise<HasilDaftar<T>> {
  const r = await apiMentah<Partial<HasilDaftar<T>>>(path, { signal });
  return {
    data: r.data ?? [],
    meta: r.meta ?? { page: 1, per_page: 25, total: 0, last_page: 1 },
    counts: r.counts ?? {},
  };
}

function pesanBawaan(status: number): string {
  switch (status) {
    case 400:
      return 'Ada isian yang belum lengkap atau formatnya keliru. Periksa lagi formnya.';
    case 401:
      return 'Sesi Anda sudah berakhir. Silakan masuk kembali.';
    case 403:
      return 'Akun Anda tidak punya akses untuk tindakan ini.';
    case 404:
      return 'Data yang dicari tidak ada. Mungkin sudah diubah orang lain — muat ulang halaman.';
    case 409:
      return 'Data ini sudah terdaftar sebelumnya.';
    case 413:
      return 'Data yang dikirim terlalu besar. Kurangi jumlah barisnya lalu simpan bertahap.';
    case 429:
      return 'Terlalu banyak permintaan dalam waktu singkat. Tunggu sebentar lalu coba lagi.';
    case 502:
    case 503:
    case 504:
      return 'Server sedang tidak bisa melayani permintaan. Coba lagi beberapa saat lagi.';
    default:
      return (
        'Sistem sedang bermasalah dan permintaan ini tidak bisa diselesaikan. ' +
        'Data yang Anda kerjakan tidak tersimpan — silakan coba lagi sebentar lagi.'
      );
  }
}
