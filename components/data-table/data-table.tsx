import type { ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// ── Column Definition ─────────────────────────────────
export interface Column<T> {
    /** Unique key for the column */
    key: string;
    /** Header label */
    label: string;
    /** Custom render function for cell content */
    render?: (row: T, index: number) => ReactNode;
    /** Align (default: left) */
    align?: 'left' | 'center' | 'right';
    /** Minimum width class e.g. 'min-w-[200px]' */
    className?: string;
}

// ── Pagination ────────────────────────────────────────
export interface PaginationMeta {
    currentPage: number;
    lastPage: number;
}

// ── Props ─────────────────────────────────────────────
export interface DataTableProps<T> {
    /** Column definitions */
    columns: Column<T>[];
    /** Row data */
    data: T[];
    /** Unique key extractor per row */
    rowKey: (row: T, index: number) => string | number;
    /** Empty state message */
    emptyMessage?: string;
    /** Pagination meta (optional) */
    pagination?: PaginationMeta;
    /** Callback when page changes */
    onPageChange?: (page: number) => void;
    /** Extra class for the wrapper */
    className?: string;
}

// ── Styles ────────────────────────────────────────────
const thBase = 'h-10 px-3 text-left align-middle font-medium text-gray-500 text-[10px] uppercase tracking-wider whitespace-nowrap';
const tdBase = 'p-3 align-middle whitespace-nowrap text-sm';

const alignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
};

// ── Component ─────────────────────────────────────────
export function DataTable<T>({
    columns,
    data,
    rowKey,
    emptyMessage = 'Tidak ada data',
    pagination,
    onPageChange,
    className = '',
}: DataTableProps<T>) {
    return (
        <div className={className}>
            <div className="overflow-x-auto">
                <table className="w-full min-w-[600px] caption-bottom text-sm">
                    {/* Header */}
                    <thead>
                        <tr className="border-b bg-gray-100/80">
                            {columns.map((col, ci) => (
                                <th
                                    key={col.key}
                                    className={`
                                        ${thBase}
                                        ${ci === 0 ? 'pl-6' : ''}
                                        ${ci === columns.length - 1 ? 'pr-6' : ''}
                                        ${col.align ? alignClass[col.align] : ''}
                                        ${col.className || ''}
                                    `}
                                >
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    {/* Body */}
                    <tbody>
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="p-6 text-center text-gray-400 text-sm">
                                    {emptyMessage}
                                </td>
                            </tr>
                        ) : (
                            data.map((row, ri) => (
                                <tr key={rowKey(row, ri)} className="border-b transition-colors hover:bg-gray-50/50">
                                    {columns.map((col, ci) => (
                                        <td
                                            key={col.key}
                                            className={`
                                                ${tdBase}
                                                ${ci === 0 ? 'pl-6 font-medium text-gray-900' : ''}
                                                ${ci === columns.length - 1 ? 'pr-6' : ''}
                                                ${col.align ? alignClass[col.align] : ''}
                                                ${col.className || ''}
                                            `}
                                        >
                                            {col.render
                                                ? col.render(row, ri)
                                                : String((row as Record<string, unknown>)[col.key] ?? '')
                                            }
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {pagination && pagination.lastPage > 1 && (
                <div className="flex items-center justify-between border-t pt-4 mt-2 px-2">
                    <span className="text-xs text-gray-400">
                        Halaman {pagination.currentPage} dari {pagination.lastPage}
                    </span>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => onPageChange?.(Math.max(1, pagination.currentPage - 1))}
                            disabled={pagination.currentPage === 1}
                            className="p-1.5 rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <span className="text-sm font-medium px-3 py-1">
                            {pagination.currentPage} / {pagination.lastPage}
                        </span>
                        <button
                            onClick={() => onPageChange?.(Math.min(pagination.lastPage, pagination.currentPage + 1))}
                            disabled={pagination.currentPage === pagination.lastPage}
                            className="p-1.5 rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DataTable;
