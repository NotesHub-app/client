/**
 * Testing ClassName. Хелпер для высталвения классНейма только тогда когда НЕ-продакшен.
 * Используется для интеграционных тестов.
 *
 * @param value
 */
export function tc(value) {
    if (process.env.NODE_ENV !== 'production') {
        return `testing__${value}`;
    }
    return undefined;
}
