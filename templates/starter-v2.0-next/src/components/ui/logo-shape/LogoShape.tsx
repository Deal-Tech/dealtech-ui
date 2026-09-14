import { useEffect, useRef, useState } from 'react';

import './logo-shape.css';

/*
 * Lambang DealTech UI — tiga keping luar dan tiga keping dalam yang saling
 * mengunci jadi satu heksagon berputar.
 *
 * Bentuknya tidak ditulis sebagai path buram, tapi dihitung dari lima tetapan
 * di bawah: semua kepingnya turunan dari satu heksagon, jadi simetri tiga
 * sisinya dijamin tepat dan proporsinya bisa disetel tanpa menggambar ulang.
 *
 * Tiap keping cuma garis patah bertitik-sudut satu. Ketebalan dan sudut
 * tumpulnya datang dari stroke: `stroke-linecap` dan `stroke-linejoin` yang
 * bulat membentuk ujung dan sikunya — itu sebabnya path-nya sependek ini.
 */

/* Jari-jari heksagon luar. Semua ukuran lain kelipatan angka ini, jadi nilainya
   sendiri tidak penting — yang penting perbandingannya. */
const JARI = 100;

/* Tebal batang, dalam satuan yang sama. */
const TEBAL = 30;

/* Heksagon bagian dalam sebesar 62% yang luar. Inilah yang mengatur lebar celah
   diagonal antar keping: makin kecil, makin lebar celahnya dan makin besar
   lubang tengahnya. */
const SKALA_DALAM = 0.62;

/* Panjang dua lengan tiap keping, sebagai pecahan dari satu sisi heksagon.
   Sengaja tidak sama panjang — ketimpangan inilah yang membuat lambangnya
   terbaca berputar, bukan diam simetris. */
const LENGAN_LUAR = [0.55, 0.82];
const LENGAN_DALAM = [0.58, 0.9];

/* Simpul heksagon bertepi datar: sudut 0, 60, ... 300 derajat. Koordinat layar,
   jadi sumbu y menunjuk ke bawah. */
function simpul(jari: number) {
  return Array.from({ length: 6 }, (_, k) => {
    const sudut = (Math.PI / 180) * 60 * k;
    return { x: jari * Math.cos(sudut), y: jari * Math.sin(sudut) };
  });
}

/* Satu keping: dari sebagian sisi sebelumnya, membelok di simpul ke-k, lalu
   turun sebagian sisi berikutnya. */
function keping(titik: ReturnType<typeof simpul>, k: number, [a, b]: number[]) {
  const lalu = titik[(k + 5) % 6];
  const kini = titik[k];
  const nanti = titik[(k + 1) % 6];
  const geser = (ke: { x: number; y: number }, f: number) =>
    `${(kini.x + f * (ke.x - kini.x)).toFixed(2)} ${(kini.y + f * (ke.y - kini.y)).toFixed(2)}`;

  return `M ${geser(lalu, a)} L ${kini.x.toFixed(2)} ${kini.y.toFixed(2)} L ${geser(nanti, b)}`;
}

const LUAR = simpul(JARI);
const DALAM = simpul(JARI * SKALA_DALAM);

/* Keping luar duduk di simpul genap, keping dalam di simpul ganjil — selang
   seling itulah yang menganyam keduanya. */
const LAMBANG = [
  ...[0, 2, 4].map((k) => keping(LUAR, k, LENGAN_LUAR)),
  ...[1, 3, 5].map((k) => keping(DALAM, k, LENGAN_DALAM)),
].join(' ');

/* Kotak pandang dihitung dari simpul terluar ditambah separuh tebal batang,
   supaya ujung bulatnya tidak terpotong tepi SVG. */
const SISI = JARI + TEBAL / 2;
const TINGGI = JARI * Math.sin(Math.PI / 3) + TEBAL / 2;
const KOTAK = `${-SISI} ${-TINGGI} ${SISI * 2} ${TINGGI * 2}`;

interface Props {
  className?: string;
  revealOnScroll?: boolean;
}

export default function LogoShape({ className, revealOnScroll = true }: Props) {
  const ref = useRef<SVGSVGElement>(null);
  const [tampil, setTampil] = useState(!revealOnScroll);

  useEffect(() => {
    if (!revealOnScroll) return;

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
      viewBox={KOTAK}
      fill="none"
      stroke="currentColor"
      strokeWidth={TEBAL}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={LAMBANG} />
    </svg>
  );
}
