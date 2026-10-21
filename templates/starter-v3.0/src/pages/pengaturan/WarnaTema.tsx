import { useEffect, useRef, useState } from 'react';
import { RotateCcw } from 'lucide-react';

import { BadgeInfo } from '@/components/ui/badgeinfo/BadgeInfo';
import { Button } from '@/components/ui/button/Button';
import { InputText } from '@/components/ui/inputtext/InputText';
import { Skeleton, SkeletonBila } from '@/components/ui/skeleton/Skeleton';
import { TombolTuang, type StatusTuang } from '@/components/ui/tombol-tuang/TombolTuang';
import { ApiError } from '@/lib/api';
import {
  WARNA_BAWAAN,
  bacaWarnaTersimpan,
  ingatWarna,
  kontrasPutih,
  rapikanHex,
  terapkanWarna,
  turunanWarna,
} from '@/lib/tema';
import { ambilTema, simpanTema } from '@/services/pengaturan';

// Teks putih masih terbaca
const KONTRAS_MIN = 4.5;

const GALAT_KODE = 'Isi kode hex 3 atau 6 digit, mis. #01498b.';

const TURUNAN = [
  { kunci: 'utama', label: 'Utama' },
  { kunci: 'gelap', label: 'Hover' },
  { kunci: 'lebihGelap', label: 'Aktif' },
  { kunci: 'aksen', label: 'Aksen' },
] as const;

/** Warna tema admin dengan pratinjau langsung. */
export default function WarnaTema() {
  const [warna, setWarna] = useState(bacaWarnaTersimpan);
  const [kode, setKode] = useState(warna);
  const [tersimpan, setTersimpan] = useState(warna);
  const [galatKode, setGalatKode] = useState('');
  const [galat, setGalat] = useState('');
  const [sukses, setSukses] = useState('');
  const [status, setStatus] = useState<StatusTuang>('idle');
  const [memuat, setMemuat] = useState(true);
  const tersimpanRef = useRef(tersimpan);

  useEffect(() => {
    tersimpanRef.current = tersimpan;
  }, [tersimpan]);

  useEffect(() => {
    const p = new AbortController();
    ambilTema(p.signal)
      .then(({ warna_utama }) => {
        if (p.signal.aborted) return;
        const hex = rapikanHex(warna_utama) ?? WARNA_BAWAAN;
        setTersimpan(hex);
        setWarna(hex);
        setKode(hex);
      })
      .catch(() => {
        if (!p.signal.aborted) setGalat('Warna tema gagal dimuat. Muat ulang halaman.');
      })
      .finally(() => {
        if (!p.signal.aborted) setMemuat(false);
      });
    return () => p.abort();
  }, []);

  // Pratinjau ke seluruh admin
  useEffect(() => terapkanWarna(warna), [warna]);

  // Batal simpan: warna kembali
  useEffect(() => () => terapkanWarna(tersimpanRef.current), []);

  const pilih = (hex: string) => {
    setWarna(hex);
    setKode(hex);
    setGalatKode('');
    setSukses('');
  };

  const ketik = (teks: string) => {
    setKode(teks);
    setSukses('');
    const hex = rapikanHex(teks);
    if (!hex) return;
    setWarna(hex);
    setGalatKode('');
  };

  const rapikan = () => {
    const hex = rapikanHex(kode);
    if (hex) setKode(hex);
    else setGalatKode(GALAT_KODE);
  };

  const simpan = async (e: React.FormEvent) => {
    e.preventDefault();
    const hex = rapikanHex(kode);
    if (!hex) {
      setGalatKode(GALAT_KODE);
      return;
    }

    setStatus('pending');
    setGalat('');
    setSukses('');
    try {
      const tema = await simpanTema({ warna_utama: hex });
      const hasil = rapikanHex(tema.warna_utama) ?? hex;
      ingatWarna(hasil);
      setTersimpan(hasil);
      setWarna(hasil);
      setKode(hasil);
      setSukses('Warna tema tersimpan.');
      setStatus('success');
    } catch (err) {
      setGalat(err instanceof ApiError ? err.message : 'Warna tema gagal disimpan.');
      setStatus('error');
    }
  };

  const turunan = turunanWarna(warna);
  const berubah = warna !== tersimpan;

  return (
    <section className="app-section-card">
      <div className="app-section-body pengaturan-bagian">
        <form onSubmit={simpan} className="pengaturan-form">
          <div className="pengaturan-form__field">
            <span className="pengaturan-form__label" id="label-warna-tema">
              Warna tema admin
            </span>
            <div className="warna-tema" role="group" aria-labelledby="label-warna-tema">
              <SkeletonBila memuat={memuat}>
                <input
                  type="color"
                  className="warna-tema__pilih"
                  value={warna}
                  onChange={(e) => pilih(e.target.value)}
                  aria-label="Pilih warna"
                />
              </SkeletonBila>
              <div className="warna-tema__kode">
                <InputText
                  value={kode}
                  onChange={(e) => ketik(e.target.value)}
                  onBlur={rapikan}
                  error={galatKode}
                  aria-label="Kode warna hex"
                  placeholder={WARNA_BAWAAN}
                  maxLength={7}
                  autoCapitalize="none"
                  autoComplete="off"
                  spellCheck={false}
                  memuat={memuat}
                />
              </div>
              {!memuat && warna !== WARNA_BAWAAN ? (
                <Button variant="ghost" icon={RotateCcw} onClick={() => pilih(WARNA_BAWAAN)}>
                  Pakai Bawaan
                </Button>
              ) : null}
            </div>
          </div>

          <ul className="warna-tema__palet" aria-label="Turunan warna tema">
            {TURUNAN.map(({ kunci, label }) => (
              <li key={kunci}>
                {memuat ? (
                  <Skeleton bentuk="kotak" className="warna-tema__contoh" />
                ) : (
                  <span className="warna-tema__contoh" style={{ background: turunan[kunci] }} />
                )}
                <span className="warna-tema__nama">{label}</span>
                <code>{memuat ? <Skeleton lebar="70%" /> : turunan[kunci]}</code>
              </li>
            ))}
          </ul>

          <BadgeInfo variant="info" icon={false}>
            Pilih dari palet atau ketik kode hex. Warnanya langsung terlihat di seluruh admin;
            kalau tidak disimpan, warna kembali saat halaman ini ditinggalkan.
          </BadgeInfo>

          {!memuat && kontrasPutih(warna) < KONTRAS_MIN ? (
            <BadgeInfo variant="warning">
              Warna ini terlalu terang, teks putih di tombol dan menu jadi sulit dibaca. Pilih
              warna yang lebih gelap.
            </BadgeInfo>
          ) : null}

          <div className="pengaturan-aksi">
            <SkeletonBila memuat={memuat}>
              <TombolTuang type="submit" ikon="simpan" status={status} disabled={!berubah}>
                Simpan Warna
              </TombolTuang>
            </SkeletonBila>
            {sukses ? <BadgeInfo variant="success">{sukses}</BadgeInfo> : null}
            {galat ? <BadgeInfo variant="error">{galat}</BadgeInfo> : null}
          </div>
        </form>
      </div>
    </section>
  );
}
