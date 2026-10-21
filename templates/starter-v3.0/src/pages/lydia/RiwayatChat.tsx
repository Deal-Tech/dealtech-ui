import { useMemo, useState } from 'react';
import { MessageSquare, MoreHorizontal, Pencil, SquarePen, Trash2 } from 'lucide-react';

import { BadgeInfo } from '@/components/ui/badgeinfo/BadgeInfo';
import { Button } from '@/components/ui/button/Button';
import { MenuAksi } from '@/components/ui/menu-aksi/MenuAksi';
import { SearchInput } from '@/components/ui/search-input/SearchInput';
import type { RingkasanPercakapan } from '@/services/lydia';

const SATU_HARI = 86_400_000;
const KERANGKA = [72, 54, 64, 48, 60];

// Urutan kelompok di daftar
const KELOMPOK = ['Hari ini', 'Kemarin', '7 hari terakhir', '30 hari terakhir', 'Lebih lama'];

function kelompokDari(iso: string, awalHari: number): string {
  const t = new Date(iso).getTime();
  if (t >= awalHari) return KELOMPOK[0];
  if (t >= awalHari - SATU_HARI) return KELOMPOK[1];
  if (t >= awalHari - 7 * SATU_HARI) return KELOMPOK[2];
  if (t >= awalHari - 30 * SATU_HARI) return KELOMPOK[3];
  return KELOMPOK[4];
}

interface RiwayatChatProps {
  daftar: RingkasanPercakapan[];
  memuat: boolean;
  aktifId: string | null;
  onBaru: () => void;
  onPilih: (id: string) => void;
  onUbahJudul: (c: RingkasanPercakapan) => void;
  onHapus: (c: RingkasanPercakapan) => void;
}

/** Panel kiri: riwayat percakapan. */
export function RiwayatChat({ daftar, memuat, aktifId, onBaru, onPilih, onUbahJudul, onHapus }: RiwayatChatProps) {
  const [cari, setCari] = useState('');

  const kelompok = useMemo(() => {
    const kini = new Date();
    const awalHari = new Date(kini.getFullYear(), kini.getMonth(), kini.getDate()).getTime();
    const kata = cari.trim().toLowerCase();
    const peta = new Map<string, RingkasanPercakapan[]>();
    for (const c of daftar) {
      if (kata && !c.judul.toLowerCase().includes(kata)) continue;
      const k = kelompokDari(c.diperbarui, awalHari);
      peta.set(k, [...(peta.get(k) ?? []), c]);
    }
    return KELOMPOK.filter((k) => peta.has(k)).map((k) => ({ judul: k, isi: peta.get(k) ?? [] }));
  }, [daftar, cari]);

  return (
    <>
      <div className="lydia-riwayat__kepala">
        <p className="lydia-riwayat__judul">Riwayat Chat</p>
        <Button icon={SquarePen} onClick={onBaru}>
          Chat Baru
        </Button>
      </div>

      <div className="lydia-riwayat__cari">
        <SearchInput
          value={cari}
          onChange={(e) => setCari(e.target.value)}
          placeholder="Cari percakapan…"
          aria-label="Cari percakapan"
        />
      </div>

      <nav className="lydia-riwayat__isi" aria-label="Daftar percakapan">
        {memuat ? (
          <div className="lydia-riwayat__kerangka" aria-hidden="true">
            {KERANGKA.map((lebar, i) => (
              <span key={i} style={{ width: `${lebar}%` }} />
            ))}
          </div>
        ) : kelompok.length === 0 ? (
          <BadgeInfo variant="info" icon={false}>
            {cari.trim() ? 'Tidak ada percakapan yang cocok.' : 'Belum ada percakapan. Mulai chat baru.'}
          </BadgeInfo>
        ) : (
          kelompok.map((g) => (
            <div key={g.judul} className="lydia-kelompok">
              <p className="lydia-kelompok__judul">{g.judul}</p>
              {g.isi.map((c) => {
                const aktif = c.id === aktifId;
                return (
                  <div key={c.id} className={`lydia-butir ${aktif ? 'is-aktif' : ''}`}>
                    <button
                      type="button"
                      className="lydia-butir__tombol"
                      onClick={() => onPilih(c.id)}
                      aria-current={aktif ? 'page' : undefined}
                      title={c.judul}
                    >
                      <MessageSquare className="lydia-butir__ikon" aria-hidden="true" />
                      <span className="lydia-butir__teks">{c.judul}</span>
                    </button>
                    <MenuAksi
                      hanyaIkon
                      ikon={MoreHorizontal}
                      ariaLabel={`Aksi untuk ${c.judul}`}
                      className="lydia-butir__menu"
                      item={[
                        { kunci: 'ubah', label: 'Ganti Nama', ikon: Pencil, onClick: () => onUbahJudul(c) },
                        { kunci: 'hapus', label: 'Hapus', ikon: Trash2, bahaya: true, onClick: () => onHapus(c) },
                      ]}
                    />
                  </div>
                );
              })}
            </div>
          ))
        )}
      </nav>
    </>
  );
}
