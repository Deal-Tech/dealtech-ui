import { PANJANG_MIN_SANDI, kekuatanSandi } from '@/lib/sandi';

/** Batang kekuatan kata sandi. */
export default function MeterSandi({ sandi }: { sandi: string }) {
  const { nilai, label } = kekuatanSandi(sandi);
  return (
    <div className="login-kekuatan" data-nilai={sandi ? nilai : 0}>
      <span className="login-kekuatan__batang" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
      <span className="login-kekuatan__label">
        {sandi ? label : `Minimal ${PANJANG_MIN_SANDI} karakter`}
      </span>
    </div>
  );
}
