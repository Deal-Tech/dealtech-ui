import { useEffect } from 'react';

import MaintenanceArt from './MaintenanceArt';
import './maintenance.css';

const JUDUL_TAB = 'Sedang Pemeliharaan — DealTech UI 3.0';

/** Halaman pemeliharaan sistem. */
export default function Maintenance() {
  useEffect(() => {
    const lama = document.title;
    document.title = JUDUL_TAB;
    return () => {
      document.title = lama;
    };
  }, []);

  return (
    <main className="maintenance">
      <div className="maintenance__isi">
        <MaintenanceArt />
        <h1 className="maintenance__judul">Sistem Sedang Dalam Pemeliharaan</h1>
        <p className="maintenance__teks">
          Kami sedang memperbaiki dan mengoptimalkan sistem agar lebih cepat dan stabil. Silakan
          kembali beberapa saat lagi.
        </p>
      </div>
    </main>
  );
}
