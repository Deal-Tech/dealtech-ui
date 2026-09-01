import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { Ban, ImagePlus, RotateCw } from 'lucide-react';

import { ActionButton } from '@/components/ui/action-button/ActionButton';
import { Button } from '@/components/ui/button/Button';
import { ApiError } from '@/lib/api';
import { periksaGambar, unggahGambar } from '@/services/unggah';
import './unggah-gambar.css';

const TIPE_TERIMA = 'image/jpeg,image/png,image/webp';

/** Berapa gambar yang boleh masuk galeri kalau pemanggilnya tidak menentukan. */
const MAKS_GALERI_BAWAAN = 8;

function pesanGalat(e: unknown, cadangan: string): string {
  return e instanceof ApiError ? e.message : cadangan;
}

/** Membatalkan unggahan yang masih jalan saat komponennya dilepas. */
function usePengendaliUnggah() {
  const pengendali = useRef<AbortController | null>(null);
  useEffect(() => () => pengendali.current?.abort(), []);
  return pengendali;
}

export interface UnggahGambarProps {
  nilai: string;
  onChange: (url: string) => void;
  label?: string;
  disabled?: boolean;
}

export function UnggahGambar({ nilai, onChange, label, disabled = false }: UnggahGambarProps) {
  const idBerkas = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const pengendali = usePengendaliUnggah();
  const [memuat, setMemuat] = useState(false);
  const [galat, setGalat] = useState('');

  const pilih = useCallback(async (file: File) => {
    const tolak = periksaGambar(file);
    if (tolak) {
      setGalat(tolak);
      return;
    }

    pengendali.current?.abort();
    const baru = new AbortController();
    pengendali.current = baru;

    setGalat('');
    setMemuat(true);
    try {
      const url = await unggahGambar(file, baru.signal);
      if (!baru.signal.aborted) onChange(url);
    } catch (e) {
      if (!baru.signal.aborted) setGalat(pesanGalat(e, 'Gambar gagal diunggah. Coba lagi.'));
    } finally {
      if (!baru.signal.aborted) setMemuat(false);
    }
  }, [onChange, pengendali]);

  return (
    <div className="unggah-gambar">
      {label ? (
        <label className="unggah-gambar__label" htmlFor={idBerkas}>
          {label}
        </label>
      ) : null}

      {nilai ? (
        <div className="unggah-gambar__pratinjau">
          <img src={nilai} alt="Pratinjau gambar yang diunggah" />
          <ActionButton
            icon={Ban}
            variant="danger"
            className="unggah-gambar__buang"
            title="Hapus gambar"
            aria-label="Hapus gambar"
            disabled={disabled || memuat}
            onClick={() => {
              setGalat('');
              onChange('');
            }}
          />
        </div>
      ) : null}

      <input
        ref={inputRef}
        id={idBerkas}
        type="file"
        className="unggah-gambar__berkas"
        accept={TIPE_TERIMA}
        disabled={disabled || memuat}
        onChange={(e) => {
          const file = e.target.files?.[0];
          // Dikosongkan supaya memilih berkas yang sama dua kali tetap memicu onChange.
          e.target.value = '';
          if (file) void pilih(file);
        }}
      />

      <Button
        icon={nilai ? RotateCw : ImagePlus}
        variant="secondary"
        loading={memuat}
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
      >
        {memuat ? 'Mengunggah…' : nilai ? 'Ganti Gambar' : 'Pilih Gambar'}
      </Button>

      {galat ? (
        <p role="alert" className="unggah-gambar__galat">
          {galat}
        </p>
      ) : null}
    </div>
  );
}

export interface UnggahGaleriProps {
  nilai: string[];
  onChange: (urls: string[]) => void;
  /** Batas jumlah gambar. `Infinity` berarti tanpa batas (halaman Gallery). */
  maks?: number;
  label?: string;
  disabled?: boolean;
}

export function UnggahGaleri({
  nilai,
  onChange,
  maks = MAKS_GALERI_BAWAAN,
  label,
  disabled = false,
}: UnggahGaleriProps) {
  const idBerkas = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const pengendali = usePengendaliUnggah();
  const [memuat, setMemuat] = useState(false);
  const [galat, setGalat] = useState('');

  const penuh = nilai.length >= maks;

  const tambah = useCallback(async (files: File[]) => {
    const sisa = maks - nilai.length;
    if (sisa <= 0) {
      setGalat(`Maksimal ${maks} gambar. Hapus salah satu dulu sebelum menambah.`);
      return;
    }

    const kelebihan = files.length > sisa;
    const antre = files.slice(0, sisa);

    for (const file of antre) {
      const tolak = periksaGambar(file);
      if (tolak) {
        setGalat(`${file.name}: ${tolak}`);
        return;
      }
    }

    pengendali.current?.abort();
    const baru = new AbortController();
    pengendali.current = baru;

    setGalat(kelebihan ? `Hanya ${sisa} gambar pertama yang diunggah — batasnya ${maks}.` : '');
    setMemuat(true);

    // Berurutan, bukan paralel: urutan galeri mengikuti urutan penambahan.
    const terkumpul: string[] = [];
    try {
      for (const file of antre) {
        terkumpul.push(await unggahGambar(file, baru.signal));
      }
      if (!baru.signal.aborted) onChange([...nilai, ...terkumpul]);
    } catch (e) {
      if (!baru.signal.aborted) {
        // Yang sudah berhasil tetap dipakai — memaksa orang mengulang semuanya
        // karena satu berkas gagal itu menyebalkan dan tidak perlu.
        if (terkumpul.length > 0) onChange([...nilai, ...terkumpul]);
        setGalat(pesanGalat(e, 'Ada gambar yang gagal diunggah. Coba lagi.'));
      }
    } finally {
      if (!baru.signal.aborted) setMemuat(false);
    }
  }, [maks, nilai, onChange, pengendali]);

  return (
    <div className="unggah-gambar">
      {label ? (
        <label className="unggah-gambar__label" htmlFor={idBerkas}>
          {label}
        </label>
      ) : null}

      {nilai.length > 0 ? (
        <ul className="unggah-gambar__galeri">
          {nilai.map((url, i) => (
            <li key={`${url}-${i}`} className="unggah-gambar__item">
              <img src={url} alt={`Gambar ke-${i + 1}`} />
              <ActionButton
                icon={Ban}
                variant="danger"
                className="unggah-gambar__buang"
                title={`Hapus gambar ke-${i + 1}`}
                aria-label={`Hapus gambar ke-${i + 1}`}
                disabled={disabled || memuat}
                onClick={() => {
                  setGalat('');
                  onChange(nilai.filter((_, j) => j !== i));
                }}
              />
            </li>
          ))}
        </ul>
      ) : null}

      <input
        ref={inputRef}
        id={idBerkas}
        type="file"
        multiple
        className="unggah-gambar__berkas"
        accept={TIPE_TERIMA}
        disabled={disabled || memuat || penuh}
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          e.target.value = '';
          if (files.length > 0) void tambah(files);
        }}
      />

      <Button
        icon={ImagePlus}
        variant="secondary"
        loading={memuat}
        disabled={disabled || penuh}
        onClick={() => inputRef.current?.click()}
      >
        {memuat ? 'Mengunggah…' : `Tambah Gambar (${nilai.length}/${maks})`}
      </Button>

      {galat ? (
        <p role="alert" className="unggah-gambar__galat">
          {galat}
        </p>
      ) : null}
    </div>
  );
}

export default UnggahGambar;
