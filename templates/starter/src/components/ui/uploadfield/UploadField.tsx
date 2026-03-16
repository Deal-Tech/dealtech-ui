import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { FileText, Upload } from 'lucide-react';

interface UploadFieldProps {
  title?: string;
  description?: string;
  placeholder?: string;
  accept?: string;
  multiple?: boolean;
  className?: string;
  onFilesChange?: (files: FileList | null) => void;
}

type PreviewItem = {
  file: File;
  isImage: boolean;
  previewUrl: string | null;
};

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const revokePreviewUrls = (items: PreviewItem[]) => {
  items.forEach((item) => {
    if (item.previewUrl) {
      URL.revokeObjectURL(item.previewUrl);
    }
  });
};

const UploadField = ({
  title = 'Gambar Produk',
  description = 'Upload gambar produk (Format: JPG, PNG, WEBP, JPEG, JFIF, SVG)',
  placeholder = 'Klik untuk upload gambar',
  accept = '.jpg,.jpeg,.png,.webp,.jfif,.svg',
  multiple = false,
  className = '',
  onFilesChange,
}: UploadFieldProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewItems, setPreviewItems] = useState<PreviewItem[]>([]);

  useEffect(() => {
    return () => {
      revokePreviewUrls(previewItems);
    };
  }, [previewItems]);

  const handlePick = () => {
    inputRef.current?.click();
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    const fileArray = files ? Array.from(files) : [];

    const nextPreviewItems: PreviewItem[] = fileArray.map((file) => {
      const isImage = file.type.startsWith('image/');
      return {
        file,
        isImage,
        previewUrl: isImage ? URL.createObjectURL(file) : null,
      };
    });

    setPreviewItems((prev) => {
      revokePreviewUrls(prev);
      return nextPreviewItems;
    });

    onFilesChange?.(files);
  };

  return (
    <div
      className={`rounded border border-gray-200 bg-white p-4 shadow-sm ${className}`}
    >
      <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#98a2b3]">
        {title}
      </p>

      <p className="mt-1 text-[13px] text-[#8d97a7]">{description}</p>

      <button
        type="button"
        onClick={handlePick}
        className="mt-4 flex h-[160px] w-full flex-col items-center justify-center gap-3 rounded border border-dashed border-[#c7ced8] bg-[#fafbfd] px-4 text-center transition-colors hover:border-[#334a34]/35 hover:bg-[#f3f7f3]"
      >
        <Upload size={28} className="text-[#8d97a7]" />
        <span className="text-[15px] font-medium text-[#7a8799]">{placeholder}</span>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
        className="hidden"
      />

      {previewItems.length > 0 ? (
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          {previewItems.map((item) =>
            item.isImage && item.previewUrl ? (
              <div
                key={`${item.file.name}-${item.file.lastModified}`}
                className="overflow-hidden rounded border border-gray-200 bg-white"
              >
                <div className="h-36 w-full overflow-hidden bg-gray-100">
                  <img
                    src={item.previewUrl}
                    alt={item.file.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="space-y-0.5 px-3 py-2">
                  <p className="truncate text-xs font-medium text-[#7a8799]">
                    {item.file.name}
                  </p>
                  <p className="text-[11px] text-gray-400">
                    {formatFileSize(item.file.size)}
                  </p>
                </div>
              </div>
            ) : (
              <div
                key={`${item.file.name}-${item.file.lastModified}`}
                className="flex items-center gap-2 rounded border border-gray-200 bg-gray-50 px-3 py-2"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded bg-white text-gray-500">
                  <FileText size={16} />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium text-[#7a8799]">
                    {item.file.name}
                  </p>
                  <p className="text-[11px] text-gray-400">
                    {formatFileSize(item.file.size)}
                  </p>
                </div>
              </div>
            )
          )}
        </div>
      ) : null}
    </div>
  );
};

export default UploadField;

