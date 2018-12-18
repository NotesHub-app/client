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

/**
 * Скачать файл по ссылке
 * @param uri
 * @param name
 */
export function downloadURI(uri, name) {
    window.location = uri;
}

/**
 * Скопировать текст в буффер обмена
 * @param textToCopy
 * @param mountArea
 */
export function copyTextToBuffer(textToCopy, mountArea) {
    mountArea = mountArea || document.body;
    if (window.clipboardData && window.clipboardData.setData) {
        // IE specific code path to prevent textarea being shown while dialog is visible.
        return window.clipboardData.setData('Text', textToCopy);
    }

    if (document.queryCommandSupported && document.queryCommandSupported('copy')) {
        const textarea = document.createElement('textarea');
        textarea.textContent = textToCopy;
        textarea.style.position = 'fixed'; // Prevent scrolling to bottom of page in MS Edge.
        mountArea.appendChild(textarea);
        textarea.select();
        try {
            return document.execCommand('copy'); // Security exception may be thrown by some browsers.
        } catch (ex) {
            console.warn('Copy to clipboard failed.', ex);
            return false;
        } finally {
            mountArea.removeChild(textarea);
        }
    }
    return false;
}
