import { useState } from 'react';
import { Upload, X } from 'lucide-react';

export interface ImageUploadProps {
    /** Label text */
    label?: string;
    /** Error message */
    error?: string;
    /** Helper text (e.g. accepted formats) */
    hint?: string;
    /** Callback when file is selected */
    onFileChange?: (file: File | null) => void;
    /** Initial preview URL (for edit forms) */
    previewUrl?: string;
    /** Accept attribute */
    accept?: string;
    /** Whether the field is required */
    required?: boolean;
    /** Whether the field is disabled */
    disabled?: boolean;
}

export const ImageUpload = ({
    label,
    error,
    hint = 'Format: JPG, PNG, WEBP, JPEG',
    onFileChange,
    previewUrl: initialPreview = '',
    accept = 'image/*',
    required,
    disabled,
}: ImageUploadProps) => {
    const [preview, setPreview] = useState(initialPreview);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        if (file) {
            setPreview(URL.createObjectURL(file));
        } else {
            setPreview('');
        }
        onFileChange?.(file);
    };

    const handleRemove = () => {
        setPreview('');
        onFileChange?.(null);
    };

    return (
        <div>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {label}
                    {required && <span className="text-red-500 ml-0.5">*</span>}
                </label>
            )}
            {hint && <p className="text-xs text-gray-400 mb-2">{hint}</p>}

            <label
                className={`
                    flex flex-col items-center justify-center w-full h-32
                    border-2 border-dashed rounded-lg cursor-pointer transition-colors
                    ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-400 hover:bg-gray-50'}
                    ${error ? 'border-red-300' : 'border-gray-300'}
                `}
            >
                <div className="flex flex-col items-center gap-2">
                    <Upload className="h-6 w-6 text-gray-400" />
                    <span className="text-sm text-gray-500">Klik untuk upload gambar</span>
                </div>
                <input
                    type="file"
                    accept={accept}
                    onChange={handleChange}
                    disabled={disabled}
                    className="hidden"
                />
            </label>

            {/* Preview */}
            {preview && (
                <div className="mt-3 relative inline-block">
                    <p className="text-xs text-gray-400 mb-2">Preview:</p>
                    <div className="relative inline-block">
                        <img
                            src={preview}
                            alt="Preview"
                            className="max-w-[200px] max-h-[200px] object-cover rounded-lg border border-gray-200"
                        />
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-sm hover:bg-red-600 transition-colors"
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                    </div>
                </div>
            )}

            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
    );
};

export default ImageUpload;
