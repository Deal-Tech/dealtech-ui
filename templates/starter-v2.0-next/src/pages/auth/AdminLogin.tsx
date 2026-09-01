import { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';

import { Button } from '@/components/ui/button/Button';
import { InputText } from '@/components/ui/inputtext/InputText';
import { ApiError } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import LoginBg from './LoginBg';
import './login.css';

import dealhost from '@/assets/dealhost.png';

const TUJUAN_BAWAAN = '/dashboard';

/**
 * Cegah open redirect: hanya terima jalur internal.
 *
 * `//evil.com` dan `/\evil.com` diperlakukan browser sebagai URL protocol-relative
 * ke host lain, jadi keduanya ditolak walau diawali "/". Nilai lain apa pun
 * (URL absolut, `javascript:`, dsb.) juga jatuh ke tujuan bawaan.
 */
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
      await masuk(email.trim(), password);
      setPassword('');
      navigate(tujuan, { replace: true });
    } catch (e) {
      // Pesan dari server sengaja tidak membedakan "email tidak ada" vs "sandi salah"
      // supaya tidak jadi alat enumerasi akun.
      setGalat(e instanceof ApiError ? e.message : 'Tidak dapat masuk. Coba beberapa saat lagi.');
      setPassword('');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="login-page flex min-h-screen items-center justify-center px-4">
      <LoginBg />

      <div className="relative z-10 flex w-full max-w-[30rem] flex-col items-center">
        <form onSubmit={submit} className="login-card w-full space-y-3 p-6">
          <div className="login-brand">
            <span className="login-brand__name">
              DealTech UI <strong>Admin</strong>
            </span>
          </div>

          {/* Pakai komponen InputText, bukan <input> mentah — supaya gaya field,
              cincin fokus, dan tombol lihat-sandi ikut satu sumber dengan
              seluruh form lain di aplikasi. */}
          <InputText
            label="Email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="username"
            autoCapitalize="none"
            spellCheck={false}
            required
          />

          <InputText
            label="Kata sandi"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Kata sandi"
            autoComplete="current-password"
            required
          />

          {galat ? (
            <p className="login-error" role="alert">
              {galat}
            </p>
          ) : null}

          {/* Komponen Button, bukan <button> mentah — kalau tidak, tombol ini
              berhenti ikut perbaikan design system seperti yang sudah pernah
              terjadi pada isian di halaman ini. */}
          <Button
            type="submit"
            icon={LogIn}
            loading={processing}
            className="login-btn"
          >
            {processing ? 'Memproses…' : 'Masuk'}
          </Button>

        </form>

        <p className="login-footnote mt-5 text-center text-xs">
          &copy; {new Date().getFullYear()} DealTech UI
          <span className="login-footnote__powered mt-1">
            Panel Admin Di Tenagai serta Di Suport
            {/* noopener+noreferrer wajib: tanpa itu halaman tujuan bisa menyetir tab ini. */}
            <a
              href="https://tech.mudahdeal.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="login-footnote__tautan"
            >
              {/* Disalin ke src/assets, bukan ditarik dari CDN DealTech:
                  CSP produksi (cspAplikasi di backend) cuma mengizinkan
                  img-src 'self', jadi versi CDN-nya tidak pernah tampil di
                  pemasangan sungguhan — cuma di dev. */}
              <img
                src={dealhost}
                alt="DealHost"
                className="login-footnote__logo"
                loading="lazy"
              />
            </a>
          </span>
        </p>
      </div>
    </div>
  );
}
