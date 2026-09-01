import HexBackdrop from '@/components/ui/hex-backdrop/HexBackdrop';
import LogoShape from '@/components/ui/logo-shape/LogoShape';

export default function LoginBg() {
  return (
    <>
      <HexBackdrop />
      {/* Halaman masuk tidak di-scroll — tanpa ini lambangnya tidak pernah tampil. */}
      <LogoShape revealOnScroll={false} />
    </>
  );
}
