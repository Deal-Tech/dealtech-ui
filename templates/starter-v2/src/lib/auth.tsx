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
      if (window.location.pathname !== '/pengaturan') {
        window.location.replace('/pengaturan');
      }
    });
  }, []);

  /**
   * Tanya server siapa yang sedang masuk. Tidak ada token dari penyimpanan
   * lokal — cookie sesi dikirim peramban sendiri, dan 401 bukan galat.
   */
  useEffect(() => {
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
      pasang(await masukLayanan(email, sandi));
    },
    [pasang],
  );

  const keluar = useCallback(async () => {
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
