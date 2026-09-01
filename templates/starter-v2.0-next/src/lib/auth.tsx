import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import {
  masuk as masukLayanan,
  keluar as keluarLayanan,
  profil,
  type Pengguna,
  type Peran,
} from '@/services/auth';
import { hapusCSRF, pasangPenanganSesiHabis, pasangPenanganWajibGantiSandi } from './api';

export type { Pengguna, Peran };

/**
 * Mode demo — starter berjalan tanpa backend.
 *
 * Halaman masuk menerima email dan kata sandi APA SAJA, lalu membuat sesi
 * lokal seadanya. Tidak ada pemeriksaan apa pun di sini, dan memang tidak
 * boleh ada: ini cuma supaya starter bisa langsung dicoba.
 *
 * Setel ke `false` begitu backend auth Anda siap. Seluruh alur di bawah
 * langsung kembali memakai `@/services/auth`, dan halaman masuk tidak perlu
 * diubah sama sekali — ia memang hanya memanggil `masuk()`.
 */
const MODE_DEMO: boolean = true;

const KUNCI_SESI_DEMO = 'dealtech_sesi_demo';

/** Nama tampilan seadanya dari bagian depan email: "budi.santoso@x" → "Budi Santoso". */
function namaDariEmail(email: string): string {
  const depan = email.split('@')[0] ?? '';
  const nama = depan
    .split(/[._-]+/)
    .filter(Boolean)
    .map((kata) => kata.charAt(0).toUpperCase() + kata.slice(1))
    .join(' ');
  return nama || 'Pengguna';
}

function penggunaDemo(email: string): Pengguna {
  return {
    id: 1,
    name: namaDariEmail(email),
    email,
    role: 'admin',
    is_active: true,
    zona_waktu: 'WIB',
  };
}

/** Sesi demo ditaruh di sessionStorage supaya muat-ulang halaman tidak melempar keluar. */
function bacaSesiDemo(): Pengguna | null {
  try {
    const mentah = window.sessionStorage.getItem(KUNCI_SESI_DEMO);
    return mentah ? (JSON.parse(mentah) as Pengguna) : null;
  } catch {
    return null;
  }
}

function simpanSesiDemo(u: Pengguna | null): void {
  try {
    if (u) window.sessionStorage.setItem(KUNCI_SESI_DEMO, JSON.stringify(u));
    else window.sessionStorage.removeItem(KUNCI_SESI_DEMO);
  } catch {
    // Penyimpanan diblokir peramban — sesinya cuma bertahan selama halaman terbuka.
  }
}

interface KonteksAuth {
  pengguna: Pengguna | null;
  memuat: boolean;
  masuk: (email: string, sandi: string) => Promise<void>;
  keluar: () => Promise<void>;
  boleh: (...peran: Peran[]) => boolean;
  /**
   * Menyegarkan data pengguna setelah profil diubah, supaya sidebar tidak basi.
   *
   * Hanya untuk data dari server. JANGAN dipakai menaikkan peran dari klien.
   */
  segarkan: (u: Pengguna) => void;
}

const Konteks = createContext<KonteksAuth | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [pengguna, setPengguna] = useState<Pengguna | null>(null);
  const [memuat, setMemuat] = useState(true);

  const pasang = useCallback((u: Pengguna | null) => {
    setPengguna(u);
  }, []);

  useEffect(() => {
    pasangPenanganSesiHabis(() => {
      hapusCSRF();
      setPengguna(null);
    });

    // Servernya yang menolak; ini cuma memindahkan orangnya ke halaman yang benar.
    pasangPenanganWajibGantiSandi(() => {
      if (window.location.pathname !== '/dashboard/pengaturan') {
        window.location.replace('/dashboard/pengaturan');
      }
    });
  }, []);

  /**
   * Tanya server siapa yang sedang masuk. Tidak ada token dari penyimpanan
   * lokal — cookie sesi dikirim peramban sendiri, dan 401 bukan galat.
   */
  useEffect(() => {
    if (MODE_DEMO) {
      pasang(bacaSesiDemo());
      setMemuat(false);
      return;
    }

    const pengendali = new AbortController();

    profil(pengendali.signal)
      .then((u) => {
        if (!pengendali.signal.aborted) pasang(u);
      })
      .catch(() => {
        if (!pengendali.signal.aborted) pasang(null);
      })
      .finally(() => {
        if (!pengendali.signal.aborted) setMemuat(false);
      });

    return () => pengendali.abort();
  }, [pasang]);

  const masuk = useCallback(
    async (email: string, sandi: string) => {
      if (MODE_DEMO) {
        // Sengaja tanpa pemeriksaan — email dan sandi apa pun diterima.
        const u = penggunaDemo(email);
        simpanSesiDemo(u);
        pasang(u);
        return;
      }
      pasang(await masukLayanan(email, sandi));
    },
    [pasang],
  );

  const keluar = useCallback(async () => {
    if (MODE_DEMO) {
      simpanSesiDemo(null);
      pasang(null);
      return;
    }
    // Sesinya dicabut di server, bukan sekadar dilupakan di sini.
    await keluarLayanan();
    pasang(null);
  }, [pasang]);

  const boleh = useCallback(
    (...peran: Peran[]) => !!pengguna && peran.includes(pengguna.role),
    [pengguna],
  );

  const segarkan = useCallback((u: Pengguna) => pasang(u), [pasang]);

  const nilai = useMemo(
    () => ({ pengguna, memuat, masuk, keluar, boleh, segarkan }),
    [pengguna, memuat, masuk, keluar, boleh, segarkan],
  );

  return <Konteks.Provider value={nilai}>{children}</Konteks.Provider>;
}

export function useAuth(): KonteksAuth {
  const k = useContext(Konteks);
  if (!k) throw new Error('useAuth harus dipakai di dalam <AuthProvider>');
  return k;
}
