import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { AlignLeft, Moon, PanelLeftClose, PanelLeftOpen, Settings2, SquarePen, Sun } from 'lucide-react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';

import { Button } from '@/components/ui/button/Button';
import { ApiError } from '@/lib/api';
import { MODE_DEMO } from '@/lib/demo';
import type { AdminOutletContext } from '@/layout/AdminLayout';
import {
  PENGATURAN_BAWAAN,
  ambilPengaturanLydia,
  ambilPercakapan,
  daftarPercakapan,
  kirimPesan,
  unggahLampiran,
  type LampiranPesan,
  type PesanLydia,
  type RingkasanPercakapan,
} from '@/services/lydia';
import { HapusPercakapanModal, PengaturanLydiaModal, UbahJudulModal } from './ModalLydia';
import { LEBAR_MIN, PembagiPanel, useLebarPanel } from './PembagiPanel';
import { RiwayatChat } from './RiwayatChat';
import { AvatarLydia, RuangChat } from './RuangChat';
import { useTemaLydia } from './temaLydia';
import './lydia.css';

const JALUR = '/dashboard/lydia';
// Sama dengan breakpoint CSS
const MEDIA_LEBAR = '(min-width: 1024px)';

const pesanLokal = (peran: PesanLydia['peran'], isi: string, lampiran?: LampiranPesan[]): PesanLydia => ({
  id: `lokal-${Date.now()}-${peran}`,
  peran,
  isi,
  dibuat: new Date().toISOString(),
  lampiran,
});

// Pratinjau sebelum terunggah
const lampiranLokal = (f: File, i: number): LampiranPesan => ({
  id: `lokal-${i}-${f.name}`,
  nama: f.name,
  tipe: f.type,
  ukuran: f.size,
  url: f.type.startsWith('image/') ? URL.createObjectURL(f) : '',
});

/** Lydia Chat: riwayat kiri, chat kanan. */
export default function LydiaChatPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const outlet = useOutletContext<AdminOutletContext | undefined>();
  const { tema, gantiTema } = useTemaLydia();

  const badanRef = useRef<HTMLDivElement>(null);
  const panelLebar = useLebarPanel(badanRef);
  const [panelBuka, setPanelBuka] = useState(() => window.matchMedia(MEDIA_LEBAR).matches);

  const [daftar, setDaftar] = useState<RingkasanPercakapan[]>([]);
  const [memuatDaftar, setMemuatDaftar] = useState(true);
  const [pesan, setPesan] = useState<PesanLydia[]>([]);
  const [memuatPesan, setMemuatPesan] = useState(false);
  const [aliran, setAliran] = useState<string | null>(null);
  const [galat, setGalat] = useState('');
  const [pengaturan, setPengaturan] = useState(PENGATURAN_BAWAAN);

  const [aturBuka, setAturBuka] = useState(false);
  const [ubahJudul, setUbahJudul] = useState<RingkasanPercakapan | null>(null);
  const [hapus, setHapus] = useState<RingkasanPercakapan | null>(null);

  // Percakapan yang sedang tampil
  const aktifRef = useRef<string | null>(null);
  // Chat baru: pesannya sudah ada
  const lewatiMuatRef = useRef<string | null>(null);
  const pengendaliRef = useRef<AbortController | null>(null);
  const urlLokalRef = useRef<string[]>([]);

  const aktif = daftar.find((c) => c.id === id) ?? null;

  useEffect(() => {
    const p = new AbortController();
    daftarPercakapan(p.signal)
      .then((d) => setDaftar(d))
      .catch(() => {
        if (!p.signal.aborted) setGalat('Riwayat chat gagal dimuat. Muat ulang halaman.');
      })
      .finally(() => {
        if (!p.signal.aborted) setMemuatDaftar(false);
      });
    ambilPengaturanLydia(p.signal)
      .then((s) => setPengaturan(s))
      .catch(() => {});
    return () => p.abort();
  }, []);

  useEffect(() => {
    if (id && id === lewatiMuatRef.current) {
      lewatiMuatRef.current = null;
      return undefined;
    }
    pengendaliRef.current?.abort();
    aktifRef.current = id ?? null;
    setAliran(null);
    setGalat('');
    setPesan([]);
    if (!id) return undefined;

    const p = new AbortController();
    setMemuatPesan(true);
    ambilPercakapan(id, p.signal)
      .then((c) => setPesan(c.pesan))
      .catch((e) => {
        if (!p.signal.aborted) setGalat(e instanceof ApiError ? e.message : 'Percakapan gagal dimuat.');
      })
      .finally(() => {
        if (!p.signal.aborted) setMemuatPesan(false);
      });
    return () => p.abort();
  }, [id]);

  // Keluar: batalkan, bersihkan pratinjau
  useEffect(
    () => () => {
      pengendaliRef.current?.abort();
      urlLokalRef.current.forEach((u) => URL.revokeObjectURL(u));
    },
    [],
  );

  const tutupPanelKecil = () => {
    if (!window.matchMedia(MEDIA_LEBAR).matches) setPanelBuka(false);
  };

  const chatBaru = () => {
    navigate(JALUR);
    tutupPanelKecil();
  };

  const pilih = (target: string) => {
    navigate(`${JALUR}/${target}`);
    tutupPanelKecil();
  };

  const kirim = async (isi: string, berkas: File[]) => {
    if (aliran !== null) return;
    setGalat('');
    const sementara = berkas.map(lampiranLokal);
    urlLokalRef.current.push(...sementara.map((l) => l.url).filter(Boolean));
    setPesan((p) => [...p, pesanLokal('pengguna', isi, sementara)]);
    setAliran('');

    const pengendali = new AbortController();
    pengendaliRef.current = pengendali;
    let milik = aktifRef.current;
    let jawaban = '';
    try {
      const lampiran = await Promise.all(berkas.map((f) => unggahLampiran(f, pengendali.signal)));
      await kirimPesan(
        milik,
        isi,
        lampiran,
        {
          onMulai: (c) => {
            setDaftar((d) => [c, ...d.filter((x) => x.id !== c.id)]);
            if (milik !== c.id) {
              milik = c.id;
              aktifRef.current = c.id;
              lewatiMuatRef.current = c.id;
              navigate(`${JALUR}/${c.id}`, { replace: true });
            }
          },
          onPotongan: (t) => {
            jawaban += t;
            setAliran(jawaban);
          },
        },
        pengendali.signal,
      );
    } catch (e) {
      if (!pengendali.signal.aborted) {
        setGalat(e instanceof ApiError ? e.message : `${pengaturan.nama} gagal menjawab. Coba lagi.`);
      }
    } finally {
      // Abaikan kalau sudah pindah
      if (aktifRef.current === milik) {
        if (jawaban) setPesan((p) => [...p, pesanLokal('lydia', jawaban)]);
        setAliran(null);
      }
      if (pengendaliRef.current === pengendali) pengendaliRef.current = null;
    }
  };

  const hentikan = () => pengendaliRef.current?.abort();

  const terhapus = (target: string) => {
    setDaftar((d) => d.filter((c) => c.id !== target));
    setHapus(null);
    if (target === id) navigate(JALUR, { replace: true });
  };

  return (
    <section className={`lydia ${panelLebar.menggeser ? 'is-menggeser' : ''}`}>
      <div className="lydia-bilah">
        <div className="lydia-bilah__kiri">
          {outlet?.bukaSidebar ? (
            <Button variant="ghost" icon={AlignLeft} aria-label="Menu admin" title="Menu admin" onClick={outlet.bukaSidebar} />
          ) : null}
          <Button
            variant="ghost"
            icon={panelBuka ? PanelLeftClose : PanelLeftOpen}
            aria-label={panelBuka ? 'Tutup riwayat' : 'Buka riwayat'}
            title={panelBuka ? 'Tutup riwayat' : 'Buka riwayat'}
            aria-expanded={panelBuka}
            aria-controls="lydia-riwayat"
            onClick={() => setPanelBuka((b) => !b)}
          />
          <Button variant="ghost" icon={SquarePen} aria-label="Chat baru" title="Chat baru" onClick={chatBaru} />
          <div className="lydia-bilah__merek">
            <AvatarLydia />
            <div className="lydia-bilah__teks">
              <p className="lydia-bilah__nama">{pengaturan.nama} Chat</p>
              <p className="lydia-bilah__status">{MODE_DEMO ? 'Mode demo' : 'Terhubung'}</p>
            </div>
          </div>
        </div>

        <p className="lydia-bilah__judul" title={aktif?.judul}>
          {aktif?.judul ?? 'Percakapan baru'}
        </p>

        <div className="lydia-bilah__kanan">
          <Button
            variant="ghost"
            icon={tema === 'gelap' ? Sun : Moon}
            aria-label={tema === 'gelap' ? 'Mode terang' : 'Mode gelap'}
            title={tema === 'gelap' ? 'Mode terang' : 'Mode gelap'}
            onClick={(e) => gantiTema(e.currentTarget)}
          />
          <Button variant="ghost" icon={Settings2} onClick={() => setAturBuka(true)} aria-label="Atur Lydia" title="Atur Lydia">
            <span className="hidden sm:inline">Atur {pengaturan.nama}</span>
          </Button>
        </div>
      </div>

      <div
        ref={badanRef}
        className={`lydia-badan ${panelBuka ? 'lydia-badan--panel' : ''}`}
        style={{ '--lebar-panel': `${Math.max(panelLebar.lebar, LEBAR_MIN)}px` } as CSSProperties}
      >
        {panelBuka ? (
          <button type="button" aria-label="Tutup riwayat" className="lydia-tirai" onClick={() => setPanelBuka(false)} />
        ) : null}

        <aside id="lydia-riwayat" className={`lydia-riwayat ${panelBuka ? '' : 'is-tutup'}`} aria-label="Riwayat chat">
          <RiwayatChat
            daftar={daftar}
            memuat={memuatDaftar}
            aktifId={id ?? null}
            onBaru={chatBaru}
            onPilih={pilih}
            onUbahJudul={setUbahJudul}
            onHapus={setHapus}
          />
        </aside>

        {panelBuka ? (
          <PembagiPanel
            lebar={panelLebar.lebar}
            menggeser={panelLebar.menggeser}
            onPointerDown={panelLebar.mulaiGeser}
            onKeyDown={panelLebar.geserPanah}
          />
        ) : null}

        <RuangChat
          pengaturan={pengaturan}
          pesan={pesan}
          aliran={aliran}
          memuat={memuatPesan}
          galat={galat}
          onKirim={(isi, berkas) => void kirim(isi, berkas)}
          onHentikan={hentikan}
        />
      </div>

      {aturBuka ? (
        <PengaturanLydiaModal pengaturan={pengaturan} onClose={() => setAturBuka(false)} onTersimpan={setPengaturan} />
      ) : null}
      {ubahJudul ? (
        <UbahJudulModal
          percakapan={ubahJudul}
          onClose={() => setUbahJudul(null)}
          onTersimpan={(c) => setDaftar((d) => d.map((x) => (x.id === c.id ? { ...x, judul: c.judul } : x)))}
        />
      ) : null}
      {hapus ? <HapusPercakapanModal percakapan={hapus} onClose={() => setHapus(null)} onTerhapus={terhapus} /> : null}
    </section>
  );
}
