import { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

import { BadgeInfo } from '@/components/ui/badgeinfo/BadgeInfo';
import { Button } from '@/components/ui/button/Button';
import { Checkbox } from '@/components/ui/checkbox/Checkbox';
import { InputText } from '@/components/ui/inputtext/InputText';
import { TombolTuang, type StatusTuang } from '@/components/ui/tombol-tuang/TombolTuang';
import { ApiError } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import GoogleMark from './GoogleMark';
import LoginArt from './LoginArt';
import './login.css';

import panelDealtech from '@/assets/panel-dealtechui.png';

const TUJUAN_BAWAAN = '/dashboard';

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

  const tujuan = jalurAman((lokasi.state as { dari?: unknown } | null)?.dari);
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
    <div className="login-page">
      <div className="login-shell">
        <div className="login-form-panel">
          <div className="login-brand">
            <span
              role="img"
              aria-label="ui.dealtech | Deal Tech"
              className="login-brand__logo"
              style={{
                maskImage: `url(${panelDealtech})`,
                WebkitMaskImage: `url(${panelDealtech})`,
              }}
            />
          </div>

          <BadgeInfo variant="info" icon={false} className="login-sambutan">
            Selamat datang kembali! Pilih metode untuk masuk:
          </BadgeInfo>

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
              <a className="login-forgot" href="#">
                Lupa kata sandi?
              </a>
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

          <p className="login-footnote">UI Dealtech Admin - Dikembangkan tech.mudahdeal.com</p>
        </div>

        <div className="login-art-panel">
          <LoginArt />
          <h2 className="login-art-title">Semua kendali dalam satu panel</h2>
          <p className="login-art-text">
            Data, laporan, dan pengaturan tersaji rapi di satu dashboard yang bisa diubah sesuai
            kebutuhan.
          </p>
          <div className="login-dots" aria-hidden="true">
            <span />
            <span />
            <span className="is-active" />
          </div>
        </div>
      </div>
    </div>
  );
}
