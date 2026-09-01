import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Boxes, Component, LayoutDashboard, Sparkles, Users } from 'lucide-react';

import { StatCard } from '@/components/ui/stat-card/StatCard';
import { WelcomeCardV2 } from '@/components/ui/welcome-card-v2/WelcomeCardV2';
import { resolveIcon } from '@/layout/ikon-menu';
import { menu, saringMenu } from '@/layout/menu';
import './dashboard.css';

/**
 * Angka contoh.
 *
 * Starter ini sengaja tidak memanggil backend — ganti blok ini dengan data
 * asli Anda (mis. lewat `src/lib/api.ts`) saat modulnya sudah siap.
 */
const RINGKASAN = [
  { kunci: 'komponen', ikon: Component, judul: 'Komponen UI', nilai: '57 elemen', helper: null },
  { kunci: 'layout', ikon: LayoutDashboard, judul: 'Layout', nilai: '1 layout', helper: null },
  { kunci: 'token', ikon: Boxes, judul: 'Token Tema', nilai: '60+ variabel', helper: null },
  { kunci: 'pengguna', ikon: Users, judul: 'Pengguna', nilai: '1 akun', helper: 'mode demo' },
] as const;

/**
 * Akses cepat: satu tombol per halaman yang ada di menu.
 *
 * Sumbernya `saringMenu` — persis yang dipakai sidebar, bukan daftar kedua yang
 * ditulis tangan. Daftar kedua akan menua diam-diam: menu baru muncul di
 * sidebar tapi tidak di sini.
 */
function AksesCepat() {
  const tujuan = useMemo(() => {
    const m = saringMenu(menu, undefined);
    return [...m.main, ...m.groups.flatMap((g) => g.items), ...m.others].filter(
      (i) => i.href !== '/dashboard' && !i.external,
    );
  }, []);

  if (tujuan.length === 0) return null;

  return (
    <section className="akses-cepat" aria-label="Akses cepat">
      <div className="akses-cepat__isi">
        <span className="akses-cepat__badge">
          <Sparkles className="akses-cepat__badge-ikon" aria-hidden="true" />
          Akses Cepat
        </span>
        <h2 className="akses-cepat__judul">Langsung Ke Halaman Yang Sering Dibuka</h2>
      </div>

      <div className="akses-cepat__tombol">
        {tujuan.map((item) => {
          const Ikon = resolveIcon(item.icon);
          return (
            <Link key={item.key} className="akses-cepat__butir" to={item.href}>
              <Ikon className="akses-cepat__ikon" aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default function DashboardPage() {
  return (
    <div className="dashboard space-y-6">
      {/* Tanpa PageTitle — dashboard langsung dibuka kartu sambutan ini. */}
      <WelcomeCardV2
        name="Administrator"
        badge="DealTech UI 2.0 Next"
        aksiLabel="Lihat Semua Element"
        aksiKe="/dashboard/element"
        aksiIkon={Component}
      />

      <div className="dashboard__stat">
        {RINGKASAN.map(({ kunci, ikon, judul, nilai, helper }) => (
          <StatCard key={kunci} icon={ikon} title={judul} value={nilai} helper={helper} />
        ))}
      </div>

      <AksesCepat />
    </div>
  );
}
