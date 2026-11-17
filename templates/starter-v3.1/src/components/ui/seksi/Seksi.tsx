import type { ReactNode } from 'react';

import './seksi.css';

export interface SeksiProps {
  title?: ReactNode;
  /** Tombol / menu di kanan kepala. */
  action?: ReactNode;
  /** Tanpa padding badan, mis. isi tabel. */
  rapat?: boolean;
  className?: string;
  bodyClassName?: string;
  children?: ReactNode;
}

/** Kartu seksi `app-section-card` dengan kepala opsional. */
export function Seksi({
  title,
  action,
  rapat = false,
  className = '',
  bodyClassName = '',
  children,
}: SeksiProps) {
  const adaKepala = !!(title || action);
  return (
    <section className={`app-section-card seksi ${className}`}>
      {adaKepala ? (
        <div className="seksi__kepala">
          <div className="seksi__teks">
            {title ? <h2 className="seksi__judul">{title}</h2> : null}
          </div>
          {action ? <div className="seksi__aksi">{action}</div> : null}
        </div>
      ) : null}
      {children !== undefined && children !== null ? (
        <div className={`${rapat ? '' : 'app-section-body'} ${bodyClassName}`}>{children}</div>
      ) : null}
    </section>
  );
}

export default Seksi;
