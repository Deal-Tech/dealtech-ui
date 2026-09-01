const BASE_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:8080').replace(/\/$/, '');

const TIMEOUT_MS = 20_000;

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly fields?: Record<string, string>,
    readonly requestId?: string,
    // Hanya ada pada gangguan sistem, bukan salah isi form.
    readonly kode?: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Sesi ada di cookie `sk_sesi` HttpOnly — berkas ini tidak bisa membacanya, dan
 * itu tujuannya: satu celah XSS tidak cukup untuk mencuri sesi.
 *
 * Yang dipegang JavaScript cuma token CSRF; sendirian ia bukan kredensial.
 */
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

/**
 * Sandi hasil reset admin wajib diganti; server menandainya `aksi: "ganti_sandi"`.
 *
 * Yang MEMBLOKIR servernya, bukan baris ini — di sini cuma melempar orangnya ke
 * halaman yang benar.
 */
let saatWajibGantiSandi: (() => void) | null = null;
export function pasangPenanganWajibGantiSandi(fn: () => void): void {
  saatWajibGantiSandi = fn;
}

export interface GangguanSistem {
  kode: string;
  pesan: string;
  status: number;
  requestId?: string;
  /** Endpoint yang gagal, mis. "POST /api/v1/batch". Untuk tim teknis. */
  jalur: string;
  /** Halaman yang sedang dibuka pengguna, mis. "/batch-produksi". */
  halaman: string;
}

let saatGangguan: ((g: GangguanSistem) => void) | null = null;
export function pasangPenanganGangguan(fn: (g: GangguanSistem) => void): void {
  saatGangguan = fn;
}

const METODE_AMAN = new Set(['GET', 'HEAD', 'OPTIONS']);

interface OpsiRequest {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  /** `FormData` dikirim apa adanya (unggahan berkas); selain itu dijadikan JSON. */
  body?: unknown;
  /** Hanya untuk login, yang memang belum punya sesi sehingga belum punya token CSRF. */
  tanpaCSRF?: boolean;
  signal?: AbortSignal;
  /** Unggahan berkas besar tidak muat di 20 detik bawaan. */
  timeoutMs?: number;
}

export async function apiMentah<T>(path: string, opsi: OpsiRequest = {}): Promise<T> {
  const { method = 'GET', body, tanpaCSRF = false, signal, timeoutMs = TIMEOUT_MS } = opsi;

  // Content-Type FormData wajib dibiarkan peramban — ia yang tahu batas multipart-nya.
  const berkas = typeof FormData !== 'undefined' && body instanceof FormData;

  const pengendali = new AbortController();
  const jedaHabis = window.setTimeout(() => pengendali.abort(), timeoutMs);
  signal?.addEventListener('abort', () => pengendali.abort(), { once: true });

  const headers: Record<string, string> = { Accept: 'application/json' };
  if (body !== undefined && !berkas) headers['Content-Type'] = 'application/json';

  // Wajib untuk metode pengubah data; metode baca tidak perlu.
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
      // Cookie sesi ikut dikirim; origin dijaga daftar putih CORS_ORIGINS.
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
    // 403 akun nonaktif juga mengakhiri sesi — cookienya sudah dibuang server.
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

/**
 * Cadangan kalau server tidak mengirim pesan sendiri (413/502/504 dari proxy).
 *
 * Sebut apa yang terjadi dalam bahasa orang, lalu satu hal yang bisa ia lakukan.
 * Tanpa istilah HTTP dan tanpa angka status.
 */
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
