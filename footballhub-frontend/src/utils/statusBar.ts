import { StatusBar, Style } from '@capacitor/status-bar';
import { isNative } from './platform';

export const statusBar = {
    async setDark() {
        if (!isNative()) return;

        await StatusBar.setStyle({ style: Style.Dark });
        await StatusBar.setBackgroundColor({ color: '#1A1915' });
    },

    async setLight() {
        if (!isNative()) return;

        await StatusBar.setStyle({ style: Style.Light });
        await StatusBar.setBackgroundColor({ color: '#FFFFFF' });
    },

    async hide() {
        if (!isNative()) return;

        await StatusBar.hide();
    },

    async show() {
        if (!isNative()) return;

        await StatusBar.show();
    },

    async setOverlaysWebView(overlay: boolean) {
        if (!isNative()) return;

        await StatusBar.setOverlaysWebView({ overlay });
    },
};
