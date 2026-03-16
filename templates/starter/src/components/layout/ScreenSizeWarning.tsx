import { useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';

const ScreenSizeWarning = () => {
    const [showWarning, setShowWarning] = useState(false);
    const [hasShownBefore, setHasShownBefore] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => {
            const isSmallScreen = window.innerWidth <= 1024;

            // Hanya tampilkan sekali saat pertama kali layar kecil terdeteksi
            if (isSmallScreen && !hasShownBefore) {
                setShowWarning(true);
                setHasShownBefore(true);
            }
        };

        // Check saat pertama kali load
        checkScreenSize();

        // Check saat resize
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, [hasShownBefore]);

    if (!showWarning) return null;

    return (
        <>
            <div className="screen-warning-backdrop" onClick={() => setShowWarning(false)} />
            <div className="screen-warning-modal">
                <div className="screen-warning-icon">
                    <AlertTriangle size={48} />
                </div>
                <h2>Penting!</h2>
                <p>
                    Kami menyarankan untuk menggunakan ukuran layar yang memadai demi kenyamanan dan fleksibilitas kinerja dashboard admin!
                </p>
                <button type="button" className="screen-warning-btn" onClick={() => setShowWarning(false)}>
                    Tutup
                </button>
            </div>
        </>
    );
};

export default ScreenSizeWarning;
