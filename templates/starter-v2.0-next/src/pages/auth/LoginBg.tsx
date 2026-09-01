import HexBackdrop from '@/components/ui/hex-backdrop/HexBackdrop';
import LogoShape from '@/components/ui/logo-shape/LogoShape';

/**
 * Latar halaman masuk = latar section 1 DealTech. Sengaja komponen yang sama,
 * supaya seluruh produk DealTech memberi pengguna layar masuk yang seragam.
 */
export default function LoginBg() {
  return (
    <>
      <HexBackdrop />
      {/* Halaman masuk tidak di-scroll — tanpa ini lambangnya tidak pernah tampil. */}
      <LogoShape revealOnScroll={false} />
    </>
  );
}
