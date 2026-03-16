import { Building2, TrendingUp, Wallet2, HardHat, Eye } from 'lucide-react';
import StatCardOverview from '../../components/ui/statcardoverview/StatCardOverview';
import WelcomeCard from '../../components/ui/welcomecard/WelcomeCard';
import TableDataV1 from '../../components/ui/tabledata-v1/TableDataV1';
import type { TableColumnV1 } from '../../components/ui/tabledata-v1/TableDataV1';
import PageHeader from '../../components/ui/pageheader/PageHeader';
import Badge from '../../components/ui/badge/Badge';
import ActionButton from '../../components/ui/actionbutton/ActionButton';

const overviewCards = [
  { title: 'Demo Total', value: '50', icon: Building2 },
  { title: 'Demo Terjual', value: '13', icon: TrendingUp, badge: '26.0%' },
  { title: 'Demo Penerimaan', value: 'Rp 4.6M', icon: Wallet2 },
  { title: 'Demo Progress', value: '56%', icon: HardHat },
];

type DemoUnit = {
  id: number;
  no: string;
  blok: string;
  type: string;
  status: string;
  cluster: string;
  lt: number;
  lb: number;
  hppUnit: number;
  hargaJual: number;
  konsumen: string;
  progress: number;
};

const demoUnits: DemoUnit[] = [
  { id: 1, no: '001', blok: 'A1', type: 'Superior', status: 'Open', cluster: 'Garden', lt: 90, lb: 40, hppUnit: 210000000, hargaJual: 325000000, konsumen: '-', progress: 12 },
  { id: 2, no: '002', blok: 'A2', type: 'Menengah', status: 'Booking', cluster: 'Garden', lt: 96, lb: 45, hppUnit: 228000000, hargaJual: 345000000, konsumen: 'Raka Pratama', progress: 28 },
  { id: 3, no: '003', blok: 'A3', type: 'Executive', status: 'Pemberkasan', cluster: 'Harmony', lt: 105, lb: 52, hppUnit: 255000000, hargaJual: 386000000, konsumen: 'Nadia Putri', progress: 36 },
  { id: 4, no: '004', blok: 'B1', type: 'Superior', status: 'Analis', cluster: 'Harmony', lt: 88, lb: 40, hppUnit: 205000000, hargaJual: 319000000, konsumen: 'Fajar Aji', progress: 43 },
  { id: 5, no: '005', blok: 'B2', type: 'Menengah', status: 'SP3K', cluster: 'Nusa', lt: 94, lb: 45, hppUnit: 222000000, hargaJual: 338000000, konsumen: 'Maya Sari', progress: 55 },
  { id: 6, no: '006', blok: 'B3', type: 'Premier', status: 'Akad', cluster: 'Nusa', lt: 120, lb: 65, hppUnit: 315000000, hargaJual: 470000000, konsumen: 'Hendra Wijaya', progress: 70 },
  { id: 7, no: '007', blok: 'C1', type: 'Executive', status: 'Open', cluster: 'Vista', lt: 110, lb: 55, hppUnit: 268000000, hargaJual: 401000000, konsumen: '-', progress: 18 },
  { id: 8, no: '008', blok: 'C2', type: 'Superior', status: 'Booking', cluster: 'Vista', lt: 92, lb: 40, hppUnit: 212000000, hargaJual: 327000000, konsumen: 'Dina Lestari', progress: 31 },
  { id: 9, no: '009', blok: 'C3', type: 'Menengah', status: 'Akad', cluster: 'Vista', lt: 98, lb: 45, hppUnit: 235000000, hargaJual: 352000000, konsumen: 'Rizky Nugraha', progress: 76 },
  { id: 10, no: '010', blok: 'D1', type: 'Premier', status: 'Open', cluster: 'Regency', lt: 124, lb: 65, hppUnit: 320000000, hargaJual: 482000000, konsumen: '-', progress: 14 },
  { id: 11, no: '011', blok: 'D2', type: 'Executive', status: 'Pemberkasan', cluster: 'Regency', lt: 108, lb: 52, hppUnit: 260000000, hargaJual: 395000000, konsumen: 'Aditya Bima', progress: 48 },
  { id: 12, no: '012', blok: 'D3', type: 'Superior', status: 'Hold', cluster: 'Regency', lt: 89, lb: 40, hppUnit: 208000000, hargaJual: 322000000, konsumen: '-', progress: 24 },
];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value);

const tableColumns: TableColumnV1<DemoUnit>[] = [
  { key: 'no', header: 'No', render: (row) => <span className="text-sm text-gray-500">{row.no}</span> },
  { key: 'blok', header: 'Blok', render: (row) => <span className="text-sm font-semibold text-gray-900">{row.blok}</span> },
  { key: 'type', header: 'Tipe', render: (row) => <Badge status={row.type} /> },
  { key: 'status', header: 'Status', render: (row) => <Badge status={row.status} /> },
  { key: 'cluster', header: 'Cluster', render: (row) => <span className="text-sm text-gray-700">{row.cluster}</span> },
  { key: 'lt', header: 'LT (m2)', render: (row) => <span className="tabular-nums text-sm text-gray-700">{row.lt}</span>, align: 'right' },
  { key: 'lb', header: 'LB (m2)', render: (row) => <span className="tabular-nums text-sm text-gray-700">{row.lb}</span>, align: 'right' },
  { key: 'hpp', header: 'HPP Unit', render: (row) => <span className="tabular-nums text-sm text-gray-700">{formatCurrency(row.hppUnit)}</span>, align: 'right' },
  {
    key: 'harga',
    header: 'Harga Jual',
    render: (row) => (
      <span className="tabular-nums text-sm font-medium" style={{ color: '#334a34' }}>
        {formatCurrency(row.hargaJual)}
      </span>
    ),
    align: 'right',
  },
  {
    key: 'konsumen',
    header: 'Konsumen',
    render: (row) => (
      <span className="text-sm text-gray-700">{row.konsumen === '-' ? <span className="text-gray-400">-</span> : row.konsumen}</span>
    ),
  },
  {
    key: 'progress',
    header: 'Progress',
    render: (row) => (
      <div className="flex items-center gap-2">
        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-gray-100">
          <div className="h-full rounded-full" style={{ width: `${row.progress}%`, background: '#334a34' }} />
        </div>
        <span className="tabular-nums text-xs text-gray-400">{row.progress}%</span>
      </div>
    ),
  },
  {
    key: 'aksi',
    header: 'Aksi',
    render: () => (
      <ActionButton icon={Eye}>Detail</ActionButton>
    ),
  },
];

const DashboardPage = () => {
  return (
    <section className="space-y-6">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-4 md:grid-cols-2">
        {overviewCards.map((card) => (
          <StatCardOverview
            key={card.title}
            title={card.title}
            value={card.value}
            icon={card.icon}
            badge={card.badge}
          />
        ))}
      </div>

      <WelcomeCard />

      <div className="space-y-4">
        <PageHeader
          title="Demo Table Data"
          subtitle="Style tabel dan pagination konsisten dengan frontend v1."
        />
        <TableDataV1
          columns={tableColumns}
          data={demoUnits}
          rowKey={(row) => row.id}
          itemLabel="unit demo"
          itemsPerPage={6}
          minTableWidthClass="min-w-[1300px]"
        />
      </div>
    </section>
  );
};

export default DashboardPage;
