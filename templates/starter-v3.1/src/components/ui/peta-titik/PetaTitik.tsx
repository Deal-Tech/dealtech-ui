import { useEffect, useState } from 'react';

import './peta-titik.css';

/*
 * Peta Indonesia bertitik dengan lompatan data antar kota.
 *
 * Petanya ditulis sebagai peta karakter, bukan daftar koordinat: bentuknya bisa
 * dibaca dan disunting langsung di berkas ini — satu '#' satu titik, satu '.'
 * laut. Grid-nya 150 x 56 sel hasil raster equirectangular memakai tetapan
 * RASTER di bawah, jadi tiap titik duduk di koordinat aslinya.
 *
 * Rasternya dibangkitkan dari poligon garis pantai (Sumatra, Jawa, Kalimantan,
 * Papua, Sulawesi berlengan empat, ditambah puluhan pulau kecil: Nias, Mentawai,
 * Bangka, Belitung, Natuna, Madura, Bali sampai Nusa Tenggara, Halmahera, Buru,
 * Seram, Aru, Tanimbar, Biak, Yapen). Kalau bentuknya mau diubah, sunting sel
 * '#'-nya langsung — tidak ada berkas sumber lain.
 */

/* Tetapan raster peta karakter: sudut kiri-atas grid dan lebar satu sel dalam
   derajat. Dipakai ulang untuk menaruh titik kota di sel yang benar. */
const RASTER = { bujur: 94.0, lintang: 6.68, langkah: 0.32 };

const PETA = [
  '.......................................................................##.............................................................................',
  '.......................................................................###............................................................................',
  '......................................................................#####...........................................................................',
  '.....................................................................#######..........................................................................',
  '....###.............................................................########..........................................................................',
  '....#######.......................................................###########.........................................................................',
  '....########.....................................................###########..........................................................................',
  '......########.................................................#############..........................#...............................................',
  '.......########.............................##................#############...........................................................................',
  '........########............................##................#############...........................................................................',
  '.........########............................................#############............................................................................',
  '..........#########.........................................##############............................................................................',
  '...........#########......................................#################...........................................................................',
  '......###...#########...................................###################................................#..........................................',
  '........#....#########................................######################...............................###........................................',
  '..............##########.........................#...#######################.....................##...................................................',
  '...............###########.....................##############################..................####.....##............................................',
  '................###########....##..............###############################..............#######.....###...........................................',
  '...........##....############..####............##############################.....#####..#########......#.##..........................................',
  '..................############.................############################......###############..........##..........................................',
  '...................###########.................###########################......#############.............####........................................',
  '...................###########.................###########################......###...####................####....##..................................',
  '....................##########..................##########################......###......................#####....##....##............................',
  '....................###########.................##########################......####.......##............#.##........#######..........................',
  '...............#.....###########................#########################......#####....#######.....................#########.....###.................',
  '...............##....############...............########################.......######.##########.........###........##########......#.................',
  '................##....###########..####.......##.#######################.......###########...###..#......###........###########...####................',
  '.................#....############..###...........#####################.......##########..........####...........#..##########........................',
  '..................#....###########..####...........####################........#######...............................#########......########..........',
  '..................##....###########..###...##......####################........########...............................#####.####...################...',
  '...................##....##########...#....##.......##################.........#########..................##########...##...####..#################...',
  '.........................##########....................###############........######.###.............###.###########........#######################...',
  '..........................##########..........................#######.........#######.###............###...#.................######################...',
  '...........................#########............................###............#####..####....................................#####################...',
  '............................########...........................................#####...###.......................................##################...',
  '.............................########..........................................#####....###.........................................###############...',
  '..............................#######...........................................####....####..........................................#############...',
  '...............................######...........................................####.....###...........................................############...',
  '..........................#.....######...........................................##........#............................##....#.........###########...',
  '...................................#......................#..............................................................##...##.........##########...',
  '.....................................####..........................................#..........................................##..........#########...',
  '....................................#########......................................#..........................................##..........#########...',
  '....................................##########......####...#####...................#...........................................#...........########...',
  '.......................................#########################...##......................................................................########...',
  '..........................................##################.......................................................##.......................#######...',
  '...............................................##############.#.....................................###.............##.......................######...',
  '...................................................#############.........#.....................###..#..###......#....#........................#####...',
  '.........................................................#####..####.##########..#################....####......................................###...',
  '.................................................................###.#######################........######.......................................##...',
  '..............................................................................#...................######..............................................',
  '...............................................................................................#######................................................',
  '...............................................................................####..........#######..................................................',
  '................................................................................####........######....................................................',
  '.................................................................................#.........#####......................................................',
  '.......................................................................................#...###........................................................',
  '...........................................................................................#..........................................................',];

interface Kota {
  nama: string;
  bujur: number;
  lintang: number;
}

/* Pin kota yang bisa disinggahi lompatan data. Urutannya tidak berarti apa-apa
   — pasangan asal dan tujuannya diundi (lihat acakLompatan). */
const KOTA: Kota[] = [
  { nama: 'Medan', bujur: 98.67, lintang: 3.6 },
  { nama: 'Pontianak', bujur: 109.33, lintang: -0.03 },
  { nama: 'Jakarta', bujur: 106.85, lintang: -6.18 },
  { nama: 'Surabaya', bujur: 112.75, lintang: -7.25 },
  { nama: 'Denpasar', bujur: 115.22, lintang: -8.65 },
  { nama: 'Makassar', bujur: 119.45, lintang: -5.15 },
  { nama: 'Balikpapan', bujur: 116.85, lintang: -1.25 },
  { nama: 'Manado', bujur: 124.85, lintang: 1.49 },
  { nama: 'Ambon', bujur: 128.19, lintang: -3.7 },
  { nama: 'Jayapura', bujur: 140.7, lintang: -2.53 },
];

/* Jarak antar titik pada viewBox. Ukuran titiknya dijaga jauh lebih kecil
   daripada jaraknya supaya polanya tetap terbaca sebagai titik, bukan blok. */
const JARAK = 10;
const KOLOM = PETA[0].length;

/*
  Setelan lompatan data.

  panjang dicerminkan apa adanya di peta-titik.css (angka 1000 pada tiap
  dasharray) dan dipasang sebagai pathLength tiap busur — itu yang membuat satu
  setelan berlaku untuk lompatan sependek maupun sepanjang apa pun.

  laju dalam satuan viewBox per detik: waktu tempuhnya dihitung dari panjang
  busur, bukan dipukul rata. Lompatan Medan–Jayapura dan Surabaya–Denpasar jadi
  terasa sama cepatnya — kalau lamanya yang disamakan, yang pendek malah
  merayap. Batas bawah dan atasnya menjaga lompatan terdekat tidak berkelebat
  dan yang terjauh tidak membosankan.
*/
const LOMPATAN = { panjang: 1000, laju: 400, tercepat: 0.6, terlama: 2.65, henti: 0.55 };

interface Titik {
  x: number;
  y: number;
}

/* Koordinat bumi -> tengah sel grid, memakai tetapan raster yang sama dengan
   peta karakternya. */
function keTitik(kota: Kota): Titik {
  return {
    x: Math.round((kota.bujur - RASTER.bujur) / RASTER.langkah) * JARAK,
    y: Math.round((RASTER.lintang - kota.lintang) / RASTER.langkah) * JARAK,
  };
}

/*
  Satu busur dari a ke b — melengkung, bukan garis lurus: titik kendalinya
  digeser tegak lurus dari tengah ruas sejauh 12% panjangnya (dibatasi 70 satuan,
  karena lompatan ujung ke ujung akan melenting jauh keluar peta), selalu ke sisi
  yang sama supaya semua lengkungnya searah.

  Panjangnya diukur dengan mencacah busur jadi 32 penggal, lalu dipakai
  menentukan lama tempuh.
*/
function busur(a: Titik, b: Titik) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const rentang = Math.hypot(dx, dy);
  const lengkung = Math.min(rentang * 0.12, 70);
  const kendali = {
    x: (a.x + b.x) / 2 + (dy / rentang) * lengkung,
    y: (a.y + b.y) / 2 - (dx / rentang) * lengkung,
  };

  let panjang = 0;
  let sebelum = a;
  for (let n = 1; n <= 32; n += 1) {
    const t = n / 32;
    const u = 1 - t;
    const kini = {
      x: u * u * a.x + 2 * u * t * kendali.x + t * t * b.x,
      y: u * u * a.y + 2 * u * t * kendali.y + t * t * b.y,
    };
    panjang += Math.hypot(kini.x - sebelum.x, kini.y - sebelum.y);
    sebelum = kini;
  }

  return {
    d: `M ${a.x} ${a.y} Q ${kendali.x.toFixed(1)} ${kendali.y.toFixed(1)} ${b.x} ${b.y}`,
    panjang,
  };
}

interface Jalur {
  /* Penanda yang selalu berubah; dipakai sebagai key supaya tiap lompatan lahir
     sebagai elemen baru — itulah yang menyalakan ulang animasinya. */
  nomor: number;
  asal: number;
  tuju: number;
  d: string;
  tempuh: number;
  tiba: number;
}

/*
  Undi satu lompatan: dua pin berbeda, dan bukan pasangan yang persis sama dengan
  lompatan barusan — pengulangan beruntun bikin geraknya terbaca sebagai pola,
  padahal justru keacakannya yang jadi isi.
*/
function acakLompatan(sebelum: Jalur | null): Jalur {
  let asal: number;
  let tuju: number;

  do {
    asal = Math.floor(Math.random() * KOTA.length);
    tuju = Math.floor(Math.random() * KOTA.length);
  } while (asal === tuju || (sebelum !== null && asal === sebelum.asal && tuju === sebelum.tuju));

  const { d, panjang } = busur(keTitik(KOTA[asal]), keTitik(KOTA[tuju]));
  const tempuh = Math.min(Math.max(panjang / LOMPATAN.laju, LOMPATAN.tercepat), LOMPATAN.terlama);

  return {
    nomor: (sebelum ? sebelum.nomor : 0) + 1,
    asal,
    tuju,
    d,
    tempuh,
    /*
      Kepala berkas sampai di ujung busur tepat saat animasinya usai. Pin tujuan
      dinyalakan sedikit lebih awal karena kilatannya sendiri perlu waktu naik —
      kalau dipasang pas di detik kedatangan, nyalanya baru puncak setelah
      berkasnya lewat.
    */
    tiba: tempuh * 0.9,
  };
}

/* Nama kelasnya ditulis utuh, bukan dirakit dari potongan: kalau disambung dari
   nama komponen, ketiganya tak akan ketemu saat digrep di CSS. */
const BERKAS = ['peta-titik__pijar', 'peta-titik__ekor', 'peta-titik__kepala'];

/* Kilatan satu pin: lingkar yang melebar lalu hilang, dan titik yang menyala
   sesaat. Jedanya diturunkan ke kedua lapisan lewat animation-delay: inherit. */
function Kilat({ kota, jeda }: { kota: Kota; jeda: number }) {
  const { x, y } = keTitik(kota);

  return (
    <g style={{ animationDelay: `${jeda.toFixed(2)}s` }}>
      <circle className="peta-titik__denyut" cx={x} cy={y} r="3" />
      <circle className="peta-titik__nyala" cx={x} cy={y} r="2.8" />
    </g>
  );
}

/*
  Satu jalur yang mengurus dirinya sendiri: mengundi pasangan pin, menjalankan
  berkasnya, lalu mengundi lagi. Dibikin komponen supaya bisa dipasang lebih dari
  satu — beberapa jalur berjalan bersamaan tanpa perlu saling tahu.

  tunda menahan lompatan pertamanya, supaya semuanya tidak berangkat berbarengan
  di detik pertama. Sesudah itu mereka menyimpang sendiri karena waktu tempuh
  tiap lompatan berbeda-beda.

  Beberapa jalur sesekali bisa menyinggung pin yang sama — dibiarkan: mengunci
  pin antar-jalur menuntut satu keadaan bersama, dan tabrakannya sendiri jarang
  serta tak merusak apa pun.
*/
function Lompatan({ tunda }: { tunda: number }) {
  const [lompatan, setLompatan] = useState<Jalur | null>(null);

  useEffect(() => {
    /* Gerak dikurangi: jamnya tidak usah jalan sama sekali — tanpa lompatan
       pertama, tak ada apa pun yang perlu disembunyikan lewat CSS. */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    /* Yang berikutnya diundi setelah yang ini sampai dan diam sejenak — berhenti
       dulu, baru pindah pasangan. */
    const tunggu = lompatan ? (lompatan.tempuh + LOMPATAN.henti) * 1000 : tunda;
    const jam = window.setTimeout(() => setLompatan(acakLompatan), tunggu);

    return () => window.clearTimeout(jam);
  }, [lompatan, tunda]);

  if (!lompatan) {
    return null;
  }

  /*
    key nomor lompatan dipasang di simpul terluarnya: tiap ganti pasangan,
    seluruh isinya lahir sebagai elemen baru — itulah yang menyalakan ulang
    animasi CSS-nya, tanpa perlu disetel ulang satu per satu.
  */
  return (
    <g key={lompatan.nomor}>
      <path
        className="peta-titik__rel"
        d={lompatan.d}
        pathLength={LOMPATAN.panjang}
        style={{ animationDuration: `${(lompatan.tempuh + LOMPATAN.henti).toFixed(2)}s` }}
      />

      {/* Berkasnya tiga lapis yang berbagi satu ujung depan: pijar lebar dan
          kabur sebagai pancarannya, ekor panjang yang redup, lalu kepala pendek
          yang terang. Satu lapis saja cuma jadi garis tipis yang lewat. */}
      {BERKAS.map((lapis) => (
        <path
          key={lapis}
          className={lapis}
          d={lompatan.d}
          pathLength={LOMPATAN.panjang}
          style={{ animationDuration: `${lompatan.tempuh.toFixed(2)}s` }}
        />
      ))}

      {/* Pin asal menyala saat berkas berangkat, pin tujuan saat ia tiba. */}
      <Kilat kota={KOTA[lompatan.asal]} jeda={0} />
      <Kilat kota={KOTA[lompatan.tuju]} jeda={lompatan.tiba} />
    </g>
  );
}

/* Dipakai dua lapis SVG sekaligus — harus persis sama, kalau beda sedikit saja
   jalurnya melenceng dari petanya. */
const KOTAK = `-6 -6 ${(KOLOM - 1) * JARAK + 12} ${(PETA.length - 1) * JARAK + 12}`;

interface Props {
  /* Berapa lompatan berjalan bersamaan. Berangkatnya dijarakkan otomatis supaya
     tidak serempak di detik pertama. */
  jalur?: number;
  /* Redupkan sudut kanan-bawah — dipakai kalau ada lambang besar duduk di situ. */
  redupSudut?: boolean;
  className?: string;
}

export default function PetaTitik({ jalur = 4, redupSudut = false, className }: Props) {
  const titik = [];

  for (let y = 0; y < PETA.length; y += 1) {
    const baris = PETA[y];
    for (let x = 0; x < baris.length; x += 1) {
      if (baris[x] === '#') {
        titik.push(
          <circle
            key={`${x}-${y}`}
            className="peta-titik__titik"
            cx={x * JARAK}
            cy={y * JARAK}
            r="1.9"
          />,
        );
      }
    }
  }

  return (
    <div className={`peta-titik${className ? ` ${className}` : ''}`} aria-hidden="true">
      {/* Dua lapis SVG sebangun, bukan satu: cuma lapis titik yang diredupkan di
          sudut lambang. Lompatan dan pin-nya tetap terang — kalau ikut diredam,
          berkas yang menuju Jayapura padam separuh jalan. */}
      <svg
        className={`peta-titik__peta${redupSudut ? ' is-redup' : ''}`}
        viewBox={KOTAK}
        preserveAspectRatio="xMidYMid meet"
      >
        {titik}
      </svg>

      <svg className="peta-titik__jalur" viewBox={KOTAK} preserveAspectRatio="xMidYMid meet">
        {KOTA.map((kota) => {
          const { x, y } = keTitik(kota);

          return <circle key={kota.nama} className="peta-titik__pin" cx={x} cy={y} r="2.4" />;
        })}

        {/* Jaraknya kira-kira seperempat satu putaran lompatan. */}
        {Array.from({ length: jalur }, (_, n) => (
          <Lompatan key={n} tunda={n * 480} />
        ))}
      </svg>
    </div>
  );
}
