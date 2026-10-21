import { useEffect, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';

import { BadgeInfo } from '@/components/ui/badgeinfo/BadgeInfo';
import { Button } from '@/components/ui/button/Button';
import { Checkbox } from '@/components/ui/checkbox/Checkbox';
import { InputText } from '@/components/ui/inputtext/InputText';
import { TombolTuang, type StatusTuang } from '@/components/ui/tombol-tuang/TombolTuang';
import { ApiError } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import GoogleMark from './GoogleMark';
import KerangkaMasuk from './KerangkaMasuk';

const TUJUAN_BAWAAN = '/dashboard';

interface StateMasuk {
  dari?: unknown;
  // Dari halaman atur ulang
  sandiDiatur?: boolean;
}

function jalurAman(nilai: unknown): string {
  if (typeof nilai !== 'string') return TUJUAN_BAWAAN;
  if (!nilai.startsWith('/')) return TUJUAN_BAWAAN;
  if (nilai.startsWith('//') || nilai.startsWith('/\\')) return TUJUAN_BAWAAN;
  return nilai;
}

export default function AdminLogin() {
  const navigate = useNavigate();
  const lokasi = useLocation();
  const { pengguna, memuat, masuk } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [ingat, setIngat] = useState(false);
  const [status, setStatus] = useState<StatusTuang>('idle');
  const [galat, setGalat] = useState('');

  const state = lokasi.state as StateMasuk | null;
  const tujuan = jalurAman(state?.dari);
  // Animasi masuk masih berjalan
  const sedangMasuk = status === 'pending' || status === 'success';

  useEffect(() => () => setPassword(''), []);

  if (!memuat && pengguna && !sedangMasuk) return <Navigate to={tujuan} replace />;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (sedangMasuk) return;

    setStatus('pending');
    setGalat('');
    try {
      await masuk(email.trim(), password, ingat);
      setPassword('');
      setStatus('success');
    } catch (e) {
      // Pesannya disamakan supaya tidak jadi alat enumerasi akun.
      setGalat(e instanceof ApiError ? e.message : 'Tidak dapat masuk. Coba beberapa saat lagi.');
      setPassword('');
      setStatus('error');
    }
  };

  return (
    <KerangkaMasuk
      judul="Semua kendali dalam satu panel"
      teks="Data, laporan, dan pengaturan tersaji rapi di satu dashboard yang bisa diubah sesuai kebutuhan."
    >
      {state?.sandiDiatur ? (
        <BadgeInfo variant="success" className="login-sambutan">
          Kata sandi baru tersimpan. Silakan masuk dengan kata sandi itu.
        </BadgeInfo>
      ) : (
        <BadgeInfo variant="info" icon={false} className="login-sambutan">
          Selamat datang kembali! Pilih metode untuk masuk:
        </BadgeInfo>
      )}

      <Button variant="ghost" className="login-google">
        <GoogleMark />
        Masuk dengan Google
      </Button>

      <div className="login-divider">atau lanjut dengan email</div>

      <form className="login-form" onSubmit={submit}>
        <div className="login-field login-field--email">
          <InputText
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            autoComplete="username"
            autoCapitalize="none"
            spellCheck={false}
            required
          />
        </div>

        <div className="login-field login-field--password">
          <InputText
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Kata sandi"
            autoComplete="current-password"
            required
          />
        </div>

        <div className="login-baris-bantu">
          <Checkbox
            label="Ingat saya"
            name="ingat"
            checked={ingat}
            onChange={(e) => setIngat(e.target.checked)}
          />
          <Link className="login-forgot" to="/lupa-sandi" state={{ email: email.trim() }}>
            Lupa kata sandi?
          </Link>
        </div>

        {galat ? <BadgeInfo variant="error">{galat}</BadgeInfo> : null}

        <TombolTuang
          type="submit"
          ikon="kunci"
          status={status}
          className="login-submit"
          samarkan
          teksBerhasil="Authorized"
          teksGagal="Unauthorized"
          onSelesai={(berhasil) => berhasil && navigate(tujuan, { replace: true })}
        >
          Masuk
        </TombolTuang>
      </form>
    </KerangkaMasuk>
  );
}
