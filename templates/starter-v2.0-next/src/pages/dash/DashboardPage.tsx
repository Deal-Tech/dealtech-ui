import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Boxes, Component, LayoutDashboard, Sparkles, Users } from 'lucide-react';

import { StatCard } from '@/components/ui/stat-card/StatCard';
import { WelcomeCardV2 } from '@/components/ui/welcome-card-v2/WelcomeCardV2';
import { resolveIcon } from '@/layout/ikon-menu';
import { menu, saringMenu } from '@/layout/menu';
import './dashboard.css';

const RINGKASAN = [
  { kunci: 'komponen', ikon: Component, judul: 'Komponen UI', nilai: '55 elemen', helper: null },
  { kunci: 'layout', ikon: LayoutDashboard, judul: 'Layout', nilai: '1 layout', helper: null },
  { kunci: 'token', ikon: Boxes, judul: 'Token Tema', nilai: '60+ variabel', helper: null },
  { kunci: 'pengguna', ikon: Users, judul: 'Pengguna', nilai: '1 akun', helper: 'mode demo' },
] as const;

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
      {/* Aksi dibiarkan bawaan: Hubungi Pengembang. */}
      <WelcomeCardV2 name="Administrator" badge="DealTech UI 2.0 Next" />

      <div className="dashboard__stat">
        {RINGKASAN.map(({ kunci, ikon, judul, nilai, helper }) => (
          <StatCard key={kunci} icon={ikon} title={judul} value={nilai} helper={helper} />
        ))}
      </div>

      <AksesCepat />
    </div>
  );
}
