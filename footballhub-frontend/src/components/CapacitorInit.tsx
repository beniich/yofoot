'use client';

import { useEffect } from 'react';
import { App as CapacitorApp } from '@capacitor/app';
import { statusBar } from '@/utils/statusBar';
import { splashScreen } from '@/utils/splashScreen';
import { pushNotifications } from '@/utils/pushNotifications';
import { isNative } from '@/utils/platform';

export function CapacitorInit() {
    useEffect(() => {
        const initializeApp = async () => {
            if (isNative()) {
                try {
                    await statusBar.setDark();

                    // Hide splash screen after a delay
                    setTimeout(async () => {
                        await splashScreen.hide();
                    }, 1000);

                    await pushNotifications.register();

                    CapacitorApp.addListener('backButton', ({ canGoBack }) => {
                        if (!canGoBack) {
                            CapacitorApp.exitApp();
                        } else {
                            window.history.back();
                        }
                    });

                    console.log('📱 Capacitor initialized');
                } catch (error) {
                    console.error('❌ Capacitor init error:', error);
                }
            }
        };

        initializeApp();
    }, []);

    return null;
}
