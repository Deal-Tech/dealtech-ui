import type { ReactNode } from 'react';

// Pasangan label-isi detail produk
export function Keterangan({ nama, children }: { nama: string; children: ReactNode }) {
  return (
    <div>
      <span className="produk-detail__label">{nama}</span>
      {children}
    </div>
  );
}

export default Keterangan;
