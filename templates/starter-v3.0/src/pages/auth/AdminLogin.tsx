import { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';

import { BadgeInfo } from '@/components/ui/badgeinfo/BadgeInfo';
import { Button } from '@/components/ui/button/Button';
import { Checkbox } from '@/components/ui/checkbox/Checkbox';
import { InputText } from '@/components/ui/inputtext/InputText';
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
  const [processing, setProcessing] = useState(false);
  const [galat, setGalat] = useState('');

  const tujuan = jalurAman((lokasi.state as { dari?: unknown } | null)?.dari);

  useEffect(() => () => setPassword(''), []);

  if (!memuat && pengguna) return <Navigate to={tujuan} replace />;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (processing) return;

    setProcessing(true);
    setGalat('');
    try {
      await masuk(email.trim(), password, ingat);
      setPassword('');
      navigate(tujuan, { replace: true });
    } catch (e) {
      // Pesannya disamakan supaya tidak jadi alat enumerasi akun.
      setGalat(e instanceof ApiError ? e.message : 'Tidak dapat masuk. Coba beberapa saat lagi.');
      setPassword('');
    } finally {
      setProcessing(false);
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

          <h1 className="login-title">Masuk ke Akun Anda</h1>
          <p className="login-subtitle">Selamat datang kembali! Pilih metode untuk masuk:</p>

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

            <Button type="submit" icon={LogIn} loading={processing} className="login-submit">
              {processing ? 'Memproses…' : 'Masuk'}
            </Button>
          </form>

          <p className="login-footnote">
            Copyright &copy; 2021 &ndash; {new Date().getFullYear()} DealTech &ndash; PT MUDAHDEAL
            DIGITAL GRUP
          </p>
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
