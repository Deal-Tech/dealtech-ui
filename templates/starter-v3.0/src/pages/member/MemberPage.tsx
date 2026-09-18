import { useMemo, useState } from 'react';
import { Download, Eye, Pencil, Plus, Trash2 } from 'lucide-react';

import ActionButton from '@/components/ui/action-button/ActionButton';
import { Button } from '@/components/ui/button/Button';
import { InputText } from '@/components/ui/inputtext/InputText';
import { Modal } from '@/components/ui/modal/Modal';
import { PageTitle } from '@/components/ui/pagetitle/PageTitle';
import { TableToolbar } from '@/components/ui/table-toolbar/TableToolbar';
import { TableListV1 } from '@/components/ui/tablelist-v1/TableListV1';
import { PER_HALAMAN_BAWAAN, usePilihan } from '@/lib/daftar';

const KOLOM = [
  { key: 'kode', label: 'Kode User', width: '140px' },
  { key: 'nama', label: 'Nama' },
  { key: 'hp', label: 'No HP', width: '170px' },
  { key: 'email', label: 'Email' },
  { key: 'aksi', label: 'Aksi', align: 'right' as const, width: '150px' },
];

interface Member {
  kode: string;
  nama: string;
  hp: string;
  email: string;
}

const DATA_AWAL: Member[] = [
  { kode: 'USR-1001', nama: 'Dewi Anggraini', hp: '0812-3344-5566', email: 'dewi.a@contoh.com' },
  { kode: 'USR-1002', nama: 'Bagus Prasetyo', hp: '0813-7788-1120', email: 'bagus.p@contoh.com' },
  { kode: 'USR-1003', nama: 'Rina Kusuma', hp: '0821-4455-9087', email: 'rina.k@contoh.com' },
  { kode: 'USR-1004', nama: 'Farhan Maulana', hp: '0857-2233-6614', email: 'farhan.m@contoh.com' },
  { kode: 'USR-1005', nama: 'Sinta Rahayu', hp: '0896-1177-4432', email: 'sinta.r@contoh.com' },
  { kode: 'USR-1006', nama: 'Andi Nugroho', hp: '0811-9090-2345', email: 'andi.n@contoh.com' },
  { kode: 'USR-1007', nama: 'Putri Lestari', hp: '0838-5566-7788', email: 'putri.l@contoh.com' },
  { kode: 'USR-1008', nama: 'Hendra Wijaya', hp: '0852-3311-8899', email: 'hendra.w@contoh.com' },
  { kode: 'USR-1009', nama: 'Maya Safitri', hp: '0877-6543-2109', email: 'maya.s@contoh.com' },
  { kode: 'USR-1010', nama: 'Rizky Ramadhan', hp: '0819-2244-3366', email: 'rizky.r@contoh.com' },
  { kode: 'USR-1011', nama: 'Nadia Puspita', hp: '0812-8080-1199', email: 'nadia.p@contoh.com' },
  { kode: 'USR-1012', nama: 'Yoga Pratama', hp: '0856-4433-2211', email: 'yoga.p@contoh.com' },
];

const ISIAN_KOSONG: Member = { kode: '', nama: '', hp: '', email: '' };

/* Menyambung form di badan modal dengan tombol simpan di kakinya. */
const ID_FORM = 'form-tambah-member';

/* Nomor urut berikutnya diambil dari kode tertinggi yang sudah ada, bukan dari
   jumlah barisnya — kalau ada yang dihapus, jumlahnya menyusut dan kodenya akan
   bentrok dengan yang masih terpakai. */
function kodeBerikutnya(daftar: Member[]): string {
  const tertinggi = daftar.reduce((maks, m) => {
    const angka = Number.parseInt(m.kode.replace(/\D/g, ''), 10);
    return Number.isNaN(angka) ? maks : Math.max(maks, angka);
  }, 1000);
  return `USR-${tertinggi + 1}`;
}

function periksa(isian: Member, daftar: Member[]): Partial<Record<keyof Member, string>> {
  const galat: Partial<Record<keyof Member, string>> = {};

  if (!isian.kode.trim()) galat.kode = 'Kode user wajib diisi.';
  else if (daftar.some((m) => m.kode.toLowerCase() === isian.kode.trim().toLowerCase()))
    galat.kode = 'Kode user ini sudah dipakai.';

  if (!isian.nama.trim()) galat.nama = 'Nama wajib diisi.';

  if (!isian.hp.trim()) galat.hp = 'No HP wajib diisi.';
  else if (isian.hp.replace(/\D/g, '').length < 9) galat.hp = 'No HP tidak lengkap.';

  if (!isian.email.trim()) galat.email = 'Email wajib diisi.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(isian.email.trim()))
    galat.email = 'Format email belum benar.';
  else if (daftar.some((m) => m.email.toLowerCase() === isian.email.trim().toLowerCase()))
    galat.email = 'Email ini sudah terdaftar.';

  return galat;
}

export default function MemberPage() {
  const [anggota, setAnggota] = useState<Member[]>(DATA_AWAL);
  const [cari, setCari] = useState('');
  const [perHalaman, setPerHalaman] = useState(PER_HALAMAN_BAWAAN);
  const [halaman, setHalaman] = useState(1);

  const [buka, setBuka] = useState(false);
  const [isian, setIsian] = useState<Member>(ISIAN_KOSONG);
  const [galat, setGalat] = useState<Partial<Record<keyof Member, string>>>({});

  const cocok = useMemo(() => {
    const k = cari.trim().toLowerCase();
    if (!k) return anggota;
    return anggota.filter((d) =>
      [d.kode, d.nama, d.hp, d.email].some((nilai) => nilai.toLowerCase().includes(k)),
    );
  }, [anggota, cari]);

  // perHalaman 0 = "Semua" pada TableToolbar.
  const ukuran = perHalaman > 0 ? perHalaman : cocok.length || 1;
  const totalHalaman = Math.max(1, Math.ceil(cocok.length / ukuran));
  const halamanAman = Math.min(halaman, totalHalaman);
  const mulai = (halamanAman - 1) * ukuran;
  const terlihat = cocok.slice(mulai, mulai + ukuran);

  const pilihan = usePilihan(terlihat.map((d) => d.kode));

  const bukaTambah = () => {
    /* Kodenya diisikan lebih dulu supaya tidak jadi pekerjaan tangan, tapi tetap
       bisa disunting kalau penomorannya mau lain. */
    setIsian({ ...ISIAN_KOSONG, kode: kodeBerikutnya(anggota) });
    setGalat({});
    setBuka(true);
  };

  const ubah = (kunci: keyof Member, nilai: string) => {
    setIsian((s) => ({ ...s, [kunci]: nilai }));
    setGalat((g) => ({ ...g, [kunci]: undefined }));
  };

  const simpan = (e: React.FormEvent) => {
    e.preventDefault();

    const hasil = periksa(isian, anggota);
    if (Object.keys(hasil).length > 0) {
      setGalat(hasil);
      return;
    }

    const baru: Member = {
      kode: isian.kode.trim(),
      nama: isian.nama.trim(),
      hp: isian.hp.trim(),
      email: isian.email.trim(),
    };

    setAnggota((s) => [baru, ...s]);
    /* Balik ke halaman satu dan kosongkan pencarian: tanpa itu member yang baru
       ditambah bisa jatuh di luar saringan atau di halaman lain, dan tampak
       seperti gagal tersimpan. */
    setCari('');
    setHalaman(1);
    setBuka(false);
  };

  const baris = terlihat.map((d) => ({
    kode: d.kode,
    nama: d.nama,
    hp: d.hp,
    email: d.email,
    aksi: (
      <div className="tablelist-v1__aksi">
        <ActionButton icon={Eye} aria-label={`Lihat ${d.nama}`} />
        <ActionButton icon={Pencil} aria-label={`Ubah ${d.nama}`} />
        <ActionButton
          icon={Trash2}
          variant="danger"
          aria-label={`Hapus ${d.nama}`}
          onClick={() => setAnggota((s) => s.filter((m) => m.kode !== d.kode))}
        />
      </div>
    ),
  }));

  return (
    <div className="space-y-6">
      <PageTitle
        title="Daftar Member"
        subtitle="Semua akun member yang terdaftar."
        action={
          <Button icon={Plus} onClick={bukaTambah}>
            Tambah Member
          </Button>
        }
      />

      <TableListV1
        columns={KOLOM}
        rows={baris}
        rowKey={(row) => String(row.kode)}
        pilihan={pilihan}
        aksiMassal={
          <>
            <Button variant="ghost" icon={Download}>
              Ekspor
            </Button>
            <Button
              icon={Trash2}
              onClick={() => {
                const buang = new Set(pilihan.terpilih);
                setAnggota((s) => s.filter((m) => !buang.has(m.kode)));
                pilihan.onBersihkan();
              }}
            >
              Hapus
            </Button>
          </>
        }
        toolbar={
          <TableToolbar
            cari={cari}
            onCari={(v) => {
              setCari(v);
              setHalaman(1);
            }}
            perHalaman={perHalaman}
            onPerHalaman={(v) => {
              setPerHalaman(v);
              setHalaman(1);
            }}
            placeholderCari="Cari kode, nama, no HP, atau email…"
          />
        }
        paginasi={{
          halaman: halamanAman,
          totalHalaman,
          info: `Menampilkan ${cocok.length === 0 ? 0 : mulai + 1}–${mulai + terlihat.length} dari ${
            cocok.length
          } member`,
          onNavigasi: setHalaman,
        }}
        minBaris={8}
        emptyText="Tidak ada member yang cocok."
      />

      <Modal
        open={buka}
        onClose={() => setBuka(false)}
        title="Tambah Member"
        footer={
          <>
            <Button variant="ghost" onClick={() => setBuka(false)}>
              Batal
            </Button>
            <Button type="submit" form={ID_FORM} icon={Plus}>
              Simpan
            </Button>
          </>
        }
      >
        {/* Form-nya di badan modal, tombolnya di kaki modal — disambung lewat
            atribut form supaya Enter di kolom isian ikut menyimpan. */}
        <form id={ID_FORM} onSubmit={simpan} className="flex flex-col gap-3">
          <InputText
            label="Kode User"
            name="kode"
            value={isian.kode}
            onChange={(e) => ubah('kode', e.target.value)}
            error={galat.kode}
            hint="Terisi otomatis dari nomor terakhir; boleh diganti."
            required
          />

          <InputText
            label="Nama"
            name="nama"
            value={isian.nama}
            onChange={(e) => ubah('nama', e.target.value)}
            placeholder="Nama lengkap"
            error={galat.nama}
            required
          />

          <InputText
            label="No HP"
            name="hp"
            type="tel"
            inputMode="tel"
            value={isian.hp}
            onChange={(e) => ubah('hp', e.target.value)}
            placeholder="0812-3456-7890"
            error={galat.hp}
            required
          />

          <InputText
            label="Email"
            name="email"
            type="email"
            value={isian.email}
            onChange={(e) => ubah('email', e.target.value)}
            placeholder="nama@contoh.com"
            autoCapitalize="none"
            spellCheck={false}
            error={galat.email}
            required
          />
        </form>
      </Modal>
    </div>
  );
}
