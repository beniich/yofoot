import React, { useState, useEffect } from 'react';
import { X, Camera, AlertCircle } from 'lucide-react';
import { qrScanner } from '@/utils/qrScanner';
import { hapticFeedback } from '@/utils/haptics';
import { isNative } from '@/utils/platform';

interface QRScannerProps {
    onScan: (data: string) => void;
    onClose: () => void;
}

export const QRScanner: React.FC<QRScannerProps> = ({ onScan, onClose }) => {
    const [scanning, setScanning] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [permissionDenied, setPermissionDenied] = useState(false);

    useEffect(() => {
        if (!isNative()) {
            setError('Le scanner QR fonctionne uniquement sur mobile');
            return;
        }

        startScanning();

        return () => {
            qrScanner.stopScan();
        };
    }, []);

    const startScanning = async () => {
        try {
            setScanning(true);
            setError(null);

            await hapticFeedback.light();

            // Check permission
            const permission = await qrScanner.checkPermission();

            if (!permission.granted) {
                setPermissionDenied(true);
                setError('Permission caméra requise');
                return;
            }

            // Start scan
            const result = await qrScanner.startScan();

            if (result) {
                await hapticFeedback.notification('success');
                onScan(result);
                onClose();
            } else {
                setError('Aucun QR code détecté');
            }
        } catch (err: any) {
            console.error('Scan error:', err);
            setError(err.message || 'Erreur lors du scan');
            await hapticFeedback.notification('error');
        } finally {
            setScanning(false);
        }
    };

    const handleClose = async () => {
        await hapticFeedback.light();
        await qrScanner.stopScan();
        onClose();
    };

    const handleOpenSettings = async () => {
        await hapticFeedback.light();
        await qrScanner.openSettings();
    };

    if (!isNative()) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6">
                <div className="bg-surface-dark rounded-2xl p-6 max-w-sm w-full">
                    <div className="flex items-center justify-center w-16 h-16 bg-red-500/20 rounded-full mx-auto mb-4">
                        <AlertCircle size={32} className="text-red-500" />
                    </div>
                    <h3 className="text-xl font-bold text-white text-center mb-2">
                        Non Disponible
                    </h3>
                    <p className="text-gray-400 text-center mb-6">
                        Le scanner QR fonctionne uniquement sur l'application mobile
                    </p>
                    <button
                        onClick={handleClose}
                        className="w-full py-3 bg-primary hover:bg-primary/90 text-black font-bold rounded-xl transition-colors"
                    >
                        Fermer
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 bg-black">
            {/* Close Button */}
            <button
                onClick={handleClose}
                className="absolute top-8 right-6 z-10 p-3 bg-black/50 backdrop-blur-md rounded-full"
            >
                <X size={24} className="text-white" />
            </button>

            {/* Scanner Frame */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-72 h-72">
                    {/* Corner Borders */}
                    <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-primary rounded-tl-2xl" />
                    <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-primary rounded-tr-2xl" />
                    <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-primary rounded-bl-2xl" />
                    <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-primary rounded-br-2xl" />

                    {/* Scanning Line */}
                    {scanning && (
                        <div className="absolute inset-x-0 h-1 bg-primary animate-scan" />
                    )}
                </div>
            </div>

            {/* Instructions */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent">
                <div className="flex items-center justify-center mb-4">
                    <Camera size={32} className="text-primary" />
                </div>
                <h3 className="text-xl font-bold text-white text-center mb-2">
                    Scanner le QR Code
                </h3>
                <p className="text-gray-400 text-center">
                    Placez le QR code dans le cadre pour le scanner
                </p>

                {error && (
                    <div className="mt-4 p-4 bg-red-500/20 border border-red-500 rounded-xl">
                        <p className="text-red-500 text-center text-sm">{error}</p>
                        {permissionDenied && (
                            <button
                                onClick={handleOpenSettings}
                                className="mt-3 w-full py-2 bg-red-500 text-white font-bold rounded-lg"
                            >
                                Ouvrir les Paramètres
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* CSS for scan animation */}
            <style>{`
        @keyframes scan {
          0% { top: 0; }
          50% { top: 100%; }
          100% { top: 0; }
        }
        .animate-scan {
          animation: scan 2s ease-in-out infinite;
        }
      `}</style>
        </div>
    );
};
