import { useEffect, useState } from 'react';
import { PencilLine, Save, Share2, SlidersHorizontal, UserRound, X } from 'lucide-react';

import { BadgeInfo } from '@/components/ui/badgeinfo/BadgeInfo';
import { Button } from '@/components/ui/button/Button';
import { InputText } from '@/components/ui/inputtext/InputText';
import { PageTitle } from '@/components/ui/pagetitle/PageTitle';
import { Select } from '@/components/ui/select/Select';
import { TabButton } from '@/components/ui/tab-button/TabButton';
import { ApiError } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { PANJANG_MIN_SANDI, periksaSandi } from '@/lib/sandi';
import { gantiEmail, gantiSandi, perbaruiAkun } from '@/services/akun';
import { ZONA_WAKTU_BAWAAN, type ZonaWaktu } from '@/services/auth';
import {
  SOSIAL,
  SOSIAL_KOSONG,
  ambilKontak,
  keInputKontak,
  simpanKontak,
  type InputKontak,
} from '@/services/pengaturan';
import './pengaturan.css';

const POLA_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const OPSI_ZONA: { value: ZonaWaktu; label: string }[] = [
  { value: 'WIB', label: 'WIB — Waktu Indonesia Barat' },
  { value: 'WITA', label: 'WITA — Waktu Indonesia Tengah' },
  { value: 'WIT', label: 'WIT — Waktu Indonesia Timur' },
];

type TahapEmail = 'diam' | 'form';

const KONTAK_KOSONG: InputKontak = {
  ...SOSIAL_KOSONG,
  whatsapp: '',
  email: '',
  lokasi: '',
  jam_buka: '',
  maps: '',
};

type GalatKontak = Partial<Record<keyof InputKontak | 'umum', string>>;

export default function PengaturanPage() {
  const { pengguna, segarkan } = useAuth();
  const peranAdmin = pengguna?.role === 'admin';

  /* Dua tab terakhir mengubah data publik situs, jadi hanya admin yang melihatnya.
     Non-admin cuma kebagian tab profil — dan karena itu juga tab awalnya, tidak
     ada keadaan yang perlu dibereskan saat perannya bukan admin. */
  const TAB = [
    { key: 'profil', label: 'Atur Profil', icon: UserRound },
    ...(peranAdmin
      ? [
          { key: 'system', label: 'Atur System', icon: SlidersHorizontal },
          { key: 'sosmed', label: 'Atur Sosmed', icon: Share2 },
        ]
      : []),
  ];
  const [tab, setTab] = useState('profil');

  // ---- Kontak publik (khusus admin) ----
  const [kontak, setKontak] = useState<InputKontak>(KONTAK_KOSONG);
  const [galatKontak, setGalatKontak] = useState<GalatKontak>({});
  const [suksesKontak, setSuksesKontak] = useState('');
  const [memuatKontak, setMemuatKontak] = useState(false);
  const [prosesKontak, setProsesKontak] = useState(false);

  useEffect(() => {
    if (!peranAdmin) return;
    const p = new AbortController();
    setMemuatKontak(true);
    ambilKontak(p.signal)
      .then((k) => {
        if (p.signal.aborted) return;
        setKontak(keInputKontak(k));
      })
      .catch(() => {
        if (!p.signal.aborted) setGalatKontak({ umum: 'Kontak gagal dimuat. Muat ulang halaman.' });
      })
      .finally(() => {
        if (!p.signal.aborted) setMemuatKontak(false);
      });
    return () => p.abort();
  }, [peranAdmin]);

  const ubahKontak = (kunci: keyof InputKontak, nilai: string) => {
    setKontak((k) => ({ ...k, [kunci]: nilai }));
    setGalatKontak((g) => ({ ...g, [kunci]: '', umum: '' }));
    setSuksesKontak('');
  };

  const simpanKontakPublik = async (e: React.FormEvent) => {
    e.preventDefault();

    // cepat, bukan supaya servernya boleh percaya.
    const g: GalatKontak = {};
    const angka = kontak.whatsapp.replace(/\D/g, '');
    if (angka.length < 8 || angka.length > 15) g.whatsapp = 'Nomor harus 8–15 angka.';
    if (!POLA_EMAIL.test(kontak.email.trim())) g.email = 'Format email tidak benar.';
    if (!kontak.lokasi.trim()) g.lokasi = 'Lokasi wajib diisi.';
    if (!kontak.jam_buka.trim()) g.jam_buka = 'Jam buka wajib diisi.';

    for (const { kunci: k } of SOSIAL) {
      const v = kontak[k].trim();
      if (v === '' || v === '#' || v.startsWith('https://') || v.startsWith('http://')) continue;
      g[k] = 'Isi alamat lengkap berawalan https://, atau # kalau belum ada.';
    }

    // ketahuan sebelum permintaannya dikirim.
    const titik = kontak.maps.trim();
    const koordinat = /^-?\d{1,2}(\.\d+)?\s*,\s*-?\d{1,3}(\.\d+)?$/.test(titik);
    const tautanMaps = /google\.[a-z.]+\/maps/i.test(titik);
    if (titik !== '' && !koordinat && !tautanMaps) {
      g.maps = 'Isi koordinat (mis. -8.3585858,116.0413142) atau tempel alamat Google Maps lengkap.';
    }
    if (Object.keys(g).length > 0) {
      setGalatKontak(g);
      return;
    }

    setProsesKontak(true);
    try {
      const k = await simpanKontak(kontak);
      setKontak(keInputKontak(k));
      setGalatKontak({});
      setSuksesKontak('Kontak publik tersimpan.');
    } catch (err) {
      setGalatKontak({
        umum: err instanceof ApiError ? err.message : 'Kontak gagal disimpan.',
      });
    } finally {
      setProsesKontak(false);
    }
  };

  const [nama, setNama] = useState(pengguna?.name ?? '');
  const [zona, setZona] = useState<ZonaWaktu>(pengguna?.zona_waktu ?? ZONA_WAKTU_BAWAAN);
  const [galatNama, setGalatNama] = useState('');
  const [suksesNama, setSuksesNama] = useState('');
  const [prosesNama, setProsesNama] = useState(false);

  // ---- Informasi akun: ganti email ----
  const [tahap, setTahap] = useState<TahapEmail>('diam');
  const [emailBaru, setEmailBaru] = useState('');
  const [sandiEmail, setSandiEmail] = useState('');
  const [galatEmail, setGalatEmail] = useState<{ email?: string; sandi?: string; umum?: string }>({});
  const [prosesEmail, setProsesEmail] = useState(false);
  const [suksesEmail, setSuksesEmail] = useState('');

  // ---- Ganti sandi ----
  const [sandiLama, setSandiLama] = useState('');
  const [sandiBaru, setSandiBaru] = useState('');
  const [konfirmasi, setKonfirmasi] = useState('');
  const [galatSandi, setGalatSandi] = useState<{ lama?: string; baru?: string; konfirmasi?: string }>(
    {},
  );
  const [prosesSandi, setProsesSandi] = useState(false);
  const [suksesSandi, setSuksesSandi] = useState('');

  useEffect(() => {
    setNama(pengguna?.name ?? '');
  }, [pengguna?.name]);

  useEffect(() => {
    setZona(pengguna?.zona_waktu ?? ZONA_WAKTU_BAWAAN);
  }, [pengguna?.zona_waktu]);

  useEffect(
    () => () => {
      setSandiEmail('');
      setSandiLama('');
      setSandiBaru('');
      setKonfirmasi('');
    },
    [],
  );

  const namaBerubah = nama.trim() !== (pengguna?.name ?? '') && nama.trim().length > 0;
  const zonaBerubah = zona !== (pengguna?.zona_waktu ?? ZONA_WAKTU_BAWAAN);
  const profilBerubah = namaBerubah || zonaBerubah;

  const simpanProfil = async (e: React.FormEvent) => {
    e.preventDefault();
    if (prosesNama || !profilBerubah) return;

    const bersih = nama.trim();
    if (bersih.length < 3 || bersih.length > 100) {
      setGalatNama('Nama 3–100 karakter.');
      return;
    }

    setProsesNama(true);
    setGalatNama('');
    setSuksesNama('');
    try {
      const user = await perbaruiAkun({ name: bersih, zona_waktu: zona });
      segarkan(user);
      setSuksesNama('Informasi akun berhasil disimpan.');
    } catch (err) {
      setGalatNama(err instanceof ApiError ? err.message : 'Gagal menyimpan informasi akun.');
    } finally {
      setProsesNama(false);
    }
  };

  const tutupFormEmail = () => {
    setTahap('diam');
    setEmailBaru('');
    setSandiEmail('');
    setGalatEmail({});
  };

  const simpanEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (prosesEmail) return;

    const tujuan = emailBaru.trim().toLowerCase();
    const galatBaru: typeof galatEmail = {};
    if (!POLA_EMAIL.test(tujuan)) galatBaru.email = 'Format email tidak valid.';
    if (tujuan === pengguna?.email) galatBaru.email = 'Email baru sama dengan email saat ini.';
    if (!sandiEmail) galatBaru.sandi = 'Kata sandi saat ini wajib diisi.';

    setGalatEmail(galatBaru);
    if (Object.keys(galatBaru).length > 0) return;

    setProsesEmail(true);
    try {
      const user = await gantiEmail(tujuan, sandiEmail);
      segarkan(user);
      setSuksesEmail(`Email berhasil diganti menjadi ${user.email}.`);
      tutupFormEmail();
    } catch (err) {
      const pesan = err instanceof ApiError ? err.message : 'Gagal mengganti email.';
      if (err instanceof ApiError && err.status === 401) setGalatEmail({ sandi: pesan });
      else if (err instanceof ApiError && err.status === 409) setGalatEmail({ email: pesan });
      else setGalatEmail({ umum: pesan });
    } finally {
      setProsesEmail(false);
    }
  };

  const submitSandi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (prosesSandi) return;

    const galatBaru: typeof galatSandi = {};
    if (!sandiLama) galatBaru.lama = 'Kata sandi saat ini wajib diisi.';

    const cek = periksaSandi(sandiBaru);
    if (cek) galatBaru.baru = cek;
    else if (sandiBaru === sandiLama) galatBaru.baru = 'Kata sandi baru harus berbeda dari yang lama.';
    else if (sandiBaru !== konfirmasi) galatBaru.konfirmasi = 'Konfirmasi tidak sama.';

    setGalatSandi(galatBaru);
    if (Object.keys(galatBaru).length > 0) return;

    setProsesSandi(true);
    setSuksesSandi('');
    try {
      await gantiSandi(sandiLama, sandiBaru);
      setSuksesSandi('Kata sandi berhasil diganti. Sesi lain diputus.');
      setSandiLama('');
      setSandiBaru('');
      setKonfirmasi('');
    } catch (err) {
      const pesan = err instanceof ApiError ? err.message : 'Gagal mengganti kata sandi.';
      if (err instanceof ApiError && err.status === 401) setGalatSandi({ lama: pesan });
      else setGalatSandi({ baru: pesan });
    } finally {
      setProsesSandi(false);
    }
  };

  return (
    <div className="pengaturan-page space-y-6">
      <PageTitle title="Pengaturan" subtitle="Kelola informasi akun dan kata sandi Anda" />

      <TabButton tabs={TAB} value={tab} onChange={setTab} />

      {tab === 'system' && peranAdmin ? (
        <section className="app-section-card">
          <div className="app-section-body pengaturan-bagian">
            <form onSubmit={simpanKontakPublik} className="pengaturan-form">
              <InputText
                label="WhatsApp"
                value={kontak.whatsapp}
                onChange={(e) => ubahKontak('whatsapp', e.target.value)}
                error={galatKontak.whatsapp}
                hint="Boleh ditulis bebas — yang dipakai tautan wa.me cuma angkanya."
                required
              />
              <InputText
                label="Email"
                type="email"
                value={kontak.email}
                onChange={(e) => ubahKontak('email', e.target.value)}
                error={galatKontak.email}
                required
              />
              <InputText
                label="Where we are"
                value={kontak.lokasi}
                onChange={(e) => ubahKontak('lokasi', e.target.value)}
                error={galatKontak.lokasi}
                required
              />
              <InputText
                label="Open"
                value={kontak.jam_buka}
                onChange={(e) => ubahKontak('jam_buka', e.target.value)}
                error={galatKontak.jam_buka}
                required
              />

              <InputText
                label="Titik lokasi (Google Maps)"
                value={kontak.maps}
                onChange={(e) => ubahKontak('maps', e.target.value)}
                error={galatKontak.maps}
                hint="Tempel alamat Google Maps lokasinya — koordinatnya diambil sendiri. Tautan pendek (maps.app.goo.gl) tidak bisa; buka dulu di peramban lalu salin alamat lengkap dari bilah alamat. Kosongkan kalau tidak ingin menampilkan peta."
              />

              <div className="pengaturan-aksi">
                <Button type="submit" icon={Save} loading={prosesKontak} disabled={memuatKontak}>
                  Simpan Kontak
                </Button>
                {suksesKontak ? <BadgeInfo variant="success">{suksesKontak}</BadgeInfo> : null}
                {galatKontak.umum ? (
                  <BadgeInfo variant="error">{galatKontak.umum}</BadgeInfo>
                ) : null}
              </div>
            </form>
          </div>
        </section>
      ) : null}

      {tab === 'sosmed' && peranAdmin ? (
        <section className="app-section-card">
          <div className="app-section-body pengaturan-bagian">
            <form onSubmit={simpanKontakPublik} className="pengaturan-form">
              {/* Semua platform dirender dari satu daftar di services/pengaturan.
                  Menambah platform cukup menambah satu baris di sana — medan,
                  pemeriksaan, dan isian kosongnya ikut sendiri. */}
              {SOSIAL.map(({ kunci, label, contoh }) => (
                <InputText
                  key={kunci}
                  label={label}
                  value={kontak[kunci]}
                  onChange={(e) => ubahKontak(kunci, e.target.value)}
                  error={galatKontak[kunci]}
                  placeholder={contoh}
                  autoCapitalize="none"
                  spellCheck={false}
                />
              ))}

              <p className="pengaturan-catatan">
                Kosongkan kalau tidak ingin ikonnya ditampilkan; isi <code>#</code> kalau akunnya
                belum ada tapi tetap mau tampil.
              </p>

              <div className="pengaturan-aksi">
                <Button type="submit" icon={Save} loading={prosesKontak} disabled={memuatKontak}>
                  Simpan Kontak
                </Button>
                {suksesKontak ? <BadgeInfo variant="success">{suksesKontak}</BadgeInfo> : null}
                {galatKontak.umum ? (
                  <BadgeInfo variant="error">{galatKontak.umum}</BadgeInfo>
                ) : null}
              </div>
            </form>
          </div>
        </section>
      ) : null}

      {tab === 'profil' ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* ---------- Informasi akun ---------- */}
          <section className="app-section-card">
            <div className="app-section-body pengaturan-bagian">
              <form onSubmit={simpanProfil} className="pengaturan-form">
                <InputText
                  label="Nama"
                  value={nama}
                  onChange={(e) => {
                    setNama(e.target.value);
                    setSuksesNama('');
                  }}
                  error={galatNama}
                  autoComplete="name"
                  required
                />

                <div className="pengaturan-form__field">
                  <span className="pengaturan-form__label">Zona waktu</span>
                  <Select
                    value={zona}
                    onValueChange={(v) => {
                      setZona(v as ZonaWaktu);
                      setSuksesNama('');
                    }}
                    options={OPSI_ZONA}
                    disabled={prosesNama}
                  />
                </div>

                <div className="pengaturan-aksi">
                  <Button type="submit" icon={Save} loading={prosesNama} disabled={!profilBerubah}>
                    Simpan Nama &amp; Zona Waktu
                  </Button>
                  {suksesNama ? <BadgeInfo variant="success">{suksesNama}</BadgeInfo> : null}
                </div>
              </form>

              <hr className="pengaturan-garis" />

              {/* Ganti email */}
              <div className="pengaturan-email">
                <InputText
                  label="Email"
                  type="email"
                  value={pengguna?.email ?? ''}
                  readOnly
                  className="pengaturan-email__field"
                />

                {suksesEmail ? <BadgeInfo variant="success">{suksesEmail}</BadgeInfo> : null}

                {tahap === 'diam' ? (
                  <Button
                 
                    icon={PencilLine}
                    onClick={() => {
                      setTahap('form');
                      setSuksesEmail('');
                    }}
                  >
                    Ubah Email
                  </Button>
                ) : null}

                {tahap === 'form' ? (
                  <form onSubmit={simpanEmail} className="pengaturan-form">
                    <p className="pengaturan-catatan">
                      Email baru langsung dipakai untuk masuk. Pastikan alamatnya benar — kalau salah,
                      akun ini tidak bisa dipakai masuk lagi dan harus direset admin.
                    </p>

                    {galatEmail.umum ? <BadgeInfo variant="error">{galatEmail.umum}</BadgeInfo> : null}

                    <InputText
                      label="Email baru"
                      type="email"
                      value={emailBaru}
                      onChange={(e) => setEmailBaru(e.target.value)}
                      error={galatEmail.email}
                      autoComplete="off"
                      autoCapitalize="none"
                      spellCheck={false}
                      required
                    />
                    <InputText
                      label="Kata sandi saat ini"
                      type="password"
                      value={sandiEmail}
                      onChange={(e) => setSandiEmail(e.target.value)}
                      error={galatEmail.sandi}
                      hint="Diminta untuk memastikan yang mengubah email memang Anda."
                      autoComplete="current-password"
                      required
                    />

                    <div className="pengaturan-aksi">
                      <Button type="submit" icon={Save} loading={prosesEmail}>
                        Simpan Email
                      </Button>
                      <Button variant="ghost" icon={X} onClick={tutupFormEmail} disabled={prosesEmail}>
                        Batal
                      </Button>
                    </div>
                  </form>
                ) : null}
              </div>
            </div>
          </section>

          {/* ---------- Ganti kata sandi ---------- */}
          <section className="app-section-card">
            <div className="app-section-body pengaturan-bagian">
              <form onSubmit={submitSandi} className="pengaturan-form">
                <InputText
                  label="Kata sandi saat ini"
                  type="password"
                  value={sandiLama}
                  onChange={(e) => setSandiLama(e.target.value)}
                  error={galatSandi.lama}
                  autoComplete="current-password"
                  required
                />
                <InputText
                  label="Kata sandi baru"
                  type="password"
                  value={sandiBaru}
                  onChange={(e) => {
                    setSandiBaru(e.target.value);
                    setSuksesSandi('');
                  }}
                  error={galatSandi.baru}
                  hint={`Minimal ${PANJANG_MIN_SANDI} karakter. Frasa panjang lebih aman daripada sandi pendek yang rumit — tidak ada kewajiban huruf besar atau simbol.`}
                  autoComplete="new-password"
                  required
                />
                <InputText
                  label="Ulangi kata sandi baru"
                  type="password"
                  value={konfirmasi}
                  onChange={(e) => setKonfirmasi(e.target.value)}
                  error={galatSandi.konfirmasi}
                  autoComplete="new-password"
                  required
                />

                <div className="pengaturan-aksi">
                  <Button type="submit" icon={Save} loading={prosesSandi}>
                    Simpan Kata Sandi
                  </Button>
                  {suksesSandi ? <BadgeInfo variant="success">{suksesSandi}</BadgeInfo> : null}
                </div>
              </form>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}
