import LogoShape from '@/components/ui/logo-shape/LogoShape';
import PetaTitik from '@/components/ui/peta-titik/PetaTitik';

export default function LoginBg() {
  return (
    <>
      {/* redupSudut menyingkir dari lambang di pojok kanan bawah — tanpa itu
          titik peta dan lambangnya saling berebut di bidang yang sama. */}
      <PetaTitik redupSudut />
      <LogoShape revealOnScroll={false} />
    </>
  );
}
