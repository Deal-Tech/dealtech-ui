import type { ReactNode } from 'react';
import { Star } from 'lucide-react';

import PitaBerjalan from '@/components/ui/pita-berjalan/PitaBerjalan';
import './ulasan-berjalan.css';

export interface Ulasan {
  nama: string;
  isi: string;
}

const ULASAN_ATAS: Ulasan[] = [
  {
    nama: 'Dewi Anggraini',
    isi: 'Prosesnya jauh lebih cepat dari sistem lama kami. Tim admin sekarang tidak perlu lagi mencatat ulang di spreadsheet terpisah.',
  },
  {
    nama: 'Marcus Bell',
    isi: 'Setup took an afternoon, not a quarter. The defaults were sensible enough that we barely had to change anything before going live.',
  },
  {
    nama: 'Rina Kusuma',
    isi: 'Laporannya bisa langsung diunduh dan formatnya sudah sesuai kebutuhan pembukuan. Itu yang paling menghemat waktu kami.',
  },
  {
    nama: 'Tobias Lange',
    isi: 'Support answered on the same day and actually understood the problem. That alone put them ahead of the last vendor we used.',
  },
  {
    nama: 'Putri Handayani',
    isi: 'Tampilannya bersih dan gampang dipelajari. Staf baru bisa langsung pakai tanpa pelatihan panjang.',
  },
];

const ULASAN_BAWAH: Ulasan[] = [
  {
    nama: 'Sofia Marchetti',
    isi: 'We run three branches on it now. Permissions per role were the thing we needed most and it handles that cleanly.',
  },
  {
    nama: 'Bagus Prasetyo',
    isi: 'Harga jelas dari awal, tidak ada biaya tersembunyi. Migrasi datanya juga dibantu sampai tuntas.',
  },
  {
    nama: 'Hannah Weiss',
    isi: 'It is quick even on our older office machines, which mattered more than we expected when we compared options.',
  },
  {
    nama: 'Andi Wijaya',
    isi: 'Yang paling membantu itu riwayat perubahannya. Kalau ada data keliru, kami tahu siapa dan kapan mengubahnya.',
  },
  {
    nama: 'Liam Fraser',
    isi: 'Straightforward tool that does what it says. We evaluated four options and this was the only one the team actually kept using.',
  },
];

export const ULASAN_SEMUA: Ulasan[] = [...ULASAN_ATAS, ...ULASAN_BAWAH];

export interface UlasanBerjalanProps {
  /** Ganti dengan ulasan Anda sendiri. */
  atas?: Ulasan[];
  bawah?: Ulasan[];
  judul?: ReactNode;
  label?: string;
}

function KartuUlasan({ ulasan }: { ulasan: Ulasan }) {
  return (
    <article className="ulasan-berjalan__kartu">
      <p className="ulasan-berjalan__isi">{ulasan.isi}</p>
      <div className="ulasan-berjalan__kaki">
        <span className="ulasan-berjalan__nama">{ulasan.nama}</span>
        <span className="ulasan-berjalan__bintang" aria-label="5 dari 5">
          {Array.from({ length: 5 }, (_, i) => (
            <Star key={i} className="ulasan-berjalan__bintang-ikon" aria-hidden="true" />
          ))}
        </span>
      </div>
    </article>
  );
}

export function UlasanBerjalan({
  atas = ULASAN_ATAS,
  bawah = ULASAN_BAWAH,
  judul,
  label = 'Ulasan pelanggan',
}: UlasanBerjalanProps = {}) {
  return (
    <section className="ulasan-berjalan" aria-label={label}>
      <h2 className="seksi-judul">
        {judul ?? (
          <>
            <span className="ulasan-berjalan__garis">Dipercaya</span> ratusan tim
          </>
        )}
      </h2>

      <PitaBerjalan
        className="ulasan-berjalan__pita"
        atas={atas.map((u) => <KartuUlasan key={u.nama} ulasan={u} />)}
        bawah={bawah.map((u) => <KartuUlasan key={u.nama} ulasan={u} />)}
      />
    </section>
  );
}

export default UlasanBerjalan;
