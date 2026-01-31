import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { isNative } from './platform';

export const qrScanner = {
    async checkPermission() {
        if (!isNative()) return { granted: false };

        const status = await BarcodeScanner.checkPermission({ force: true });
        return status;
    },

    async requestPermission() {
        if (!isNative()) return { granted: false };

        const status = await BarcodeScanner.checkPermission({ force: true });

        if (status.granted) {
            return { granted: true };
        }

        if (status.denied) {
            // User denied permission
            return { granted: false, denied: true };
        }

        if (status.neverAsked || status.restricted) {
            // Ask for permission
            const newStatus = await BarcodeScanner.checkPermission({ force: true });
            return { granted: newStatus.granted };
        }

        return { granted: false };
    },

    async startScan(): Promise<string | null> {
        if (!isNative()) {
            console.log('QR Scanner only works on mobile');
            return null;
        }

        // Check permission
        const permission = await this.requestPermission();
        if (!permission.granted) {
            throw new Error('Permission refusée');
        }

        // Prepare scanner
        await BarcodeScanner.prepare();

        // Hide background
        document.body.classList.add('qr-scanner-active');

        // Start scanning
        const result = await BarcodeScanner.startScan();

        // Show background
        document.body.classList.remove('qr-scanner-active');

        if (result.hasContent) {
            return result.content;
        }

        return null;
    },

    async stopScan() {
        if (!isNative()) return;

        await BarcodeScanner.stopScan();
        document.body.classList.remove('qr-scanner-active');
    },

    async openSettings() {
        if (!isNative()) return;

        await BarcodeScanner.openAppSettings();
    },
};

// Add CSS for QR Scanner
if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.innerHTML = `
    body.qr-scanner-active {
      --background: transparent;
      --ion-background-color: transparent;
    }
    
    body.qr-scanner-active .app-content {
      display: none;
    }
  `;
    document.head.appendChild(style);
}
