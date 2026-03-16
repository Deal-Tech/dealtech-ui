import type { ReactNode } from 'react';

interface NoteCardProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

const NoteCard = ({
  title = 'Catatan Penting:',
  children,
  className = '',
}: NoteCardProps) => {
  return (
    <div className={`rounded border border-amber-100 bg-amber-50 p-4 ${className}`}>
      <div className="text-xs leading-relaxed text-amber-800">
        <p className="mb-1 font-semibold uppercase tracking-wide text-amber-900">{title}</p>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default NoteCard;
