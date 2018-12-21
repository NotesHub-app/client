/**
 * Вернуть рандомную строку фиксированной длины
 * @param length
 */
export function randomString(length = 7) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i += 1) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
}
