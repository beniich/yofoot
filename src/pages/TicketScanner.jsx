import React, { useState, useEffect, useRef } from 'react';
import { Camera, CheckCircle, XCircle, AlertCircle, History, Keyboard, FlashlightOff, Flashlight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ticketService } from '../services/tickets';

// ============================================================================
// TICKET SCANNER - INTERFACE FONCTIONNELLE
// ============================================================================

const TicketScanner = () => {
    const [isScanning, setIsScanning] = useState(false);
    const [flashOn, setFlashOn] = useState(false);
    const [validationResult, setValidationResult] = useState(null);
    const [scanHistory, setScanHistory] = useState([]);
    const [showManualEntry, setShowManualEntry] = useState(false);
    const [manualCode, setManualCode] = useState('');
    const videoRef = useRef(null);
    const streamRef = useRef(null);

    // Démarrer la caméra
    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'environment', // Caméra arrière
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                },
            });

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                streamRef.current = stream;
            }

            setIsScanning(true);
        } catch (error) {
            console.error('Error accessing camera:', error);
            alert('Could not access camera. Please check permissions.');
        }
    };

    // Arrêter la caméra
    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
        }
        setIsScanning(false);
    };

    // Toggle flash
    const toggleFlash = async () => {
        if (streamRef.current) {
            const track = streamRef.current.getVideoTracks()[0];
            const capabilities = track.getCapabilities();

            if (capabilities.torch) {
                try {
                    await track.applyConstraints({
                        advanced: [{ torch: !flashOn }],
                    });
                    setFlashOn(!flashOn);
                } catch (error) {
                    console.error('Flash not supported:', error);
                }
            }
        }
    };

    // Valider le ticket via API
    const validateTicket = async (qrCode) => {
        try {
            const data = await ticketService.validate(qrCode);

            // Succès
            setValidationResult({
                success: true,
                ticket: data.ticket,
                message: data.message || 'Ticket validated successfully',
            });

            // Ajouter à l'historique
            setScanHistory((prev) => [
                {
                    id: Date.now(),
                    ticketNumber: data.ticket.ticketNumber,
                    member: data.ticket.member,
                    timestamp: new Date(),
                    success: true,
                },
                ...prev.slice(0, 9), // Garder seulement les 10 derniers
            ]);
        } catch (error) {
            console.error('Validation error:', error);
            const errorMessage = error.response?.data?.message || 'Invalid ticket or network error';

            setValidationResult({
                success: false,
                message: errorMessage,
            });

            setScanHistory((prev) => [
                {
                    id: Date.now(),
                    error: errorMessage,
                    timestamp: new Date(),
                    success: false,
                },
                ...prev.slice(0, 9),
            ]);
        }
    };

    // Simuler le scan d'un QR code (pour démo)
    const simulateScan = () => {
        // En production, ceci serait remplacé par une vraie détection QR
        const mockQrCode = 'eyJ...'; // Mock QR logic
        validateTicket(mockQrCode);
    };

    // Entrée manuelle
    const handleManualEntry = () => {
        if (manualCode.trim()) {
            validateTicket(manualCode.trim());
            setManualCode('');
            setShowManualEntry(false);
        }
    };

    // Réinitialiser le résultat
    const resetValidation = () => {
        setValidationResult(null);
    };

    // Cleanup
    useEffect(() => {
        return () => {
            stopCamera();
        };
    }, []);

    return (
        <div className="min-h-screen bg-charcoal text-white font-display flex flex-col">
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
        
        /* Overriding theme for scanner specific look */
        .scanner-line {
          width: 100%;
          height: 2px;
          background: #D4AF37; /* Gold */
          box-shadow: 0 0 10px #D4AF37;
          animation: scan 2s infinite ease-in-out;
          position: absolute;
          top: 50%;
        }
        
        .scan-corner {
          position: absolute;
          width: 40px;
          height: 40px;
          border-color: #D4AF37;
          border-style: solid;
        }

        .corner-tl { top: 0; left: 0; border-width: 4px 0 0 4px; border-top-left-radius: 12px; }
        .corner-tr { top: 0; right: 0; border-width: 4px 4px 0 0; border-top-right-radius: 12px; }
        .corner-bl { bottom: 0; left: 0; border-width: 0 0 4px 4px; border-bottom-left-radius: 12px; }
        .corner-br { bottom: 0; right: 0; border-width: 0 4px 4px 0; border-bottom-right-radius: 12px; }
        
        @keyframes scan {
          0% { transform: translateY(-100px); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateY(100px); opacity: 0; }
        }
      `}</style>

            {/* Header */}
            <header className="fixed top-0 w-full z-20 bg-gradient-to-b from-black/80 to-transparent">
                <div className="flex items-center justify-between px-4 py-4">
                    <Link
                        to="/tickets"
                        className="p-2 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/10 hover:bg-white/10 transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </Link>

                    <h1 className="text-lg font-bold tracking-tight uppercase drop-shadow-md gold-text-gradient">
                        Ticket Scanner
                    </h1>

                    <button
                        onClick={toggleFlash}
                        className={`p-2 rounded-full backdrop-blur-md text-white border transition-colors ${flashOn
                            ? 'bg-gold/20 border-gold text-gold'
                            : 'bg-black/40 border-white/10 hover:bg-white/10'
                            }`}
                    >
                        {flashOn ? <Flashlight size={20} /> : <FlashlightOff size={20} />}
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-full relative pt-16">
                {/* Camera View */}
                <div className="relative h-[55%] bg-black w-full overflow-hidden">
                    {isScanning ? (
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-900">
                            <button
                                onClick={startCamera}
                                className="flex flex-col items-center gap-3 px-6 py-4 bg-gold text-charcoal rounded-xl font-bold transition-transform active:scale-95 shadow-lg shadow-gold/20"
                            >
                                <Camera size={32} />
                                <span>Start Camera</span>
                            </button>
                        </div>
                    )}

                    {/* Scanner Frame */}
                    {isScanning && !validationResult && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <div className="relative w-64 h-64">
                                <div className="scan-corner corner-tl" />
                                <div className="scan-corner corner-tr" />
                                <div className="scan-corner corner-bl" />
                                <div className="scan-corner corner-br" />
                                <div className="scanner-line" />
                            </div>
                        </div>
                    )}

                    {/* Instructions */}
                    {isScanning && !validationResult && (
                        <div className="absolute bottom-8 w-full text-center">
                            <p className="text-white/80 text-sm font-medium tracking-wide mb-4">
                                Align QR code within the frame
                            </p>
                            <button
                                onClick={simulateScan}
                                className="px-6 py-2 bg-gold/20 border border-gold rounded-lg text-gold font-medium hover:bg-gold/30 transition-colors"
                            >
                                Simulate Scan (Demo)
                            </button>
                        </div>
                    )}
                </div>

                {/* Results Panel */}
                <div className="flex-1 bg-surface-dark rounded-t-[2rem] -mt-6 relative z-10 p-6 flex flex-col shadow-[0_-10px_40px_rgba(0,0,0,0.5)] border-t border-white/5">
                    <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-6" />

                    {validationResult ? (
                        // Résultat de validation
                        <div className="flex flex-col items-center justify-center flex-1 space-y-4">
                            {/* Icon */}
                            <div
                                className={`w-20 h-20 rounded-full flex items-center justify-center border-2 ${validationResult.success
                                    ? 'bg-green-500/20 border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.2)]'
                                    : 'bg-red-500/20 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.2)]'
                                    }`}
                            >
                                {validationResult.success ? (
                                    <CheckCircle size={48} className="text-green-500" />
                                ) : (
                                    <XCircle size={48} className="text-red-500" />
                                )}
                            </div>

                            {/* Message */}
                            <h2
                                className={`text-2xl font-bold tracking-widest uppercase ${validationResult.success ? 'text-green-500' : 'text-red-500'
                                    }`}
                            >
                                {validationResult.success ? 'Ticket Valid' : 'Invalid Ticket'}
                            </h2>

                            {/* Ticket Details */}
                            {validationResult.success && validationResult.ticket && (
                                <div className="w-full max-w-sm bg-black/20 rounded-xl p-5 border border-white/5 backdrop-blur-sm">
                                    <div className="flex items-center gap-4 mb-4 border-b border-white/5 pb-4">
                                        <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                                            {validationResult.ticket.member?.avatar ? (
                                                <img
                                                    src={validationResult.ticket.member.avatar}
                                                    alt="Avatar"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-2xl">👤</span>
                                            )}
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-400">Attendee</div>
                                            <div className="font-bold text-lg leading-tight text-white">
                                                {validationResult.ticket.member?.firstName}{' '}
                                                {validationResult.ticket.member?.lastName}
                                            </div>
                                        </div>
                                        <div className="ml-auto text-right">
                                            <div className="text-xs text-gray-400">Ticket ID</div>
                                            <div className="font-mono text-green-500 font-medium">
                                                {validationResult.ticket.ticketNumber?.slice(-5)}
                                            </div>
                                        </div>
                                    </div>

                                    {validationResult.ticket.seating && (
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-white/5 p-3 rounded-lg">
                                                <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                                                    Section
                                                </div>
                                                <div className="text-lg font-bold text-white">
                                                    {validationResult.ticket.seating.section || 'N/A'}
                                                </div>
                                            </div>
                                            <div className="bg-white/5 p-3 rounded-lg">
                                                <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                                                    Row / Seat
                                                </div>
                                                <div className="text-lg font-bold text-white">
                                                    {validationResult.ticket.seating.row || 'N/A'}{' '}
                                                    <span className="text-white/30 mx-1">/</span>{' '}
                                                    {validationResult.ticket.seating.seat || 'N/A'}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Error Message */}
                            {!validationResult.success && (
                                <div className="w-full max-w-sm bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                                    <p className="text-center text-red-400">
                                        {validationResult.message}
                                    </p>
                                </div>
                            )}

                            {/* Actions */}
                            <button
                                onClick={resetValidation}
                                className="mt-4 px-8 py-3 bg-gold text-charcoal rounded-xl font-bold hover:bg-gold/90 transition-all active:scale-95"
                            >
                                Scan Next Ticket
                            </button>
                        </div>
                    ) : (
                        // État initial
                        <div className="flex flex-col items-center justify-center flex-1 space-y-4">
                            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center border-2 border-white/10">
                                <Camera size={40} className="text-white/40" />
                            </div>
                            <h2 className="text-xl font-bold text-white/60 tracking-wide uppercase">
                                Ready to Scan
                            </h2>
                            <p className="text-sm text-white/40 text-center max-w-xs">
                                Position the QR code within the frame to validate the ticket
                            </p>
                        </div>
                    )}

                    {/* Bottom Actions */}
                    <div className="mt-auto grid grid-cols-2 gap-4 pt-4">
                        <button
                            onClick={() => setShowManualEntry(true)}
                            className="flex items-center justify-center gap-2 py-4 rounded-xl bg-white/5 text-white font-medium border border-white/10 hover:bg-white/10 transition-all active:scale-95"
                        >
                            <Keyboard size={20} />
                            <span>Manual Entry</span>
                        </button>
                        <button
                            onClick={() => { }}
                            className="flex items-center justify-center gap-2 py-4 rounded-xl bg-white/5 text-white font-medium border border-white/10 hover:bg-white/10 transition-all active:scale-95"
                        >
                            <History size={20} />
                            <span>History ({scanHistory.length})</span>
                        </button>
                    </div>
                </div>
            </main>

            {/* Manual Entry Modal */}
            {showManualEntry && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6">
                    <div className="w-full max-md bg-surface-dark rounded-2xl p-6 border border-white/10">
                        <h3 className="text-xl font-bold mb-4 text-white">Manual Entry</h3>
                        <input
                            type="text"
                            value={manualCode}
                            onChange={(e) => setManualCode(e.target.value)}
                            placeholder="Enter ticket code..."
                            className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-gold"
                            autoFocus
                        />
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowManualEntry(false)}
                                className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl font-medium text-white hover:bg-white/10 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleManualEntry}
                                className="flex-1 py-3 bg-gold text-charcoal rounded-xl font-bold hover:bg-gold/90 transition-colors"
                            >
                                Validate
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TicketScanner;
