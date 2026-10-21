import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { BadgeInfo } from '@/components/ui/badgeinfo/BadgeInfo';
import { InputText } from '@/components/ui/inputtext/InputText';
import { KodeOtp } from '@/components/ui/kode-otp/KodeOtp';
import { TombolTuang, type StatusTuang } from '@/components/ui/tombol-tuang/TombolTuang';
import { ApiError } from '@/lib/api';
import { MODE_DEMO } from '@/lib/demo';
import { periksaSandi } from '@/lib/sandi';
import {
  KODE_DEMO_SALAH,
  PANJANG_KODE_SANDI,
  aturUlangSandi,
  mintaKodeSandi,
  periksaKodeSandi,
} from '@/services/auth';
import KerangkaMasuk, { TautanKembali } from './KerangkaMasuk';
import MeterSandi from './MeterSandi';

const POLA_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const JEDA_KIRIM_ULANG_DETIK = 60;

// Tetap dianggap terkirim, cegah enumerasi
const STATUS_SAMAR = new Set([404, 422]);

type Langkah = 'email' | 'kode' | 'sandi';

const PANEL: Record<Langkah, { judul: string; teks: string }> = {
  email: {
    judul: 'Akses kembali dalam hitungan menit',
    teks: 'Kode verifikasi dikirim ke email Anda. Masukkan kodenya, buat kata sandi baru, lalu masuk seperti biasa.',
  },
  kode: {
    judul: 'Cek kotak masuk Anda',
    teks: 'Kode hanya berlaku beberapa menit dan sekali pakai. Jangan bagikan ke siapa pun.',
  },
  sandi: {
    judul: 'Kata sandi baru, akun tetap aman',
    teks: 'Pilih frasa panjang yang mudah Anda ingat tapi sulit ditebak orang lain.',
  },
};

const pesanGalat = (e: unknown, cadangan: string) => (e instanceof ApiError ? e.message : cadangan);

function useHitungMundur() {
  const [sisa, setSisa] = useState(0);

  useEffect(() => {
    if (sisa <= 0) return undefined;
    const detak = window.setTimeout(() => setSisa((s) => s - 1), 1000);
    return () => window.clearTimeout(detak);
  }, [sisa]);

  return { sisa, mulai: () => setSisa(JEDA_KIRIM_ULANG_DETIK) };
}

/** Kirim kode: idle → pending → success/error. */
function useKirimKode(email: string) {
  const [status, setStatus] = useState<StatusTuang>('idle');
  const [galat, setGalat] = useState('');

  const kirim = async () => {
    if (status === 'pending' || status === 'success') return;
    setGalat('');
    setStatus('pending');
    try {
      await mintaKodeSandi(email);
      setStatus('success');
    } catch (e) {
      if (e instanceof ApiError && STATUS_SAMAR.has(e.status)) {
        setStatus('success');
        return;
      }
      setGalat(pesanGalat(e, 'Kode belum terkirim. Coba beberapa saat lagi.'));
      setStatus('error');
    }
  };

  return { status, galat, kirim, reset: () => setStatus('idle') };
}

interface LangkahEmailProps {
  email: string;
  onEmail: (v: string) => void;
  onTerkirim: () => void;
}

function LangkahEmail({ email, onEmail, onTerkirim }: LangkahEmailProps) {
  const [galatFormat, setGalatFormat] = useState('');
  const pengirim = useKirimKode(email.trim().toLowerCase());

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!POLA_EMAIL.test(email.trim())) {
      setGalatFormat('Format email belum benar.');
      return;
    }
    void pengirim.kirim();
  };

  const galat = galatFormat || pengirim.galat;

  return (
    <>
      <BadgeInfo variant="info" icon={false} className="login-sambutan">
        Masukkan email akun Anda. Kami kirimkan kode verifikasi 6 angka.
      </BadgeInfo>

      <form className="login-form" onSubmit={submit}>
        <div className="login-field login-field--email">
          <InputText
            name="email"
            type="email"
            value={email}
            onChange={(e) => {
              onEmail(e.target.value);
              setGalatFormat('');
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
          status={pengirim.status}
          className="login-submit"
          teksBerhasil="Berhasil terkirim"
          onTuntas={onTerkirim}
        >
          Kirim Kode
        </TombolTuang>
      </form>

      <div className="login-tautan-bawah">
        <TautanKembali />
      </div>
    </>
  );
}

interface LangkahKodeProps {
  email: string;
  onToken: (token: string) => void;
  onGantiEmail: () => void;
}

function LangkahKode({ email, onToken, onGantiEmail }: LangkahKodeProps) {
  const [status, setStatus] = useState<StatusTuang>('idle');
  const [galat, setGalat] = useState('');
  const tokenRef = useRef('');
  const hitung = useHitungMundur();
  const pengirim = useKirimKode(email);

  useEffect(() => hitung.mulai(), []); // eslint-disable-line react-hooks/exhaustive-deps

  const periksa = async (kode: string) => {
    setGalat('');
    setStatus('pending');
    try {
      tokenRef.current = await periksaKodeSandi(email, kode);
      setStatus('success');
    } catch (e) {
      setGalat(pesanGalat(e, 'Kode tidak bisa diperiksa. Coba beberapa saat lagi.'));
      setStatus('error');
    }
  };

  const selesai = (berhasil: boolean) => {
    if (berhasil) onToken(tokenRef.current);
    else setStatus('idle');
  };

  return (
    <>
      <BadgeInfo variant="success" className="login-sambutan">
        Kalau <strong>{email}</strong> terdaftar, kode 6 angka sudah kami kirim. Cek kotak masuk
        atau folder spam.
      </BadgeInfo>

      <div className="login-form">
        <KodeOtp
          status={status}
          panjang={PANJANG_KODE_SANDI}
          onLengkap={(kode) => void periksa(kode)}
          onSelesai={selesai}
        />

        {MODE_DEMO ? (
          <p className="login-catatan">
            Mode demo: kode apa pun diterima, kecuali {KODE_DEMO_SALAH} yang selalu ditolak.
          </p>
        ) : null}

        {galat ? <BadgeInfo variant="error">{galat}</BadgeInfo> : null}
        {pengirim.galat ? <BadgeInfo variant="error">{pengirim.galat}</BadgeInfo> : null}

        <TombolTuang
          ikon="kirim"
          variant="ghost"
          status={pengirim.status}
          className="login-submit"
          disabled={hitung.sisa > 0 || status !== 'idle'}
          teksBerhasil="Berhasil terkirim"
          onClick={() => void pengirim.kirim()}
          onSelesai={(berhasil) => {
            pengirim.reset();
            if (berhasil) hitung.mulai();
          }}
        >
          {hitung.sisa > 0 ? `Kirim ulang dalam ${hitung.sisa} detik` : 'Kirim Ulang Kode'}
        </TombolTuang>
      </div>

      <div className="login-tautan-bawah">
        <TautanKembali />
        <button type="button" className="login-forgot" onClick={onGantiEmail}>
          Pakai email lain
        </button>
      </div>
    </>
  );
}

interface LangkahSandiProps {
  email: string;
  token: string;
  onTersimpan: () => void;
}

function LangkahSandi({ email, token, onTersimpan }: LangkahSandiProps) {
  const [baru, setBaru] = useState('');
  const [ulang, setUlang] = useState('');
  const [galat, setGalat] = useState<{ baru?: string; ulang?: string; umum?: string }>({});
  const [status, setStatus] = useState<StatusTuang>('idle');
  const sibuk = status === 'pending' || status === 'success';

  useEffect(
    () => () => {
      setBaru('');
      setUlang('');
    },
    [],
  );

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sibuk) return;

    const cek = periksaSandi(baru);
    if (cek) return setGalat({ baru: cek });
    if (baru !== ulang) return setGalat({ ulang: 'Konfirmasi tidak sama.' });
    setGalat({});

    setStatus('pending');
    try {
      await aturUlangSandi({ token, email, sandi: baru, ulang });
      setBaru('');
      setUlang('');
      setStatus('success');
    } catch (err) {
      const galatSandi = err instanceof ApiError ? err.fields?.password : undefined;
      setGalat(
        galatSandi
          ? { baru: galatSandi }
          : { umum: pesanGalat(err, 'Kata sandi belum tersimpan. Coba beberapa saat lagi.') },
      );
      setStatus('error');
    }
  };

  return (
    <>
      <BadgeInfo variant="success" className="login-sambutan">
        Kode benar. Buat kata sandi baru untuk <strong>{email}</strong>.
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
        <MeterSandi sandi={baru} />

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

        {galat.umum ? <BadgeInfo variant="error">{galat.umum}</BadgeInfo> : null}

        <TombolTuang
          type="submit"
          ikon="kunci"
          status={status}
          className="login-submit"
          teksBerhasil="Tersimpan"
          onTuntas={onTersimpan}
        >
          Simpan Kata Sandi
        </TombolTuang>
      </form>

      <div className="login-tautan-bawah">
        <TautanKembali />
      </div>
    </>
  );
}

export default function LupaSandi() {
  const navigate = useNavigate();
  const lokasi = useLocation();
  const emailAwal = (lokasi.state as { email?: unknown } | null)?.email;

  const [langkah, setLangkah] = useState<Langkah>('email');
  const [email, setEmail] = useState(typeof emailAwal === 'string' ? emailAwal : '');
  const [token, setToken] = useState('');
  const emailBersih = email.trim().toLowerCase();

  return (
    <KerangkaMasuk judul={PANEL[langkah].judul} teks={PANEL[langkah].teks} titik={0} tema="sandi">
      {langkah === 'email' ? (
        <LangkahEmail email={email} onEmail={setEmail} onTerkirim={() => setLangkah('kode')} />
      ) : null}
      {langkah === 'kode' ? (
        <LangkahKode
          email={emailBersih}
          onToken={(t) => {
            setToken(t);
            setLangkah('sandi');
          }}
          onGantiEmail={() => setLangkah('email')}
        />
      ) : null}
      {langkah === 'sandi' ? (
        <LangkahSandi
          email={emailBersih}
          token={token}
          onTersimpan={() => navigate('/login', { replace: true, state: { sandiDiatur: true } })}
        />
      ) : null}
    </KerangkaMasuk>
  );
}
