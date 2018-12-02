import { FocusStyleManager } from '@blueprintjs/core';
import Promise from 'bluebird';

window.Promise = Promise;

/**
 * Выставить надстройки окружения в браузере для комфортной работы
 */
export function prepareBrowserEnv() {
    // Отключаем фокус по клику
    FocusStyleManager.onlyShowFocusOnTabs();
}
