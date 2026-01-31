import { SplashScreen } from '@capacitor/splash-screen';
import { isNative } from './platform';

export const splashScreen = {
    async show() {
        if (!isNative()) return;

        await SplashScreen.show({
            showDuration: 2000,
            autoHide: true,
        });
    },

    async hide() {
        if (!isNative()) return;

        await SplashScreen.hide();
    },
};
