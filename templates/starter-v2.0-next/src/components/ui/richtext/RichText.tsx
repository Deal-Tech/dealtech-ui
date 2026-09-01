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
  Save,
  Unlink,
  X,
  type LucideIcon,
} from 'lucide-react';

import { Button } from '@/components/ui/button/Button';
import { InputText } from '@/components/ui/inputtext/InputText';
import { Modal } from '@/components/ui/modal/Modal';
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

const SKEMA_TAUTAN = /^(?:https?:\/\/|mailto:|tel:|\/|#|\.\/)/i;
const SKEMA_GAMBAR = /^(?:https?:\/\/|\/)/i;

function urlAman(nilai: string, pola: RegExp): boolean {
  // Karakter kendali dipakai untuk menyelundupkan "javascript:".
  const bersih = nilai.replace(/[\u0000-\u001F\u007F]/g, '').trim();
  return pola.test(bersih);
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
        if (nama === 'href' && !urlAman(attr.value, SKEMA_TAUTAN)) el.removeAttribute(attr.name);
        if (nama === 'src' && !urlAman(attr.value, SKEMA_GAMBAR)) el.removeAttribute(attr.name);
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

const escHtml = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escAttr = (s: string): string => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');

const normalkanUrl = (u: string): string => {
  const v = u.trim();
  if (v === '') return '';
  if (/^(https?:\/\/|mailto:|tel:|\/|#)/i.test(v)) return v;
  return `https://${v}`;
};
const eksternal = (u: string): boolean => /^https?:\/\//i.test(u);

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

export interface RichTextProps {
  value: string;
  onChange: (html: string) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
}

export function RichText({ value, onChange, label, placeholder, error, disabled = false }: RichTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const htmlTerakhir = useRef<string>('');
  const rentangTersimpan = useRef<Range | null>(null);
  const tautanDiedit = useRef<HTMLAnchorElement | null>(null);
  const [aktif, setAktif] = useState<Record<string, boolean>>({});

  const idDasar = useId();
  const idLabel = `${idDasar}-label`;
  const idEditor = `${idDasar}-editor`;
  const idGalat = `${idDasar}-galat`;

  const [modalBuka, setModalBuka] = useState(false);
  const [sedangEdit, setSedangEdit] = useState(false);
  const [teksTautan, setTeksTautan] = useState('');
  const [urlTautan, setUrlTautan] = useState('');

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

  const bukaModalTautan = () => {
    if (disabled) return;
    simpanSeleksi();
    tautanDiedit.current = null;
    setSedangEdit(false);
    setTeksTautan(rentangTersimpan.current ? rentangTersimpan.current.toString() : '');
    setUrlTautan('');
    setModalBuka(true);
  };

  const klikIsi = (e: MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    const tautan = (e.target as HTMLElement).closest('a');
    if (tautan && ref.current?.contains(tautan)) {
      e.preventDefault();
      tautanDiedit.current = tautan as HTMLAnchorElement;
      setSedangEdit(true);
      setTeksTautan(tautan.textContent ?? '');
      setUrlTautan(tautan.getAttribute('href') ?? '');
      rentangTersimpan.current = null;
      setModalBuka(true);
    }
  };

  const tutupModal = () => {
    setModalBuka(false);
    setSedangEdit(false);
    tautanDiedit.current = null;
    rentangTersimpan.current = null;
  };

  const terapkanTautan = () => {
    const url = normalkanUrl(urlTautan);
    const teks = teksTautan.trim();

    if (tautanDiedit.current) {
      const a = tautanDiedit.current;
      if (url === '') {
        if (a.parentNode) {
          while (a.firstChild) a.parentNode.insertBefore(a.firstChild, a);
          a.parentNode.removeChild(a);
        }
      } else {
        a.setAttribute('href', url);
        if (eksternal(url)) {
          a.setAttribute('target', '_blank');
          a.setAttribute('rel', 'noopener noreferrer');
        } else {
          a.removeAttribute('target');
          a.removeAttribute('rel');
        }
        if (teks !== '' && a.textContent !== teks) a.textContent = teks;
      }
      kirim();
      tutupModal();
      return;
    }

    if (url === '') {
      tutupModal();
      return;
    }
    ref.current?.focus();
    const sel = window.getSelection();
    if (rentangTersimpan.current && sel) {
      sel.removeAllRanges();
      sel.addRange(rentangTersimpan.current);
    }
    const nama = teks !== '' ? teks : rentangTersimpan.current?.toString() || url;
    const tambahan = eksternal(url) ? ' target="_blank" rel="noopener noreferrer"' : '';
    document.execCommand(
      'insertHTML',
      false,
      `<a href="${escAttr(url)}"${tambahan}>${escHtml(nama)}</a>`,
    );
    kirim();
    tutupModal();
  };

  const hapusTautan = () => {
    const a = tautanDiedit.current;
    if (a && a.parentNode) {
      while (a.firstChild) a.parentNode.insertBefore(a.firstChild, a);
      a.parentNode.removeChild(a);
      kirim();
    }
    tutupModal();
  };

  return (
    <div className="richtext">
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
            type="button"
            className="richtext__tombol"
            title="Tautan"
            aria-label="Tautan"
            disabled={disabled}
            onMouseDown={(e) => e.preventDefault()}
            onClick={bukaModalTautan}
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
          onKeyUp={segarkanAktif}
          onMouseUp={segarkanAktif}
          onFocus={segarkanAktif}
          onClick={klikIsi}
          onPaste={(e) => {
            if (disabled) return;
            e.preventDefault();
            const html = e.clipboardData.getData('text/html');
            if (html) {
              document.execCommand('insertHTML', false, sanitasiHtml(html));
            } else {
              const teks = e.clipboardData.getData('text/plain');
              document.execCommand('insertHTML', false, escHtml(teks).replace(/\n/g, '<br>'));
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

      <Modal
        open={modalBuka}
        onClose={tutupModal}
        title={sedangEdit ? 'Ubah Tautan' : 'Tambah Tautan'}
        className="richtext-modal"
        footer={
          <div className="richtext-modal__aksi">
            {sedangEdit ? (
              <Button icon={Unlink} onClick={hapusTautan}>
                Hapus Link
              </Button>
            ) : null}
            <Button variant="ghost" icon={X} onClick={tutupModal}>
              Batal
            </Button>
            <Button icon={Save} onClick={terapkanTautan}>
              Terapkan
            </Button>
          </div>
        }
      >
        <div className="richtext-modal__form">
          <InputText
            label="Teks"
            value={teksTautan}
            onChange={(e) => setTeksTautan(e.target.value)}
            placeholder="Teks yang ditautkan"
          />
          <InputText
            label="Target URL"
            value={urlTautan}
            onChange={(e) => setUrlTautan(e.target.value)}
            placeholder="https://contoh.com atau /halaman"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                terapkanTautan();
              }
            }}
          />
        </div>
      </Modal>
    </div>
  );
}

export default RichText;
