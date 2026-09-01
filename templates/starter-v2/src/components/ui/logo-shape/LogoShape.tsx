import { useEffect, useRef, useState } from 'react';

import './logo-shape.css';

const LAMBANG =
  'M156.4 0.3L140.9 4.7L125.1 14.1L14.8 124.8A46.22 46.22 0 0 0 32.2 202.8A51.75 51.75 0 0 0 90.1 186.2L141.9 134.9A21.39 21.39 0 0 1 169 139L254.3 225.6A13.62 13.62 0 0 1 237 244.1A27.54 27.54 0 0 1 226.9 235.1L183.1 191.8L176 188.8L167.6 189.6A16.92 16.92 0 0 0 163.8 220.1L210.2 266.8A12.69 12.69 0 1 1 188.9 281.2L139.1 231.9A16.98 16.98 0 0 0 119.8 260.1L169.9 310.1A46.5 46.5 0 0 0 245.1 280A3.11 3.11 0 0 1 249.7 276.9A46.3 46.3 0 0 0 269.3 192.7L238.2 161.8L185.2 108.8L172.3 101.5L157 97.8L143.5 98.3L127.9 103.8L118.2 111.1L61.2 168.2L53.1 172.2L43.6 171.5A13.43 13.43 0 0 1 40.8 146.9L146.8 40.7L158.3 35.2A34.93 34.93 0 0 1 193.1 47.9L278.2 133.8L299.9 155.1A17.16 17.16 0 0 0 328.4 138.7L324.9 132.2L281.5 88.5L222.9 30.1L204.5 12.5A63.57 63.57 0 0 0 157.2 0.3L156.4 0.3Z';

interface Props {
  className?: string;
  /** Halaman yang tidak di-scroll (mis. login) wajib false, kalau tidak lambangnya tidak pernah muncul. */
  revealOnScroll?: boolean;
}

export default function LogoShape({ className, revealOnScroll = true }: Props) {
  const ref = useRef<SVGSVGElement>(null);
  const [tampil, setTampil] = useState(!revealOnScroll);

  useEffect(() => {
    if (!revealOnScroll) return;

    // Yang diamati induknya, bukan SVG-nya: lambang menempel di tepi bawah dan
    // keluar layar jauh lebih dulu daripada section-nya.
    const induk = ref.current?.parentElement;
    if (!induk) return;

    const pengamat = new IntersectionObserver(
      ([entri]) => setTampil(entri.isIntersecting),
      { threshold: 0.1 },
    );
    pengamat.observe(induk);
    return () => pengamat.disconnect();
  }, [revealOnScroll]);

  return (
    <svg
      ref={ref}
      className={`logo-shape${tampil ? ' is-visible' : ''}${className ? ` ${className}` : ''}`}
      viewBox="0 0 329 320"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d={LAMBANG} />
    </svg>
  );
}
