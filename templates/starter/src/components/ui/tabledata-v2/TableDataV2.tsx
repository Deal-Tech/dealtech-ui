import { useMemo, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '../button/Button';
import ActionButton from '../actionbutton/ActionButton';

type CostRow = {
  id: string;
  item: string;
  volume: number;
  satuan: string;
  hargaSatuan: number;
};

interface TableDataV2Props {
  title?: string;
  label?: string;
  initialRows?: CostRow[];
  searchValue?: string;
  satuanFilter?: string;
}

const defaultRows: CostRow[] = [
  {
    id: 'b-1',
    item: 'Riset pasar digital',
    volume: 1,
    satuan: 'paket',
    hargaSatuan: 12000000,
  },
  {
    id: 'b-2',
    item: 'Produksi konten campaign',
    volume: 1,
    satuan: 'paket',
    hargaSatuan: 18500000,
  },
  {
    id: 'b-3',
    item: 'Budget iklan performa',
    volume: 1,
    satuan: 'paket',
    hargaSatuan: 25000000,
  },
];

const createId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value);

const numberInputClass =
  'w-full rounded border border-neutral-300/40 bg-white px-3.5 py-2 text-sm tabular-nums focus:border-[#334a34]/50 focus:outline-none focus:ring-2 focus:ring-[#334a34]/20';

const textInputClass =
  'w-full rounded border border-neutral-300/40 bg-white px-3.5 py-2 text-sm focus:border-[#334a34]/50 focus:outline-none focus:ring-2 focus:ring-[#334a34]/20';

const TableDataV2 = ({
  title = 'Blok B - Biaya Operasional Demo',
  label = 'B',
  initialRows = defaultRows,
  searchValue = '',
  satuanFilter = '',
}: TableDataV2Props) => {
  const [rows, setRows] = useState<CostRow[]>(initialRows);

  const visibleRows = useMemo(() => {
    const keyword = searchValue.trim().toLowerCase();

    return rows.filter((row) => {
      const matchesSearch =
        keyword.length === 0 ||
        [row.item, row.satuan].join(' ').toLowerCase().includes(keyword);

      const matchesSatuan =
        satuanFilter.length === 0 || row.satuan === satuanFilter;

      return matchesSearch && matchesSatuan;
    });
  }, [rows, searchValue, satuanFilter]);

  const total = useMemo(
    () => visibleRows.reduce((sum, row) => sum + row.volume * row.hargaSatuan, 0),
    [visibleRows]
  );

  const updateRow = <K extends keyof CostRow>(
    id: string,
    key: K,
    value: CostRow[K]
  ) => {
    setRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [key]: value } : row))
    );
  };

  const addRow = () => {
    setRows((prev) => [
      ...prev,
      {
        id: createId(),
        item: '',
        volume: 0,
        satuan: 'unit',
        hargaSatuan: 0,
      },
    ]);
  };

  const removeRow = (id: string) => {
    setRows((prev) => prev.filter((row) => row.id !== id));
  };

  return (
    <div className="overflow-hidden rounded border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
        <div>
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
          <p className="mt-0.5 text-xs text-gray-400">
            Total: {formatCurrency(Math.round(total))}
          </p>
        </div>

        <Button variant="premium" size="sm" icon={Plus} onClick={addRow}>
          Tambah Item
        </Button>
      </div>

      <div className="px-6 py-5">
        {rows.length === 0 ? (
          <p className="py-6 text-sm text-neutral-400">Belum ada item.</p>
        ) : visibleRows.length === 0 ? (
          <p className="py-6 text-sm text-neutral-400">
            Tidak ada data yang sesuai filter.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full w-max text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-[#334a34]/[0.06] text-[10px] font-semibold uppercase tracking-wider text-[#334a34]/70">
                  <th className="whitespace-nowrap px-4 py-2 text-left">No</th>
                  <th className="whitespace-nowrap px-4 py-2 text-left">Uraian</th>
                  <th className="whitespace-nowrap px-4 py-2 text-left">Volume</th>
                  <th className="whitespace-nowrap px-4 py-2 text-left">Satuan</th>
                  <th className="whitespace-nowrap px-4 py-2 text-left">Harga Satuan</th>
                  <th className="whitespace-nowrap px-4 py-2 text-left">Sub Jumlah</th>
                  <th className="w-10" />
                </tr>
              </thead>

              <tbody>
                {visibleRows.map((row, index) => {
                  const subTotal = row.volume * row.hargaSatuan;

                  return (
                    <tr
                      key={row.id}
                      className="border-b border-neutral-100/50 transition-colors last:border-0"
                    >
                      <td className="whitespace-nowrap px-4 py-2.5 text-xs text-neutral-400">
                        {label}
                        {index + 1}
                      </td>
                      <td className="whitespace-nowrap px-4 py-2.5">
                        <input
                          type="text"
                          placeholder="Nama item..."
                          value={row.item}
                          onChange={(event) =>
                            updateRow(row.id, 'item', event.target.value)
                          }
                          className={`${textInputClass} min-w-[220px]`}
                        />
                      </td>
                      <td className="whitespace-nowrap px-4 py-2.5">
                        <input
                          type="number"
                          min={0}
                          step="any"
                          value={row.volume}
                          onChange={(event) =>
                            updateRow(
                              row.id,
                              'volume',
                              Number.isNaN(Number(event.target.value))
                                ? 0
                                : Number(event.target.value)
                            )
                          }
                          className={`${numberInputClass} min-w-[120px]`}
                        />
                      </td>
                      <td className="whitespace-nowrap px-4 py-2.5">
                        <input
                          type="text"
                          value={row.satuan}
                          onChange={(event) =>
                            updateRow(row.id, 'satuan', event.target.value)
                          }
                          className={`${textInputClass} min-w-[110px]`}
                        />
                      </td>
                      <td className="whitespace-nowrap px-4 py-2.5">
                        <input
                          type="number"
                          min={0}
                          step={1000}
                          value={row.hargaSatuan}
                          onChange={(event) =>
                            updateRow(
                              row.id,
                              'hargaSatuan',
                              Number.isNaN(Number(event.target.value))
                                ? 0
                                : Number(event.target.value)
                            )
                          }
                          className={`${numberInputClass} min-w-[150px]`}
                        />
                      </td>
                      <td className="whitespace-nowrap px-4 py-2.5 tabular-nums font-medium text-neutral-900">
                        {formatCurrency(Math.round(subTotal))}
                      </td>
                      <td className="whitespace-nowrap px-4 py-2.5">
                        <ActionButton
                          variant="danger"
                          icon={Trash2}
                          onClick={() => removeRow(row.id)}
                        >
                          Hapus
                        </ActionButton>
                      </td>
                    </tr>
                  );
                })}
              </tbody>

              <tfoot>
                <tr className="border-t border-neutral-100">
                  <td
                    colSpan={5}
                    className="whitespace-nowrap px-4 py-2.5 font-semibold text-neutral-700"
                  >
                    Total {label}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2.5 tabular-nums font-bold text-[#334a34]">
                    {formatCurrency(Math.round(total))}
                  </td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TableDataV2;
