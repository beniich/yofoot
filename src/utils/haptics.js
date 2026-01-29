export const hapticFeedback = {
    light: () => {
        if (window.navigator.vibrate) {
            window.navigator.vibrate(10);
        }
    },
    medium: () => {
        if (window.navigator.vibrate) {
            window.navigator.vibrate(20);
        }
    },
    selection: () => {
        if (window.navigator.vibrate) {
            window.navigator.vibrate(5);
        }
    },
    error: () => {
        if (window.navigator.vibrate) {
            window.navigator.vibrate([50, 50, 50]);
        }
    }
};
