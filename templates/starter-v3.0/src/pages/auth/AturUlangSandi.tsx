import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import { BadgeInfo } from '@/components/ui/badgeinfo/BadgeInfo';
import { Button } from '@/components/ui/button/Button';
import { InputText } from '@/components/ui/inputtext/InputText';
import { TombolTuang, type StatusTuang } from '@/components/ui/tombol-tuang/TombolTuang';
import { ApiError } from '@/lib/api';
import { PANJANG_MIN_SANDI, kekuatanSandi, periksaSandi } from '@/lib/sandi';
import { aturUlangSandi } from '@/services/auth';
import KerangkaMasuk, { TautanKembali } from './KerangkaMasuk';

const JUDUL = 'Kata sandi baru, akun tetap aman';
const TEKS = 'Pilih frasa panjang yang mudah Anda ingat tapi sulit ditebak orang lain.';

interface Galat {
  baru?: string;
  ulang?: string;
  umum?: string;
}

function MeterKekuatan({ sandi }: { sandi: string }) {
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

function TautanRusak() {
  const navigate = useNavigate();
  return (
    <KerangkaMasuk judul={JUDUL} teks={TEKS} titik={1}>
      <BadgeInfo variant="error" className="login-sambutan">
        Tautan atur ulang tidak lengkap atau sudah tidak berlaku. Minta tautan baru untuk
        melanjutkan.
      </BadgeInfo>
      <Button className="login-submit" onClick={() => navigate('/lupa-sandi')}>
        Minta Tautan Baru
      </Button>
      <div className="login-tautan-bawah">
        <TautanKembali />
      </div>
    </KerangkaMasuk>
  );
}

export default function AturUlangSandi() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get('token') ?? '';
  const email = params.get('email') ?? '';

  const [baru, setBaru] = useState('');
  const [ulang, setUlang] = useState('');
  const [galat, setGalat] = useState<Galat>({});
  const [status, setStatus] = useState<StatusTuang>('idle');
  const sibuk = status === 'pending' || status === 'success';

  useEffect(
    () => () => {
      setBaru('');
      setUlang('');
    },
    [],
  );

  if (!token || !email) return <TautanRusak />;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sibuk) return;

    const g: Galat = {};
    const cek = periksaSandi(baru);
    if (cek) g.baru = cek;
    else if (baru !== ulang) g.ulang = 'Konfirmasi tidak sama.';
    setGalat(g);
    if (Object.keys(g).length > 0) return;

    setStatus('pending');
    try {
      await aturUlangSandi({ token, email, sandi: baru, ulang });
      setBaru('');
      setUlang('');
      setStatus('success');
    } catch (err) {
      const pesan =
        err instanceof ApiError ? err.message : 'Kata sandi belum tersimpan. Coba beberapa saat lagi.';
      const galatSandi = err instanceof ApiError ? err.fields?.password : undefined;
      setGalat(galatSandi ? { baru: galatSandi } : { umum: pesan });
      setStatus('error');
    }
  };

  return (
    <KerangkaMasuk judul={JUDUL} teks={TEKS} titik={1}>
      <BadgeInfo variant="info" icon={false} className="login-sambutan">
        Buat kata sandi baru untuk <strong>{email}</strong>.
      </BadgeInfo>

      <form className="login-form" onSubmit={submit}>
        {/* Bantu pengelola sandi */}
        <input type="email" name="email" value={email} autoComplete="username" readOnly hidden />

        <div className="login-field login-field--password">
          <InputText
            name="password"
            type="password"
            value={baru}
            onChange={(e) => {
              setBaru(e.target.value);
              setGalat((g) => ({ ...g, baru: undefined, umum: undefined }));
            }}
            placeholder="Kata sandi baru"
            autoComplete="new-password"
            error={galat.baru}
            disabled={sibuk}
            autoFocus
            required
          />
        </div>
        <MeterKekuatan sandi={baru} />

        <div className="login-field login-field--password">
          <InputText
            name="password_confirmation"
            type="password"
            value={ulang}
            onChange={(e) => {
              setUlang(e.target.value);
              setGalat((g) => ({ ...g, ulang: undefined }));
            }}
            placeholder="Ulangi kata sandi baru"
            autoComplete="new-password"
            error={galat.ulang}
            disabled={sibuk}
            required
          />
        </div>

        {galat.umum ? (
          <BadgeInfo variant="error">
            {galat.umum}{' '}
            <Link className="login-forgot" to="/lupa-sandi">
              Minta tautan baru
            </Link>
          </BadgeInfo>
        ) : null}

        <TombolTuang
          type="submit"
          ikon="kunci"
          status={status}
          className="login-submit"
          teksBerhasil="Tersimpan"
          onTuntas={() => navigate('/login', { replace: true, state: { sandiDiatur: true } })}
        >
          Simpan Kata Sandi
        </TombolTuang>
      </form>

      <div className="login-tautan-bawah">
        <TautanKembali />
      </div>
    </KerangkaMasuk>
  );
}
