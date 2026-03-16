import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemLabel?: string;
}

function getPageNumbers(current: number, total: number): (number | '...')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }

  const pages: (number | '...')[] = [1];

  if (current <= 3) {
    pages.push(2, 3, 4, '...', total);
  } else if (current >= total - 2) {
    pages.push('...', total - 3, total - 2, total - 1, total);
  } else {
    pages.push('...', current - 1, current, current + 1, '...', total);
  }

  return pages;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemLabel = 'item',
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages);

  const btnBase =
    'h-8 min-w-[32px] px-2 text-sm rounded-md border transition-colors flex items-center justify-center';
  const btnActive = 'border-[#334a34] bg-[#334a34] text-white font-medium';
  const btnInactive = 'border-gray-200 text-gray-600 hover:bg-gray-50';
  const btnDisabled = 'border-gray-200 text-gray-300 cursor-not-allowed';

  return (
    <div className="flex items-center justify-between border-t px-6 py-3">
      <span className="text-xs text-gray-400">
        Halaman {currentPage} dari {totalPages}
        {totalItems !== undefined ? ` (${totalItems} ${itemLabel})` : ''}
      </span>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`${btnBase} ${currentPage === 1 ? btnDisabled : btnInactive}`}
          aria-label="Halaman sebelumnya"
        >
          <ChevronLeft size={16} />
        </button>

        {pages.map((page, index) =>
          page === '...' ? (
            <span
              key={`dots-${index}`}
              className="flex h-8 min-w-[32px] items-center justify-center px-1 text-sm text-gray-400"
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              className={`${btnBase} ${page === currentPage ? btnActive : btnInactive}`}
              aria-label={`Halaman ${page}`}
            >
              {page}
            </button>
          )
        )}

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`${btnBase} ${currentPage === totalPages ? btnDisabled : btnInactive}`}
          aria-label="Halaman berikutnya"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;

