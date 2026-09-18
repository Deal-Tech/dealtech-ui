import type { ReactNode } from 'react';

import './pita-berjalan.css';

export interface PitaBerjalanProps {
  atas: ReactNode[];
  bawah: ReactNode[];
  className?: string;
}

export function PitaBerjalan({ atas, bawah, className = '' }: PitaBerjalanProps) {
  return (
    <div className={`pita-berjalan ${className}`}>
      <div className="pita-berjalan__baris pita-berjalan__baris--kiri">
        {[...atas, ...atas].map((isi, i) => (
          <div className="pita-berjalan__sel" key={i}>
            {isi}
          </div>
        ))}
      </div>
      <div className="pita-berjalan__baris pita-berjalan__baris--kanan">
        {[...bawah, ...bawah].map((isi, i) => (
          <div className="pita-berjalan__sel" key={i}>
            {isi}
          </div>
        ))}
      </div>
    </div>
  );
}

export default PitaBerjalan;
