# Aturan Project untuk AI dan Pengembang

Berkas ini dibaca otomatis oleh asisten AI (Claude Code lewat `CLAUDE.md`, Codex,
Cursor, Gemini CLI, dan sejenisnya). Ikuti aturan di bawah setiap kali menambah
atau mengubah halaman di project ini.

## Warna tema

Admin bisa mengganti warna utama di **Pengaturan → Atur System**, jadi warna
merek tidak boleh ditulis langsung sebagai hex.

1. Pakai variabel: `var(--color-primary)`, `var(--color-primary-dark)`,
   `var(--color-primary-darker)`, `var(--color-accent)`, atau turunan
   `--app-primary-*`. Jangan menulis `#01498b` dan kawan-kawannya di CSS
   maupun komponen.
2. Butuh versi lebih muda atau transparan? Turunkan dari variabel, misalnya
   `color-mix(in srgb, var(--color-primary) 12%, #ffffff)`.
3. Warna untuk grafik di JavaScript diambil lewat `chartColors()` atau
   `seriesColors()` dari `@/lib/chart`, karena keduanya membaca warna tema yang
   sedang aktif.

## Keterangan dan catatan (`BadgeInfo`)

1. **Keterangan, catatan, atau info tambahan wajib memakai
   `<BadgeInfo variant="info" icon={false}>`.** Jangan membuat paragraf
   ber-style sendiri seperti `<p className="...-catatan">` dengan latar, padding,
   atau ukuran huruf baru.
2. **Ukuran dan tebal teks BadgeInfo tanpa ikon selalu sama** (12px, tebal
   500, dari `badgeinfo.css`). Jangan menimpanya lewat `className`, `style`,
   atau kelas Tailwind seperti `text-xs` / `font-bold`. `className` hanya boleh
   dipakai untuk jarak dan penempatan, misalnya `margin`.
3. **Isinya teks polos.** Jangan membungkus sebagian isi dengan `<strong>`,
   `<b>`, `<small>`, atau elemen lain untuk mengubah ukuran dan tebal; elemen di
   dalam BadgeInfo tanpa ikon dipaksa mengikuti ukuran induknya.
4. Varian mengikuti makna: `info` untuk keterangan, `warning` untuk
   peringatan, `success` untuk berhasil, `error` untuk gagal.

### Benar

```tsx
import { BadgeInfo } from '@/components/ui/badgeinfo/BadgeInfo';

<BadgeInfo variant="info" icon={false}>
  Bukti tidak dapat diganti setelah dikirim.
</BadgeInfo>
```

### Salah

```tsx
// Gaya catatan buatan sendiri
<p className="pengaturan-catatan">Bukti tidak dapat diganti setelah dikirim.</p>

// Ukuran dan tebal ditimpa
<BadgeInfo variant="info" icon={false} className="text-[11px] font-bold">
  Bukti tidak dapat diganti setelah dikirim.
</BadgeInfo>

// Sebagian isi ditebalkan
<BadgeInfo variant="info" icon={false}>
  Bukti <strong>tidak dapat</strong> diganti setelah dikirim.
</BadgeInfo>
```

## Tabel data (`TableListV1`)

1. **Satu sel, satu data.** Jangan menumpuk dua data dalam satu sel, misalnya
   nama user dengan nomor HP atau email di bawahnya. Data kedua dijadikan
   kolom sendiri.
2. **Isi sel selalu satu baris.** Sel tidak boleh membungkus ke baris kedua,
   jadi semua baris setinggi sama. Isi yang lebih panjang dari kolomnya otomatis
   dipotong elipsis, dan teks lengkapnya muncul sebagai tooltip. Jangan memaksa
   sel memanjang dengan `<br>`, `white-space: normal`, atau elemen blok yang
   bertumpuk.
3. **Aksi baris lewat dropdown.** Pakai `AksiBaris` dari
   `@/components/ui/tablelist-v1/TableListV1` di kolom terakhir. Jangan
   menderetkan beberapa `ActionButton` dalam satu sel.
4. **Kolom aksi selebar `64px`, rata kanan.** Pemicunya ikon titik tiga tanpa
   teks; sisa lebar diberikan ke kolom data.

### Benar

```tsx
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { AksiBaris, TableListV1 } from '@/components/ui/tablelist-v1/TableListV1';

const KOLOM = [
  { key: 'kode', label: 'Kode User', width: '140px' },
  { key: 'nama', label: 'Nama' },
  { key: 'hp', label: 'No HP', width: '170px' },
  { key: 'email', label: 'Email' },
  { key: 'aksi', label: 'Aksi', align: 'right' as const, width: '64px' },
];

const baris = member.map((m) => ({
  kode: m.kode,
  nama: m.nama,
  hp: m.hp,
  email: m.email,
  aksi: (
    <AksiBaris
      nama={m.nama}
      item={[
        { kunci: 'lihat', label: 'Lihat Detail', ikon: Eye, onClick: () => lihat(m) },
        { kunci: 'ubah', label: 'Ubah', ikon: Pencil, onClick: () => ubah(m) },
        { kunci: 'hapus', label: 'Hapus', ikon: Trash2, bahaya: true, onClick: () => hapus(m) },
      ]}
    />
  ),
}));
```

### Salah

```tsx
// Dua data ditumpuk dalam satu sel
nama: (
  <div>
    <p>{m.nama}</p>
    <p>{m.hp}</p>
  </div>
),

// Deretan tombol aksi dalam satu sel
aksi: (
  <div className="tablelist-v1__aksi">
    <ActionButton icon={Eye} />
    <ActionButton icon={Pencil} />
    <ActionButton icon={Trash2} variant="danger" />
  </div>
),
```

`TabelCardV1` adalah daftar kartu, bukan tabel. Judul dengan subjudul di
bawahnya memang bagian dari desain kartu itu, jadi aturan di atas tidak berlaku
untuknya.
