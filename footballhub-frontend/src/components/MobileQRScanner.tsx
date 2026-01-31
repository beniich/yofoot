import React, { useState, useEffect } from 'react';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { Camera, X, Flashlight, FlashlightOff, History, Keyboard } from 'lucide-react';
import { hapticFeedback } from '../utils/haptics';
import { isNative } from '../utils/platform';
import { getApiUrl } from '../config/api';

interface ScanResult {
    success: boolean;
    data?: any;
    message?: string;
}

interface MobileQRScannerProps {
    onScanComplete?: (result: ScanResult) => void;
    onClose?: () => void;
}

export const MobileQRScanner: React.FC<MobileQRScannerProps> = ({
    onScanComplete,
    onClose,
}) => {
    const [scanning, setScanning] = useState(false);
    const [hasPermission, setHasPermission] = useState(false);
    const [torchOn, setTorchOn] = useState(false);
    const [validationResult, setValidationResult] = useState<ScanResult | null>(null);
    const [showManualEntry, setShowManualEntry] = useState(false);
    const [manualCode, setManualCode] = useState('');
    const [scanHistory, setScanHistory] = useState<any[]>([]);

    useEffect(() => {
        checkPermission();
        loadScanHistory();

        return () => {
            if (scanning) {
                stopScan();
            }
        };
    }, []);

    const checkPermission = async () => {
        try {
            // Sur le web, on simule que la permission n'est pas accordée par défaut pour ne pas planter
            if (!isNative()) {
                setHasPermission(true); // Ou false selon comportement désiré sur web
                return;
            }

            const status = await BarcodeScanner.checkPermission({ force: false });
            setHasPermission(status.granted);

            if (status.denied) {
                alert('Accès caméra refusé. Veuillez activer dans les paramètres.');
            }
        } catch (error) {
            console.error('Permission check error:', error);
        }
    };

    const requestPermission = async () => {
        try {
            const status = await BarcodeScanner.checkPermission({ force: true });
            setHasPermission(status.granted);

            if (status.granted) {
                await startScan();
            }
        } catch (error) {
            console.error('Permission request error:', error);
        }
    };

    const startScan = async () => {
        if (!isNative()) {
            alert('Scanner QR disponible uniquement sur mobile (Capacitor)');
            return;
        }

        try {
            await hapticFeedback.medium();

            // Prepare scanner
            await BarcodeScanner.hideBackground();
            document.body.classList.add('scanner-active');

            setScanning(true);

            // Start scanning
            const result = await BarcodeScanner.startScan();

            // Scan completed
            if (result.hasContent) {
                await hapticFeedback.success();
                await validateTicket(result.content);
            }
        } catch (error) {
            console.error('Scan error:', error);
            await hapticFeedback.error();
            alert('Erreur lors du scan');
        } finally {
            await stopScan();
        }
    };

    const stopScan = async () => {
        try {
            if (isNative()) {
                await BarcodeScanner.showBackground();
                await BarcodeScanner.stopScan();
            }
            document.body.classList.remove('scanner-active');
            setScanning(false);
            setTorchOn(false);
        } catch (error) {
            console.error('Stop scan error:', error);
        }
    };

    const toggleTorch = async () => {
        try {
            if (isNative()) {
                await BarcodeScanner.toggleTorch();
            }
            setTorchOn(!torchOn);
            await hapticFeedback.light();
        } catch (error) {
            console.error('Torch error:', error);
        }
    };

    const validateTicket = async (qrCode: string) => {
        try {
            const response = await fetch(`${getApiUrl()}/tickets/validate-qr`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    qrCode,
                }),
            });

            const data = await response.json();

            const result: ScanResult = {
                success: response.ok && data.success,
                data: data.ticket,
                message: data.message || (response.ok ? 'Ticket valide' : 'Erreur de validation'),
            };

            setValidationResult(result);

            if (onScanComplete) {
                onScanComplete(result);
            }

            // Add to history
            addToHistory(result);

            if (result.success) {
                await hapticFeedback.success();
            } else {
                await hapticFeedback.error();
            }
        } catch (error) {
            console.error('Validation error:', error);
            const result: ScanResult = {
                success: false,
                message: 'Erreur de connexion',
            };
            setValidationResult(result);
            await hapticFeedback.error();
        }
    };

    const handleManualEntry = async () => {
        if (manualCode.trim()) {
            await validateTicket(manualCode.trim());
            setManualCode('');
            setShowManualEntry(false);
        }
    };

    const loadScanHistory = () => {
        const history = localStorage.getItem('scanHistory');
        if (history) {
            setScanHistory(JSON.parse(history));
        }
    };

    const addToHistory = (result: ScanResult) => {
        const newEntry = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            success: result.success,
            ticketNumber: result.data?.ticketNumber,
            memberName: result.data?.member?.firstName ? (result.data?.member?.firstName + ' ' + result.data?.member?.lastName) : 'Inconnu',
            message: result.message,
        };

        const updatedHistory = [newEntry, ...scanHistory.slice(0, 19)]; // Keep last 20
        setScanHistory(updatedHistory);
        localStorage.setItem('scanHistory', JSON.stringify(updatedHistory));
    };

    const resetValidation = async () => {
        await hapticFeedback.light();
        setValidationResult(null);
    };

    // Permission Screen
    if (!hasPermission) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-background-dark p-6">
                <Camera size={64} className="text-primary mb-4" />
                <h2 className="text-xl font-bold text-white mb-2">
                    Accès Caméra Requis
                </h2>
                <p className="text-gray-400 text-center mb-6">
                    Pour scanner les tickets QR, nous avons besoin d'accéder à votre caméra.
                </p>
                <button
                    onClick={requestPermission}
                    className="px-6 py-3 bg-primary text-black rounded-xl font-bold hover:bg-primary/90 transition-all active:scale-95"
                >
                    Autoriser l'Accès
                </button>
            </div>
        );
    }

    // Result Screen
    if (validationResult) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-background-dark p-6 z-50 fixed inset-0">
                {/* Result Icon */}
                <div
                    className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 border-4 ${validationResult.success
                            ? 'bg-green-500/20 border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.3)]'
                            : 'bg-red-500/20 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.3)]'
                        }`}
                >
                    {validationResult.success ? (
                        <svg className="w-16 h-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    ) : (
                        <svg className="w-16 h-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    )}
                </div>

                {/* Message */}
                <h2
                    className={`text-3xl font-bold mb-2 uppercase tracking-wider ${validationResult.success ? 'text-green-500' : 'text-red-500'
                        }`}
                >
                    {validationResult.success ? 'Ticket Valide' : 'Ticket Invalide'}
                </h2>

                <p className="text-gray-400 text-center mb-8">
                    {validationResult.message || 'Scan terminé'}
                </p>

                {/* Ticket Details */}
                {validationResult.success && validationResult.data && (
                    <div className="w-full max-w-md bg-card-dark rounded-2xl p-6 mb-8 border border-white/10">
                        <div className="flex items-center gap-4 mb-4 pb-4 border-b border-white/10">
                            <div className="w-14 h-14 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                                {validationResult.data.member?.avatar ? (
                                    <img src={validationResult.data.member.avatar} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-2xl">👤</span>
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="text-sm text-gray-400">Participant</div>
                                <div className="font-bold text-lg">
                                    {validationResult.data.member?.firstName}{' '}
                                    {validationResult.data.member?.lastName}
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-xs text-gray-400">Ticket</div>
                                <div className="font-mono text-green-500 font-bold text-sm">
                                    #{validationResult.data.ticketNumber?.slice(-6)}
                                </div>
                            </div>
                        </div>

                        {validationResult.data.seating && (
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-white/5 p-3 rounded-lg">
                                    <div className="text-xs text-gray-400 uppercase mb-1">Section</div>
                                    <div className="font-bold text-lg">
                                        {validationResult.data.seating.section || 'N/A'}
                                    </div>
                                </div>
                                <div className="bg-white/5 p-3 rounded-lg">
                                    <div className="text-xs text-gray-400 uppercase mb-1">Rang / Siège</div>
                                    <div className="font-bold text-lg">
                                        {validationResult.data.seating.row || 'N/A'} /{' '}
                                        {validationResult.data.seating.seat || 'N/A'}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Actions */}
                <button
                    onClick={resetValidation}
                    className="w-full max-w-md px-6 py-4 bg-primary text-black rounded-xl font-bold text-lg hover:bg-primary/90 transition-all active:scale-95 shadow-lg shadow-primary/20 mb-3"
                >
                    Scanner un Autre Ticket
                </button>

                {onClose && (
                    <button
                        onClick={onClose}
                        className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
                    >
                        Fermer
                    </button>
                )}
            </div>
        );
    }

    // Scanning Screen
    if (scanning) {
        return (
            <div className="scanner-overlay fixed inset-0 z-[9999] flex flex-col bg-black">
                <style>{`
          .scanner-active {
            background: transparent !important;
          }
          .scanner-controls {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            padding: 2rem 1.5rem;
            padding-top: max(2rem, env(safe-area-inset-top));
            background: linear-gradient(to bottom, rgba(0,0,0,0.8), transparent);
            z-index: 10000;
          }
          .scanner-frame {
            flex: 1;
            display: flex;
            align-items: center;
            justify-center;
            padding: 2rem;
          }
          .scanner-box {
            width: 280px;
            height: 280px;
            position: relative;
          }
          .scanner-corner {
            position: absolute;
            width: 40px;
            height: 40px;
            border-color: #F9D406;
            border-style: solid;
          }
          .corner-tl { top: 0; left: 0; border-width: 4px 0 0 4px; border-top-left-radius: 12px; }
          .corner-tr { top: 0; right: 0; border-width: 4px 4px 0 0; border-top-right-radius: 12px; }
          .corner-bl { bottom: 0; left: 0; border-width: 0 0 4px 4px; border-bottom-left-radius: 12px; }
          .corner-br { bottom: 0; right: 0; border-width: 0 4px 4px 0; border-bottom-right-radius: 12px; }
          .scanner-line {
            position: absolute;
            left: 0;
            right: 0;
            height: 2px;
            background: #F9D406;
            box-shadow: 0 0 10px #F9D406;
            animation: scan 2s ease-in-out infinite;
          }
          @keyframes scan {
            0%, 100% { top: 10%; opacity: 0; }
            50% { top: 90%; opacity: 1; }
          }
        `}</style>

                {/* Controls */}
                <div className="scanner-controls">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={stopScan}
                            className="p-3 rounded-full bg-black/50 backdrop-blur-md text-white border border-white/20 hover:bg-black/70 transition-colors"
                        >
                            <X size={24} />
                        </button>

                        <h1 className="text-white font-bold text-lg">Scanner QR</h1>

                        <button
                            onClick={toggleTorch}
                            className={`p-3 rounded-full backdrop-blur-md border transition-colors ${torchOn
                                    ? 'bg-primary/20 border-primary text-primary'
                                    : 'bg-black/50 border-white/20 text-white hover:bg-black/70'
                                }`}
                        >
                            {torchOn ? <Flashlight size={24} /> : <FlashlightOff size={24} />}
                        </button>
                    </div>
                </div>

                {/* Scanner Frame */}
                <div className="scanner-frame">
                    <div className="scanner-box">
                        <div className="scanner-corner corner-tl" />
                        <div className="scanner-corner corner-tr" />
                        <div className="scanner-corner corner-bl" />
                        <div className="scanner-corner corner-br" />
                        <div className="scanner-line" />
                    </div>
                </div>

                {/* Instructions */}
                <div className="absolute bottom-20 left-0 right-0 text-center px-6 pb-6">
                    <p className="text-white text-sm font-medium">
                        Positionnez le code QR dans le cadre
                    </p>
                </div>
            </div>
        );
    }

    // Initial Screen
    return (
        <div className="flex flex-col items-center justify-center min-h-[500px] w-full bg-background-dark p-6 rounded-3xl border border-white/10">
            <div className="w-24 h-24 rounded-full bg-primary/20 border-4 border-primary flex items-center justify-center mb-6 text-primary">
                <Camera size={48} />
            </div>

            <h2 className="text-xl font-bold text-white mb-2">
                Scanner de Billets
            </h2>

            <p className="text-gray-400 text-center mb-6 text-sm max-w-[200px]">
                Scan pour valider l'entrée et enregistrer la présence
            </p>

            <button
                onClick={startScan}
                className="w-full max-w-xs px-6 py-3 bg-primary text-black rounded-xl font-bold hover:bg-primary/90 transition-all active:scale-95 shadow-lg shadow-primary/20 mb-4 flex items-center justify-center gap-2"
            >
                <Camera size={20} />
                Scanner
            </button>

            {/* Manual Entry Toggle */}
            <button
                onClick={() => setShowManualEntry(true)}
                className="w-full max-w-xs flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 text-white font-medium border border-white/10 hover:bg-white/10 transition-all active:scale-95 text-sm"
            >
                <Keyboard size={18} />
                <span>Saisie Manuelle</span>
            </button>

            {/* Manual Entry Modal */}
            {showManualEntry && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-6">
                    <div className="w-full max-w-md bg-card-dark rounded-2xl p-6 border border-white/10 shadow-2xl">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-white">Saisie Manuelle</h3>
                            <button onClick={() => setShowManualEntry(false)} className="text-gray-400 hover:text-white">
                                <X size={24} />
                            </button>
                        </div>

                        <input
                            type="text"
                            value={manualCode}
                            onChange={(e) => setManualCode(e.target.value)}
                            placeholder="Entrez le code du ticket..."
                            className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary mb-6"
                            autoFocus
                        />

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowManualEntry(false)}
                                className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl font-medium hover:bg-white/10 transition-colors text-white"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleManualEntry}
                                disabled={!manualCode.trim()}
                                className="flex-1 py-3 bg-primary text-black rounded-xl font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Valider
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MobileQRScanner;
