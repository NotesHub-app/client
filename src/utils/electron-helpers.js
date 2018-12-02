let isElectronCachedValue;

/**
 * Определяем что запущено в окрежении electron
 * @returns {boolean}
 */
export function isElectron() {
    if (isElectronCachedValue === undefined) {
        const userAgent = navigator.userAgent.toLowerCase();
        isElectronCachedValue = userAgent.indexOf(' electron/') > -1;
    }
    return isElectronCachedValue;
}
