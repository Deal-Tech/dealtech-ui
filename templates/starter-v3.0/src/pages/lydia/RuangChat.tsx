import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Check,
  Copy,
  FileImage,
  FileSpreadsheet,
  FileText,
  Paperclip,
  Square,
  User,
  X,
  type LucideIcon,
} from 'lucide-react';

import fotoLydia from '@/assets/lydia.webp';
import { BadgeInfo } from '@/components/ui/badgeinfo/BadgeInfo';
import {
  MAKS_LAMPIRAN,
  TERIMA_LAMPIRAN,
  periksaLampiran,
  type PengaturanLydia,
  type PesanLydia,
} from '@/services/lydia';
import { IsiPesan } from './IsiPesan';
import { LangkahAi, type LangkahProses } from './LangkahAi';

const TINGGI_TULIS_MAKS = 180;

const LANGKAH_CHAT: LangkahProses[] = [
  { teks: 'Membaca pesan Anda', mulaiMs: 0 },
  { teks: 'Memahami maksud pertanyaan', mulaiMs: 900 },
  { teks: 'Menyusun jawaban', mulaiMs: 1800 },
];

const LANGKAH_LAMPIRAN: LangkahProses[] = [
  { teks: 'Mengunggah lampiran', mulaiMs: 0 },
  { teks: 'Membaca isi lampiran', mulaiMs: 900 },
  { teks: 'Menyusun jawaban', mulaiMs: 1800 },
];
// Jarak masih dianggap di bawah
const AMBANG_BAWAH_PX = 80;

export function AvatarLydia({ besar = false, sibuk = false }: { besar?: boolean; sibuk?: boolean }) {
  return (
    <span
      className={`lydia-avatar ${besar ? 'lydia-avatar--besar' : ''} ${sibuk ? 'is-sibuk' : ''}`}
      aria-hidden="true"
    >
      <img src={fotoLydia} alt="" className="lydia-avatar__foto" />
    </span>
  );
}

function ikonBerkas(tipe: string, nama: string): LucideIcon {
  if (tipe.startsWith('image/')) return FileImage;
  if (/\.(xlsx?|csv)$/i.test(nama)) return FileSpreadsheet;
  return FileText;
}

function ukuranBaca(bita: number): string {
  if (bita < 1024 * 1024) return `${Math.max(1, Math.round(bita / 1024))} KB`;
  return `${(bita / 1024 / 1024).toFixed(1)} MB`;
}

interface ButirLampiranProps {
  nama: string;
  tipe: string;
  ukuran: number;
  url: string;
  // Hanya di kotak ketik
  onHapus?: () => void;
}

// Gambar: pratinjau; lainnya: ikon
function ButirLampiran({ nama, tipe, ukuran, url, onHapus }: ButirLampiranProps) {
  const Ikon = ikonBerkas(tipe, nama);
  return (
    <li className="lydia-lampiran__butir" title={nama}>
      {url ? (
        <img src={url} alt="" className="lydia-lampiran__gambar" />
      ) : (
        <Ikon className="lydia-lampiran__ikon" aria-hidden="true" />
      )}
      <span className="lydia-lampiran__teks">
        <span className="lydia-lampiran__nama">{nama}</span>
        <span className="lydia-lampiran__ukuran">{ukuranBaca(ukuran)}</span>
      </span>
      {onHapus ? (
        <button type="button" className="lydia-lampiran__hapus" aria-label={`Batalkan ${nama}`} onClick={onHapus}>
          <X aria-hidden="true" />
        </button>
      ) : null}
    </li>
  );
}

function TombolSalin({ teks }: { teks: string }) {
  const [tersalin, setTersalin] = useState(false);

  const salin = async () => {
    try {
      await navigator.clipboard.writeText(teks);
      setTersalin(true);
      window.setTimeout(() => setTersalin(false), 1500);
    } catch {
      // Clipboard ditolak peramban.
    }
  };

  return (
    <button type="button" className="lydia-aksi-pesan" onClick={() => void salin()}>
      {tersalin ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
      {tersalin ? 'Tersalin' : 'Salin'}
    </button>
  );
}

function BarisPesan({ p }: { p: PesanLydia }) {
  if (p.peran === 'pengguna') {
    return (
      <div className="lydia-baris lydia-baris--saya">
        <div className="lydia-saya">
          {p.lampiran?.length ? (
            <ul className="lydia-lampiran" aria-label="Lampiran">
              {p.lampiran.map((l) => (
                <ButirLampiran key={l.id} nama={l.nama} tipe={l.tipe} ukuran={l.ukuran} url={l.url} />
              ))}
            </ul>
          ) : null}
          {p.isi ? <div className="lydia-gelembung lydia-gelembung--saya">{p.isi}</div> : null}
        </div>
        <span className="lydia-avatar lydia-avatar--saya" aria-hidden="true">
          <User />
        </span>
      </div>
    );
  }
  return (
    <div className="lydia-baris">
      <AvatarLydia />
      <div className="lydia-kolom">
        <div className="lydia-gelembung lydia-gelembung--ai">
          <IsiPesan teks={p.isi} />
        </div>
        <div className="lydia-pesan__aksi">
          <TombolSalin teks={p.isi} />
        </div>
      </div>
    </div>
  );
}

const samaBerkas = (a: File, b: File) => a.name === b.name && a.size === b.size && a.lastModified === b.lastModified;

interface RuangChatProps {
  pengaturan: PengaturanLydia;
  pesan: PesanLydia[];
  /** null: Lydia tidak menjawab. */
  aliran: string | null;
  memuat: boolean;
  galat: string;
  onKirim: (teks: string, berkas: File[]) => void;
  onHentikan: () => void;
}

/** Panel kanan: pesan dan kolom tulis. */
export function RuangChat({ pengaturan, pesan, aliran, memuat, galat, onKirim, onHentikan }: RuangChatProps) {
  const [teks, setTeks] = useState('');
  const [berkas, setBerkas] = useState<File[]>([]);
  const [galatLampiran, setGalatLampiran] = useState('');
  const [seret, setSeret] = useState(false);
  const [diBawah, setDiBawah] = useState(true);
  const gulirRef = useRef<HTMLDivElement>(null);
  const tulisRef = useRef<HTMLTextAreaElement>(null);
  const pilihRef = useRef<HTMLInputElement>(null);
  const diBawahRef = useRef(true);
  const menjawab = aliran !== null;
  const kosong = !memuat && pesan.length === 0 && !menjawab;
  const bisaKirim = !menjawab && (teks.trim() !== '' || berkas.length > 0);
  const berlampiran = !!pesan.filter((p) => p.peran === 'pengguna').at(-1)?.lampiran?.length;

  const pratinjau = useMemo(
    () => berkas.map((f) => (f.type.startsWith('image/') ? URL.createObjectURL(f) : '')),
    [berkas],
  );
  useEffect(() => () => pratinjau.forEach((u) => u && URL.revokeObjectURL(u)), [pratinjau]);

  const keBawah = (halus = false) => {
    const el = gulirRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: halus ? 'smooth' : 'auto' });
    diBawahRef.current = true;
    setDiBawah(true);
  };

  // Pesan baru: langsung ke bawah
  useLayoutEffect(() => keBawah(), [pesan]);

  // Ikuti jawaban kalau di bawah
  useLayoutEffect(() => {
    const el = gulirRef.current;
    if (el && diBawahRef.current) el.scrollTop = el.scrollHeight;
  }, [aliran]);

  useLayoutEffect(() => {
    const el = tulisRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, TINGGI_TULIS_MAKS)}px`;
  }, [teks]);

  // Desktop: kolom tulis siap
  useEffect(() => {
    if (window.matchMedia('(min-width: 1024px)').matches) tulisRef.current?.focus();
  }, [pesan]);

  const padaGulir = () => {
    const el = gulirRef.current;
    if (!el) return;
    const bawah = el.scrollHeight - el.scrollTop - el.clientHeight < AMBANG_BAWAH_PX;
    diBawahRef.current = bawah;
    setDiBawah(bawah);
  };

  // Format, ukuran, jumlah dicek
  const tambahBerkas = (pilihan: File[]) => {
    const galatBaru: string[] = [];
    const hasil = [...berkas];
    for (const f of pilihan) {
      const salah = periksaLampiran(f);
      if (salah) galatBaru.push(`${f.name}: ${salah}`);
      else if (!hasil.some((x) => samaBerkas(x, f))) hasil.push(f);
    }
    if (hasil.length > MAKS_LAMPIRAN) galatBaru.push(`Paling banyak ${MAKS_LAMPIRAN} lampiran dalam satu pesan.`);
    setBerkas(hasil.slice(0, MAKS_LAMPIRAN));
    setGalatLampiran(galatBaru.join(' '));
  };

  const kirim = (isi: string = teks) => {
    if (menjawab || (!isi.trim() && berkas.length === 0)) return;
    onKirim(isi.trim(), berkas);
    setTeks('');
    setBerkas([]);
    setGalatLampiran('');
  };

  return (
    <div className="lydia-ruang">
      <div ref={gulirRef} className="lydia-ruang__gulir" onScroll={padaGulir}>
        {kosong ? (
          <div className="lydia-sambut">
            <AvatarLydia besar />
            <h1 className="lydia-sambut__judul">{pengaturan.sapaan}</h1>
            {pengaturan.deskripsi ? <p className="lydia-sambut__teks">{pengaturan.deskripsi}</p> : null}
            {pengaturan.saran.length > 0 ? (
              <div className="lydia-saran">
                {pengaturan.saran.map((s) => (
                  <button key={s} type="button" className="lydia-saran__butir" onClick={() => kirim(s)}>
                    {s}
                  </button>
                ))}
              </div>
            ) : null}
            {galat ? (
              <BadgeInfo variant="error" className="lydia-sambut__galat">
                {galat}
              </BadgeInfo>
            ) : null}
          </div>
        ) : (
          <div className="lydia-pesan-daftar">
            {memuat ? (
              <div className="lydia-pesan-kerangka" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
            ) : (
              pesan.map((p) => <BarisPesan key={p.id} p={p} />)
            )}

            {menjawab ? (
              <div className="lydia-baris">
                <AvatarLydia sibuk />
                <div className="lydia-kolom">
                  <div className="lydia-gelembung lydia-gelembung--ai">
                    {aliran ? (
                      <IsiPesan teks={aliran} mengalir />
                    ) : (
                      <LangkahAi langkah={berlampiran ? LANGKAH_LAMPIRAN : LANGKAH_CHAT} />
                    )}
                  </div>
                </div>
              </div>
            ) : null}

            {galat ? <BadgeInfo variant="error">{galat}</BadgeInfo> : null}
          </div>
        )}
      </div>

      <p className="sr-only" aria-live="polite">
        {menjawab ? `${pengaturan.nama} sedang menjawab` : ''}
      </p>

      <div className="lydia-tulis-wadah">
        {!diBawah && !kosong ? (
          <button type="button" className="lydia-turun" onClick={() => keBawah(true)} aria-label="Ke pesan terbaru">
            <ArrowDown aria-hidden="true" />
          </button>
        ) : null}
        {galatLampiran ? (
          <BadgeInfo variant="error" className="lydia-tulis__galat">
            {galatLampiran}
          </BadgeInfo>
        ) : null}
        <form
          className={`lydia-tulis ${seret ? 'is-seret' : ''}`}
          onSubmit={(e) => {
            e.preventDefault();
            kirim();
          }}
          onDragOver={(e) => {
            if (!e.dataTransfer.types.includes('Files')) return;
            e.preventDefault();
            setSeret(true);
          }}
          onDragLeave={() => setSeret(false)}
          onDrop={(e) => {
            e.preventDefault();
            setSeret(false);
            tambahBerkas(Array.from(e.dataTransfer.files));
          }}
        >
          {berkas.length > 0 ? (
            <ul className="lydia-lampiran lydia-lampiran--tulis" aria-label="Lampiran yang akan dikirim">
              {berkas.map((f, i) => (
                <ButirLampiran
                  key={`${f.name}-${f.size}-${f.lastModified}`}
                  nama={f.name}
                  tipe={f.type}
                  ukuran={f.size}
                  url={pratinjau[i] ?? ''}
                  onHapus={() => setBerkas((b) => b.filter((_, j) => j !== i))}
                />
              ))}
            </ul>
          ) : null}

          <div className="lydia-tulis__baris">
            <button
              type="button"
              className="lydia-tulis__lampir"
              aria-label="Lampirkan berkas"
              title="Lampirkan gambar atau dokumen"
              disabled={menjawab || berkas.length >= MAKS_LAMPIRAN}
              onClick={() => pilihRef.current?.click()}
            >
              <Paperclip aria-hidden="true" />
            </button>
            <input
              ref={pilihRef}
              type="file"
              hidden
              multiple
              accept={TERIMA_LAMPIRAN}
              onChange={(e) => {
                const dipilih = Array.from(e.target.files ?? []);
                // Boleh pilih berkas sama lagi
                e.target.value = '';
                if (dipilih.length) tambahBerkas(dipilih);
              }}
            />
            <textarea
              ref={tulisRef}
              className="lydia-tulis__isi"
              rows={1}
              value={teks}
              onChange={(e) => setTeks(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
                  e.preventDefault();
                  kirim();
                }
              }}
              onPaste={(e) => {
                const tempel = Array.from(e.clipboardData.files);
                if (tempel.length === 0) return;
                e.preventDefault();
                tambahBerkas(tempel);
              }}
              placeholder={`Tanya ${pengaturan.nama}…`}
              aria-label={`Pesan untuk ${pengaturan.nama}`}
              maxLength={4000}
            />
            {menjawab ? (
              <button
                type="button"
                className="lydia-tulis__tombol lydia-tulis__tombol--henti"
                onClick={onHentikan}
                aria-label="Hentikan jawaban"
                title="Hentikan"
              >
                <Square aria-hidden="true" />
              </button>
            ) : (
              <button
                type="submit"
                className="lydia-tulis__tombol"
                disabled={!bisaKirim}
                aria-label="Kirim pesan"
                title="Kirim (Enter)"
              >
                <ArrowUp aria-hidden="true" />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
