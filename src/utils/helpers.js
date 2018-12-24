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

/**
 * Генерация массива значений от и до
 * @param from
 * @param to
 * @returns {Array}
 */
export function rangeArr(from, to) {
    const result = [];
    if (to < from) {
        [from, to] = [to, from];
    }
    for (let i = from; i <= to; i += 1) {
        result.push(i);
    }
    return result;
}

/**
 * Минимальное значение в массиве
 * @param arr
 * @returns {*}
 */
export function minArr(arr) {
    return arr.reduce((result, i) => (i < result ? i : result), arr[0]);
}

/**
 * Максимальное знаечние в массиве
 * @param arr
 * @returns {*}
 */
export function maxArr(arr) {
    return arr.reduce((result, i) => (i > result ? i : result), arr[0]);
}

export function formValuesDiff(from, to) {
    const keys = new Set([...Object.keys(from), ...Object.keys(to)]);
    const result = {};
    keys.forEach(key => {
        if (from[key] !== to[key]) {
            result[key] = to[key] || '';
        }
    });

    return result;
}
