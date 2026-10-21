import { useCallback, useEffect, useId, useRef, useState, type MouseEvent } from 'react';
import {
  Bold,
  Code2,
  Heading2,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Pilcrow,
  Quote,
  type LucideIcon,
} from 'lucide-react';

import { Skeleton, SkeletonTeks } from '@/components/ui/skeleton/Skeleton';
import { GelembungTautan, hitungPosisiGelembung, rectTerakhir, type PosisiGelembung } from './GelembungTautan';
import './richtext.css';

const DIIZINKAN = new Set([
  'H2', 'H3', 'P', 'STRONG', 'B', 'EM', 'I', 'U', 'UL', 'OL', 'LI', 'BLOCKQUOTE', 'A', 'BR',
  'IMG', 'FIGURE', 'FIGCAPTION',
  'TABLE', 'THEAD', 'TBODY', 'TFOOT', 'TR', 'TH', 'TD', 'CAPTION', 'COLGROUP', 'COL',
  'PRE', 'CODE',
]);

const DIBUANG_TOTAL = new Set(['SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'EMBED', 'NOSCRIPT', 'TEMPLATE', 'SVG']);

const ATRIBUT_DIIZINKAN: Record<string, string[]> = {
  A: ['href', 'target', 'rel'],
  IMG: ['src', 'alt', 'title', 'width', 'height'],
  TD: ['colspan', 'rowspan'],
  TH: ['colspan', 'rowspan', 'scope'],
  COL: ['span'],
};

function encodeUriAman(nilai: string): string {
  try {
    // Pertahankan escape persen yang sudah valid agar sanitasi tetap idempoten.
    return encodeURI(nilai).replace(/%25([0-9a-f]{2})/gi, '%$1');
  } catch {
    return '';
  }
}

// Awalan literal, bukan pola.
function hrefAman(nilai: string): string {
  const bersih = hapusKendali(nilai);
  const kecil = bersih.toLowerCase();
  let aman = '';
  if (kecil.startsWith('https://')) aman = 'https://' + bersih.slice(8);
  else if (kecil.startsWith('http://')) aman = 'http://' + bersih.slice(7);
  else if (kecil.startsWith('mailto:')) aman = 'mailto:' + bersih.slice(7);
  else if (kecil.startsWith('tel:')) aman = 'tel:' + bersih.slice(4);
  else if (kecil.startsWith('./')) aman = './' + bersih.slice(2);
  else if (kecil.startsWith('/')) aman = '/' + bersih.slice(1);
  else if (kecil.startsWith('#')) aman = '#' + bersih.slice(1);
  return aman ? encodeUriAman(aman) : '';
}

function srcAman(nilai: string): string {
  const bersih = hapusKendali(nilai);
  const kecil = bersih.toLowerCase();
  let aman = '';
  if (kecil.startsWith('https://')) aman = 'https://' + bersih.slice(8);
  else if (kecil.startsWith('http://')) aman = 'http://' + bersih.slice(7);
  else if (kecil.startsWith('/')) aman = '/' + bersih.slice(1);
  return aman ? encodeUriAman(aman) : '';
}

function hapusKendali(nilai: string): string {
  // Karakter kendali dipakai untuk menyelundupkan "javascript:".
  const bersih = nilai.replace(/[\u0000-\u001F\u007F]/g, '').trim();
  return bersih;
}

export function sanitasiHtml(html: string): string {
  if (!html) return '';
  const dok = new DOMParser().parseFromString(html, 'text/html');

  const bersihkan = (simpul: Node): void => {
    Array.from(simpul.childNodes).forEach((anak) => {
      if (anak.nodeType === Node.COMMENT_NODE) {
        anak.parentNode?.removeChild(anak);
        return;
      }
      if (anak.nodeType !== Node.ELEMENT_NODE) return;

      const el = anak as HTMLElement;
      const tag = el.tagName.toUpperCase();

      if (DIBUANG_TOTAL.has(tag)) {
        el.parentNode?.removeChild(el);
        return;
      }

      bersihkan(el);

      const boleh = ATRIBUT_DIIZINKAN[tag] ?? [];
      Array.from(el.attributes).forEach((attr) => {
        const nama = attr.name.toLowerCase();
        if (!boleh.includes(nama)) {
          el.removeAttribute(attr.name);
          return;
        }
        if (nama === 'href' || nama === 'src') {
          const bersih = nama === 'href' ? hrefAman(attr.value) : srcAman(attr.value);
          if (bersih === '') el.removeAttribute(attr.name);
          else el.setAttribute(attr.name, bersih);
        }
      });

      if (tag === 'A' && el.getAttribute('target') === '_blank') {
        el.setAttribute('rel', 'noopener noreferrer');
      }
      if (tag === 'IMG' && !el.getAttribute('src')) {
        el.parentNode?.removeChild(el);
        return;
      }

      if (!DIIZINKAN.has(tag)) {
        const induk = el.parentNode;
        if (induk) {
          while (el.firstChild) induk.insertBefore(el.firstChild, el);
          induk.removeChild(el);
        }
      }
    });
  };

  bersihkan(dok.body);
  return dok.body.innerHTML.trim();
}

const normalkanUrl = (u: string): string => {
  const v = u.trim();
  if (v === '') return '';
  if (/^(https?:\/\/|mailto:|tel:|\/|#)/i.test(v)) return v;
  return `https://${v}`;
};
const eksternal = (u: string): boolean => /^https?:\/\//i.test(u);

// Tolak skema di luar allowlist.
const urlTautanAman = (u: string): string => hrefAman(normalkanUrl(u));

type TombolAlat = {
  cmd: string;
  arg?: string;
  icon: LucideIcon;
  label: string;
  kunciStatus?: string;
};

const TOMBOL: TombolAlat[] = [
  { cmd: 'formatBlock', arg: '<h2>', icon: Heading2, label: 'Judul (H2)' },
  { cmd: 'bold', icon: Bold, label: 'Tebal', kunciStatus: 'bold' },
  { cmd: 'italic', icon: Italic, label: 'Miring', kunciStatus: 'italic' },
  { cmd: 'insertUnorderedList', icon: List, label: 'List titik', kunciStatus: 'insertUnorderedList' },
  { cmd: 'insertOrderedList', icon: ListOrdered, label: 'List nomor', kunciStatus: 'insertOrderedList' },
  { cmd: 'formatBlock', arg: '<blockquote>', icon: Quote, label: 'Kutipan' },
  { cmd: 'formatBlock', arg: '<pre>', icon: Code2, label: 'Blok kode' },
  { cmd: 'formatBlock', arg: '<p>', icon: Pilcrow, label: 'Paragraf biasa' },
];

// Waktu pindah dari tautan ke gelembung.
const JEDA_TUTUP_MS = 250;

type StatusGelembung = PosisiGelembung & { baru: boolean; fokus: boolean };

const NAMA_SOROTAN = 'richtext-tautan';

// Seleksi hilang saat input fokus.
function sorotRentang(rentang: Range | null): void {
  if (typeof CSS === 'undefined' || !('highlights' in CSS)) return;
  if (rentang && !rentang.collapsed) CSS.highlights.set(NAMA_SOROTAN, new Highlight(rentang));
  else CSS.highlights.delete(NAMA_SOROTAN);
}

export interface RichTextProps {
  value: string;
  onChange: (html: string) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  /** Label tetap, editor jadi skeleton. */
  memuat?: boolean;
}

// Tombol format plus tautan
const JUMLAH_TOMBOL = TOMBOL.length + 1;

export function RichTextSkeleton({ label }: { label?: string }) {
  return (
    <div className="richtext">
      {label ? <span className="richtext__label">{label}</span> : null}
      <div className="richtext__kotak">
        <div className="richtext__toolbar">
          {Array.from({ length: JUMLAH_TOMBOL }, (_, i) => (
            <Skeleton key={i} bentuk="kotak" lebar={32} tinggi={32} />
          ))}
        </div>
        <div className="richtext__konten">
          <SkeletonTeks />
        </div>
      </div>
    </div>
  );
}

// Editor dipasang ulang setelah memuat
export function RichText({ memuat = false, ...props }: RichTextProps) {
  if (memuat) return <RichTextSkeleton label={props.label} />;
  return <EditorRichText {...props} />;
}

function EditorRichText({ value, onChange, label, placeholder, error, disabled = false }: RichTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const htmlTerakhir = useRef<string>('');
  const rentangTersimpan = useRef<Range | null>(null);
  const tautanDiedit = useRef<HTMLAnchorElement | null>(null);
  const [aktif, setAktif] = useState<Record<string, boolean>>({});

  const idDasar = useId();
  const idLabel = `${idDasar}-label`;
  const idEditor = `${idDasar}-editor`;
  const idGalat = `${idDasar}-galat`;

  const wadahRef = useRef<HTMLDivElement>(null);
  const gelembungRef = useRef<HTMLDivElement>(null);
  const tombolTautanRef = useRef<HTMLButtonElement>(null);
  const timerTutup = useRef<number | undefined>(undefined);
  const penunjukDiAtas = useRef(false);
  const [gelembung, setGelembung] = useState<StatusGelembung | null>(null);
  const [urlTautan, setUrlTautan] = useState('');
  const gelembungBuka = gelembung !== null;

  useEffect(() => {
    if (!ref.current || value === htmlTerakhir.current) return;
    const bersih = sanitasiHtml(value || '');
    ref.current.innerHTML = bersih;
    htmlTerakhir.current = bersih;
    if (bersih !== (value || '')) onChange(bersih);
  }, [value, onChange]);

  const kirim = useCallback(() => {
    const html = ref.current?.innerHTML ?? '';
    htmlTerakhir.current = html;
    onChange(html);
  }, [onChange]);

  const segarkanAktif = useCallback(() => {
    try {
      setAktif({
        bold: document.queryCommandState('bold'),
        italic: document.queryCommandState('italic'),
        insertUnorderedList: document.queryCommandState('insertUnorderedList'),
        insertOrderedList: document.queryCommandState('insertOrderedList'),
      });
    } catch {
    }
  }, []);

  const jalankan = (cmd: string, arg?: string) => {
    if (disabled) return;
    ref.current?.focus();
    document.execCommand(cmd, false, arg);
    kirim();
    segarkanAktif();
  };

  const simpanSeleksi = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && ref.current?.contains(sel.anchorNode)) {
      rentangTersimpan.current = sel.getRangeAt(0).cloneRange();
    } else {
      rentangTersimpan.current = null;
    }
  };

  const tutupGelembung = useCallback(() => {
    window.clearTimeout(timerTutup.current);
    penunjukDiAtas.current = false;
    tautanDiedit.current = null;
    rentangTersimpan.current = null;
    sorotRentang(null);
    setGelembung(null);
  }, []);

  useEffect(() => {
    if (!gelembungBuka) return;
    const tekanLuar = (e: Event) => {
      if (!wadahRef.current?.contains(e.target as Node)) tutupGelembung();
    };
    document.addEventListener('mousedown', tekanLuar);
    return () => document.removeEventListener('mousedown', tekanLuar);
  }, [gelembungBuka, tutupGelembung]);

  useEffect(() => {
    const timer = timerTutup;
    return () => window.clearTimeout(timer.current);
  }, []);

  const batalTutup = () => window.clearTimeout(timerTutup.current);

  const sedangMengisi = () =>
    gelembung?.baru === true || !!gelembungRef.current?.contains(document.activeElement);

  const tautanDari = (simpul: EventTarget | Node | null | undefined): HTMLAnchorElement | null => {
    const el = simpul instanceof Element ? simpul : simpul instanceof Node ? simpul.parentElement : null;
    const a = el?.closest('a');
    return a && ref.current?.contains(a) ? a : null;
  };

  const tautanDiKursor = () => tautanDari(window.getSelection()?.anchorNode);

  const tampilkanGelembung = (jangkar: DOMRect, tautan: HTMLAnchorElement | null, fokus = false) => {
    if (!wadahRef.current) return;
    batalTutup();
    if (tautan === null || tautan !== tautanDiedit.current) {
      setUrlTautan(tautan ? hrefAman(tautan.getAttribute('href') ?? '') : '');
    }
    tautanDiedit.current = tautan;
    setGelembung({ ...hitungPosisiGelembung(wadahRef.current, jangkar), baru: tautan === null, fokus });
  };

  const jadwalTutup = () => {
    batalTutup();
    timerTutup.current = window.setTimeout(() => {
      const kursorDiTautan = tautanDiedit.current !== null && tautanDiKursor() === tautanDiedit.current;
      if (penunjukDiAtas.current || sedangMengisi() || kursorDiTautan) return;
      tutupGelembung();
    }, JEDA_TUTUP_MS);
  };

  const bukaGelembungBaru = (fokus: boolean) => {
    const rentang = rentangTersimpan.current;
    const rect = rentang ? rectTerakhir(rentang) : null;
    // Kursor di baris kosong tanpa rect.
    const jangkar = rect && (rect.width > 0 || rect.height > 0) ? rect : tombolTautanRef.current?.getBoundingClientRect();
    if (!jangkar) return;
    sorotRentang(rentang);
    tampilkanGelembung(jangkar, null, fokus);
  };

  const ikutiKursor = () => {
    if (disabled) return;
    const a = tautanDiKursor();
    if (a) {
      tampilkanGelembung(rectTerakhir(a), a);
      return;
    }
    simpanSeleksi();
    // Tanpa fokus: Ctrl+B tetap jalan.
    if (rentangTersimpan.current && !rentangTersimpan.current.collapsed) bukaGelembungBaru(false);
    else if (gelembungBuka && !penunjukDiAtas.current) tutupGelembung();
  };

  const saatKursorBerubah = () => {
    segarkanAktif();
    ikutiKursor();
  };

  const masukTautan = (e: MouseEvent<HTMLDivElement>) => {
    const a = tautanDari(e.target);
    if (disabled || !a) return;
    penunjukDiAtas.current = true;
    batalTutup();
    if (!sedangMengisi()) tampilkanGelembung(rectTerakhir(a), a);
  };

  const keluarTautan = (e: MouseEvent<HTMLDivElement>) => {
    const a = tautanDari(e.target);
    if (!a || a.contains(e.relatedTarget as Node | null)) return;
    penunjukDiAtas.current = false;
    if (!gelembung?.baru) jadwalTutup();
  };

  const masukGelembung = () => {
    penunjukDiAtas.current = true;
    batalTutup();
  };

  const keluarGelembung = () => {
    penunjukDiAtas.current = false;
    if (!gelembung?.baru) jadwalTutup();
  };

  const bukaTautanBaru = () => {
    if (disabled) return;
    const ada = tautanDiKursor();
    if (ada) {
      tampilkanGelembung(rectTerakhir(ada), ada, true);
      return;
    }
    simpanSeleksi();
    bukaGelembungBaru(true);
  };

  const klikIsi = (e: MouseEvent<HTMLDivElement>) => {
    if (tautanDari(e.target)) e.preventDefault();
  };

  const pasangAtribut = (a: HTMLAnchorElement, url: string) => {
    a.setAttribute('href', url);
    if (eksternal(url)) {
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener noreferrer');
    } else {
      a.removeAttribute('target');
      a.removeAttribute('rel');
    }
  };

  const lepasTautan = (a: HTMLAnchorElement) => {
    const induk = a.parentNode;
    if (!induk) return;
    while (a.firstChild) induk.insertBefore(a.firstChild, a);
    induk.removeChild(a);
  };

  const sisipkanTautan = (url: string) => {
    ref.current?.focus();
    const sel = window.getSelection();
    if (rentangTersimpan.current && sel) {
      sel.removeAllRanges();
      sel.addRange(rentangTersimpan.current);
    }
    const a = document.createElement('a');
    pasangAtribut(a, url);
    a.textContent = rentangTersimpan.current?.toString() || url;

    const rentang = sel && sel.rangeCount > 0 ? sel.getRangeAt(0) : null;
    if (rentang) {
      rentang.deleteContents();
      rentang.insertNode(a);
      rentang.setStartAfter(a);
      rentang.collapse(true);
      sel?.removeAllRanges();
      sel?.addRange(rentang);
    } else {
      ref.current?.appendChild(a);
    }
  };

  const terapkanTautan = () => {
    const url = urlTautanAman(urlTautan);
    const a = tautanDiedit.current;
    if (a) {
      if (url === '') lepasTautan(a);
      else pasangAtribut(a, url);
    } else if (url !== '') {
      sisipkanTautan(url);
    }
    kirim();
    tutupGelembung();
  };

  const hapusTautan = () => {
    if (tautanDiedit.current) {
      lepasTautan(tautanDiedit.current);
      kirim();
    }
    tutupGelembung();
  };

  const bukaTautan = () => {
    const url = urlTautanAman(urlTautan);
    if (url !== '') window.open(url, '_blank', 'noopener,noreferrer');
  };

  const batalTautan = () => {
    const rentang = rentangTersimpan.current;
    tutupGelembung();
    if (!rentang) return;
    ref.current?.focus();
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(rentang);
  };

  return (
    <div ref={wadahRef} className="richtext">
      {label ? (
        <span
          id={idLabel}
          className="richtext__label"
          onClick={() => ref.current?.focus()}
        >
          {label}
        </span>
      ) : null}

      <div className={`richtext__kotak ${error ? 'richtext__kotak--galat' : ''} ${disabled ? 'richtext__kotak--mati' : ''}`}>
        <div className="richtext__toolbar">
          {TOMBOL.map((b) => {
            const Ikon = b.icon;
            const isAktif = b.kunciStatus ? !!aktif[b.kunciStatus] : false;
            return (
              <button
                key={b.label}
                type="button"
                className={`richtext__tombol ${isAktif ? 'richtext__tombol--aktif' : ''}`}
                title={b.label}
                aria-label={b.label}
                aria-pressed={b.kunciStatus ? isAktif : undefined}
                disabled={disabled}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => jalankan(b.cmd, b.arg)}
              >
                <Ikon className="h-4 w-4" />
              </button>
            );
          })}
          <button
            ref={tombolTautanRef}
            type="button"
            className="richtext__tombol"
            title="Tautan"
            aria-label="Tautan"
            aria-expanded={gelembungBuka}
            disabled={disabled}
            onMouseDown={(e) => e.preventDefault()}
            onClick={bukaTautanBaru}
          >
            <LinkIcon className="h-4 w-4" />
          </button>
        </div>

        <div
          ref={ref}
          id={idEditor}
          className="richtext__konten"
          contentEditable={!disabled}
          suppressContentEditableWarning
          role="textbox"
          aria-multiline="true"
          aria-labelledby={label ? idLabel : undefined}
          aria-invalid={error ? true : undefined}
          aria-errormessage={error ? idGalat : undefined}
          data-placeholder={placeholder ?? ''}
          onInput={kirim}
          onKeyUp={saatKursorBerubah}
          onMouseUp={saatKursorBerubah}
          onFocus={segarkanAktif}
          onClick={klikIsi}
          onMouseOver={masukTautan}
          onMouseOut={keluarTautan}
          onScroll={tutupGelembung}
          onPaste={(e) => {
            if (disabled) return;
            e.preventDefault();
            const html = e.clipboardData.getData('text/html');
            if (html) {
              document.execCommand('insertHTML', false, sanitasiHtml(html));
            } else {
              const teks = e.clipboardData.getData('text/plain');
              document.execCommand('insertText', false, teks);
            }
            kirim();
          }}
        />
      </div>

      {error ? (
        <p id={idGalat} role="alert" className="richtext__galat">
          {error}
        </p>
      ) : null}

      {gelembung ? (
        <GelembungTautan
          ref={gelembungRef}
          posisi={gelembung}
          url={urlTautan}
          sudahAda={!gelembung.baru}
          fokusOtomatis={gelembung.fokus}
          onUrlChange={setUrlTautan}
          onTerapkan={terapkanTautan}
          onBuka={bukaTautan}
          onHapus={hapusTautan}
          onBatal={batalTautan}
          onMouseEnter={masukGelembung}
          onMouseLeave={keluarGelembung}
        />
      ) : null}
    </div>
  );
}

export default RichText;
