import { useCallback, useState } from 'react';

import type { StatusTuang } from './TombolTuang';

/** Hasil `false` atau galat = gagal; selain itu berhasil. */
export type AksiTuang = () => Promise<boolean | void> | boolean | void;

/**
 * Status TombolTuang dari handler async.
 *
 * Pakai `onSelesai={reset}` di TombolTuang supaya tombol siap dipakai lagi.
 */
export function useAksiTuang() {
  const [status, setStatus] = useState<StatusTuang>('idle');

  const jalankan = useCallback(async (aksi: AksiTuang) => {
    setStatus('pending');
    try {
      const hasil = await aksi();
      setStatus(hasil === false ? 'error' : 'success');
      return hasil !== false;
    } catch {
      setStatus('error');
      return false;
    }
  }, []);

  const reset = useCallback(() => setStatus('idle'), []);

  return { status, jalankan, reset, sibuk: status === 'pending' || status === 'success' };
}

export default useAksiTuang;
