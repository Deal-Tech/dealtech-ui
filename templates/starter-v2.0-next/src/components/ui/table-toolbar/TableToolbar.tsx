import { useEffect, useState, type ReactNode } from 'react';
import { CornerDownLeft, X } from 'lucide-react';

import { SearchInput } from '@/components/ui/search-input/SearchInput';
import { Select } from '@/components/ui/select/Select';
import { PER_HALAMAN_OPSI } from '@/lib/daftar';
import './table-toolbar.css';

export interface TableToolbarProps {
  cari: string;
  onCari: (nilai: string) => void;
  placeholderCari?: string;
  perHalaman: number;
  onPerHalaman: (nilai: number) => void;
  /** Slot penyaring per domain (status, kategori, dsb.). */
  saring?: ReactNode;
  className?: string;
}

/**
 * Baris alat di atas tabel: pencarian, penyaring, jumlah baris per halaman.
 *
 * Pencarian baru jalan SETELAH ENTER, bukan live search (Bos, 2026-08-12).
 * WAJIB dipakai di setiap halaman daftar supaya letak dan perilakunya seragam.
 */
export function TableToolbar({
  cari,
  onCari,
  placeholderCari = 'Cari…',
  perHalaman,
  onPerHalaman,
  saring,
  className = '',
}: TableToolbarProps) {
  const [ketikan, setKetikan] = useState(cari);

  // Ikut kalau pencarian direset dari luar (mis. setelah pindah penyaring).
  useEffect(() => setKetikan(cari), [cari]);

  // Ada ketikan yang belum dijalankan — untuk petunjuk "tekan Enter".
  const tertunda = ketikan !== cari;

  const jalankan = () => onCari(ketikan.trim());

  const bersihkan = () => {
    setKetikan('');
    onCari('');
  };

  return (
    <div className={`table-toolbar ${className}`}>
      <div className="table-toolbar__cari">
        <SearchInput
          value={ketikan}
          onChange={(e) => setKetikan(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              jalankan();
            }
            if (e.key === 'Escape' && cari) bersihkan();
          }}
          placeholder={placeholderCari}
          aria-label={placeholderCari}
          enterKeyHint="search"
          autoComplete="off"
          className={ketikan ? 'table-toolbar__input--terisi' : ''}
        />

        {ketikan ? (
          <button
            type="button"
            className="table-toolbar__bersih"
            onClick={bersihkan}
            title="Bersihkan pencarian"
            aria-label="Bersihkan pencarian"
          >
            <X />
          </button>
        ) : null}

        {tertunda ? (
          <span className="table-toolbar__petunjuk" role="status">
            <CornerDownLeft />
            Tekan Enter untuk mencari
          </span>
        ) : null}
      </div>

      {saring ? <div className="table-toolbar__saring">{saring}</div> : null}

      <div className="table-toolbar__per-halaman">
        <Select
          value={String(perHalaman)}
          onValueChange={(v) => onPerHalaman(Number(v))}
          options={PER_HALAMAN_OPSI}
        />
      </div>
    </div>
  );
}

export default TableToolbar;
