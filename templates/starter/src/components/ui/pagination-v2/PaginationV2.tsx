import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationV2Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemLabel?: string;
  siblingCount?: number;
}

type PaginationItem = number | 'ellipsis-left' | 'ellipsis-right';

function getPageNumbers(currentPage: number, totalPages: number, siblingCount: number): PaginationItem[] {
  if (totalPages <= 1) {
    return [1];
  }

  const leftSibling = Math.max(currentPage - siblingCount, 1);
  const rightSibling = Math.min(currentPage + siblingCount, totalPages);
  const pages: PaginationItem[] = [1];

  if (leftSibling > 2) {
    if (leftSibling === 3) {
      pages.push(2);
    } else {
      pages.push('ellipsis-left');
    }
  }

  for (let page = Math.max(2, leftSibling); page <= Math.min(totalPages - 1, rightSibling); page += 1) {
    pages.push(page);
  }

  if (rightSibling < totalPages - 1) {
    if (rightSibling === totalPages - 2) {
      pages.push(totalPages - 1);
    } else {
      pages.push('ellipsis-right');
    }
  }

  pages.push(totalPages);

  return pages;
}

const PaginationV2 = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemLabel = 'item',
  siblingCount = 2,
}: PaginationV2Props) => {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages, siblingCount);

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) {
      return;
    }

    onPageChange(page);
  };

  const btnBase =
    'inline-flex h-8 min-w-[32px] items-center justify-center px-2 text-sm font-semibold rounded-md border transition-colors';
  const navButtonClass =
    'inline-flex h-8 items-center justify-center gap-1 rounded-md border border-gray-200 bg-white px-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-45';
  const btnActive = 'border-gray-900 bg-gray-900 text-white font-medium';
  const btnInactive = 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50';

  return (
    <div className="mt-2 flex flex-col gap-3 border-t px-2 pt-3 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-xs text-gray-400">
        Halaman {currentPage} dari {totalPages}
        {totalItems !== undefined ? ` (${totalItems} ${itemLabel})` : ''}
      </span>

      <div className="flex flex-wrap items-center gap-0.5 rounded-md border border-gray-200 bg-white p-0.5 shadow-sm">
        <button
          type="button"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className={navButtonClass}
          aria-label="Halaman sebelumnya"
        >
          <ChevronLeft size={16} />
          <span className="hidden sm:inline">Previous</span>
        </button>

        {pages.map((page, index) =>
          typeof page !== 'number' ? (
            <span
              key={`${page}-${index}`}
              className="flex h-8 min-w-[32px] items-center justify-center px-2 text-sm font-semibold text-gray-400"
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              type="button"
              onClick={() => goToPage(page)}
              className={`${btnBase} ${page === currentPage ? btnActive : btnInactive}`}
              aria-label={`Halaman ${page}`}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </button>
          )
        )}

        <button
          type="button"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={navButtonClass}
          aria-label="Halaman berikutnya"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default PaginationV2;
