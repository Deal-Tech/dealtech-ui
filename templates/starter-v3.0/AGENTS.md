# Aturan Project untuk AI dan Pengembang

Berkas ini dibaca otomatis oleh asisten AI (Claude Code lewat `CLAUDE.md`, Codex,
Cursor, Gemini CLI, dan sejenisnya). Ikuti aturan di bawah setiap kali menambah
atau mengubah halaman di project ini.

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
