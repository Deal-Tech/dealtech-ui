import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { BadgeInfo } from '@/components/ui/badgeinfo/BadgeInfo';
import { Button } from '@/components/ui/button/Button';
import { InputText } from '@/components/ui/inputtext/InputText';
import { TombolTuang, type StatusTuang } from '@/components/ui/tombol-tuang/TombolTuang';
import { ApiError } from '@/lib/api';
import { MODE_DEMO } from '@/lib/demo';
import { mintaTautanSandi } from '@/services/auth';
import KerangkaMasuk, { TautanKembali } from './KerangkaMasuk';

const POLA_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const JEDA_KIRIM_ULANG_DETIK = 60;

// Tetap dianggap terkirim, cegah enumerasi
const STATUS_SAMAR = new Set([404, 422]);

function useHitungMundur() {
  const [sisa, setSisa] = useState(0);

  useEffect(() => {
    if (sisa <= 0) return undefined;
    const detak = window.setTimeout(() => setSisa((s) => s - 1), 1000);
    return () => window.clearTimeout(detak);
  }, [sisa]);

  return { sisa, mulai: () => setSisa(JEDA_KIRIM_ULANG_DETIK) };
}

export default function LupaSandi() {
  const navigate = useNavigate();
  const lokasi = useLocation();
  const emailAwal = (lokasi.state as { email?: unknown } | null)?.email;

  const [email, setEmail] = useState(typeof emailAwal === 'string' ? emailAwal : '');
  const [galat, setGalat] = useState('');
  const [status, setStatus] = useState<StatusTuang>('idle');
  const [terkirim, setTerkirim] = useState(false);
  const hitung = useHitungMundur();

  const kirim = async () => {
    const tujuan = email.trim().toLowerCase();
    if (!POLA_EMAIL.test(tujuan)) {
      setGalat('Format email belum benar.');
      return;
    }

    setGalat('');
    setStatus('pending');
    try {
      await mintaTautanSandi(tujuan);
      setStatus('success');
    } catch (e) {
      if (e instanceof ApiError && STATUS_SAMAR.has(e.status)) {
        setStatus('success');
        return;
      }
      setGalat(e instanceof ApiError ? e.message : 'Tautan belum terkirim. Coba beberapa saat lagi.');
      setStatus('error');
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'pending' || status === 'success') return;
    void kirim();
  };

  const keTerkirim = () => {
    setTerkirim(true);
    setStatus('idle');
    hitung.mulai();
  };

  const gantiEmail = () => {
    setTerkirim(false);
    setStatus('idle');
    setGalat('');
  };

  const bukaTautanDemo = () => {
    const kueri = new URLSearchParams({ token: 'demo', email: email.trim().toLowerCase() });
    navigate(`/atur-ulang-sandi?${kueri.toString()}`);
  };

  return (
    <KerangkaMasuk
      judul="Akses kembali dalam hitungan menit"
      teks="Tautan aman dikirim ke email Anda. Buka tautannya, buat kata sandi baru, lalu masuk seperti biasa."
      titik={0}
    >
      {terkirim ? (
        <>
          <BadgeInfo variant="success" className="login-sambutan">
            Kalau <strong>{email.trim().toLowerCase()}</strong> terdaftar, tautan untuk membuat kata
            sandi baru sudah kami kirim. Cek kotak masuk atau folder spam.
          </BadgeInfo>

          <div className="login-form">
            {galat ? <BadgeInfo variant="error">{galat}</BadgeInfo> : null}

            {MODE_DEMO ? (
              <Button className="login-submit" onClick={bukaTautanDemo}>
                Buka Tautan (Mode Demo)
              </Button>
            ) : null}

            <TombolTuang
              ikon="kirim"
              variant="ghost"
              status={status}
              className="login-submit"
              disabled={hitung.sisa > 0}
              teksBerhasil="Terkirim"
              onClick={() => void kirim()}
              onSelesai={(berhasil) => berhasil && hitung.mulai()}
            >
              {hitung.sisa > 0 ? `Kirim ulang dalam ${hitung.sisa} detik` : 'Kirim Ulang Tautan'}
            </TombolTuang>
          </div>

          <div className="login-tautan-bawah">
            <TautanKembali />
            <button type="button" className="login-forgot" onClick={gantiEmail}>
              Pakai email lain
            </button>
          </div>
        </>
      ) : (
        <>
          <BadgeInfo variant="info" icon={false} className="login-sambutan">
            Masukkan email akun Anda. Kami kirimkan tautan untuk membuat kata sandi baru.
          </BadgeInfo>

          <form className="login-form" onSubmit={submit}>
            <div className="login-field login-field--email">
              <InputText
                name="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setGalat('');
                }}
                placeholder="Email"
                autoComplete="username"
                autoCapitalize="none"
                spellCheck={false}
                autoFocus
                required
              />
            </div>

            {galat ? <BadgeInfo variant="error">{galat}</BadgeInfo> : null}

            <TombolTuang
              type="submit"
              ikon="kirim"
              status={status}
              className="login-submit"
              teksBerhasil="Terkirim"
              onTuntas={keTerkirim}
            >
              Kirim Tautan
            </TombolTuang>
          </form>

          <div className="login-tautan-bawah">
            <TautanKembali />
          </div>
        </>
      )}
    </KerangkaMasuk>
  );
}
