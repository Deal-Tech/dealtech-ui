import { ApiError, api, apiAliran } from '@/lib/api';
import { MODE_DEMO, bacaData, jeda, simpanData } from '@/lib/demo';

// Kunci API model hanya di backend

export type PeranPesan = 'pengguna' | 'lydia';

export interface LampiranPesan {
  id: string;
  nama: string;
  /** MIME, mis. image/png. */
  tipe: string;
  ukuran: number;
  url: string;
}

export interface PesanLydia {
  id: string;
  peran: PeranPesan;
  isi: string;
  /** ISO 8601. */
  dibuat: string;
  lampiran?: LampiranPesan[];
}

export interface RingkasanPercakapan {
  id: string;
  judul: string;
  /** ISO 8601. */
  diperbarui: string;
}

export interface Percakapan extends RingkasanPercakapan {
  pesan: PesanLydia[];
}

export interface PengaturanLydia {
  nama: string;
  sapaan: string;
  deskripsi: string;
  /** Instruksi sistem untuk model. */
  instruksi: string;
  saran: string[];
}

export const MAKS_SARAN = 4;
export const MAKS_LAMPIRAN = 4;
const MAKS_UKURAN_MB = 10;

// Gambar dan dokumen umum
export const TERIMA_LAMPIRAN = 'image/*,.pdf,.doc,.docx,.xls,.xlsx,.csv,.txt';
const POLA_LAMPIRAN = /^image\/|\.(pdf|docx?|xlsx?|csv|txt)$/i;

export const PENGATURAN_BAWAAN: PengaturanLydia = {
  nama: 'Lydia',
  sapaan: 'Halo! Aku Lydia. Ada yang bisa kubantu hari ini?',
  deskripsi:
    'Tanyakan soal data, laporan, atau minta dibuatkan draf. Lampirkan gambar atau dokumen kalau perlu.',
  instruksi:
    'Kamu Lydia, asisten admin yang ramah. Jawab dalam bahasa Indonesia yang singkat, jelas, dan sopan.',
  saran: [
    'Ringkas penjualan minggu ini',
    'Buatkan contoh kode tombol React',
    'Tulis pengumuman jadwal maintenance',
    'Beri ide promo untuk pelanggan baru',
  ],
};

export interface KabarAliran {
  onMulai: (percakapan: RingkasanPercakapan) => void;
  onPotongan: (teks: string) => void;
}

// Satu JSON per `data:`
type EventChat =
  | { jenis: 'mulai'; percakapan: RingkasanPercakapan }
  | { jenis: 'potongan'; teks: string }
  | { jenis: 'selesai' }
  | { jenis: 'galat'; pesan: string };

const PANJANG_JUDUL = 48;

/** Judul dari pesan pertama. */
export function judulDari(teks: string): string {
  const satuBaris = teks.replace(/\s+/g, ' ').trim();
  return satuBaris.length > PANJANG_JUDUL ? `${satuBaris.slice(0, PANJANG_JUDUL)}…` : satuBaris;
}

const KUNCI_DEMO = 'dealtech_lydia_demo';
const KUNCI_PENGATURAN_DEMO = 'dealtech_lydia_pengaturan_demo';

function sejak(hari: number, jam = 9): string {
  const d = new Date();
  d.setDate(d.getDate() - hari);
  d.setHours(jam, 15, 0, 0);
  return d.toISOString();
}

function contoh(id: string, judul: string, hari: number, tanya: string, jawab: string): Percakapan {
  const waktu = sejak(hari);
  return {
    id,
    judul,
    diperbarui: waktu,
    pesan: [
      { id: `${id}-1`, peran: 'pengguna', isi: tanya, dibuat: waktu },
      { id: `${id}-2`, peran: 'lydia', isi: jawab, dibuat: waktu },
    ],
  };
}

const CONTOH_DEMO: Percakapan[] = [
  contoh(
    'demo-1',
    'Ringkasan stok produk',
    0,
    'Produk apa saja yang stoknya hampir habis?',
    'Ada **3 produk** yang stoknya di bawah batas aman:\n\n- Paket Langganan Pro — sisa 4\n- Modul Laporan Lanjutan — sisa 2\n- Domain Kustom — sisa 6\n\nMau kubuatkan draf pesanan ulang untuk ketiganya?',
  ),
  contoh(
    'demo-2',
    'Balasan untuk keluhan pelanggan',
    1,
    'Buatkan balasan sopan untuk pelanggan yang paketnya telat.',
    'Tentu, ini drafnya:\n\n> Halo Kak, mohon maaf paketnya terlambat. Pesanan Kakak sudah kami cek dan sedang diantar kurir hari ini. Kalau besok belum sampai, kabari kami ya — kami bantu urus langsung.\n\nMau nadanya dibuat lebih formal?',
  ),
  contoh(
    'demo-3',
    'Ide konten media sosial',
    4,
    'Beri 3 ide konten Instagram untuk minggu depan.',
    '1. **Di balik layar** — foto tim saat menyiapkan pesanan.\n2. **Tips singkat** — carousel 5 slide cara memakai produk.\n3. **Testimoni** — kutipan ulasan pelanggan dengan foto produk.',
  ),
  contoh(
    'demo-4',
    'Rumus diskon bertingkat',
    12,
    'Bagaimana menghitung diskon 10% lalu 5%?',
    'Diskon bertingkat dihitung berurutan, bukan dijumlah:\n\n```ts\nconst hargaAkhir = harga * (1 - 0.1) * (1 - 0.05);\n```\n\nJadi totalnya `14,5%`, bukan 15%.',
  ),
];

const bacaDemo = () => bacaData<Percakapan[]>(KUNCI_DEMO, CONTOH_DEMO);
const simpanDemo = (daftar: Percakapan[]) => simpanData(KUNCI_DEMO, daftar);
const ringkas = ({ id, judul, diperbarui }: Percakapan): RingkasanPercakapan => ({ id, judul, diperbarui });
const idBaru = () => `c-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

export async function daftarPercakapan(signal?: AbortSignal): Promise<RingkasanPercakapan[]> {
  if (MODE_DEMO) {
    await jeda(200);
    return bacaDemo()
      .map(ringkas)
      .sort((a, b) => b.diperbarui.localeCompare(a.diperbarui));
  }
  return api<RingkasanPercakapan[]>('/api/v1/lydia/percakapan', { signal });
}

export async function ambilPercakapan(id: string, signal?: AbortSignal): Promise<Percakapan> {
  if (MODE_DEMO) {
    await jeda(150);
    const c = bacaDemo().find((x) => x.id === id);
    if (!c) throw new ApiError(404, 'Percakapan ini tidak ditemukan. Mungkin sudah dihapus.');
    return c;
  }
  return api<Percakapan>(`/api/v1/lydia/percakapan/${encodeURIComponent(id)}`, { signal });
}

export async function ubahJudulPercakapan(id: string, judul: string): Promise<RingkasanPercakapan> {
  if (MODE_DEMO) {
    await jeda();
    const daftar = bacaDemo().map((c) => (c.id === id ? { ...c, judul } : c));
    simpanDemo(daftar);
    const c = daftar.find((x) => x.id === id);
    if (!c) throw new ApiError(404, 'Percakapan ini tidak ditemukan.');
    return ringkas(c);
  }
  return api<RingkasanPercakapan>(`/api/v1/lydia/percakapan/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: { judul },
  });
}

export async function hapusPercakapan(id: string): Promise<void> {
  if (MODE_DEMO) {
    await jeda();
    simpanDemo(bacaDemo().filter((c) => c.id !== id));
    return;
  }
  await api<void>(`/api/v1/lydia/percakapan/${encodeURIComponent(id)}`, { method: 'DELETE' });
}

// Kolom baru tetap terisi
const lengkapi = (p: Partial<PengaturanLydia>): PengaturanLydia => ({ ...PENGATURAN_BAWAAN, ...p });

export async function ambilPengaturanLydia(signal?: AbortSignal): Promise<PengaturanLydia> {
  if (MODE_DEMO) {
    await jeda(100);
    return lengkapi(bacaData(KUNCI_PENGATURAN_DEMO, PENGATURAN_BAWAAN));
  }
  return lengkapi(await api<PengaturanLydia>('/api/v1/lydia/pengaturan', { signal }));
}

export async function simpanPengaturanLydia(data: PengaturanLydia): Promise<PengaturanLydia> {
  if (MODE_DEMO) {
    await jeda();
    return simpanData(KUNCI_PENGATURAN_DEMO, data);
  }
  return lengkapi(await api<PengaturanLydia>('/api/v1/lydia/pengaturan', { method: 'PUT', body: data }));
}

/** Galat, atau null bila valid. */
export function periksaLampiran(f: File): string | null {
  if (!POLA_LAMPIRAN.test(f.type) && !POLA_LAMPIRAN.test(f.name)) {
    return 'format belum didukung. Pakai gambar, PDF, Word, Excel, CSV, atau TXT.';
  }
  if (f.size > MAKS_UKURAN_MB * 1024 * 1024) return `ukurannya lebih dari ${MAKS_UKURAN_MB} MB.`;
  return null;
}

const SISI_PRATINJAU = 800;

// Demo: gambar diperkecil jadi data URL
async function pratinjauDemo(f: File): Promise<string> {
  if (!f.type.startsWith('image/')) return '';
  const gambar = await createImageBitmap(f);
  const skala = Math.min(1, SISI_PRATINJAU / Math.max(gambar.width, gambar.height));
  const kanvas = document.createElement('canvas');
  kanvas.width = Math.round(gambar.width * skala);
  kanvas.height = Math.round(gambar.height * skala);
  kanvas.getContext('2d')?.drawImage(gambar, 0, 0, kanvas.width, kanvas.height);
  gambar.close();
  return kanvas.toDataURL('image/jpeg', 0.82);
}

export async function unggahLampiran(f: File, signal?: AbortSignal): Promise<LampiranPesan> {
  if (MODE_DEMO) {
    await jeda(300);
    return { id: idBaru(), nama: f.name, tipe: f.type, ukuran: f.size, url: await pratinjauDemo(f) };
  }
  const isian = new FormData();
  isian.append('berkas', f);
  return api<LampiranPesan>('/api/v1/lydia/lampiran', { method: 'POST', body: isian, signal });
}

/** Jawaban mengalir lewat onPotongan. */
export async function kirimPesan(
  percakapanId: string | null,
  pesan: string,
  lampiran: LampiranPesan[],
  kabar: KabarAliran,
  signal?: AbortSignal,
): Promise<void> {
  if (MODE_DEMO) return kirimDemo(percakapanId, pesan, lampiran, kabar, signal);

  await apiAliran(
    '/api/v1/lydia/chat',
    { percakapan_id: percakapanId, pesan, lampiran: lampiran.map((l) => l.id) },
    (data) => {
      const ev = JSON.parse(data) as EventChat;
      if (ev.jenis === 'mulai') kabar.onMulai(ev.percakapan);
      else if (ev.jenis === 'potongan') kabar.onPotongan(ev.teks);
      else if (ev.jenis === 'galat') throw new ApiError(502, ev.pesan);
    },
    signal,
  );
}

// --- Mode demo -----------------------------------------------------------

const JEDA_KATA_MS = 22;

function balasanDemo(tanya: string, nama: string, lampiran: LampiranPesan[]): string {
  if (lampiran.length > 0) {
    const daftar = lampiran.map((l) => `- ${l.nama}`).join('\n');
    return `Aku menerima **${lampiran.length} lampiran**:\n\n${daftar}\n\nIni mode demo, jadi isinya belum benar-benar kubaca. Setelah backend siap, ${nama} bisa merangkum dokumen atau menjelaskan gambar yang kamu kirim.`;
  }
  const t = tanya.toLowerCase();
  if (/kode|code|react|komponen|tombol/.test(t)) {
    return 'Tentu! Ini contoh tombol simpan sederhana dengan React:\n\n```tsx\nexport function TombolSimpan({ onClick }: { onClick: () => void }) {\n  return (\n    <button type="button" className="btn btn--normal" onClick={onClick}>\n      Simpan\n    </button>\n  );\n}\n```\n\nPasang fungsi simpan di `onClick`. Mau sekalian kubuatkan versi dengan status loading?';
  }
  if (/ringkas|rangkum|penjualan|laporan/.test(t)) {
    return 'Berikut ringkasan penjualan minggu ini (data contoh):\n\n- **Total transaksi:** 186 pesanan\n- **Pendapatan:** Rp 48.250.000, naik 12% dari minggu lalu\n- **Produk terlaris:** Paket Langganan Pro\n- **Perlu perhatian:** 4 pesanan masih menunggu pembayaran\n\nMau kubuatkan grafiknya atau kukirim sebagai laporan?';
  }
  if (/maintenance|pengumuman|jadwal/.test(t)) {
    return 'Ini draf pengumumannya:\n\n### Pemberitahuan Pemeliharaan Sistem\n\nHalo pengguna, kami akan melakukan pemeliharaan sistem pada **Sabtu pukul 22.00–24.00 WIB**. Selama waktu itu dashboard tidak bisa diakses sementara.\n\nTerima kasih atas pengertiannya.\n\nMau nadanya dibuat lebih santai?';
  }
  if (/promo|ide|pelanggan/.test(t)) {
    return 'Beberapa ide promo untuk pelanggan baru:\n\n1. **Diskon pembelian pertama** 15% dengan kode `HALOBARU`.\n2. **Gratis ongkir** untuk pesanan di atas Rp 150.000.\n3. **Bonus poin ganda** selama 7 hari setelah mendaftar.\n\nPilih satu, nanti kubantu susun teks bannernya.';
  }
  return `Ini mode demo, jadi aku belum tersambung ke model AI sungguhan. Pertanyaanmu:\n\n> ${tanya.replace(/\n+/g, ' ')}\n\nSetelah backend siap, jawaban asli dari ${nama} akan muncul di sini dan mengalir kata demi kata seperti ini.`;
}

function tunggu(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((selesai, gagal) => {
    if (signal?.aborted) {
      gagal(new DOMException('Dihentikan', 'AbortError'));
      return;
    }
    const t = window.setTimeout(selesai, ms);
    signal?.addEventListener(
      'abort',
      () => {
        window.clearTimeout(t);
        gagal(new DOMException('Dihentikan', 'AbortError'));
      },
      { once: true },
    );
  });
}

async function kirimDemo(
  percakapanId: string | null,
  pesan: string,
  lampiran: LampiranPesan[],
  kabar: KabarAliran,
  signal?: AbortSignal,
): Promise<void> {
  const sekarang = new Date().toISOString();
  const daftar = bacaDemo();
  let c = percakapanId ? daftar.find((x) => x.id === percakapanId) : undefined;
  if (!c) {
    c = { id: idBaru(), judul: judulDari(pesan || lampiran[0]?.nama || 'Lampiran'), diperbarui: sekarang, pesan: [] };
    daftar.push(c);
  }
  c.pesan.push({ id: idBaru(), peran: 'pengguna', isi: pesan, dibuat: sekarang, lampiran });
  c.diperbarui = sekarang;
  simpanDemo(daftar);
  kabar.onMulai(ringkas(c));

  const { nama } = bacaData(KUNCI_PENGATURAN_DEMO, PENGATURAN_BAWAAN);
  const potongan = balasanDemo(pesan, nama, lampiran).match(/\s*\S+/g) ?? [];
  let jawaban = '';
  try {
    await tunggu(500, signal);
    for (const p of potongan) {
      await tunggu(JEDA_KATA_MS, signal);
      jawaban += p;
      kabar.onPotongan(p);
    }
  } finally {
    // Jawaban terpotong tetap disimpan
    if (jawaban) {
      const terbaru = bacaDemo();
      const target = terbaru.find((x) => x.id === c.id);
      target?.pesan.push({ id: idBaru(), peran: 'lydia', isi: jawaban, dibuat: new Date().toISOString() });
      simpanDemo(terbaru);
    }
  }
}
