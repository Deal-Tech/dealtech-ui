import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent as MouseEventReact,
  type PointerEvent as PointerEventReact,
  type ReactNode,
} from 'react';

import { Checkbox } from '@/components/ui/checkbox/Checkbox';
import { Pagination } from '@/components/ui/pagination/Pagination';
import './tablelist-v1.css';

export type TableListAlign = 'left' | 'center' | 'right';

export interface TableListColumn {
  key: string;
  label: string;
  align?: TableListAlign;
  muted?: boolean;
  width?: string;
}

export type TableListRow = Record<string, ReactNode>;

export interface PilihanTabel {
  terpilih: string[];
  kunciHalaman: string[];
  onToggle: (kunci: string) => void;
  onToggleSemua: () => void;
  onBersihkan: () => void;
  terkunci?: string[];
}

export interface TableListV1Props {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  toolbar?: ReactNode;
  columns: TableListColumn[];
  rows: TableListRow[];
  rowKey?: (row: TableListRow, index: number) => string;
  onKlikBaris?: (row: TableListRow, index: number) => void;
  pilihan?: PilihanTabel;
  aksiMassal?: ReactNode;
  paginasi?: {
    halaman: number;
    totalHalaman: number;
    info: string;
    onNavigasi: (halaman: number) => void;
  };
  footer?: ReactNode;
  /**
   * Jumlah baris minimal yang selalu dirender. Kekurangannya diisi baris
   * kosong supaya tinggi tabel tidak berubah saat halaman terakhir lebih
   * pendek. Kosongkan kalau tabel memang boleh memendek.
   */
  minBaris?: number;
  emptyText?: string;
  className?: string;
}

const TH_ALIGN: Record<TableListAlign, string> = {
  left: '',
  center: 'tablelist-v1__th--center',
  right: 'tablelist-v1__th--right',
};

const TD_ALIGN: Record<TableListAlign, string> = {
  left: '',
  center: 'tablelist-v1__td--center',
  right: 'tablelist-v1__td--right',
};

const LEBAR_PILIH = 44;

/** Jatah kolom yang tidak diberi lebar. */
const LEBAR_LENTUR = 200;

/**
 * Lebar minimum tabel dihitung dari definisi kolom, bukan dari isinya — supaya
 * lebar kolom tidak bergeser saat halaman berganti. Lebih sempit dari ini,
 * pembungkusnya menggulir mendatar.
 */
function lebarMinimum(columns: TableListColumn[], adaPilihan: boolean): string {
  let total = adaPilihan ? LEBAR_PILIH : 0;
  for (const c of columns) {
    const px = c.width?.endsWith('px') ? Number.parseFloat(c.width) : NaN;
    total += Number.isFinite(px) ? px : LEBAR_LENTUR;
  }
  return `${total}px`;
}

const isTeks = (v: ReactNode) => typeof v === 'string' || typeof v === 'number';

/** Geseran sebelum tarikan dianggap sengaja — supaya klik biasa tetap jalan. */
const AMBANG_SERET = 4;

const KONTROL = 'button, input, a, label, select, textarea';

/**
 * Seret-untuk-menggulir mendatar, khusus tetikus.
 *
 * Sentuh sengaja tidak ikut: peramban sudah menggulir sendiri, dan memaksakan
 * ini di sana justru merebut gerakan gulir vertikal halaman.
 */
function useSeretGulir(pemicu: unknown) {
  const wadahRef = useRef<HTMLDivElement>(null);
  const [bisaSeret, setBisaSeret] = useState(false);
  const [menyeret, setMenyeret] = useState(false);
  const seret = useRef({ aktif: false, bergerak: false, mulaiX: 0, mulaiGulir: 0 });
  const baruSeret = useRef(false);

  useEffect(() => {
    const el = wadahRef.current;
    if (!el) return;
    const cek = () => setBisaSeret(el.scrollWidth > el.clientWidth + 1);
    cek();
    window.addEventListener('resize', cek);
    return () => window.removeEventListener('resize', cek);
  }, [pemicu]);

  useEffect(() => {
    const gerak = (e: globalThis.PointerEvent) => {
      const s = seret.current;
      const el = wadahRef.current;
      if (!s.aktif || !el) return;
      const jarak = e.clientX - s.mulaiX;
      if (!s.bergerak) {
        if (Math.abs(jarak) < AMBANG_SERET) return;
        s.bergerak = true;
        setMenyeret(true);
      }
      e.preventDefault();
      el.scrollLeft = s.mulaiGulir - jarak;
    };

    const lepas = () => {
      const s = seret.current;
      if (!s.aktif) return;
      s.aktif = false;
      if (s.bergerak) {
        // Klik sesudah menyeret ditelan sekali, kalau tidak barisnya ikut terbuka.
        baruSeret.current = true;
        window.setTimeout(() => {
          baruSeret.current = false;
        }, 0);
        setMenyeret(false);
      }
      s.bergerak = false;
    };

    window.addEventListener('pointermove', gerak);
    window.addEventListener('pointerup', lepas);
    window.addEventListener('pointercancel', lepas);
    return () => {
      window.removeEventListener('pointermove', gerak);
      window.removeEventListener('pointerup', lepas);
      window.removeEventListener('pointercancel', lepas);
    };
  }, []);

  const mulai = useCallback((e: PointerEventReact<HTMLDivElement>) => {
    const el = wadahRef.current;
    if (!el) return;
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    if (el.scrollWidth <= el.clientWidth + 1) return;
    if ((e.target as HTMLElement).closest(KONTROL)) return;
    seret.current = { aktif: true, bergerak: false, mulaiX: e.clientX, mulaiGulir: el.scrollLeft };
  }, []);

  const tahanKlik = useCallback((e: MouseEventReact) => {
    if (!baruSeret.current) return;
    e.preventDefault();
    e.stopPropagation();
  }, []);

  return { wadahRef, bisaSeret, menyeret, mulai, tahanKlik };
}

export function TableListV1({
  title,
  subtitle,
  action,
  toolbar,
  columns,
  rows,
  rowKey,
  onKlikBaris,
  pilihan,
  aksiMassal,
  paginasi,
  footer,
  minBaris,
  emptyText = 'Tidak ada data.',
  className = '',
}: TableListV1Props) {
  const adaPilihan = !!pilihan;
  const terkunci = new Set(pilihan?.terkunci ?? []);
  const kunciBisaPilih = (pilihan?.kunciHalaman ?? []).filter((k) => !terkunci.has(k));
  const jumlahTerpilihHalaman = kunciBisaPilih.filter((k) =>
    pilihan?.terpilih.includes(k),
  ).length;
  const semuaHalamanTerpilih =
    kunciBisaPilih.length > 0 && jumlahTerpilihHalaman === kunciBisaPilih.length;
  const jumlahTerpilih = pilihan?.terpilih.length ?? 0;

  const kolomTotal = columns.length + (adaPilihan ? 1 : 0);

  // Baris kosong penambal; tanpa ini tinggi tabel melompat di halaman terakhir.
  const kurang = minBaris && rows.length > 0 ? Math.max(0, minBaris - rows.length) : 0;
  const pengisi = Array.from({ length: kurang }, (_, i) => i);

  const { wadahRef, bisaSeret, menyeret, mulai, tahanKlik } = useSeretGulir(columns);

  return (
    <section className={`tablelist-v1 ${className}`}>
      {title || subtitle || action ? (
        <div className="tablelist-v1__header">
          <div className="tablelist-v1__heading">
            {title ? <h2 className="tablelist-v1__title">{title}</h2> : null}
            {subtitle ? <p className="tablelist-v1__subtitle">{subtitle}</p> : null}
          </div>
          {action ? <div className="tablelist-v1__action">{action}</div> : null}
        </div>
      ) : null}

      {toolbar}

      {adaPilihan && jumlahTerpilih > 0 ? (
        <div className="tablelist-v1__massal">
          <span className="tablelist-v1__massal-jumlah">{jumlahTerpilih} baris dipilih</span>
          <div className="tablelist-v1__massal-aksi">{aksiMassal}</div>
          <button
            type="button"
            className="tablelist-v1__massal-batal"
            onClick={pilihan.onBersihkan}
          >
            Batalkan pilihan
          </button>
        </div>
      ) : null}

      <div className="tablelist-v1__body">
        <div
          ref={wadahRef}
          className={`tablelist-v1__scroll ${bisaSeret ? 'tablelist-v1__scroll--seret' : ''} ${
            menyeret ? 'tablelist-v1__scroll--menyeret' : ''
          }`}
          onPointerDown={mulai}
          onClickCapture={tahanKlik}
        >
          <table
            className="tablelist-v1__table"
            style={{ minWidth: lebarMinimum(columns, adaPilihan) }}
          >
            <colgroup>
              {adaPilihan ? <col style={{ width: `${LEBAR_PILIH}px` }} /> : null}
              {columns.map((col) => (
                <col key={col.key} style={col.width ? { width: col.width } : undefined} />
              ))}
            </colgroup>
            <thead>
              <tr>
                {adaPilihan ? (
                  <th className="tablelist-v1__th tablelist-v1__th--pilih">
                    <Checkbox
                      checked={semuaHalamanTerpilih}
                      indeterminate={jumlahTerpilihHalaman > 0 && !semuaHalamanTerpilih}
                      onChange={pilihan.onToggleSemua}
                      disabled={kunciBisaPilih.length === 0}
                      aria-label="Pilih semua baris di halaman ini"
                    />
                  </th>
                ) : null}
                {columns.map((col) => (
                  <th key={col.key} className={`tablelist-v1__th ${TH_ALIGN[col.align ?? 'left']}`}>
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr className="tablelist-v1__row">
                  <td className="tablelist-v1__empty" colSpan={kolomTotal}>
                    {emptyText}
                  </td>
                </tr>
              ) : null}
              {rows.map((row, i) => {
                const kunci = rowKey ? rowKey(row, i) : String(i);
                const dipilih = pilihan?.terpilih.includes(kunci) ?? false;
                return (
                  <tr
                    key={kunci}
                    className={`tablelist-v1__row ${dipilih ? 'tablelist-v1__row--dipilih' : ''} ${
                      onKlikBaris ? 'tablelist-v1__row--klik' : ''
                    }`}
                    tabIndex={onKlikBaris ? 0 : undefined}
                    role={onKlikBaris ? 'button' : undefined}
                    onClick={
                      onKlikBaris
                        ? (e) => {
                            if ((e.target as HTMLElement).closest('button, input, a, label')) return;
                            onKlikBaris(row, i);
                          }
                        : undefined
                    }
                    onKeyDown={
                      onKlikBaris
                        ? (e) => {
                            if (e.target !== e.currentTarget) return;
                            if (e.key !== 'Enter' && e.key !== ' ') return;
                            e.preventDefault();
                            onKlikBaris(row, i);
                          }
                        : undefined
                    }
                  >
                    {adaPilihan ? (
                      <td className="tablelist-v1__td tablelist-v1__td--pilih">
                        <Checkbox
                          checked={dipilih}
                          onChange={() => pilihan.onToggle(kunci)}
                          disabled={terkunci.has(kunci)}
                          aria-label={`Pilih baris ${i + 1}`}
                        />
                      </td>
                    ) : null}
                    {columns.map((col) => {
                      const isi = row[col.key];
                      const teks = isTeks(isi);
                      return (
                        <td
                          key={col.key}
                          className={`tablelist-v1__td ${TD_ALIGN[col.align ?? 'left']} ${
                            col.muted ? 'tablelist-v1__td--muted' : ''
                          }`}
                          title={teks ? String(isi) : undefined}
                        >
                          {teks ? <span className="tablelist-v1__teks">{isi}</span> : isi}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
              {pengisi.map((n) => (
                <tr key={`kosong-${n}`} className="tablelist-v1__row tablelist-v1__row--kosong">
                  <td className="tablelist-v1__td" colSpan={kolomTotal}>
                    &nbsp;
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {paginasi ? (
        <div className="tablelist-v1__footer tablelist-v1__footer--paginasi">
          <span className="tablelist-v1__info">{paginasi.info}</span>
          <Pagination
            current={paginasi.halaman}
            last={paginasi.totalHalaman}
            onNavigate={paginasi.onNavigasi}
          />
        </div>
      ) : null}

      {footer ? <div className="tablelist-v1__footer">{footer}</div> : null}
    </section>
  );
}

export default TableListV1;
