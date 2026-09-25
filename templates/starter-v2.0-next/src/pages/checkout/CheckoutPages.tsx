import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Banknote,
  Building2,
  Check,
  CheckCircle2,
  Clock3,
  Copy,
  CreditCard,
  ImagePlus,
  QrCode,
  ReceiptText,
  ShoppingCart,
  Upload,
  type LucideIcon,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge/Badge';
import { BadgeInfo } from '@/components/ui/badgeinfo/BadgeInfo';
import { Button } from '@/components/ui/button/Button';
import './checkout.css';

interface MetodeBayar {
  id: string;
  tipe: 'bank' | 'qris' | 'tunai';
  nama: string;
  provider: string;
  nomor?: string;
  pemilik?: string;
  instruksi: string;
}

const LISENSI = {
  kode: 'DT-2026-PRO-001',
  pelanggan: 'PT Contoh Nusantara',
  domain: 'app.contoh.co.id',
  telepon: '081234567890',
  berakhir: '18 Sep 2027',
};

const METODE: MetodeBayar[] = [
  {
    id: 'bni',
    tipe: 'bank',
    nama: 'BNI Virtual Account',
    provider: 'BNI',
    nomor: '8800123456789',
    pemilik: 'PT Dealtech Indonesia',
    instruksi: 'Transfer melalui ATM, mobile banking, atau internet banking BNI.',
  },
  {
    id: 'bsi',
    tipe: 'qris',
    nama: 'BSI QRIS',
    provider: 'BSI',
    instruksi: 'Pindai QRIS menggunakan mobile banking atau dompet digital.',
  },
  {
    id: 'tunai',
    tipe: 'tunai',
    nama: 'Pembayaran Tunai',
    provider: 'Dealtech',
    instruksi: 'Hubungi admin untuk jadwal dan konfirmasi pembayaran tunai.',
  },
];

const IKON_METODE: Record<MetodeBayar['tipe'], LucideIcon> = {
  bank: Building2,
  qris: QrCode,
  tunai: Banknote,
};

function Bilah({ ikon: Ikon, judul, teks }: { ikon: LucideIcon; judul: string; teks: string }) {
  return (
    <div className="checkout-bilah" role="note">
      <Ikon className="checkout-bilah__ikon" aria-hidden="true" />
      <span>{judul}</span>
      <strong>{teks}</strong>
    </div>
  );
}

function DaftarRincian({ item }: { item: Array<[string, ReactNode]> }) {
  return (
    <dl className="checkout-list">
      {item.map(([label, nilai]) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>{nilai}</dd>
        </div>
      ))}
    </dl>
  );
}

async function salin(teks: string) {
  await navigator.clipboard.writeText(teks);
}

function RincianMetode({ metode }: { metode: MetodeBayar }) {
  const [tersalin, setTersalin] = useState(false);

  return (
    <div className="checkout-rekening">
      <div className="checkout-rekening__kepala">
        <div>
          <span>Metode terpilih</span>
          <strong>{metode.nama}</strong>
        </div>
        <b>{metode.provider}</b>
      </div>

      {metode.nomor ? (
        <dl className="checkout-rekening__data">
          <div>
            <dt>Nomor rekening / VA</dt>
            <dd>
              <span>{metode.nomor}</span>
              <Button
                variant="ghost"
                icon={tersalin ? Check : Copy}
                aria-label="Salin nomor rekening"
                onClick={() => void salin(metode.nomor!).then(() => setTersalin(true))}
              />
            </dd>
          </div>
          <div>
            <dt>Atas nama</dt>
            <dd>{metode.pemilik}</dd>
          </div>
        </dl>
      ) : null}

      {metode.tipe === 'qris' ? (
        <div className="checkout-qris">
          <QrCode aria-hidden="true" />
          <span>Contoh QRIS</span>
        </div>
      ) : null}

      <p>{metode.instruksi}</p>
    </div>
  );
}

export function CheckoutPage() {
  const navigate = useNavigate();
  const [metodeId, setMetodeId] = useState('');
  const metode = METODE.find((item) => item.id === metodeId);

  return (
    <div className="checkout-page space-y-6">
      <Bilah
        ikon={ShoppingCart}
        judul="Checkout pembelian paket"
        teks="Periksa paket dan metode pembayaran sebelum melanjutkan."
      />

      <div className="checkout-grid">
        <section className="app-section-card">
          <div className="app-section-body checkout-stack">
            <h2 className="checkout-judul">Data Lisensi</h2>
            <DaftarRincian
              item={[
                ['Kode lisensi', LISENSI.kode],
                ['Nama pelanggan', LISENSI.pelanggan],
                ['Custom domain', LISENSI.domain],
                ['No. HP', LISENSI.telepon],
                ['Masa paket berakhir', LISENSI.berakhir],
              ]}
            />
          </div>
        </section>

        <section className="app-section-card">
          <div className="app-section-body checkout-stack">
            <h2 className="checkout-judul">Ringkasan Checkout</h2>
            <DaftarRincian
              item={[
                ['Paket yang dipilih', 'Paket Pro'],
                ['Harga yang harus dibayar', 'Rp1.200.000'],
                ['Berlaku sampai', '18 Sep 2028'],
              ]}
            />

            <div className="checkout-pemisah" />
            <div>
              <p className="checkout-label">Metode pembayaran</p>
              <div className="checkout-metode" role="radiogroup">
                {METODE.map((item) => {
                  const Ikon = IKON_METODE[item.tipe];
                  const aktif = item.id === metodeId;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      role="radio"
                      aria-checked={aktif}
                      className={`checkout-metode__item${aktif ? ' checkout-metode__item--aktif' : ''}`}
                      onClick={() => setMetodeId(item.id)}
                    >
                      <Ikon aria-hidden="true" />
                      <strong>{item.nama}</strong>
                      <CheckCircle2 aria-hidden="true" />
                    </button>
                  );
                })}
              </div>
            </div>

            {metode ? <RincianMetode metode={metode} /> : null}
            <div>
              <Button
                icon={CreditCard}
                disabled={!metode}
                onClick={() => navigate(`/dashboard/pembayaran?metode=${metodeId}`)}
              >
                Bayar Sekarang
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export function PembayaranPage() {
  const [params] = useSearchParams();
  const metode = METODE.find((item) => item.id === params.get('metode')) ?? METODE[0];
  const inputRef = useRef<HTMLInputElement>(null);
  const [bukti, setBukti] = useState<File | null>(null);
  const [terkirim, setTerkirim] = useState(false);
  const urlBukti = useMemo(() => {
    if (!bukti) return '';
    // Hanya blob lokal yang dipakai.
    const url = URL.createObjectURL(bukti);
    return url.startsWith('blob:') ? 'blob:' + url.slice(5) : '';
  }, [bukti]);

  useEffect(() => () => {
    if (urlBukti) URL.revokeObjectURL(urlBukti);
  }, [urlBukti]);

  return (
    <div className="checkout-page space-y-6">
      <Bilah
        ikon={ReceiptText}
        judul="Detail pesanan"
        teks="Lakukan pembayaran dan unggah bukti untuk memproses lisensi."
      />

      <div className="checkout-grid">
        <section className="app-section-card">
          <div className="app-section-body checkout-stack">
            <h2 className="checkout-judul">Detail Pesanan</h2>
            <DaftarRincian
              item={[
                ['Kode lisensi', LISENSI.kode],
                ['Jenis transaksi', 'Pembelian baru'],
                ['Paket', 'Paket Pro'],
                ['Total pembayaran', 'Rp1.200.000'],
                ['Berlaku sampai', '18 Sep 2028'],
                [
                  'Status',
                  <Badge key="status" variant={terkirim ? 'blue' : 'amber'} icon={terkirim ? CheckCircle2 : Clock3}>
                    {terkirim ? 'Menunggu Verifikasi' : 'Lakukan Pembayaran'}
                  </Badge>,
                ],
              ]}
            />
          </div>
        </section>

        <section className="app-section-card">
          <div className="app-section-body checkout-stack">
            <RincianMetode metode={metode} />
            <div className="checkout-pemisah" />
            <div>
              <h2 className="checkout-judul">Bukti Pembayaran</h2>
              <p className="checkout-keterangan">Bukti tidak dapat diganti setelah dikirim.</p>
            </div>

            <input
              ref={inputRef}
              type="file"
              className="checkout-bukti__input"
              accept="image/jpeg,image/png,image/webp"
              disabled={terkirim}
              onChange={(e) => setBukti(e.target.files?.[0] ?? null)}
            />

            {urlBukti ? (
              <div className="checkout-bukti__pratinjau">
                <img src={urlBukti} alt="Pratinjau bukti pembayaran" />
                <span>{bukti?.name}</span>
              </div>
            ) : null}

            {terkirim ? (
              <>
                <BadgeInfo variant="success">Bukti sudah diunggah dan tidak dapat diunggah ulang.</BadgeInfo>
                <Button icon={Check} disabled>Bukti Sudah Diunggah</Button>
              </>
            ) : (
              <div className="checkout-bukti__aksi">
                <Button variant="ghost" icon={ImagePlus} onClick={() => inputRef.current?.click()}>
                  {bukti ? 'Ganti Bukti' : 'Pilih Bukti'}
                </Button>
                <Button icon={Upload} disabled={!bukti} onClick={() => setTerkirim(true)}>
                  Unggah Bukti Pembayaran
                </Button>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
