import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import Pagination from '../pagination/Pagination';

type TableColumnV1<T> = {
  key: string;
  header: string;
  align?: 'left' | 'center' | 'right';
  render: (row: T, index: number) => ReactNode;
};

interface TableDataV1Props<T> {
  columns: TableColumnV1<T>[];
  data: T[];
  itemsPerPage?: number;
  loading?: boolean;
  emptyMessage?: string;
  itemLabel?: string;
  minTableWidthClass?: string;
  rowKey?: (row: T, index: number) => string | number;
  onRowClick?: (row: T) => void;
}

function TableDataV1<T>({
  columns,
  data,
  itemsPerPage = 10,
  loading = false,
  emptyMessage = 'Tidak ada data.',
  itemLabel = 'item',
  minTableWidthClass = 'min-w-[1400px]',
  rowKey,
  onRowClick,
}: TableDataV1Props<T>) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(data.length / itemsPerPage));
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedRows = data.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const thClass = 'h-10 px-3 first:pl-6 last:pr-6 text-left align-middle whitespace-nowrap';
  const tdClass = 'px-3 py-3 first:pl-6 last:pr-6 align-middle whitespace-nowrap';

  const alignClassMap: Record<NonNullable<TableColumnV1<T>['align']>, string> = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <div className="overflow-hidden rounded border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className={`w-full caption-bottom text-sm ${minTableWidthClass}`}>
          <thead>
            <tr className="border-b border-gray-200 bg-[#334a34]/[0.06] text-[10px] font-semibold uppercase tracking-wider text-[#334a34]/70">
              {columns.map((column) => (
                <th key={column.key} className={`${thClass} ${alignClassMap[column.align ?? 'left']}`}>
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-sm text-gray-400">
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#334a34] border-t-transparent" />
                    Memuat data...
                  </div>
                </td>
              </tr>
            ) : paginatedRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-sm text-gray-400">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedRows.map((row, index) => (
                <tr
                  key={rowKey ? rowKey(row, index) : index}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={`border-b border-gray-50 transition-colors ${
                    onRowClick ? 'cursor-pointer hover:bg-gray-50/50' : ''
                  }`}
                >
                  {columns.map((column) => (
                    <td key={column.key} className={`${tdClass} ${alignClassMap[column.align ?? 'left']}`}>
                      {column.render(row, startIndex + index)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        totalItems={data.length}
        itemLabel={itemLabel}
      />
    </div>
  );
}

export type { TableColumnV1 };
export default TableDataV1;

